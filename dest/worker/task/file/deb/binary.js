"use strict";
/**
 * houston/src/worker/task/file/deb/binary.ts
 * Tests debian packages for needed binary file
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
const glob_1 = require("../../../../lib/utility/glob");
const log_1 = require("../../../log");
const task_1 = require("../../task");
class FileDebBinary extends task_1.Task {
    /**
     * Location of the directory to build
     *
     * @return {string}
     */
    get path() {
        return path.resolve(this.worker.workspace, 'package/usr/bin', this.worker.context.nameDomain);
    }
    /**
     * Runs liftoff
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield fs.exists(this.path);
            if (exists === false) {
                throw log_1.Log.template(log_1.Log.Level.ERROR, path.resolve(__dirname, 'binary.md'), {
                    context: this.worker.context,
                    files: yield this.files()
                });
            }
        });
    }
    /**
     * Returns a list of useful files in the package. Filters out custom files
     *
     * @async
     * @return {string[]}
     */
    files() {
        return __awaiter(this, void 0, void 0, function* () {
            const root = path.resolve(this.worker.workspace, 'package');
            const files = yield glob_1.glob(path.resolve(root, '**/*'), { nodir: true });
            return files
                .filter((p) => !p.startsWith(path.resolve(root, 'DEBIAN')))
                .filter((p) => (p !== path.resolve(root, 'FILES')))
                .map((p) => p.substring(root.length));
        });
    }
}
exports.FileDebBinary = FileDebBinary;

//# sourceMappingURL=binary.js.map
