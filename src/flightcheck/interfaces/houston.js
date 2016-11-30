/**
 * flightcheck/interfaces/houston.js
 * Will connect flightcheck to houston for tests
 */

import config from 'lib/config'
import Cycle from 'lib/database/cycle'
import Log from 'lib/log'
import Pipeline from 'flightcheck/pipeline'
import Project from 'lib/database/project'
import Queue from 'lib/database/queue'

const log = new Log('flightcheck')

log.info(`Running in ${config.env} configuration`)

// Increate the runningPipelineLimit for more builds at the same time
const runningPipelineLimit = 1
let currentRunningPipelines = 0

/**
 * processQueue
 * Checks if we are able to run the queue item
 *
 * @param {Queue} q - Database queue document to check
 *
 * @return {Object} - Finished pipeline
 */
const processQueue = async (q) => {
  if (!(q instanceof Queue)) {
    throw new Error('Unable to process queue item with invalid queue')
  }

  if (currentRunningPipelines >= runningPipelineLimit) {
    log.debug(`Currently running ${currentRunningPipelines} pipelines. Skipping queue item`)
    return
  }

  const ack = await q.acknowledge()
  if (ack === false) return

  log.debug('Creating pipeline from queue item')
  const pipeline = await pipelineFromQueue(q)
  if (pipeline == null) return

  await processOutcome(q, pipeline)
  return pipeline
}

/**
 * processIncome
 * Takes a database Queue document and returns a Pipeline object
 *
 * @param {Queue} q - Database queue document to update with
 *
 * @return {Object} - Promise of an object to create a pipeline with
 */
const processIncome = async (q) => {
  if (!(q instanceof Queue)) {
    throw new Error('Unable to process outcome with invalid Queue')
  }

  const cycle = await Cycle.findById(q.cycle)
  if (cycle == null) throw new Error('Unable to find cycle in database')

  const changelog = cycle.changelog
  .reverse()
  .map((c) => {
    c['changes'] = c['changelog']
    return c
  })

  return {
    repo: cycle.repo,
    tag: cycle.tag,
    name: cycle.name,
    source: 'github',
    changelog,
    auth: cycle.installation
  }
}

/**
 * pipelineFromQueue
 * Starts a pipeline with given queue item
 *
 * @param {Queue} q - Database queue document to start pipeline with
 *
 * @return {Object} - A finished Pipeline
 */
const pipelineFromQueue = async (q) => {
  if (!(q instanceof Queue)) {
    throw new Error('Unable to create pipeline with invalid queue')
  }

  const data = await processIncome(q)
  const pipeline = new Pipeline(data)

  pipeline.on('Pipeline#pipe:start', () => {
    log.debug('Pinging queue item to avoid timeout')
    q.ping()
  })

  currentRunningPipelines++

  try {
    await pipeline.start()
  } finally {
    currentRunningPipelines--
  }

  return pipeline
}

/**
 * processOutcome
 * Takes the results from the pipeline and updates the database
 *
 * @param {Queue} q - Database queue document to update with
 * @param {Object} p - A finished pipeline
 *
 * @return {Promise} - Nothing special except the error
 */
const processOutcome = async (q, p) => {
  if (!(q instanceof Queue)) {
    throw new Error('Unable to process outcome with invalid Queue')
  }

  if (!(p instanceof Pipeline)) {
    throw new Error('Unable to process outcome with invalid Pipeline')
  }

  const errors = await p.logs('error')
  const aptly = p.pipes.find((p) => (p.name === 'ElementaryAptly'))
  const apphub = p.pipes.find((p) => (p.name === 'AppHub'))
  const cycleUpdates = {}

  if (errors.length > 0) {
    cycleUpdates['_status'] = 'ERROR'
  }

  if (aptly.data.publishedKeys != null && aptly.data.publishedKeys.length > 0) {
    cycleUpdates['packages'] = aptly.data.publishedKeys
    cycleUpdates['_status'] = 'REVIEW'
  } else {
    cycleUpdates['_status'] = 'FINISH'
  }

  const cycle = await Cycle.findOneAndUpdate({
    '_id': q.cycle
  }, cycleUpdates)

  await Project.update({
    '_id': cycle.project
  }, {
    'apphub': apphub.data,
    'github.label': apphub.data.log.label
  })
}

/**
 * Past this point are all timer functions. They are designed to be long
 * running, with nothing stopping them. Make sure to wrap everything that
 * could possibly error with a try statement.
 */

/**
 * runQueue
 * A Timer function for checking the Queue database for avalible jobs.
 * Will run every 2 minutes and when a Pipeline finishes.
 *
 * @return {Promise} - Async function will always return null
 */
const runQueue = async () => {
  log.debug('Running queue timer')
  clearTimeout(processTimeout)
  processTimeout = setTimeout(runQueue, 2 * 60000)

  let currentQueue = null

  try {
    currentQueue = await Queue.findOneQueue()
    if (currentQueue == null) return
  } catch (err) {
    log.error('Unable to find current queue items')
    log.error(err)
    log.report(err)
  }

  try {
    const pipeline = await processQueue(currentQueue)
    if (pipeline == null) return

    return runQueue()
  } catch (err) {
    log.error('Unable to process pipeline due to error')
    log.error(err)
    log.report(err, currentQueue)

    await currentQueue.setStatusToError(err)
  }
}

// eslint-disable-next-line
let processTimeout = null
runQueue()

/**
 * runClean
 * A Timer function for cleaning any long running tasks.
 * Runs every 20 minutes
 *
 * @return {Promise} - Async function will always return null
 */
const runClean = async () => {
  log.debug('Running clean timer')
  clearTimeout(cleanTimeout)
  cleanTimeout = setTimeout(runClean, 20 * 60000)

  try {
    await Queue.cleanTimeout()
  } catch (err) {
    log.error('Error while running clean timer')
    log.error(err)
    log.report(err)
  }
}

// eslint-disable-next-line
let cleanTimeout = null
runClean()
