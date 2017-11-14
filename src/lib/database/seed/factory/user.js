/**
 * lib/database/seed/factory/user.js
 * Creates a fake user.
 * @flow
 */

import { merge } from 'lodash'

import * as util from './utility'

/**
 * Creates a fake user
 *
 * @param {Object} [obj] - Any overrides
 * @return {Object}
 */
export default function (obj: Object = {}) {
  const githubUserId = (obj.github != null && obj.github.id != null) ? obj.github.id : util.randomNumber(8)

  return merge({
    username: util.randomString(),
    avatar: `https://avatars.githubusercontent.com/u${githubUserId}?v=3`,
    projects: util.randomArray(0, 10, () => util.randomNumber(6)),
    date: {
      visited: new Date(),
      joined: new Date()
    },
    notify: {
      beta: util.randomBoolean()
    },
    right: util.randomChoice(['USER', 'BETA', 'ADMIN']),
    github: {
      id: githubUserId,
      access: util.randomHash(40)
    }
  }, obj)
}
