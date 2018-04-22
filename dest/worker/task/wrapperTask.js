"use strict";
/**
 * houston/src/worker/task/wrapperTask.ts
 * Runs a bunch of tasks in a row, collecting errors for later.
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
const task_1 = require("./task");
class WrapperTask extends task_1.Task {
    constructor() {
        super(...arguments);
        /**
         * All of the logs that where gathered
         *
         * @var {Log[]}
         */
        this.logs = [];
    }
    /**
     * The tasks to run
     *
     * @var {ITaskConstructor[]}
     */
    get tasks() {
        return [];
    }
    // BUG: We have to set a no-op setter because Jest will error if we don't
    set tasks(tasks) {
        return;
    }
    /**
     * Returns all of the logs that are errors
     *
     * @return {Log[]}
     */
    get errorLogs() {
        return this.logs
            .map((l) => l.level)
            .filter((l) => (l === log_1.Log.Level.ERROR));
    }
    /**
     * Does logic.
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.runTasks();
            this.logs.forEach((l) => this.worker.report(l));
            if (this.errorLogs.length > 0) {
                this.worker.stop();
            }
        });
    }
    /**
     * Runs all the tasks. This is out of the `run` method to allow easier
     * custom logic for WrapperTask runners
     *
     * @async
     * @return {void}
     */
    runTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const T of this.tasks) {
                const task = new T(this.worker);
                yield task.run()
                    .catch((e) => this.catchError(e)); // Binding issue
            }
        });
    }
    /**
     * Catches an error thrown from one of the tasks
     *
     * @param {Error} e
     * @return {void}
     * @throws {Error}
     */
    catchError(e) {
        if (e instanceof log_1.Log) {
            this.logs.push(e);
        }
        else {
            throw e;
        }
    }
}
exports.WrapperTask = WrapperTask;

//# sourceMappingURL=wrapperTask.js.map
