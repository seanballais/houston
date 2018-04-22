"use strict";
/**
 * houston/src/lib/database/migration/2.0.0-010-build_logs.ts
 * The inital houston 2.0.0 migration for build logs table
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
    return knex.schema.createTable('build_logs', (table) => {
        table.uuid('id').primary();
        table.string('title').notNullable();
        table.string('body').notNullable();
        table.string('test').nullable();
        table.json('metadata').nullable();
        table.uuid('build_id').nullable();
        table.foreign('build_id').references('id').inTable('builds');
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
    return knex.schema.dropTable('build_logs');
}
exports.down = down;

//# sourceMappingURL=2.0.0-010-build_logs.js.map
