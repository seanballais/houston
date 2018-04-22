"use strict";
/**
 * houston/src/lib/database/migration/2.0.0-007-projects.ts
 * The inital houston 2.0.0 migration for projects table
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
    return knex.schema.createTable('projects', (table) => {
        table.uuid('id').primary();
        table.string('name_domain').unique().index();
        table.string('name_human').notNullable();
        table.string('name_developer').notNullable();
        table.enu('type', ['application']).defaultTo('application');
        table.uuid('projectable_id').notNullable();
        table.string('projectable_type').notNullable();
        table.uuid('stripe_id').nullable();
        table.foreign('stripe_id').references('id').inTable('stripe_accounts');
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
    return knex.schema.dropTable('projects');
}
exports.down = down;

//# sourceMappingURL=2.0.0-007-projects.js.map
