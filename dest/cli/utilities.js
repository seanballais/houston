"use strict";
/**
 * houston/src/cli/utilities.ts
 * Some utilities for command line stuff
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Command line files are allowed to have console log statements
// tslint:disable no-console
const app_1 = require("../lib/app");
const loader_1 = require("../lib/config/loader");
const log_1 = require("../lib/log");
/**
 * Sets up some boilderplate application classes based on command line args
 *
 * @param {Object} argv
 * @return {Object}
 */
function setup(argv) {
    const config = loader_1.getConfig(argv.config);
    const app = new app_1.App(config);
    const logger = app.get(log_1.Logger);
    process.on('unhandledRejection', (reason) => console.error(reason));
    return { app, config, logger };
}
exports.setup = setup;

//# sourceMappingURL=utilities.js.map
