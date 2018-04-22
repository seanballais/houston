"use strict";
/**
 * houston/src/lib/database/provider.ts
 * Provides the app with the needed Log classes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const database_1 = require("./database");
exports.provider = new inversify_1.ContainerModule((bind) => {
    bind(database_1.Database).toSelf();
});

//# sourceMappingURL=provider.js.map
