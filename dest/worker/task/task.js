"use strict";
/**
 * houston/src/worker/task/task.ts
 * Some worker logic.
 *
 * @exports {Class} Task
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
const log_1 = require("../log");
class Task {
    /**
     * Creates a new Task
     *
     * @param {Worker} worker
     */
    constructor(worker) {
        this.worker = worker;
    }
    /**
     * Does logic.
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.worker.emit(`task:${this.constructor.name}:start`);
            //
            this.worker.emit(`task:${this.constructor.name}:end`);
        });
    }
    /**
     * Adds a log/error to storage
     *
     * @param {Error} e
     * @return {Task}
     */
    report(e) {
        // A real error. Not a Log
        if (!(e instanceof log_1.Log)) {
            const log = new log_1.Log(log_1.Log.Level.ERROR, 'Internal error while running')
                .setError(e);
            this.worker.report(log);
            this.worker.stop();
        }
        else {
            this.worker.report(e);
            if (e.level === log_1.Log.Level.ERROR) {
                this.worker.stop();
            }
        }
        return this;
    }
}
exports.Task = Task;

//# sourceMappingURL=task.js.map
