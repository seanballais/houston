/**
 * tests/houston/service/aptly.js
 * Tests aptly for accurate route sending
 */

import nock from 'nock'

import * as aptly from '~/houston/service/aptly'
import config from '~/lib/config'

// TODO: Get a better way to mock requests. Maybe a full aptly mock server?
// TODO: More restrictive mock server, test for get and post values
describe('aptly', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('can push package to review', (done) => {
    nock(config.aptly.url)
    .post((uri) => {
      return uri.indexOf(`/repos/${config.aptly.review}/file/`) !== -1
    })
    .reply(200, { Report: { Added: ['test-package-0.1.3_amd64 added'] } })
    .get((uri) => {
      return uri.split('?')[0] === `/repos/${config.aptly.review}/packages`
    })
    .reply(200, ['Pamd64 test-pacakge 0.1.3 dddddddddddddddd'])
    .post((uri) => {
      return uri.indexOf(`/repos/${config.aptly.review}/snapshots`) !== -1
    })
    .reply(200)
    .put((uri) => {
      return uri.indexOf(`/publish/${config.aptly.review}/loki`) !== -1
    })
    .reply(200)

    aptly.review('test-package', '0.1.3', ['loki'])
    .then(() => done())
    .catch((error) => done(error))
  })

  // TODO: aptly stable testing
})