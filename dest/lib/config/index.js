"use strict";
/**
 * houston/src/lib/config/index.ts
 * The application wide configuration class
 *
 * @exports {class} config - Global configuration class
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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const lodash_1 = require("lodash");
/**
 * Config
 * An easy to use application wide configuration class
 */
let Config = Config_1 = class Config {
    /**
     * Create a new Config class with the given object
     *
     * @param {object} configuration - A basic object to set as config
     */
    constructor(configuration = {}) {
        this.tree = configuration;
        this.immutable = false;
    }
    /**
     * freeze
     * Freezes an object
     *
     * @param {object} obj - The object to freeze
     * @return {object} - A newly frozen object
     */
    static freeze(obj) {
        const newObject = {};
        Object.getOwnPropertyNames(obj).forEach((key) => {
            if (lodash_1.isPlainObject(obj[key])) {
                newObject[key] = this.freeze(obj[key]);
            }
            else {
                newObject[key] = obj[key];
            }
        });
        return Object.freeze(newObject);
    }
    /**
     * unfreeze
     * Makes an object unfrozzen and able to accept new values
     *
     * @param {object} obj - The object to unfreeze
     * @return {object} - A new unfrozzen object
     */
    static unfreeze(obj) {
        const newObject = {};
        Object.getOwnPropertyNames(obj).forEach((key) => {
            if (typeof obj[key] === 'object') {
                newObject[key] = this.unfreeze(obj[key]);
            }
            else {
                newObject[key] = obj[key];
            }
        });
        return newObject;
    }
    /**
     * get
     * Returns a configuration value
     *
     * @param {*} key - Key value for the configuration
     * @param {*} def - The default value if configuration does not exist
     * @return {*} - The stored configuration value
     */
    get(key, def) {
        if (key === '.') {
            return this.tree;
        }
        if (this.has(key) === false) {
            return def;
        }
        return lodash_1.get(this.tree, key);
    }
    /**
     * has
     * Returns boolean if value exists in configuration
     *
     * @param {string} key - Dot notation path of configuration value
     * @return {boolean} - True if the configuration has the value
     */
    has(key) {
        return lodash_1.has(this.tree, key);
    }
    /**
     * set
     * Sets a configuration value
     *
     * @param {string} key - Key value to store under
     * @param {*} - The configuration value to store
     * @return {Config} - The configuration after value was set
     */
    set(key, value) {
        if (this.immutable === true) {
            return this;
        }
        lodash_1.set(this.tree, key, value);
        return this;
    }
    /**
     * merge
     * Merges an object with the current configuration
     *
     * @param {object} obj - An object to merge in configuration
     * @return {Config} - The configuration after value was set
     */
    merge(obj) {
        if (this.immutable === true) {
            return this;
        }
        lodash_1.merge(this.tree, obj);
        return this;
    }
    /**
     * freeze
     * Makes the configuration immutable
     *
     * @return {Config} - The configuration after being frozen
     */
    freeze() {
        this.immutable = true;
        this.tree = Config_1.freeze(this.tree);
        return this;
    }
    /**
     * unfreeze
     * Makes the configuration editable
     *
     * @return {Config} - The configuration after unfrozzen
     */
    unfreeze() {
        this.immutable = false;
        this.tree = Config_1.unfreeze(this.tree);
        return this;
    }
};
Config = Config_1 = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Object])
], Config);
exports.Config = Config;
var Config_1;

//# sourceMappingURL=index.js.map
