"use strict";
/**
 * houston/src/lib/utility/faker/provider.ts
 * Provides the app with the needed Log classes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const index_1 = require("./index");
exports.provider = new inversify_1.ContainerModule((bind) => {
    bind(index_1.Faker).toSelf();
});

//# sourceMappingURL=provider.js.map
