"use strict";
/**
 * houston/src/lib/log/provider.ts
 * Provides the app with the needed Log classes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const log_1 = require("./log");
const logger_1 = require("./logger");
const output_1 = require("./output");
const console_1 = require("./outputs/console");
const sentry_1 = require("./outputs/sentry");
exports.provider = new inversify_1.ContainerModule((bind) => {
    bind(output_1.Output).toConstructor(console_1.Console);
    bind(output_1.Output).toConstructor(sentry_1.Sentry);
    bind(log_1.Log).toConstructor(log_1.Log);
    bind(logger_1.Logger).toSelf();
});

//# sourceMappingURL=provider.js.map
