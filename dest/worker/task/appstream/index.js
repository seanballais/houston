"use strict";
/**
 * houston/src/worker/task/appstream/index.ts
 * Runs a bunch of appstream tests
 * TODO: Only reports error and warn logs instead of all
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
const fs = require("fs-extra");
const path = require("path");
const log_1 = require("../../log");
const wrapperTask_1 = require("../wrapperTask");
const content_rating_1 = require("./content-rating");
const description_1 = require("./description");
const id_1 = require("./id");
const license_1 = require("./license");
const name_1 = require("./name");
const release_1 = require("./release");
const screenshot_1 = require("./screenshot");
const stripe_1 = require("./stripe");
const summary_1 = require("./summary");
const validate_1 = require("./validate");
class Appstream extends wrapperTask_1.WrapperTask {
    /**
     * All of the fun tests we should run on the appstream file
     *
     * @var {Task[]}
     */
    get tasks() {
        switch (this.worker.context.type) {
            // System apps will never have a stripe key
            case 'system-app':
                return [
                    id_1.AppstreamId,
                    name_1.AppstreamName,
                    description_1.AppstreamDescription,
                    summary_1.AppstreamSummary,
                    license_1.AppstreamLicense,
                    screenshot_1.AppstreamScreenshot,
                    content_rating_1.AppstreamContentRating,
                    release_1.AppstreamRelease,
                    validate_1.AppstreamValidate
                ];
            default:
                return [
                    id_1.AppstreamId,
                    name_1.AppstreamName,
                    description_1.AppstreamDescription,
                    summary_1.AppstreamSummary,
                    license_1.AppstreamLicense,
                    screenshot_1.AppstreamScreenshot,
                    content_rating_1.AppstreamContentRating,
                    release_1.AppstreamRelease,
                    stripe_1.AppstreamStripe,
                    validate_1.AppstreamValidate
                ];
        }
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
     * All of the error logs that do not have a body
     *
     * @return {Log[]}
     */
    get errorPartials() {
        return this.logs
            .filter((l) => (l.level === log_1.Log.Level.ERROR))
            .filter((l) => (l.body == null));
    }
    /**
     * All of the warn logs that do not have a body
     *
     * @return {Log[]}
     */
    get warnPartials() {
        return this.logs
            .filter((l) => (l.level === log_1.Log.Level.WARN))
            .filter((l) => (l.body == null));
    }
    /**
     * Runs all the appstream tests
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield fs.exists(this.path);
            if (exists === false) {
                const template = path.resolve(__dirname, 'exist.md');
                throw log_1.Log.template(log_1.Log.Level.ERROR, template, {
                    storage: this.worker.context
                });
            }
            yield this.runTasks();
            // All logs that don't have a body get put to a single easy to read log
            if (this.errorPartials.length > 0 || this.warnPartials.length > 0) {
                this.concatLogs();
            }
            // All logs that already have a body should be submitted up the stack
            this.logs
                .filter((l) => (l.body != null))
                .forEach((l) => this.worker.report(l));
            if (this.errorLogs.length > 0) {
                this.worker.stop();
            }
            // Save the appstream information
            this.worker.context.appstream = yield fs.readFile(this.path);
        });
    }
    /**
     * Concats any logs that don't have a body to a markdown template for easier
     * looking to the developer.
     *
     * @return {void}
     */
    concatLogs() {
        const topLevel = (this.errorPartials.length > 0)
            ? log_1.Log.Level.ERROR
            : log_1.Log.Level.WARN;
        const template = path.resolve(__dirname, 'index.md');
        const log = log_1.Log.template(topLevel, template, {
            errors: this.errorPartials,
            storage: this.worker.context,
            warnings: this.warnPartials
        });
        this.worker.report(log);
    }
}
exports.Appstream = Appstream;

//# sourceMappingURL=index.js.map
