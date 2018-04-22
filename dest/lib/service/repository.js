"use strict";
/**
 * houston/src/lib/service/repository.ts
 * Creates a new repository service given a URL
 */
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("./github/repository");
/**
 * Creates a new repository service given any URL
 * TODO: Add more repository services besides GitHub
 *
 * @param {string} url
 * @return {Repository}
 */
function create(url) {
    return new repository_1.Repository(url);
}
exports.create = create;

//# sourceMappingURL=repository.js.map
