"use strict";
/**
 * houston/src/lib/server/provider.ts
 * Provides the app with the needed Server classes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const server_1 = require("./server");
exports.provider = new inversify_1.ContainerModule((bind) => {
    bind(server_1.Server).toSelf();
});

//# sourceMappingURL=provider.js.map
