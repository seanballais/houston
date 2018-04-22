"use strict";
/**
 * houston/src/worker/task/appstream/stripe.ts
 * Adds stripe data to appstream file
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
const task_1 = require("../task");
class AppstreamStripe extends task_1.Task {
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
            if (this.worker.context.stripe == null) {
                return;
            }
            const raw = yield fs.readFile(this.path);
            const $ = cheerio.load(raw, { xmlMode: true });
            if ($('component > custom').length === 0) {
                $('component').append('<custom></custom>');
            }
            $('component > custom').append('<value></value>');
            const $el = $('component > custom > value:last-of-type');
            $el.attr('key', 'x-appcenter-stripe');
            $el.text(this.worker.context.stripe);
            yield fs.writeFile(this.path, $.xml());
        });
    }
}
exports.AppstreamStripe = AppstreamStripe;

//# sourceMappingURL=stripe.js.map
