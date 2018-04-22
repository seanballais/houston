"use strict";
/**
 * houston/src/worker/task/appstream/icon.ts
 * Checks that a icon field is matches app name in the desktop file
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
const ini = require("ini");
const path = require("path");
const log_1 = require("../../log");
const task_1 = require("../task");
class DesktopIcon extends task_1.Task {
    /**
     * Path the desktop file should exist at
     *
     * @return {string}
     */
    get path() {
        return path.resolve(this.worker.workspace, 'package/usr/share/applications', this.worker.context.nameAppstream);
    }
    /**
     * Checks Icon field in desktop file
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield fs.readFile(this.path, 'utf8');
            const data = ini.parse(raw);
            if (data['Desktop Entry'] == null) {
                throw new log_1.Log(log_1.Log.Level.ERROR, 'Missing application data');
            }
            if (data['Desktop Entry'].Icon !== this.worker.context.nameDomain) {
                throw new log_1.Log(log_1.Log.Level.ERROR, 'Incorrect icon value');
            }
        });
    }
}
exports.DesktopIcon = DesktopIcon;

//# sourceMappingURL=icon.js.map
