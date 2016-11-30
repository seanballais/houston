/**
 * lib/database/queue.js
 * Stores queue information to be done by flightcheck
 *
 * @exports {Object} schema - queue database schema
 * @exports {Class} Queue - queue database class
 * @exports {Object} default - queue database model
 */

import moment from 'moment'

import db from './connection'
import Master from './master'

/**
 * @type {Object} - Queue database schema
 *
 * @property {String} status - Current status of work
 * @property {Number} tries - Amount of times this queue item has been tried
 * @property {String[]} [error] - Error message for what caused the quere item to fail
 *
 * @property {Object} date - Holds useful dates
 * @property {Date} date.created - Date the queue item was created
 * @property {Date} [date.started] - Date the queue item was started
 * @property {Date} [date.pinged] - Date the queue last acknowledged being ran
 * @property {Date} [date.finished] - Date when the queue item was finished or errored
 */
export const schema = new db.Schema({
  status: {
    type: String,
    enum: ['QUEUE', 'RUN', 'ERROR'],
    default: 'QUEUE'
  },
  tries: {
    type: Number,
    default: 0
  },
  error: [String],

  date: {
    created: {
      type: Date,
      default: new Date()
    },
    started: Date,
    pinged: Date,
    finished: Date
  }
})

/**
 * Queue
 * Holds queue related methods
 */
export class Queue extends Master {

  /**
   * findOneQueue
   * Returns a single queue item to run
   *
   * @returns {Query} - A single queue item waiting to be ran
   */
  static findOneQueue () {
    return this
    .findOne({
      $or: [{
        'status': 'QUEUE'
      }, {
        'status': 'ERROR',
        'tries': { $lt: 3 },
        'error': 'Timeout'
      }]
    })
    .sort({ 'date.created': 1 })
  }

  /**
   * findTimeout
   * Returns a list of queue items that are running and have not pinged since
   *
   * @return {Query} - A queue query to return a list
   */
  static findTimeout () {
    const expirationDate = moment().subtract(30, 'minutes').toDate()

    return this
    .find({
      'status': 'RUN',
      'date.pinged': { $lt: expirationDate }
    })
  }

  /**
   * cleanTimeout
   * Finds all timeout queue items and sets them to timeout status. This is much
   * more efficent than using `findTimeout` and `setStatusToTimeout` as we never
   * receive the documents.
   *
   * @return {Query} - A queue update query
   */
  static cleanTimeout () {
    const expirationDate = moment().subtract(30, 'minutes').toDate()

    return this
    .update({
      'status': 'RUN',
      'date.pinged': { $lt: expirationDate }
    }, {
      'status': 'ERROR',
      'error': 'Timeout',
      'date.finished': new Date()
    })
  }

  /**
   * acknowledge
   * Tryes to start the Queue item
   *
   * @returns {Boolean} - true if you are running the queue task
   */
  async acknowledge () {
    const res = await Queue.update({
      '_id': this._id,
      'tries': this.tries
    }, {
      $set: {
        'status': 'RUN',
        'date.started': new Date(),
        'date.pinged': new Date()
      },
      $inc: {
        'tries': 1
      }
    })

    return (res['nModified'] !== 0)
  }

  /**
   * ping
   * Updates date in document so it does not timeout
   *
   * @returns {Query} - Queue update query
   */
  ping () {
    return this.update({ 'date.pinged': new Date() })
  }

  /**
   * setStatusToFinish
   * Finishes an item in the queue
   *
   * @return {Query} - Queue update query
   */
  setStatusToFinish () {
    return this.remove()
  }

  /**
   * setStatusToError
   * Sets current queue item to error status
   *
   * @param {Error} e - An error to set
   *
   * @return {Query} - Queue update query
   */
  setStatusToError (e) {
    if (!(e instanceof Error)) {
      throw new Error('Unable to set queue error to something other than error')
    }

    return this.update({
      $set: {
        'status': 'ERROR',
        'date.finished': new Date()
      },
      $addToSet: {
        'error': e.message
      }
    })
  }

  /**
   * setStatusToTimeout
   * Sets the current queue item to timeout error status
   *
   * @return {Query} - Queue update query
   */
  setStatusToTimeout () {
    return this.setStatusToError(new Error('Timeout'))
  }
}

export default db.model(Queue, schema, 'queue')
