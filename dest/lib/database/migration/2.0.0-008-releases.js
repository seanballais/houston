"use strict";
/**
 * houston/src/lib/database/migration/2.0.0-008-releases.ts
 * The inital houston 2.0.0 migration for releases table
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
    return knex.schema.createTable('releases', (table) => {
        table.uuid('id').primary();
        table.string('version').notNullable();
        table.integer('version_major', 12).notNullable();
        table.integer('version_minor', 12).notNullable();
        table.integer('version_patch', 12).notNullable();
        table.integer('version_build', 12).nullable();
        table.boolean('is_prerelease').defaultTo(false);
        table.uuid('releaseable_id').notNullable();
        table.string('releaseable_type').notNullable();
        table.uuid('project_id').notNullable();
        table.foreign('project_id').references('id').inTable('projects');
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
    return knex.schema.dropTable('releases');
}
exports.down = down;

//# sourceMappingURL=2.0.0-008-releases.js.map
