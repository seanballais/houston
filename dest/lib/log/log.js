"use strict";
/**
 * houston/src/lib/log/log.ts
 * A log message with super powers.
 *
 * @exports {Class} Log - A single log line.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const level_1 = require("./level");
const logger_1 = require("./logger");
/**
 * Log
 * A single log line.
 */
let Log = class Log {
    /**
     * Creates a new log with default values
     *
     * @param {Logger} logger
     */
    constructor(logger) {
        this.level = level_1.Level.DEBUG;
        this.data = {};
        this.date = new Date();
        this.logger = logger;
    }
    /**
     * Sets the log level
     *
     * @param {Level} level
     *
     * @return {Log}
     */
    setLevel(level) {
        this.level = level;
        return this;
    }
    /**
     * Sets the log message
     *
     * @param {String} message
     *
     * @return {Log}
     */
    setMessage(message) {
        this.message = message;
        return this;
    }
    /**
     * Sets data in the log
     *
     * @param {String} key
     * @param {*} value
     *
     * @return {Log}
     */
    setData(key, value) {
        this.data[key] = value;
        return this;
    }
    /**
     * A shorthand for attaching an error message to a log
     *
     * @param {Error} err
     *
     * @return {Log}
     */
    setError(err) {
        this.error = err;
        return this;
    }
    /**
     * Gets the date this log was created.
     *
     * @return {Date}
     */
    getDate() {
        return this.date;
    }
    /**
     * Sends the log to what ever services / places it needs to be.
     *
     * @return {void}
     */
    send() {
        return this.logger.send(this);
    }
};
Log = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [logger_1.Logger])
], Log);
exports.Log = Log;

//# sourceMappingURL=log.js.map
