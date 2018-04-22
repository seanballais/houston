"use strict";
/**
 * houston/src/lib/database/migration/2.0.0-005-github_repositories_github_users.ts
 * The inital houston 2.0.0 migration for pivot table between github users and
 * repositories.
 *
 * @exports {Function} up - Database information for upgrading to version 2.0.0
 * @exports {Function} down - Database information for downgrading version 2.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * up
 * Database information for upgrading to version 2.0.0
 *
 * @param {Object} knex - An initalized Knex package
 * @return {Promise} - A promise of database migration
 */
function up(knex) {
    return knex.schema.createTable('github_repositories_github_users', (table) => {
        table.increments();
        table.uuid('github_repository_id').nullable();
        table.foreign('github_repository_id').references('id').inTable('github_repositories');
        table.uuid('github_user_id').nullable();
        table.foreign('github_user_id').references('id').inTable('github_users');
    });
}
exports.up = up;
/**
 * down
 * Database information for downgrading version 2.0.0
 *
 * @param {Object} knex - An initalized Knex package
 * @return {Promise} - A promise of successful database migration
 */
function down(knex) {
    return knex.schema.dropTable('github_repositories_github_users');
}
exports.down = down;

//# sourceMappingURL=2.0.0-005-github_repositories_github_users.js.map
