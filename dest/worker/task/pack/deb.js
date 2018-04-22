"use strict";
/**
 * houston/src/worker/task/pack/deb.ts
 * Packages up an extracted deb file
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
const path = require("path");
const docker_1 = require("../../docker");
const log_1 = require("../../log");
const task_1 = require("../task");
class PackDeb extends task_1.Task {
    /**
     * The directory we will pack to a deb file
     *
     * @return {string}
     */
    get path() {
        return path.resolve(this.worker.workspace, 'package');
    }
    /**
     * Runs liftoff
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const docker = yield this.docker(this.worker.workspace);
            // The extract script will need to chmod root files
            const exit = yield docker.run('pack-deb', { Privileged: true });
            if (exit !== 0) {
                throw new log_1.Log(log_1.Log.Level.ERROR, 'Unable to pack Debian package');
            }
        });
    }
    /**
     * Returns a docker instance to use for liftoff
     *
     * @async
     * @param {string} p - Folder to mount for building
     * @return {Docker}
     */
    docker(p) {
        return __awaiter(this, void 0, void 0, function* () {
            const docker = new docker_1.Docker(this.worker.config, 'pack-deb');
            const exists = yield docker.exists();
            if (exists === false) {
                const folder = path.resolve(__dirname, 'deb');
                yield docker.create(folder);
            }
            docker.mount(this.worker.workspace, '/tmp/houston');
            return docker;
        });
    }
}
exports.PackDeb = PackDeb;

//# sourceMappingURL=deb.js.map
