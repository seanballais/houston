/**
 * lib/database/seed/factory/project.js
 * Creates a fake project.
 * @flow
 */

import { merge } from 'lodash'

import * as util from './utility'

/**
 * Creates a fake project
 *
 * @param {Object} [obj] - Any overrides
 * @return {Object}
 */
export default function (obj: Object = {}) {
  const user = util.randomString(16)
  const repo = util.randomString(16)

  return merge({
    name: `com.github.${user}.${repo}`,
    repo: `https://github.com/${user}/${repo}.git`,
    cycles: [],
    releases: [],
    _status: 'NEW',
    stripe: {
      enabled: false,
      public: util.randomString(42),
      refresh: util.randomString(42),
      access: util.randomString(42),
      id: null,
      user: null
    },
    github: {
      id: util.randomNumber(8),
      owner: user,
      name: repo,
      installation: util.randomNumber(4),
      label: 'AppHub',
      private: util.randomBoolean()
    },
    tag: 'master',
    type: 'Application'
  }, obj)
}
