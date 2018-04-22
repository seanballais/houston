"use strict";
/**
 * houston/src/worker/log.ts
 * A log to be passed around during a worker role
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const level_1 = require("../lib/log/level");
const template_1 = require("../lib/utility/template");
class Log extends Error {
    /**
     * Creates a new Log
     *
     * @param {Level} level
     * @param {string} title
     * @param {string} [body]
     */
    constructor(level, title, body) {
        super(title);
        this.level = level;
        this.title = title;
        this.body = body;
    }
    /**
     * Creates a new log from a file. This will take the first non-whitespace line
     * as the title, and the rest as the Log body
     *
     * @param {Level} level
     * @param {string} path
     * @param {object} [data]
     * @return {Log}
     */
    static template(level, path, data = {}) {
        const template = fs.readFileSync(path, 'utf8');
        const raw = template_1.default(template, data);
        let title = raw.trim().split('\n')[0].trim();
        // Most issues start with an h1 markdown header. It's easier to read and
        // Edit, but it's not supported in most repos as the title is plain text.
        if (title.startsWith('#')) {
            title = title.substring(2);
        }
        const body = raw.trim().split('\n').slice(1).join('\n').trim();
        return new Log(level, title, body);
    }
    /**
     * Wraps an error in the current Log
     *
     * @param {Error} error
     * @return {Log}
     */
    setError(error) {
        this.message = error.message;
        this.error = error;
        return this;
    }
    /**
     * Returns a nice string version of the log
     * BUG: This should override the default node `Error.toString()`
     *
     * @return {string}
     */
    toString() {
        const out = [];
        if (this.body != null) {
            const bodyIndented = this.body
                .split('\n')
                .map((l) => `  ${l}`);
            out.push(...bodyIndented);
        }
        else {
            const stackIndented = this.stack
                .split('\n')
                .map((l) => `  ${l}`);
            out.push(...stackIndented);
        }
        return out.join('\n');
    }
}
/**
 * A handy level assignment for easier usage
 *
 * @var {Level}
 */
Log.Level = level_1.Level;
exports.Log = Log;

//# sourceMappingURL=log.js.map
