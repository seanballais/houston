"use strict";
/**
 * houston/src/lib/database/migration/2.0.0-009-builds.ts
 * The inital houston 2.0.0 migration for builds table
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
    return knex.schema.createTable('builds', (table) => {
        table.uuid('id').primary();
        table.enum('status', [
            'queue',
            'build',
            'test',
            'review',
            'publish',
            'fail',
            'error'
        ]).nullable();
        table.json('appcenter').nullable();
        table.json('appstream').nullable();
        table.uuid('release_id').notNullable();
        table.foreign('release_id').references('id').inTable('releases');
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
    return knex.schema.dropTable('builds');
}
exports.down = down;

//# sourceMappingURL=2.0.0-009-builds.js.map
