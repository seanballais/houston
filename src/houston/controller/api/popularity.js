/**
 * houston/controller/api/popularity.js
 * api for appcenter popularity contest. This will deviate from JSON spec slightly
 *
 * @exports {Object} - Koa router
 */

import Router from 'koa-router'

import * as helper from './helper'
import log from 'lib/log'
import Project from 'houston/model/project'

const route = new Router({
  prefix: '/popularity'
})

/**
 * GET /api/popularity
 * Grabs list of projects avalible to download sorted by download count
 * TODO: setup an algorithm taking into account GitHub stats, not just raw download count
 *
 * @param {Number} page[limit] - number of results to return per page
 * @param {Number} page[offset] - number of records to skip while searching
 */
route.get('/', async (ctx) => {
  const query = Project.find({
    'github.private': false,
    'downloads': { $gte: 1 }
  })
  .sort('-downloads')

  // Limit and offset parameter
  let limit = 10
  let offset = 0

  try {
    limit = helper.limit(ctx.query, limit)
    offset = helper.offset(ctx.query, offset)
  } catch (err) {
    if (err.code === 'APIERR' && err.expose) {
      ctx.status = err.status
      ctx.body = { errors: [{
        status: err.status,
        title: 'Bad Request',
        detail: err.message
      }]}
      return
    }

    log.error('Error occured while processing query paramiters', err)

    ctx.status = 500
    ctx.body = { errors: [{
      status: 500,
      title: 'Internal Error',
      detail: 'Houston ran into an issue processing your request'
    }]}
    return
  }

  query.limit(limit)
  query.skip(offset)

  // Clean url for pagation links
  const count = await Project.count({
    'github.private': false,
    'downloads': { $gte: 1 }
  })

  const base = ctx.request.href.split('?')[0]
  const cleanQuery = Object.keys(ctx.request.query).filter((key) => {
    if (key[0] === '?') key = key.substr(1)
    return (key !== 'page[offset]' && key !== 'page[limit]')
  })

  let url = `${base}?`
  cleanQuery.forEach((key) => {
    url += `${key}=${ctx.request.query[key]}`
  })
  if (Object.keys(cleanQuery).length > 0) url += '&'

  let nextPage = offset + limit
  if (count < 1) {
    nextPage = 0
  } else {
    nextPage = count - 1
  }

  // Execute query
  const castedProjects = await Promise.map(query.exec(), async (project) => {
    const data = await project.toNormal()
    const release = project.release.latest

    return {
      type: 'projects',
      id: data.id,
      attributes: {
        package: data.name,
        popularity: data.downloads,
        version: release.version
      }
    }
  })

  ctx.body = {
    data: castedProjects,
    links: {
      first: `${url}page[limit]=${limit}&page[offset]=0`,
      prev: `${url}page[limit]=${limit}&page[offset]=${(offset - limit > 0) ? offset - limit : 0}`,
      next: `${url}page[limit]=${limit}&page[offset]=${nextPage}`,
      last: `${url}page[limit]=${limit}&page[offset]=${(count - limit > 0) ? count - limit : 0}`
    }
  }
  return
})

export default route
