"use strict";
/**
 * houston/src/cli/commands/repo.ts
 * Runs the repository syslogd server
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
// Command line files are allowed to have console log statements
// tslint:disable no-console
const repo_1 = require("../../repo/repo");
const utilities_1 = require("../utilities");
exports.command = 'repo';
exports.describe = 'Starts the repository syslogd server';
exports.builder = (yargs) => {
    return yargs
        .option('port', { alias: 'p', describe: 'The port to run the server on', type: 'number', default: 0 });
};
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const { app } = utilities_1.setup(argv);
        const server = app.get(repo_1.Repo);
        yield server.listen(argv.port);
    });
}
exports.handler = handler;

//# sourceMappingURL=repo.js.map
