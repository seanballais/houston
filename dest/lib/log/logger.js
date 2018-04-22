"use strict";
/**
 * houston/src/lib/log/logger.ts
 * A manager of logs and third party logging services.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const config_1 = require("../config");
const level_1 = require("./level");
const log_1 = require("./log");
const outputs = require("./outputs");
/**
 * Log
 * A manager of logs and third party logging services
 */
let Logger = class Logger {
    /**
     * Creates a new logger
     *
     * @param {Config} config
     */
    constructor(config) {
        /**
         * A list of outputs that we will use when a log gets sent
         *
         * @var {Output[]}
         */
        this.outputs = [];
        this.config = config;
        // TODO: At some point we can replace this with `Object.values()`
        this.setupOutputs(Object.keys(outputs).map((key) => outputs[key]));
    }
    /**
     * Creates a new log
     *
     * @return {Log}
     */
    create() {
        return new log_1.Log(this);
    }
    /**
     * Creates a new debug log
     *
     * @param {String} message
     * @return {Log}
     */
    debug(message) {
        return this.create()
            .setLevel(level_1.Level.DEBUG)
            .setMessage(message);
    }
    /**
     * Creates a new info log
     *
     * @param {String} message
     * @return {Log}
     */
    info(message) {
        return this.create()
            .setLevel(level_1.Level.INFO)
            .setMessage(message);
    }
    /**
     * Creates a new warn log
     *
     * @param {String} message
     * @return {Log}
     */
    warn(message) {
        return this.create()
            .setLevel(level_1.Level.WARN)
            .setMessage(message);
    }
    /**
     * Creates a new error log
     *
     * @param {String} message
     * @return {Log}
     */
    error(message) {
        return this.create()
            .setLevel(level_1.Level.ERROR)
            .setMessage(message);
    }
    /**
     * Does things with a finished log.
     *
     * @param {Log} log
     */
    send(log) {
        this.outputs.forEach((output) => {
            output[level_1.levelString(log.level)](log);
        });
    }
    /**
     * Sets up an output for the logger
     *
     * @param {OutputConstructor} outputter
     * @return {Logger}
     */
    setupOutput(outputter) {
        if (outputter.enabled(this.config)) {
            this.outputs.push(new outputter(this.config));
        }
        return this;
    }
    /**
     * Given an array of outputters, we try to set them up
     *
     * @param {OutputConstructor[]} outputters
     * @return {Logger}
     */
    setupOutputs(outputters) {
        outputters.forEach((outputter) => {
            this.setupOutput(outputter);
        });
        return this;
    }
};
Logger = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(config_1.Config)),
    __metadata("design:paramtypes", [config_1.Config])
], Logger);
exports.Logger = Logger;

//# sourceMappingURL=logger.js.map
