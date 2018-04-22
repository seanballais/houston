"use strict";
/**
 * houston/src/lib/database/seed/004-github_users.ts
 * Seeds the database
 *
 * @exports {Function} seed - Seeds the Github users table
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
/**
 * seed
 * Seeds the Github users table
 *
 * @param {Object} knex - An initalized Knex package
 */
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex('github_users').del();
        yield knex('github_users').insert({
            access_key: 'u9r0nuq083ru880589rnyq29nyvaw4etbaw34vtr',
            company: 'elementary',
            created_at: new Date(),
            email: 'blake@elementary.io',
            id: 'da527f7e-b865-46e1-a47e-99542d838298',
            key: 6423154,
            login: 'btkostner',
            name: 'Blake Kostner',
            scopes: 'public_repo,repo',
            updated_at: new Date(),
            user_id: '24ef2115-67e7-4ea9-8e18-ae6c44b63a71'
        });
    });
}
exports.seed = seed;

//# sourceMappingURL=004-github_users.js.map
