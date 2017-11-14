/**
 * lib/database/seed/factory/release.js
 * Creates a fake release.
 * @flow
 */

import { merge } from 'lodash'

import * as util from './utility'

/**
 * Creates a fake release
 *
 * @param {Object} [obj] - Any overrides
 * @return {Object}
 */
export default function (obj: Object = {}) {
  return merge({
    changelog: util.randomArray(0, 10, () => util.randomString(32)),
    github: {
      tag: util.randomSemver(),
      date: new Date(),
      author: util.randomString(16),
      id: util.randomNumber(8)
    },
    date: {
      released: new Date(),
      published: new Date()
    },
    _status: 'STANDBY',
    cycles: [],
    version: util.randomSemver()
  }, obj)
}
