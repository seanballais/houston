/**
 * houston/controller/api/helper.js
 * Holds common functions for koa queries and mongoose
 *
 * @exports {Class} APIError - A specialty error related to JSON api
 * @exports {Function} limit - Limits query amount
 * @exports {Function} offset - Sets the query offset
 */

import Mistake from 'lib/mistake'

/**
 * APIError
 * A specialty error related to JSON api
 *
 * @param {String} m - message to output to client
 */
export class APIError extends Mistake {

  /**
   * Creates a new APIError from message
   *
   * @param {String} m - message to output to client
   */
  constructor (m) {
    super(400, m, true)
    this.code = 'APIERR'
  }
}

/**
 * limit
 * Limits query amount
 *
 * @param {Object} param - Koa object of parameters
 * @param {Number} def - the default limit value
 * @param {Number} high - Highest limit number
 * @returns {Number} - number to limit query data to
 */
export function limit (param = {}, def = 10, high = 50) {
  let limit = def

  if (param['page[limit]'] != null) {
    try {
      limit = Math.abs(Number(param['page[limit]']))
    } catch (err) {
      throw new APIError('Query "page[limit]" needs to be a valid number')
    }
  }

  if (limit > high) {
    throw new APIError(`Query "page[limit]" has to be ${high} or less`)
  }

  return limit
}

/**
 * offset
 * Limits query amount
 *
 * @param {Object} param - Koa object of parameters
 * @param {Number} def - the default offset
 * @returns {Number} - number to limit query data to
 */
export function offset (param = {}, def = 0) {
  let offset = def

  if (param['page[offset]'] != null) {
    try {
      offset = Math.abs(Number(param['page[offset]']))
    } catch (err) {
      throw new APIError('Query "page[offset]" needs to be a valid number')
    }
  }

  return offset
}
