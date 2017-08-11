/**
 * houston/controller/api/downloads.js
 * Shows total download counts
 *
 * @exports {Object} - Koa router
 */

import Cache from 'node-cache'
import Router from 'koa-router'

import Download from 'lib/database/download'

const cache = new Cache({ stdTTL: 600 })
const route = new Router({
  prefix: '/downloads'
})

/**
 * findTotal
 * Finds total amount of downloads.
 *
 * @return {number}
 */
const findTotal = async () => {
  const cachedRes = cache.get('findTotal')

  if (cachedRes != null) {
    return cachedRes
  }

  const downloads = await Download.aggregate([
    { $match: { type: 'year' } },
    { $group: { _id: 0, total: { $sum: '$current.total' } } }
  ])

  if (downloads[0] == null) {
    return 0
  }

  const total = downloads[0]['total']

  cache.set('findTotal', total)
  return total
}

/**
 * findDay
 * Finds total amount of downloads for the current day.
 *
 * @return {number}
 */
const findDay = async () => {
  const cachedRes = cache.get('findDay')

  if (cachedRes != null) {
    return cachedRes
  }

  const downloads = await Download.aggregate([
    { $match: { type: 'hour' } },
    { $group: { _id: 0, total: { $sum: '$current.total' } } }
  ])

  if (downloads[0] == null) {
    return 0
  }

  const total = downloads[0]['total']

  cache.set('findDay', total)
  return total
}


/**
 * findProject
 * Finds total amount of downloads for a project
 *
 * @param {string} app
 *
 * @return {object}
 */
const findProject = async (app) => {
  const cachedRes = cache.get(app)

  if (cachedRes != null) {
    return cachedRes
  }

  const downloads = await Download.aggregate([
    { $match: { type: 'year' } },
    { $lookup: {
      from: 'Projects',
      localField: '_id',
      foreignField: 'releases._id',
      as: 'project'
    }},
    { $match: { 'project._id': app } },
    { $group: {
      _id: 0,
      count: { $sum: 1 },
      total: { $sum: '$current.total' }
    }}
  ])

  if (downloads[0] == null) {
    return { count: 0, total: 0 }
  }

  const res = {
    count: downloads[0]['count'],
    total: downloads[0]['total']
  }

  cache.set(app, res)
  return res
}


/**
 * GET /api/downloads/total
 * Returns the amount of downloads that have hit the server.
 */
route.get('/total', async (ctx) => {
  const total = await findTotal()

  ctx.status = 200
  ctx.body = { data: {
    total
  }}

  return
})

/**
 * GET /api/downloads/day
 * Returns the amount of downloads for the current day.
 */
route.get('/day', async (ctx) => {
  const total = await findDay()

  ctx.status = 200
  ctx.body = { data: {
    total
  }}

  return
})

/**
 * GET /api/downloads/:app
 * Returns the total amount of downloads for a given app.
 */
route.get('/:app', async (ctx) => {
  let count = 0
  let total = 0

  if (ctx.params.app != null && ctx.params.app.split('.').length === 3) {
    const { total, count } = await findProject(ctx.params.app)
  }

  ctx.status = (count === 0) ? 404: 200
  ctx.body = { data: {
    total
  }}

  return
})

export default route
