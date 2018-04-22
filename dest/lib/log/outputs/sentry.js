"use strict";
/**
 * houston/src/lib/log/services/sentry.ts
 * Handles logging errors to sentry
 */
Object.defineProperty(exports, "__esModule", { value: true });
const output_1 = require("../output");
class Sentry extends output_1.Output {
    /**
     * Checks if this output should be enabled
     *
     * @return {boolean}
     */
    static enabled(config) {
        if (config.has('log.sentry') === false) {
            return false;
        }
        else if (config.has('service.sentry.secret') === false) {
            return false;
        }
        try {
            require.resolve('raven');
        }
        catch (e) {
            return false;
        }
        return (config.get('log.sentry') !== 'never');
    }
    /**
     * Creates a new Sentry output
     *
     * @param {Config} config
     */
    constructor(config) {
        super(config);
        this.config = config;
        this.dns = config.get('service.sentry.secret');
        this.raven = this.setup();
    }
    /**
     * Sends error logs to sentry
     *
     * @param {Log} log
     * @return {void}
     */
    error(log) {
        this.raven.captureException(this.toError(log));
    }
    /**
     * Transforms a log message to an error
     *
     * @param {Log} log
     *
     * @return {Error}
     */
    toError(log) {
        const error = new Error(log.message);
        // Add a stack trace no including this function
        Error.captureStackTrace(error, this.toError);
        Object.assign(error, log.data, { error: log.error });
        return error;
    }
    /**
     * Sets up raven with common metadata and things.
     *
     * @return {Raven}
     */
    setup() {
        return require('raven')
            .config(this.dns)
            .install();
    }
}
exports.Sentry = Sentry;

//# sourceMappingURL=sentry.js.map
