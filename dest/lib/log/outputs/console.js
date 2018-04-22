"use strict";
/**
 * houston/src/lib/log/services/console.ts
 * Outputs logs to the console
 */
Object.defineProperty(exports, "__esModule", { value: true });
const level_1 = require("../level");
const output_1 = require("../output");
class Console extends output_1.Output {
    /**
     * Checks if this output should be enabled
     *
     * @param {Config} config
     *
     * @return {boolean}
     */
    static enabled(config) {
        if (config.has('log.console') === false) {
            return false;
        }
        return (config.get('log.console') !== 'never');
    }
    /**
     * Creates a new Sentry output
     *
     * @param {Config} config
     */
    constructor(config) {
        super(config);
        this.config = config;
    }
    /**
     * Sends debug info to the console
     *
     * @param {Log} log
     * @return {void}
     */
    debug(log) {
        console.info(log.message);
    }
    /**
     * Logs a message to the console
     *
     * @param {Log} log
     * @return {void}
     */
    info(log) {
        console.info(log.message);
    }
    /**
     * Logs a warning log to the console
     *
     * @param {Log} log
     * @return {void}
     */
    warn(log) {
        console.warn(log.message);
    }
    /**
     * Logs an error to the console
     *
     * @param {Log} log
     * @return {void}
     */
    error(log) {
        console.error(log.message);
    }
    /**
     * Checks if the configuration allows a given log level.
     *
     * @param {Level} level
     *
     * @return {Boolean}
     */
    allows(level) {
        if (this.config.has('log.console') === false) {
            return false;
        }
        const configLevel = level_1.parseLevel(this.config.get('log.console'));
        if (level >= configLevel) {
            return true;
        }
        return false;
    }
}
exports.Console = Console;

//# sourceMappingURL=console.js.map
