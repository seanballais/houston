"use strict";
/**
 * houston/src/lib/database/migration/2.0.0-002-github_releases.ts
 * The inital houston 2.0.0 migration for GitHub releases table
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
    return knex.schema.createTable('github_releases', (table) => {
        table.uuid('id').primary();
        table.integer('key').notNullable().unique();
        table.string('tag').notNullable();
        table.uuid('github_repository').notNullable();
        table.foreign('github_repository').references('id').inTable('github_repositories');
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted_at').nullable();
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
    return knex.schema.dropTable('github_releases');
}
exports.down = down;

//# sourceMappingURL=2.0.0-002-github_releases.js.map
