/**
 * lib/database/seed/index.js
 * Seeds the database with fake information
 */

import Project from '../project'
import User from '../user'

import * as util from './factory/utility'

import generateProject from './factory/project'
import generateRelease from './factory/release'

/**
 * Seeds the database
 *
 * @return {void}
 */
export default async function () {
  const projects = util.randomArray(2, 6, () => generateProject())
    .map((p) => {
      p.releases = util.randomArray(0, 4, () => generateRelease({

      }))
      p.status = (p.releases > 0) ? 'DEFER' : 'NEW'

      return p
    })

  await Project.insertMany(projects)

  await User.update({}, {
    'github.projects': projects.map((p) => p.github.id),
    'github.cache': new Date()
  })
}
