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
const utilities_1 = require("../utilities");
exports.command = 'version';
exports.describe = 'Displays Houston version information';
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const { config } = utilities_1.setup(argv);
        console.log(`Release: ${config.get('houston.version')}`);
        if (config.has('houston.commit')) {
            console.log(`Commit: ${config.get('houston.commit')}`);
        }
        else {
            console.log('Commit: Unknown');
        }
        process.exit(0);
    });
}
exports.handler = handler;

//# sourceMappingURL=version.js.map
