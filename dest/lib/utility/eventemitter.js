"use strict";
/**
 * houston/src/lib/utility/eventemitter.ts
 * An event emitter based on eventemitter2 with some nice added features
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter2_1 = require("eventemitter2");
const lodash_1 = require("lodash");
const DEFAULT_OPTS = {
    delimiter: ':',
    maxListeners: 10,
    newListener: false,
    verboseMemoryLeak: true,
    wildcard: true
};
class EventEmitter extends eventemitter2_1.EventEmitter2 {
    /**
     * Creates a new event emitter
     *
     * @param {Object} [opts]
     */
    constructor(opts = {}) {
        super(lodash_1.defaultsDeep({}, DEFAULT_OPTS, opts));
    }
    /**
     * This emites an async event, that will resolve the results by running
     * listeners step by step. This is great for things that can be extended and
     * modified by listeners.
     *
     * @param {string} event
     * @param {*} arg
     * @return {*} - Results of arg after modification from listeners
     */
    emitAsyncChain(event, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const listeners = this.listeners(event);
            let value = arg;
            for (const listener of listeners) {
                yield Promise.resolve(listener(value))
                    .then((result) => (value = result));
            }
            return value;
        });
    }
}
exports.EventEmitter = EventEmitter;

//# sourceMappingURL=eventemitter.js.map
