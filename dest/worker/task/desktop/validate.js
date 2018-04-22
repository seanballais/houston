"use strict";
/**
 * houston/src/worker/task/appstream/validate.ts
 * Runs desktop files through the `desktop-file-validate` command
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
const path = require("path");
const glob_1 = require("../../../lib/utility/glob");
const docker_1 = require("../../docker");
const log_1 = require("../../log");
const task_1 = require("../task");
class DesktopValidate extends task_1.Task {
    /**
     * Path to folder containing the desktop files
     *
     * @return {string}
     */
    get path() {
        return path.resolve(this.worker.workspace, 'package/usr/share/applications');
    }
    /**
     * Runs appstream validate with docker
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield glob_1.glob(path.resolve(this.path, '*'));
            const logFiles = [];
            for (const file of files) {
                const fileName = path.basename(file);
                const docker = yield this.docker(fileName);
                const localFile = path.relative(this.path, file);
                const exit = yield docker.run(localFile);
                if (exit !== 0) {
                    logFiles.push(fileName);
                }
            }
            if (logFiles.length > 0) {
                throw yield this.log(logFiles);
            }
        });
    }
    /**
     * Location of the desktop log file for the given test file
     *
     * @return {string}
     */
    logPath(file) {
        return path.resolve(this.worker.workspace, `appstream-${file}.log`);
    }
    /**
     * Formats the docker log to something we can pass to the user
     *
     * @async
     * @param {string[]} files
     * @return {Log}
     */
    log(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = path.resolve(__dirname, 'validate.md');
            const logs = {};
            for (const file of files) {
                logs[file] = yield fs.readFile(this.logPath(file), 'utf8');
            }
            return log_1.Log.template(log_1.Log.Level.ERROR, p, {
                logs,
                storage: this.worker.context
            });
        });
    }
    /**
     * Returns a docker instance to use for liftoff
     *
     * @async
     * @param {string} file
     * @return {Docker}
     */
    docker(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const docker = new docker_1.Docker(this.worker.config, 'desktop-validate');
            const exists = yield docker.exists();
            if (exists === false) {
                const folder = path.resolve(__dirname, 'validate');
                yield docker.create(folder);
            }
            docker.log = this.logPath(file);
            docker.mount(this.path, '/tmp/houston');
            return docker;
        });
    }
}
exports.DesktopValidate = DesktopValidate;

//# sourceMappingURL=validate.js.map
