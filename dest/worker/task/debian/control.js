"use strict";
/**
 * houston/src/worker/task/debian/control.ts
 * Updates, lints, and validates the Debian control file.
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
const lodash_1 = require("lodash");
const path = require("path");
const log_1 = require("../../log");
const task_1 = require("../task");
const controlParser_1 = require("./controlParser");
class DebianControl extends task_1.Task {
    constructor() {
        super(...arguments);
        /**
         * The parser to use when doing stuff to the debian control file
         *
         * @var {Parser}
         */
        this.parser = new controlParser_1.Parser(this.path);
    }
    /**
     * Returns the full path for the debian control file and the current test.
     *
     * @return {String}
     */
    get path() {
        return path.resolve(this.worker.workspace, 'dirty', DebianControl.path);
    }
    /**
     * Checks the Debian control file for errors
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = fs.pathExists(this.path);
            if (exists === false) {
                throw new log_1.Log(log_1.Log.Level.ERROR, 'Missing debian control file');
            }
            // TODO: Disabled Debian parser until we can handle multi package control
            // Files like the one used by io.elementary.code
            return;
            const data = yield this.parser.read();
            this.fill(data);
            const logs = (this.lint(data) || []);
            const highestLogs = logs.sort((a, b) => (b.level - a.level));
            if (highestLogs.length > 0) {
                // TODO: Report errors
            }
        });
    }
    /**
     * Fills in missing data.
     *
     * @async'
     * @param {Object} data
     * @return {void}
     */
    fill(data) {
        // Required fields by Debian law
        this.deepFill(data, 'Source', this.worker.context.nameAppstream);
        this.deepFill(data, 'Maintainer', `${this.worker.context.nameDeveloper} <appcenter@elementary.io>`);
        this.deepFill(data, 'Package', this.worker.context.nameDomain);
        // Extra optional fun stuff
        this.deepFill(data, 'Priority', 'optional');
        this.deepFill(data, 'Standards-Version', this.worker.context.version);
    }
    /**
     * Lints an object representation of the Debian control file.
     *
     * @async
     * @param {Object} data
     * @return {Log[]}
     */
    lint(data) {
        const logs = [];
        this.deepAssert(logs, data, 'Source', this.worker.context.nameAppstream, `Source should be \`${this.worker.context.nameAppstream}\``);
        this.deepAssert(logs, data, 'Maintainer', null, 'Missing maintainer');
        this.deepAssert(logs, data, 'Maintainer', /^.*\s<.*>$/, 'Maintainer should be in the form of `Maintainer Name <maintainer@email.com>`');
        this.deepAssert(logs, data, 'Package', this.worker.context.nameDomain, `Package should be \`${this.worker.context.nameDomain}\``);
        return logs;
    }
    /**
     * Inserts value into object it it does not yet exist
     *
     * @param {Object} data
     * @param {String} key
     * @param {String|Number} value
     * @return {void}
     */
    deepFill(data, key, value) {
        if (lodash_1.get(data, key) == null) {
            lodash_1.set(data, key, value);
        }
        return;
    }
    /**
     * Asserts a deep value in the debian control file
     *
     * @param {Log[]} logs
     * @param {Object} data
     * @param {String} key
     * @param {String|Number|RegExp|Function|null} value
     * @param {String} [error]
     * @return {void}
     */
    deepAssert(logs, data, key, value, error = `Assert of ${key} failed`) {
        const d = lodash_1.get(data, key);
        let failed = false;
        if (typeof value === 'string' || typeof value === 'number') {
            failed = (d !== value);
        }
        else if (value instanceof RegExp) {
            failed = !value.test(d);
        }
        else if (typeof value === 'function') {
            failed = !value(d);
        }
        else if (value == null) {
            failed = (d == null);
        }
        else {
            throw new Error(`Unknown deepAssert value for "${value}"`);
        }
        if (failed) {
            const log = new log_1.Log(log_1.Log.Level.ERROR, 'Debian control linting failed', error);
            logs.push(log);
        }
    }
}
/**
 * File location for the debian control file
 *
 * @var {string}
 */
DebianControl.path = 'debian/control';
exports.DebianControl = DebianControl;

//# sourceMappingURL=control.js.map
