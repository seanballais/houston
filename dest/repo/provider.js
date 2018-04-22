"use strict";
/**
 * houston/src/repo/provider.ts
 * Provides the app with the needed Repo server classes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const repo_1 = require("./repo");
exports.provider = new inversify_1.ContainerModule((bind) => {
    bind(repo_1.Repo).toSelf();
});

//# sourceMappingURL=provider.js.map
