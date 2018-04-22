"use strict";
/**
 * houston/src/worker/worker.ts
 * The master class for repository processing.
 *
 * @exports {Class} Worker - A processing class
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
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const uuid = require("uuid/v4");
const eventemitter_1 = require("../lib/utility/eventemitter");
const log_1 = require("./log");
const tempDir = path.resolve(os.tmpdir(), 'houston');
class Worker extends eventemitter_1.EventEmitter {
    /**
     * Creates a new worker process
     *
     * @param {Config} config - The configuration to use
     * @param {Repository} repository - The repository to process on
     * @param {IContext} context - The starting context for building
     */
    constructor(config, repository, context) {
        super();
        /**
         * tasks
         * All of the tasks to run.
         *
         * @var {ITaskConstructor[]}
         */
        this.tasks = [];
        /**
         * forks
         * All of the forks we are going to run after the current task ends.
         *
         * @var {Worker[]}
         */
        this.forks = [];
        this.config = config;
        this.repository = repository;
        this.context = context;
        this.workspace = path.resolve(tempDir, uuid());
    }
    /**
     * fails
     * Checks if the worker fails
     *
     * @return {boolean}
     */
    get fails() {
        for (const log of this.context.logs) {
            if (log.level === log_1.Log.Level.ERROR) {
                return true;
            }
        }
        return false;
    }
    /**
     * passes
     * Checks if the worker passes
     *
     * @return {boolean}
     */
    get passes() {
        return (this.fails === false);
    }
    /**
     * runningIndex
     * Returns the currently running task index
     *
     * @return {Number}
     */
    get runningIndex() {
        if (this.running != null) {
            return this.tasks.findIndex((task) => {
                return (this.running instanceof task);
            });
        }
    }
    /**
     * contexts
     * Returns a list of all the contexts this worker has, and all of it's forks
     *
     * @return {IContext[]}
     */
    get contexts() {
        return [
            this.context,
            ...this.forks
                .map((worker) => worker.contexts)
                .reduce((a, b) => [...a, ...b], [])
        ];
    }
    /**
     * result
     * Returns the result of the worker. Possible, but incomplete if not stopped.
     *
     * @return {IResult}
     */
    get result() {
        const packages = this.contexts
            .map((ctx) => ({
            path: ctx.packagePath,
            type: ctx.packageSystem
        }))
            .filter((p) => (p != null));
        // We just assume the longest appcenter and appstream fields are the best
        const appcenters = this.contexts
            .map((ctx) => ctx.appcenter)
            .filter((a) => (a != null))
            .sort((a, b) => (JSON.stringify(b).length - JSON.stringify(a).length));
        const appstreams = this.contexts
            .map((ctx) => ctx.appstream)
            .filter((a) => (a != null))
            .sort((a, b) => (b.length - a.length));
        const logs = this.contexts
            .map((ctx) => ctx.logs)
            .reduce((a, b) => [...a, ...b], [])
            .filter((l) => (l != null))
            .reduce((allLogs, log) => {
            const similarLogIndex = allLogs
                .findIndex((l) => (l.title === log.title));
            if (similarLogIndex === -1) {
                return [...allLogs, log];
            }
            const similarLog = allLogs[similarLogIndex];
            if (similarLog.body.length < log.body.length) {
                return allLogs.splice(similarLogIndex, 1, log);
            }
        }, []);
        return {
            appcenter: appcenters[0],
            appstream: appstreams[0],
            failed: this.fails,
            logs,
            packages
        };
    }
    /**
     * setup
     * Creates a workspace for the process
     *
     * @async
     * @return {void}
     */
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('starting worker with: ', this.context);
            yield this.emitAsync('setup:start');
            yield fs.ensureDir(this.workspace);
            yield this.emitAsync('setup:end');
        });
    }
    /**
     * run
     * Runs a bun of tasks. The first param is do match the ITask.
     *
     * @async
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.emitAsync('run:start');
            for (const task of this.tasks) {
                // Run the tasks given to us
                try {
                    const taskConstructor = yield this.emitAsyncChain('task:start', task);
                    this.running = new taskConstructor(this);
                    yield this.running.run();
                }
                catch (err) {
                    this.report(err);
                }
                if (this.running == null) {
                    break;
                }
                // And if we have any forks, stop running the tasks, and run the forks
                if (this.forks.length > 0) {
                    const todoTasks = this.tasks.splice(this.runningIndex);
                    this.forks.forEach((fork) => {
                        fork.tasks = todoTasks;
                    });
                    yield Promise.all(this.forks.map((fork) => fork.run()));
                    break;
                }
            }
            yield this.emitAsync('run:end');
            this.stop();
        });
    }
    /**
     * fork
     * Creates a new worker, copying most of the properties from this instance.
     * It will then run all of these forks _AFTER_ the current task is done.
     *
     * @example
     *   Some tests, like setting up the workspace, can have multiple outputs. In
     *   an effort to keep things linear and _hopefully_ easy to understand the
     *   order, this is the way we would make multiple outputs possible. If the
     *   task, it will look at all the repository references and determine what
     *   kinds of packages it can make. Then, for each distribution, it forks.
     *   We end up with 3 different `Worker`s running, and on exit, merging
     *   storages.
     *
     * @async
     * @param {Object} context - Overwrite for the forked context
     * @return {Worker}
     */
    fork(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const newContext = Object.assign({}, this.context, context);
            const fork = this.constructor(this.config, this.repository, newContext);
            this.forks.push(fork);
            return fork;
        });
    }
    /**
     * teardown
     * Removes files and cleans up remaining files
     *
     * @async
     * @return {void}
     */
    teardown() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.emitAsync('teardown:start');
            yield fs.remove(this.workspace);
            yield this.emitAsync('teardown:end');
        });
    }
    /**
     * Adds a log/error to storage
     *
     * @param {Error} err
     * @return {Worker}
     */
    report(err) {
        // A real error. Not a Log
        if (!(err instanceof log_1.Log)) {
            this.emit('run:error', err);
            const log = new log_1.Log(log_1.Log.Level.ERROR, 'Internal error while running')
                .setError(err);
            this.context.logs.push(log);
            this.stop();
        }
        else {
            this.context.logs.push(err);
            if (err.level === log_1.Log.Level.ERROR) {
                this.stop();
            }
        }
        return this;
    }
    /**
     * Stops the build if it's currently running
     *
     * @return {IResult}
     */
    stop() {
        this.running = null;
        return this.result;
    }
}
exports.Worker = Worker;

//# sourceMappingURL=worker.js.map
