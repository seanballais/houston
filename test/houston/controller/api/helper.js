/**
 * test/houston/controller/api/helper.js
 * Tests api controller helpers
 */

import test from 'ava'

import * as helper from 'houston/controller/api/helper'

test('API error inherits Error class', (t) => {
  const one = new helper.APIError(400, 'This is an error', 'A detailed message')
  const two = new helper.APIError(500, 'Internal error', "It's going down")

  t.true(one instanceof Error)

  t.is(one.status, 400)
  t.is(one.title, 'This is an error')
  t.is(one.detail, 'A detailed message')

  t.is(two.status, 500)
  t.is(two.title, 'Internal error')
  t.is(two.detail, "It's going down")
})

test('limit parses numbers correctly', (t) => {
  t.is(helper.limit({ 'page[limit]': 20 }), 20)
  t.is(helper.limit({ 'page[limit]': 1 }), 1)
  t.is(helper.limit({ 'page[limit]': 50 }), 50)

  t.is(helper.limit({ 'page[limit]': '8' }), 8)

  t.throws(() => helper.limit({ 'page[limit]': 20000000 }))
  t.throws(() => helper.limit({ 'page[limit]': -123 }))
  t.throws(() => helper.limit({ 'page[limit]': 'fail' }))

  const one = t.throws(() => helper.limit({ 'page[limit]': 'nope' }))
  t.is(one.code, 'APIERR')
})

test('offset parses numbers correctly', (t) => {
  t.is(helper.offset({ 'page[offset]': 20 }), 20)
  t.is(helper.offset({ 'page[offset]': 1 }), 1)
  t.is(helper.offset({ 'page[offset]': 50 }), 50)

  t.is(helper.offset({ 'page[offset]': '8' }), 8)

  t.throws(() => helper.offset({ 'page[offset]': -123 }))
  t.throws(() => helper.offset({ 'page[offset]': 'fail' }))

  const one = t.throws(() => helper.offset({ 'page[offset]': 'nope' }))
  t.is(one.code, 'APIERR')
})
