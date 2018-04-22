"use strict";
/**
 * houston/src/lib/database/model/project/model.ts
 * The model for projects
 */
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../base/model");
const query_1 = require("./query");
/**
 * Project
 * The main project model.
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
    constructor() {
        super(...arguments);
        /**
         * guarded
         * All properties that should not be included when put to object or json
         *
         * @var {string[]}
         */
        this.guarded = ['stripeId'];
    }
    /**
     * query
     * This is a super master query function so we can put data in a model
     *
     * @param {Database} database - The database to query
     * @return {Query}
     */
    static query(database) {
        return (new query_1.Query(database))
            .setModel(Model)
            .from(Model.table);
    }
    /**
     * name_appstream
     * Returns the name used when in desktop appstream.
     *
     * @return {string}
     */
    get nameAppstream() {
        return `${this.nameDomain}.desktop`;
    }
}
/**
 * table
 * The table name for the current model
 *
 * @var {string}
 */
Model.table = 'projects';
exports.Model = Model;

//# sourceMappingURL=model.js.map
