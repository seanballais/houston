"use strict";
/**
 * houston/src/worker/task/appstream/screenshot.ts
 * Ensures the developer includes a screenshot
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
const log_1 = require("../../log");
const task_1 = require("../task");
class AppstreamScreenshot extends task_1.Task {
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
            const $ = cheerio.load(raw, { xmlMode: true });
            const screenshots = $('component > screenshots > screenshot');
            if (screenshots.length < 1) {
                throw new log_1.Log(log_1.Log.Level.ERROR, 'Missing screenshots');
            }
            screenshots.each((i, elem) => this.checkTag($, elem));
        });
    }
    /**
     * Checks a screenshot tag in appstream file
     *
     * @param {Object} elem - Cheerio element
     * @return {void}
     */
    checkTag($, elem) {
        const screenshot = $(elem);
        const image = $('image', screenshot);
        if (image.length !== 1) {
            this.worker.report(new log_1.Log(log_1.Log.Level.ERROR, 'Missing image tag in screenshot'));
        }
    }
}
exports.AppstreamScreenshot = AppstreamScreenshot;

//# sourceMappingURL=screenshot.js.map
