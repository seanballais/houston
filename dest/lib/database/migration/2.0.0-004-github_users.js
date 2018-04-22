"use strict";
/**
 * houston/src/lib/database/migration/2.0.0-004-github_users.ts
 * The inital houston 2.0.0 migration for github users table
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
    return knex.schema.createTable('github_users', (table) => {
        table.uuid('id').primary();
        table.integer('key').notNullable().unique();
        table.string('login').notNullable();
        table.string('name').nullable();
        table.string('email').nullable();
        table.string('company').nullable();
        table.string('avatar').nullable();
        table.string('access_key').nullable();
        table.string('scopes').nullable();
        table.uuid('user_id').nullable();
        table.foreign('user_id').references('id').inTable('users');
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
    return knex.schema.dropTable('github_users');
}
exports.down = down;

//# sourceMappingURL=2.0.0-004-github_users.js.map
