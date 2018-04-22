"use strict";
/**
 * houston/src/cli/cli.ts
 * Entry point to houston CLI
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Command line files are allowed to have console log statements
// tslint:disable no-console
const yargs = require("yargs");
const commands_1 = require("./commands");
yargs.version(false);
yargs.help('h').alias('h', 'help');
for (const c of commands_1.default) {
    yargs.command(c);
}
yargs.option('config', { alias: 'c', describe: 'Path to configuration file', type: 'string' });
yargs.recommendCommands();
yargs.showHelpOnFail(true);
const argv = yargs.argv;
if (argv._.length === 0) {
    yargs.showHelp();
    process.exit(1);
}

//# sourceMappingURL=cli.js.map
