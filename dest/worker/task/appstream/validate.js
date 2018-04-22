"use strict";
/**
 * houston/src/worker/task/appstream/validate.ts
 * Runs appstreamcli to validate appstream file
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
const docker_1 = require("../../docker");
const log_1 = require("../../log");
const task_1 = require("../task");
class AppstreamValidate extends task_1.Task {
    /**
     * Location of the appstream cli log
     *
     * @return {string}
     */
    get logPath() {
        return path.resolve(this.worker.workspace, 'appstream.log');
    }
    /**
     * Path to folder containing the appstream file
     *
     * @return {string}
     */
    get path() {
        return path.resolve(this.worker.workspace, 'package/usr/share/metainfo');
    }
    /**
     * Runs appstream validate with docker
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const docker = yield this.docker();
            const file = `${this.worker.context.nameDomain}.appdata.xml`;
            const cmd = `validate ${file} --no-color`;
            const exit = yield docker.run(cmd);
            if (exit !== 0) {
                throw yield this.log();
            }
        });
    }
    /**
     * Formats the docker log to something we can pass to the user
     *
     * @async
     * @return {Log}
     */
    log() {
        return __awaiter(this, void 0, void 0, function* () {
            const p = path.resolve(__dirname, 'validate.md');
            const log = yield fs.readFile(this.logPath, 'utf8');
            return log_1.Log.template(log_1.Log.Level.ERROR, p, {
                log,
                storage: this.worker.context
            });
        });
    }
    /**
     * Returns a docker instance to use for liftoff
     *
     * @async
     * @return {Docker}
     */
    docker() {
        return __awaiter(this, void 0, void 0, function* () {
            const docker = new docker_1.Docker(this.worker.config, 'appstream-validate');
            const exists = yield docker.exists();
            if (exists === false) {
                const folder = path.resolve(__dirname, 'validate');
                yield docker.create(folder);
            }
            docker.log = this.logPath;
            docker.mount(this.path, '/tmp/houston');
            return docker;
        });
    }
}
exports.AppstreamValidate = AppstreamValidate;

//# sourceMappingURL=validate.js.map
