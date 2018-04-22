"use strict";
/**
 * houston/src/lib/database/model/base/model.ts
 * A basic master model inherited by everything
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const uuid = require("uuid/v4");
const query_1 = require("./query");
/**
 * Model
 * A basic master model to be inherited by other models
 *
 * @property {string} id - The record's ID
 *
 * @property {Date} createdAt - The date the record was created at
 * @property {Date} updatedAt - The date the record was last updated
 * @property {Date} [deletedAt] - The date the record may have been deleted
 */
class Model {
    /**
     * Creates a Model class
     *
     * @param {object} [values] - Initial values to be set
     */
    constructor(values) {
        /**
         * exists
         * If this record already exists in the database
         *
         * @var {boolean}
         */
        this.exists = false;
        /**
         * guarded
         * All properties that should not be included when put to object or json
         *
         * @var {string[]}
         */
        this.guarded = [];
        if (values != null) {
            Object.keys(values).forEach((key) => {
                this[lodash_1.camelCase(key)] = values[key];
            });
        }
        if (this.id == null) {
            this.id = Model.createId();
        }
        if (this.createdAt == null) {
            this.createdAt = new Date();
        }
        if (this.updatedAt == null) {
            this.updatedAt = new Date();
        }
    }
    /**
     * createId
     * Creates a new UUID for use in the model.
     *
     * @return {string}
     */
    static createId() {
        return uuid();
    }
    /**
     * castFromDatabase
     * Takes values from the database to create a model
     *
     * @param {object} values - Values from the database
     * @return {Model}
     */
    static castFromDatabase(values) {
        const cammelCasedValues = {};
        Object.keys(values).forEach((key) => {
            cammelCasedValues[lodash_1.camelCase(key)] = values[key];
        });
        // Date converting all of the `xxxxAt` columns
        Object.keys(cammelCasedValues)
            .filter((key) => key.endsWith('At'))
            .filter((key) => (cammelCasedValues[key] != null))
            .forEach((key) => {
            cammelCasedValues[key] = new Date(cammelCasedValues[key]);
        });
        const record = new this(cammelCasedValues);
        record.exists = true;
        return record;
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
     * isDeleted
     * Tells if the record has been soft deleted or not
     *
     * @return {boolean}
     */
    get isDeleted() {
        if (this.deletedAt == null) {
            return false;
        }
        return true;
    }
    /**
     * isDeleted
     * Sets the deleted at date
     *
     * @param {boolean} value - True if the record should be deleted
     * @return {void}
     */
    set isDeleted(value) {
        if (value === true) {
            this.deletedAt = new Date();
        }
        else {
            this.deletedAt = null;
        }
    }
    /**
     * toObject
     * Transforms the current model to a plain object
     *
     * @return {object}
     */
    toObject() {
        const res = {};
        Object.getOwnPropertyNames(this).forEach((key) => {
            if (this.guarded.indexOf(key) === -1) {
                res[key] = this[key];
            }
        });
        return res;
    }
    /**
     * toJson
     * Transforms the current model to a json value
     *
     * @return {string}
     */
    toJson() {
        return JSON.stringify(this.toObject());
    }
}
exports.Model = Model;

//# sourceMappingURL=model.js.map
