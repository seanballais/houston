"use strict";
/**
 * houston/src/worker/task/appstream/name.ts
 * Checks that a name field exists in the appstream file
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
class AppstreamName extends task_1.Task {
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
            const name = $('component > name');
            if (name.length === 0) {
                $('component').prepend(`<name>${this.worker.context.nameHuman}</name>`);
                yield fs.writeFile(this.path, $.xml());
                throw new log_1.Log(log_1.Log.Level.WARN, 'Missing "name" field');
            }
        });
    }
}
exports.AppstreamName = AppstreamName;

//# sourceMappingURL=name.js.map
