"use strict";
/**
 * houston/src/worker/task/desktop/index.ts
 * Runs a bunch of tests around the desktop file
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
const exec_1 = require("./exec");
const icon_1 = require("./icon");
const validate_1 = require("./validate");
class Desktop extends wrapperTask_1.WrapperTask {
    /**
     * All of the fun tests we should run on the desktop file
     *
     * @var {Task[]}
     */
    get tasks() {
        switch (this.worker.context.type) {
            // System apps are allowed system icons
            case 'system-app':
                return [
                    exec_1.DesktopExec,
                    validate_1.DesktopValidate
                ];
            default:
                return [
                    exec_1.DesktopExec,
                    icon_1.DesktopIcon,
                    validate_1.DesktopValidate
                ];
        }
    }
    /**
     * Path the desktop file should exist at
     *
     * @return {string}
     */
    get path() {
        return path.resolve(this.worker.workspace, 'package/usr/share/applications', this.worker.context.nameAppstream);
    }
    /**
     * Runs all the desktop tests
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield fs.exists(this.path);
            if (exists === false) {
                throw new log_1.Log(log_1.Log.Level.ERROR, 'Desktop file does not exist');
            }
            yield this.runTasks();
            // TODO: Concat all errors that have no body to a single list log
            this.logs.forEach((l) => this.worker.report(l));
            if (this.errorLogs.length > 0) {
                this.worker.stop();
            }
        });
    }
}
exports.Desktop = Desktop;

//# sourceMappingURL=index.js.map
