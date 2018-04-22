"use strict";
/**
 * houston/src/worker/task/appstream/summary.ts
 * Checks stuff about the appstream summary field
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
class AppstreamSummary extends task_1.Task {
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
            const summary = $('component > summary');
            if (summary.length === 0) {
                throw new log_1.Log(log_1.Log.Level.ERROR, 'Missing "summary" field');
            }
            const text = summary.text();
            if (text.toLowerCase().replace(/\W/, '').indexOf('elementaryos') !== -1) {
                throw new log_1.Log(log_1.Log.Level.ERROR, '"summary" field calls out elementary OS');
            }
        });
    }
}
exports.AppstreamSummary = AppstreamSummary;

//# sourceMappingURL=summary.js.map
