"use strict";
/**
 * houston/src/lib/database/model/base/query.ts
 * Sets up some cool methods and overwrites then function for casting to model
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Builder = require("knex/lib/query/builder");
class Query extends Builder {
    /**
     * Creates a new Query instance
     *
     * @param {Database} database
     */
    constructor(database) {
        super(database.knex.client);
        return this;
    }
    /**
     * Sets the castFromDatabase function for the query
     *
     * @param {ModelConstructor} model
     * @return {Query}
     */
    setModel(model) {
        this.model = model;
        this.from(model.table);
        return this;
    }
    /**
     * Sets up the query, runs it, then casts it to a model
     *
     * @return {Model|Model[]|Object|null}
     */
    then(onResolve, onReject) {
        this.client
            .runner(this)
            .run()
            .then((results) => {
            if (this.model == null) {
                return results;
            }
            if (results == null) {
                return null;
            }
            if (Array.isArray(results)) {
                return results.map((result) => this.model.castFromDatabase(result));
            }
            else {
                return this.model.castFromDatabase(results);
            }
        })
            .then(onResolve, onReject);
    }
}
exports.Query = Query;

//# sourceMappingURL=query.js.map
