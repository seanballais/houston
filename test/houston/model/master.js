/**
 * test/houston/model/master.js
 * Tests master model class methods
 */

import mock from 'mock-require'
import path from 'path'
import test from 'ava'

import alias from 'root/.alias'
import mockConfig from 'test/fixtures/config'

test.beforeEach('setup configuration mock', (t) => {
  mock(path.resolve(alias.resolve.alias['root'], 'config.js'), mockConfig)
  t.context.master = require(path.resolve(alias.resolve.alias['houston'], 'model', 'master')).default
})

test('can sanatize user input', (t) => {
  const sanatize = t.context.master.sanatize

  const one = { 'id': 'somesortofid' }
  const two = { '$or': [{ 'id': 'nestedinputquery' }] }

  t.is(sanatize(one), one)
  t.is(Object.keys(sanatize(two)).length, 0)
})
