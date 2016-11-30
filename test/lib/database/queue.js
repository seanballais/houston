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
    'date.created': new Date(2001, 1, 1)
  })

  const two = await Queue.create({
    cycle: t.context.db.Types.ObjectId(),
    'date.created': new Date(2002, 2, 2)
  })

  await one.save()
  await two.save()

  const three = await Queue.findOneQueue()

  t.deepEqual(three._id, one._id)
})

test.serial('can findTimeout', async (t) => {
  const Queue = t.context.Queue

  await Queue.create({
    cycle: t.context.db.Types.ObjectId(),
    'status': 'RUN',
    'date.pinged': new Date(2001, 1, 1)
  })

  await Queue.create({
    cycle: t.context.db.Types.ObjectId(),
    'status': 'RUN',
    'date.pinged': new Date(2099, 9, 9)
  })

  const one = await Queue.findTimeout()

  t.is(one.length, 1)
})

test.serial('can cleanTimeout', async (t) => {
  const Queue = t.context.Queue

  await Queue.create({
    cycle: t.context.db.Types.ObjectId(),
    'status': 'RUN',
    'date.pinged': new Date(2001, 1, 1)
  })

  await Queue.create({
    cycle: t.context.db.Types.ObjectId(),
    'status': 'RUN',
    'date.pinged': new Date(2099, 9, 9)
  })

  await Queue.create({
    cycle: t.context.db.Types.ObjectId()
  })

  await Queue.cleanTimeout()

  const one = await Queue.find({
    'status': 'ERROR'
  })

  t.is(one.length, 1)
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

  const four = await Queue.findById(one._id)

  t.is(four.tries, 1)
})

test.serial('can ping', async (t) => {
  const Queue = t.context.Queue

  const id = t.context.db.Types.ObjectId()

  const one = await Queue.create({
    'status': 'RUN',
    'date.created': new Date(1, 1, 2001),
    'date.pinged': new Date(2, 2, 2002)
  })

  await one.ping()

  const two = await Queue.findById(one._id)

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
    'status': 'RUN',
    'date.created': new Date(1, 1, 2001),
    'date.pinged': new Date(2, 2, 2002)
  })

  await one.setStatusToError(err)

  const two = await Queue.findById(one._id)

  t.is(two.status, 'ERROR')
  t.is(two.error[0], err.message)
  t.true(two.date.finished != null)
})

test.serial('can setStatusToTimeout', async (t) => {
  const Queue = t.context.Queue

  const one = await Queue.create({
    'cycle': t.context.db.Types.ObjectId(),
    'status': 'RUN',
    'date.created': new Date(1, 1, 2001),
    'date.pinged': new Date(2, 2, 2002)
  })

  await one.setStatusToTimeout()

  const two = await Queue.findById(one._id)

  t.is(two.status, 'ERROR')
  t.is(two.error[0], 'Timeout')
  t.is(two.tries, 0)
})
