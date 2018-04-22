"use strict";
/**
 * houston/src/worker/task/debian/changelog.ts
 * Updates, lints, and validates the Debian changelog file.
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
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");
const markdown_1 = require("../../../lib/utility/markdown");
const template_1 = require("../../../lib/utility/template");
const task_1 = require("../task");
class DebianChangelog extends task_1.Task {
    /**
     * Returns the string templated version of the changelog
     *
     * @async
     * @param {IContext} context
     * @return {string}
     */
    static template(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const changes = yield this.getChanges(context.changelog);
            const file = yield fs.readFile(this.templatePath, 'utf8');
            const changelog = template_1.default(file, { context, changes });
            return changelog
                // Trim empty lines of whitespace
                .replace(/^\s*$/img, '')
                .trim();
        });
    }
    /**
     * Recursivly gets a list of changes for each changelog item
     *
     * @async
     * @param {Object[]} changelogs
     * @return {Array[]}
     */
    static getChanges(changelogs = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const changes = [];
            for (const version of changelogs) {
                changes.push(yield this.parseMarkdown(version.changes));
            }
            return changes;
        });
    }
    /**
     * Parses a markdown string to find a list of changes
     *
     * @param {string} changes
     * @return {string[]}
     */
    static parseMarkdown(changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = markdown_1.default(changes);
            const $ = cheerio.load(html);
            const values = [];
            // A normal list in the markdown
            if ($('ul').length > 0) {
                $('ul > li').each(function () {
                    values.push($(this).text());
                });
                // Transform paragraphs into the changes
            }
            else if ($('p').length > 0) {
                $('p').each(function () {
                    values.push($(this).text());
                });
            }
            if (values.length < 1) {
                values.push('Version Bump');
            }
            return values;
        });
    }
    /**
     * Returns the full path for the debian changelog file and the current test.
     *
     * @return {String}
     */
    get path() {
        return path.resolve(this.worker.workspace, 'dirty', DebianChangelog.path);
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
                yield this.fill();
            }
            // TODO: Lint?
        });
    }
    /**
     * Fills the changelog file with all known changes
     * TODO: Convert markdown changes to a list
     *
     * @return {void}
     */
    fill() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs.ensureFile(this.path);
            if (this.worker.context.changelog.length === 0) {
                this.worker.context.changelog.push(this.noopChange());
            }
            const changelog = yield DebianChangelog.template(this.worker.context);
            yield fs.writeFile(this.path, changelog, 'utf8');
        });
    }
    /**
     * Returns a blank change we will insert into the changelog
     *
     * @return {Object}
     */
    noopChange() {
        return {
            author: this.worker.context.nameDeveloper,
            changes: 'Version Bump',
            date: new Date(),
            version: this.worker.context.version
        };
    }
}
/**
 * File location for the debian changelog file
 *
 * @var {string}
 */
DebianChangelog.path = 'debian/changelog';
/**
 * File location for the debian changelog template
 *
 * @var {string}
 */
DebianChangelog.templatePath = path.resolve(__dirname, 'changelogTemplate.ejs');
exports.DebianChangelog = DebianChangelog;

//# sourceMappingURL=changelog.js.map
