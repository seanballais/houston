"use strict";
/**
 * houston/src/lib/utility/faker/index.ts
 * Creates fake data. Used for testing and factories
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
const BaseFaker = require("faker/lib/index");
const locale = require("faker/locale/en");
const inversify_1 = require("inversify");
const type_1 = require("./type");
let Faker = class Faker extends BaseFaker {
    /**
     * Creates a new new Faker instance
     *
     * @param {FakerProvider[]} [providers]
     */
    constructor(providers = []) {
        super({
            locale: 'en',
            locales: [{ en: locale }]
        });
        providers.forEach((provider) => {
            this.registerProvider(provider);
        });
    }
    registerProvider(provider) {
        const p = provider(this);
        // TODO: Allow extending Faker with more providers
    }
};
Faker = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.multiInject(type_1.fakerProvider)),
    __metadata("design:paramtypes", [Array])
], Faker);
exports.Faker = Faker;

//# sourceMappingURL=index.js.map
