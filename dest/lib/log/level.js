"use strict";
/**
 * houston/src/lib/log/level.ts
 * Some log levels
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The debug level of logs
 *
 * @var {Symbol}
 */
exports.DEBUG = Symbol();
/**
 * The info level of logs
 *
 * @var {Symbol}
 */
exports.INFO = Symbol();
/**
 * The warn level of logs
 *
 * @var {Symbol}
 */
exports.WARN = Symbol();
/**
 * The error level of logs
 *
 * @var {Symbol}
 */
exports.ERROR = Symbol();
/**
 * An enum representing all of the log levels
 *
 * @var {enum}
 */
var Level;
(function (Level) {
    Level[Level["DEBUG"] = 0] = "DEBUG";
    Level[Level["INFO"] = 1] = "INFO";
    Level[Level["WARN"] = 2] = "WARN";
    Level[Level["ERROR"] = 3] = "ERROR";
})(Level = exports.Level || (exports.Level = {}));
/**
 * Parses a string value for a level symbol
 *
 * @param {string} level
 * @return {Level}
 */
function parseLevel(level) {
    switch (level.toLowerCase().trim()) {
        case ('debug'):
            return Level.DEBUG;
        case ('info'):
            return Level.INFO;
        case ('warn'):
            return Level.WARN;
        case ('error'):
            return Level.ERROR;
        default:
            return Level.INFO;
    }
}
exports.parseLevel = parseLevel;
/**
 * Returns a string given a level symbol
 *
 * @param {Level} level
 * @return {string}
 */
function levelString(level) {
    switch (level) {
        case (Level.DEBUG):
            return 'debug';
        case (Level.INFO):
            return 'info';
        case (Level.WARN):
            return 'warn';
        case (Level.ERROR):
            return 'error';
        default:
            return 'info';
    }
}
exports.levelString = levelString;
/**
 * Returns a number index of severity for a level symbol
 *
 * @param {Level} level
 * @return {Number}
 */
function levelIndex(level) {
    switch (level) {
        case (Level.DEBUG):
            return 0;
        case (Level.INFO):
            return 1;
        case (Level.WARN):
            return 2;
        case (Level.ERROR):
            return 3;
        default:
            return 1;
    }
}
exports.levelIndex = levelIndex;

//# sourceMappingURL=level.js.map
