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
class FileDebNonexistent extends task_1.Task {
    /**
     * Folder where non-correctly installed files will end up in the Debian package
     *
     * @return {string}
     */
    get path() {
        return path.resolve(this.worker.workspace, 'package');
    }
    /**
     * Glob for non-correctly installed files
     *
     * @return {string}
     */
    get files() {
        return path.resolve(this.path, 'package/nonexistent/**/*');
    }
    /**
     * Checks no files are incorrectly placed in the deb package
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield glob_1.glob(this.files);
            if (files.length < 1) {
                return;
            }
            const relativePaths = files.map((file) => file.replace(`${this.path}/`, ''));
            const p = path.resolve(__dirname, 'nonexistentLog.md');
            const log = yield fs.readFile(p, 'utf8');
            throw log_1.Log.template(log_1.Log.Level.ERROR, p, {
                files: relativePaths,
                storage: this.worker.context
            });
        });
    }
}
exports.FileDebNonexistent = FileDebNonexistent;

//# sourceMappingURL=nonexistent.js.map
