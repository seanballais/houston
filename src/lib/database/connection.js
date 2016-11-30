/**
 * lib/database/connection.js
 * Sets up database connection
 *
 * @exports {Object} default - initialized mongoose object
 */

import mongoose from 'mongoose'

import config from 'lib/config'
import Log from 'lib/log'

const log = new Log('lib:database')

mongoose.Promise = global.Promise

mongoose.createConnection(config.database)

mongoose.connection.on('error', (msg) => log.error(msg))

mongoose.connection.once('open', () => log.info('Connected to database'))

mongoose.connection.once('close', () => log.warn('Disconnected to database'))

export default mongoose
