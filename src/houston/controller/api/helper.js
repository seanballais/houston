/**
 * houston/controller/api/helper.js
 * Holds common functions for koa queries and mongoose
 *
 * @exports {Class} APIError - A specialty error related to JSON api
 * @exports {Function} limit - Limits query amount
 * @exports {Function} offset - Sets the query offset
 */

/**
 * APIError
 * A specialty error related to JSON api
 *
 * @param {Number} status - status code of error message
 * @param {String} title - title of error to put in error
 * @param {String} detail - details to put in error response
 */
export class APIError extends Error {

  /**
   * Creates a new APIError
   *
   * @param {Number} status - status code of error message
   * @param {String} title - title of error to put in error
   * @param {String} detail - details to put in error response
   */
  constructor (status = 400, title = 'Invalid request', detail) {
    super(title)

    this.code = 'APIERR'

    this.status = status
    this.title = title
    this.detail = detail
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
      throw new APIError(400, 'Bad page limit', 'Query "page[limit]" needs to be a valid number')
    }
  }

  if (limit > high) {
    throw new APIError(422, 'Invalid page limit', `Query "page[limit]" has to be ${high} or less`)
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
      throw new APIError(400, 'Bad page offset', 'Query "page[offset]" needs to be a valid number')
    }
  }

  return offset
}
