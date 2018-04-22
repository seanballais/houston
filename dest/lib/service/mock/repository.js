"use strict";
/**
 * houston/src/lib/service/mock/repository.ts
 * A mock repository used for testing.
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
const rdnn_1 = require("../rdnn");
class Repository {
    /**
     * Creates a new GitHub Repository
     *
     * @param {string} url - The full github url
     */
    constructor(url) {
        this.url = url;
    }
    /**
     * Returns the default RDNN value for this repository
     *
     * @return {string}
     */
    get rdnn() {
        const [host, ...paths] = this.url.split('://')[1].split('/');
        const h = host.split('.').reverse().join('.');
        const p = paths.join('.');
        return rdnn_1.sanitize(`${h}${p}`);
    }
    /**
     * clone
     * Clones the repository to a folder
     *
     * @async
     * @param {string} p - The path to clone to
     * @param {string} [reference] - The branch to clone
     * @return {void}
     */
    clone(p, reference) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Unimplimented in mock repository');
        });
    }
    /**
     * references
     * Returns a list of references this repository has
     *
     * @async
     * @return {string[]}
     */
    references() {
        return __awaiter(this, void 0, void 0, function* () {
            return ['refs/origin/master'];
        });
    }
    /**
     * Fake uploads an asset.
     *
     * @async
     * @param {string} reference
     * @param {string} name
     * @param {string} p
     * @return {void}
     */
    asset(reference, name, p) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
}
exports.Repository = Repository;

//# sourceMappingURL=repository.js.map
