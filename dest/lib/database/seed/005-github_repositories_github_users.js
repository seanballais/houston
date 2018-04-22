"use strict";
/**
 * houston/src/lib/database/seed/005-github_repositories_github_users.ts
 * Seeds the database
 *
 * @exports {Function} seed - Seeds the Github repositories to Github users table
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
 * Seeds the Github repositories to Github users table
 *
 * @param {Object} knex - An initalized Knex package
 */
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex('github_repositories_github_users').del();
        yield knex('github_repositories_github_users').insert({
            github_repository_id: 'b272a75e-5263-4133-b2e1-c8894b29493c',
            github_user_id: 'da527f7e-b865-46e1-a47e-99542d838298'
        });
        yield knex('github_repositories_github_users').insert({
            github_repository_id: '14f2dc0d-9648-498e-b06e-a8479e0a7b26',
            github_user_id: 'da527f7e-b865-46e1-a47e-99542d838298'
        });
        yield knex('github_repositories_github_users').insert({
            github_repository_id: 'b353ee74-596a-4ec8-8b1c-11589bb8eb36',
            github_user_id: 'da527f7e-b865-46e1-a47e-99542d838298'
        });
        yield knex('github_repositories_github_users').insert({
            github_repository_id: '274b1d3e-85bd-4ee4-88d9-5ec18f4e87c4',
            github_user_id: 'da527f7e-b865-46e1-a47e-99542d838298'
        });
    });
}
exports.seed = seed;

//# sourceMappingURL=005-github_repositories_github_users.js.map
