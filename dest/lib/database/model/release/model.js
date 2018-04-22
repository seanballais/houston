"use strict";
/**
 * houston/src/lib/database/model/release/model.ts
 * All the information about a project release
 */
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../base/model");
const query_1 = require("./query");
/**
 * Release
 * The main release model.
 *
 * @property {string} id - The record's ID
 *
 * @property {string} nameDomain - The reverse name schema for the project
 * @property {string} nameHuman - The human readable name for a project
 * @property {string} nameDeveloper - The name of the developer
 *
 * @property {string} type - The type of project
 *
 * @property {string} projectableId - The ID of the third party service
 * @property {string} projectableType - The name of the third party service
 *
 * @property {string} stripeId - The ID for the stripe record connected
 *
 * @property {Date} createdAt - The date the record was created at
 * @property {Date} updatedAt - The date the record was last updated
 * @property {Date} [deletedAt] - The date the record may have been deleted
 */
class Model extends model_1.Model {
    /**
     * query
     * This is a super master query function so we can put data in a model
     *
     * @param {Database} database - The database to query
     * @return {Model|Model[]|null}
     */
    static query(database) {
        return new query_1.Query(database)
            .setModel(Model)
            .from(Model.table);
    }
}
/**
 * table
 * The table name for the current model
 *
 * @var {string}
 */
Model.table = 'releases';
exports.Model = Model;

//# sourceMappingURL=model.js.map
