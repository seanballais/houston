/**
 * lib/database/queue.js
 * Stores queue information to be done by flightcheck
 *
 * @exports {Object} schema - queue database schema
 * @exports {Class} Queue - queue database class
 * @exports {Object} default - queue database model
 */

import db from './connection'
import Master from './master'

/**
 * @type {Object} - Queue database schema
 *
 * @property {ObjectId} cycle - Cycle document for work to be done
 *
 * @property {String} status - Current status of work
 * @property [String] error - Error message for what caused the quere item to fail
 *
 * @property {Object} date - Holds useful dates
 * @property {Date} date.created - Date the queue item was created
 * @property [Date] date.started - Date the queue item was started
 * @property [Date] date.pinged - Date the queue last acknowledged being ran
 * @property [Date] date.finished - Date when the queue item was finished or errored
 */
export const schema = new db.Schema({
  cycle: {
    type: db.Schema.Types.ObjectId,
    ref: 'cycle',
    required: true
  },

  status: {
    type: String,
    enum: ['QUEUE', 'WORK', 'ERROR'],
    default: 'QUEUE'
  },
  error: String,

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
    .findOne({ 'status': 'QUEUE' })
    .sort({ 'date.created': 1 })
  }

  /**
   * findTimeout
   * Returns a list of queue items that are running and have not pinged since
   *
   * @param {Date} t - Time to query against for last ping acknowledgement
   *
   * @return {Query} - A queue query to return a list
   */
  static findTimeout (t) {
    if (!(t instanceof Date)) {
      throw new TypeError('Unable to query against a non Date')
    }

    return this
    .find({
      $or: [{
        'status': 'WORK',
        'date.pinged': { $lt: t }
      }, {
        'status': 'ERROR',
        'error': 'Timeout'
      }]
    })
  }

  /**
   * acknowledge
   * Tryes to start the Queue item
   *
   * @returns {Boolean} - true if you are running the queue task
   */
  async acknowledge () {
    const res = await Queue
    .findOneAndUpdate({
      '_id': this._id,
      'status': 'QUEUE'
    }, {
      'status': 'WORK',
      'date.started': new Date(),
      'date.pinged': new Date()
    })

    return (res != null)
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
      throw new Error.TypeError('Unable to set queue error to something other than error')
    }

    return this.update({
      'status': 'ERROR',
      'error': e.message,
      'date.finished': new Date()
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
