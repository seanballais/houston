"use strict";
/**
 * houston/src/cli/commands/seed.ts
 * Runs database seed scripts
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
const database_1 = require("../../lib/database/database");
const utilities_1 = require("../utilities");
exports.command = 'seed';
exports.describe = 'Seeds the database tables with fake data';
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const { app } = utilities_1.setup(argv);
        const database = app.get(database_1.Database);
        console.log(`Seeding database tables`);
        try {
            yield database.knex.seed.run();
        }
        catch (e) {
            console.error('Error seeding database tables');
            console.error(e.message);
            process.exit(1);
        }
        console.log('Seeded database tables');
        process.exit(0);
    });
}
exports.handler = handler;

//# sourceMappingURL=seed.js.map
