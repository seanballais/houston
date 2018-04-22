"use strict";
/**
 * houston/src/worker/task/appstream/release.ts
 * Checks and updates the appstream releases section
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
const sanitize = require("sanitize-html");
const semver = require("semver");
const markdown_1 = require("../../../lib/utility/markdown");
const task_1 = require("../task");
class AppstreamRelease extends task_1.Task {
    /**
     * Path the appstream file should exist at
     *
     * @return {string}
     */
    get path() {
        return path.resolve(this.worker.workspace, 'package/usr/share/metainfo', `${this.worker.context.nameDomain}.appdata.xml`);
    }
    /**
     * Runs all the appstream tests
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield fs.readFile(this.path);
            const $ = cheerio.load(raw, AppstreamRelease.CHEERIO_OPTS);
            const releases = $('component > releases');
            // NOTE: We want to allow people to fill this in theirself for translations
            if (releases.length === 0) {
                yield fs.writeFile(this.path, this.fill($));
            }
        });
    }
    /**
     * Fills in the missing releases section
     *
     * @param {Object} $ - cheerio appstream document
     * @return {string} - The full appstream document after filling releases
     */
    fill($) {
        if ($('component > releases').length === 0) {
            $('component').append('<releases></releases>');
        }
        this.worker.context.changelog
            .sort((a, b) => semver.rcompare(a.version, b.version))
            .forEach((change) => {
            $('component > releases').prepend('<release></release>');
            const release = $('component > releases > release:last-of-type');
            release.attr('version', change.version);
            release.attr('date', change.date.toISOString());
            release.attr('urgency', this.urgency(change.changes));
            release.html(`<description>${this.html(change.changes)}</description>`);
        });
        return $.xml();
    }
    /**
     * Parses a markdown changelog to find an urgency of the release
     *
     * @param {String} change
     * @return {String} - "low" "medium" "high" or "critical". "medium" is default
     */
    urgency(change) {
        const grepable = change
            .toLowerCase()
            .replace(/\W\s/img, '')
            .replace(/\s+/img, ' ');
        const CRITICAL_WORDS = [
            'security', 'critical'
        ];
        CRITICAL_WORDS.forEach((word) => {
            if (grepable.indexOf(word) !== -1) {
                return 'critical';
            }
        });
        return 'medium';
    }
    /**
     * Converts a markdown changelog to something appstream can deal with
     *
     * @param {String} change
     * @return {String}
     */
    html(change) {
        const html = markdown_1.default(change);
        const $ = cheerio.load(html, AppstreamRelease.CHEERIO_OPTS);
        const lists = $('ul');
        const paragraphs = $('p');
        if (lists.length === 0 && paragraphs.length === 1) {
            const items = paragraphs.text().split('\n').join('</li><li>');
            $.root().html(`<ul><li>${items}</li></ul>`);
        }
        return this.sanitize($.xml());
    }
    /**
     * Sanitizes the html input to only allowed valid appstream tags
     *
     * @param {String} change
     * @return {String}
     */
    sanitize(change) {
        const $el = cheerio.load(change, AppstreamRelease.CHEERIO_OPTS);
        const sanitized = sanitize($el.xml(), {
            allowedTags: AppstreamRelease.WHITELISTED_TAGS,
            parser: AppstreamRelease.CHEERIO_OPTS
        });
        return cheerio.load(sanitized, AppstreamRelease.CHEERIO_OPTS).xml();
    }
}
/**
 * A list of valid tags for an appstream release
 *
 * @var {String[]}
 */
AppstreamRelease.WHITELISTED_TAGS = [
    'p', 'ul', 'li'
];
/**
 * The options needed for cheerio parsing
 *
 * @var {object}
 */
AppstreamRelease.CHEERIO_OPTS = {
    useHtmlParser2: true,
    xmlMode: true
};
exports.AppstreamRelease = AppstreamRelease;

//# sourceMappingURL=release.js.map
