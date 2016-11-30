/**
 * test/lib/database/queue.js
 * Tests queue model class methods
 */

import mock from 'mock-require'
import path from 'path'
import test from 'ava'

import alias from 'root/.alias'
import mockConfig from 'test/fixtures/config'

test.beforeEach('setup configuration mock', async (t) => {
  mock(path.resolve(alias.resolve.alias['root'], 'config.js'), Object.assign(mockConfig, {
    database: `${mockConfig['database']}-queue`
  }))

  t.context.db = require(path.resolve(alias.resolve.alias['lib'], 'database', 'connection')).default
  t.context.Cycle = require(path.resolve(alias.resolve.alias['lib'], 'database', 'cycle')).default
  t.context.Queue = require(path.resolve(alias.resolve.alias['lib'], 'database', 'queue')).default

  await t.context.Queue.remove({})
})

test.serial('can findOneQueue', async (t) => {
  const Queue = t.context.Queue

  const one = await Queue.create({
    cycle: t.context.db.Types.ObjectId(),
    'date.created': new Date(1, 1, 2001)
  })

  const two = await Queue.create({
    cycle: t.context.db.Types.ObjectId(),
    'date.created': new Date(2, 2, 2002)
  })

  await one.save()
  await two.save()

  const three = await Queue.findOneQueue()

  t.deepEqual(three._id, one._id)
})

test.serial('can createByCycle', async (t) => {
  const Cycle = t.context.Cycle
  const Queue = t.context.Queue

  const one = await Cycle.create({
    project: t.context.db.Types.ObjectId(),
    installation: 1,
    repo: 'https://github.com/elementary/houston.git',
    tag: 'master',
    name: 'com.github.elementary.houston',
    version: '1.0.0',
    type: 'RELEASE',
    changelog: ['a change']
  })

  const two = await Queue.createByCycle(one)

  t.is(two['status'], 'QUEUE')
})

test.serial('can acknowledge', async (t) => {
  const Queue = t.context.Queue

  const one = await Queue.create({
    cycle: t.context.db.Types.ObjectId()
  })

  const two = await one.acknowledge()
  const three = await one.acknowledge()

  t.true(two)
  t.false(three)
})

test.serial('can ping', async (t) => {
  const Queue = t.context.Queue

  const id = t.context.db.Types.ObjectId()

  const one = await Queue.create({
    'cycle': id,
    'status': 'WORK',
    'date.created': new Date(1, 1, 2001),
    'date.pinged': new Date(2, 2, 2002)
  })

  await one.ping()

  const two = await Queue.findOne({
    'cycle': id
  })

  t.true(two.date.pinged.getTime() > new Date(2, 2, 2002).getTime())
})

test.serial('can setStatusToFinish', async (t) => {
  const Queue = t.context.Queue

  const id = t.context.db.Types.ObjectId()

  const one = await Queue.create({
    'cycle': id
  })

  await one.setStatusToFinish()

  const two = await Queue.findOne({ 'cycle': id })

  t.true(two == null)
})

test.serial('can setStatusToError', async (t) => {
  const Queue = t.context.Queue

  const err = new Error('testing errors')

  const one = await Queue.create({
    'cycle': t.context.db.Types.ObjectId(),
    'status': 'WORK',
    'date.created': new Date(1, 1, 2001),
    'date.pinged': new Date(2, 2, 2002)
  })

  await one.setStatusToError(err)

  const two = await Queue.findById(one._id)

  t.is(two.status, 'ERROR')
  t.is(two.error, err.message)
  t.true(two.date.finished != null)
})
