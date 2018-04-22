"use strict";
/**
 * houston/src/lib/log/output.ts
 * An abstract class for sending logs somewhere.
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
// Disabled because of abstract and interfaces are made to be extended.
// tslint:disable:no-unused-variable
const inversify_1 = require("inversify");
const config_1 = require("../config");
/**
 * A generic abstract class for handling logs.
 */
let Output = class Output {
    /**
     * Creates a new logger output
     *
     * @param {Config} config
     */
    constructor(config) {
        return;
    }
    /**
     * Checks if we should enable this output
     *
     * @param {Config} config
     *
     * @return {boolean}
     */
    static enabled(config) {
        return true;
    }
    /**
     * Does something with a debug log.
     *
     * @param {Log} log
     * @return {void}
     */
    debug(log) {
        return;
    }
    /**
     * Does something with a info log.
     *
     * @param {Log} log
     * @return {void}
     */
    info(log) {
        return;
    }
    /**
     * Does something with a warn log.
     *
     * @param {Log} log
     * @return {void}
     */
    warn(log) {
        return;
    }
    /**
     * Does something with a error log.
     *
     * @param {Log} log
     * @return {void}
     */
    error(log) {
        return;
    }
};
Output = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [config_1.Config])
], Output);
exports.Output = Output;

//# sourceMappingURL=output.js.map
