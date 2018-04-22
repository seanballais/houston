"use strict";
/**
 * houston/src/lib/utility/glob.ts
 * Promiseifies the glob package function
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Glob = require("glob");
/**
 * A promise-ify passthrough function for glob
 *
 * @async
 *
 * @param {String} pattern
 * @param {Object} [options]
 *
 * @return {String[]}
 */
function glob(pattern, options = {}) {
    return new Promise((resolve, reject) => {
        Glob(pattern, options, (err, res) => {
            if (err != null) {
                return reject(err);
            }
            else {
                return resolve(res);
            }
        });
    });
}
exports.glob = glob;

//# sourceMappingURL=glob.js.map
