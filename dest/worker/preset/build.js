"use strict";
/**
 * houston/src/worker/preset/build.ts
 * Builds a package and edits contents for appcenter.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const worker_1 = require("../worker");
const appstream_1 = require("../task/appstream");
const deb_1 = require("../task/build/deb");
const changelog_1 = require("../task/debian/changelog");
const control_1 = require("../task/debian/control");
const desktop_1 = require("../task/desktop");
const deb_2 = require("../task/extract/deb");
const deb_3 = require("../task/file/deb");
const deb_4 = require("../task/pack/deb");
const setup_1 = require("../task/workspace/setup");
function buildTasks(t) {
    switch (t) {
        case 'library':
            return [
                setup_1.WorkspaceSetup,
                changelog_1.DebianChangelog,
                control_1.DebianControl,
                deb_1.BuildDeb
            ];
        default:
            return [
                setup_1.WorkspaceSetup,
                changelog_1.DebianChangelog,
                control_1.DebianControl,
                deb_1.BuildDeb,
                deb_2.ExtractDeb,
                deb_3.FileDeb,
                appstream_1.Appstream,
                desktop_1.Desktop,
                deb_4.PackDeb
            ];
    }
}
function Build(config, repository, context) {
    const worker = new worker_1.Worker(config, repository, context);
    for (const task of buildTasks(context.type)) {
        worker.tasks.push(task);
    }
    return worker;
}
exports.Build = Build;

//# sourceMappingURL=build.js.map
