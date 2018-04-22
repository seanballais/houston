"use strict";
/**
 * houston/src/lib/queue/providers/redis/job.ts
 * Wraps `bull` package in types for use in our queue system.
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
const events_1 = require("events");
class Job extends events_1.EventEmitter {
    /**
     * Creates a new queue with the given name
     *
     * @param {String} name
     */
    constructor(job) {
        super();
        this.bull = job;
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this.bull.getState();
            switch (state) {
                case ('waiting'):
                    return 'waiting';
                case ('active'):
                    return 'active';
                case ('completed'):
                    return 'completed';
                case ('failed'):
                    return 'failed';
                case ('delayed'):
                    return 'delayed';
                default:
                    return 'failed';
            }
        });
    }
    progress(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bull.progress(amount);
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bull.remove();
        });
    }
}
exports.Job = Job;

//# sourceMappingURL=job.js.map
