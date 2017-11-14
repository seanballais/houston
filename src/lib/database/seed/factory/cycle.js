/**
 * lib/database/seed/factory/cycle.js
 * Creates a fake cycle.
 * @flow
 */

import { merge } from 'lodash'

import * as util from './utility'

/**
 * Creates a fake cycle
 *
 * @param {Object} [obj] - Any overrides
 * @return {Object}
 */
export default function (obj: Object = {}) {
  return merge({
    project: null,
    installation: util.randomNumber(6),
    repo: `https://github.com/${util.randomString(8)}/${util.randomString(8)}.git`,
    tag: util.randomSemver(),
    name: `com.github.${util.randomString(8)}.${util.randomString(8)}`,
    version: util.randomSemver(),
    type: 'RELEASE',
    _status: 'NEW',
    packages: [],
    changelog: util.randomArray(0, 10, () => util.randomString(32))
  }, obj)
}
