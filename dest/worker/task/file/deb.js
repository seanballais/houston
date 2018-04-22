"use strict";
/**
 * houston/src/worker/task/file/deb.ts
 * Tests debian packages for needed file paths
 */
Object.defineProperty(exports, "__esModule", { value: true });
const wrapperTask_1 = require("../wrapperTask");
const binary_1 = require("./deb/binary");
const nonexistent_1 = require("./deb/nonexistent");
class FileDeb extends wrapperTask_1.WrapperTask {
    /**
     * Tasks to run for checking file paths
     *
     * @var {Task[]}
     */
    get tasks() {
        return [
            binary_1.FileDebBinary,
            nonexistent_1.FileDebNonexistent
        ];
    }
}
exports.FileDeb = FileDeb;

//# sourceMappingURL=deb.js.map
