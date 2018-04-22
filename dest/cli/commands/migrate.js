"use strict";
/**
 * houston/src/cli/commands/migrate.ts
 * Runs database migration scripts
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
const database_1 = require("../../lib/database");
const utilities_1 = require("../utilities");
exports.command = 'migrate';
exports.describe = 'Changes database tables based on houston schemas';
exports.builder = (yargs) => {
    return yargs
        .option('direction', { describe: 'The direction to migrate', type: 'string', default: 'up' });
};
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const { app, config } = utilities_1.setup(argv);
        const database = app.get(database_1.Database);
        if (argv.direction === 'up') {
            const version = config.get('houston.version', 'latest');
            console.log(`Updating database tables to ${version} version`);
        }
        else if (argv.direction === 'down') {
            console.log(`Downgrading database tables 1 version`);
        }
        else {
            console.error(`Incorrect non-option arguments: got ${argv.direction}, need at be up or down`);
            process.exit(1);
        }
        try {
            if (argv.direction === 'up') {
                yield database.knex.migrate.latest();
            }
            else if (argv.direction === 'down') {
                yield database.knex.migrate.rollback();
            }
        }
        catch (e) {
            console.error('Error updating database tables');
            console.error(e.message);
            process.exit(1);
        }
        console.log('Updated database tables');
        process.exit(0);
    });
}
exports.handler = handler;

//# sourceMappingURL=migrate.js.map
