/**
 * lib/database/master.js
 * Holds a master class for all other models to inherit from
 *
 * @exports {Class} default - A class for other models to inherit from
 */

import db from './connection'

/**
 * Master
 * A class for other models to inherit from
 */
export default class Master extends db.Model {

  /**
   * sanatize
   * Cleans database input from public sources
   *
   * @param {*} i - Input to sanatize
   *
   * @returns {*} - Sanazited output with same format as input
   */
  static sanatize (i) {
    if (i instanceof Object) {
      for (const k in i) {
        if (/^\$/.test(k)) {
          delete i[k]
        }
      }
    }

    return i
  }
}
