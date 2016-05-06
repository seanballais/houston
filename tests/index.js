/**
 * tests/index.js
 * Entry for handling all Houston tests
 */

import mock from 'mock-require'
import path from 'path'

// Required for any imports not in a mocha test
mock(path.resolve(__dirname, '../config'), require('./mocks/config'))

process.on('unhandledRejection', (reason, promise) => {
  /* eslint-disable no-console */
  console.log(`Unhandled Rejection at: ${promise}`)
  console.log(reason)
  /* eslint-enable no-console */
})

beforeEach(() => {
  mock(path.resolve(__dirname, '../config'), require('./mocks/config'))
})

afterEach(() => {
  mock.stopAll()
})

require('./project')
require('./lib')
require('./flightcheck')
require('./houston')