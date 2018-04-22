"use strict";
/**
 * houston/src/lib/database/migration/2.0.0-006-stripe_accounts.ts
 * The inital houston 2.0.0 migration for stripe accounts table
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
    return knex.schema.createTable('stripe_accounts', (table) => {
        table.uuid('id').primary();
        table.integer('key').notNullable().unique();
        table.string('name').unique();
        table.string('color').nullable();
        table.string('url').nullable();
        table.string('public_key').nullable();
        table.string('secret_key').nullable();
        table.uuid('user_id').notNullable();
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
    return knex.schema.dropTable('stripe_accounts');
}
exports.down = down;

//# sourceMappingURL=2.0.0-006-stripe_accounts.js.map
