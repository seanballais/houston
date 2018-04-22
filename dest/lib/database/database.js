"use strict";
/**
 * houston/src/lib/database/database.ts
 * The main database class
 *
 * @exports {Class} Database - The master database connection class
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const Knex = require("knex");
const path = require("path");
const config_1 = require("../config");
const log_1 = require("../log");
/**
 * Database
 * The master database connection class
 *
 * @property {Knex} knex - A knex instance for queries
 */
let Database = class Database {
    /**
     * Creates a Database class
     *
     * @param {Config} config - Configuration for database connection
     * @param {Log} [log] - The log instance to use for reporting
     */
    constructor(config, log) {
        const migrationPath = path.resolve(__dirname, 'migration');
        const seedPath = path.resolve(__dirname, 'seed');
        // We assign some default file paths for migrations and seeds
        const databaseConfig = Object.assign({}, config.get('database'), {
            migrations: {
                directory: migrationPath,
                tableName: 'migrations'
            },
            seeds: {
                directory: seedPath
            },
            useNullAsDefault: false
        });
        this.config = config;
        this.log = log;
        this.knex = new Knex(databaseConfig);
    }
};
Database = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(config_1.Config)), __param(1, inversify_1.inject(log_1.Log)),
    __metadata("design:paramtypes", [config_1.Config, log_1.Log])
], Database);
exports.Database = Database;

//# sourceMappingURL=database.js.map
