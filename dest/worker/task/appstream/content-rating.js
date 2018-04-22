"use strict";
/**
 * houston/src/worker/task/appstream/content-rating.ts
 * Tests the OARS content rating in appstream files
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
class AppstreamContentRating extends task_1.Task {
    constructor() {
        super(...arguments);
        /**
         * All of the OARS content attributes to check for
         *
         * @var {string[]}
         */
        this.attributes = [
            'violence-cartoon',
            'violence-fantasy',
            'violence-realistic',
            'violence-bloodshed',
            'violence-sexual',
            'violence-desecration',
            'violence-slavery',
            'violence-worship',
            'drugs-alcohol',
            'drugs-narcotics',
            'drugs-tobacco',
            'sex-nudity',
            'sex-themes',
            'sex-homosexuality',
            'sex-prostitution',
            'sex-adultery',
            'sex-appearance',
            'language-profanity',
            'language-humor',
            'language-discrimination',
            'social-chat',
            'social-info',
            'social-audio',
            'social-location',
            'social-contacts',
            'money-purchasing',
            'money-gambling'
        ];
    }
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
            const contentRating = $('component > content_rating');
            if (contentRating.length === 0) {
                const template = path.resolve(__dirname, 'content-rating-required.md');
                throw log_1.Log.template(log_1.Log.Level.ERROR, template, {
                    storage: this.worker.context
                });
            }
            if (contentRating.attr('type') == null) {
                const template = path.resolve(__dirname, 'content-rating-type.md');
                throw log_1.Log.template(log_1.Log.Level.WARN, template, {
                    storage: this.worker.context
                });
            }
            const missingAttributes = this.attributes
                .filter((attribute) => !this.hasAttribute($, attribute));
            if (missingAttributes.length > 0) {
                const template = path.resolve(__dirname, 'content-rating-missing.md');
                throw log_1.Log.template(log_1.Log.Level.ERROR, template, {
                    attributes: missingAttributes,
                    storage: this.worker.context
                });
            }
        });
    }
    /**
     * Checks if the given document has an OARS attribute
     *
     * @param {Object} $
     * @param {string} attribute
     * @return {Boolean}
     */
    hasAttribute($, attribute) {
        const attr = $(`component > content_rating > content_attribute#${attribute}`);
        return (attr.length !== 0);
    }
}
exports.AppstreamContentRating = AppstreamContentRating;

//# sourceMappingURL=content-rating.js.map
