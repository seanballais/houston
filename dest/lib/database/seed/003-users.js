"use strict";
/**
 * houston/src/lib/database/seed/003-users.ts
 * Seeds the database
 *
 * @exports {Function} seed - Seeds the users table
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * seed
 * Seeds the users table
 *
 * @param {Object} knex - An initalized Knex package
 */
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex('users').del();
        yield knex('users').insert({
            created_at: new Date(),
            deleted_at: null,
            email: 'blake@elementary.io',
            id: '24ef2115-67e7-4ea9-8e18-ae6c44b63a71',
            name: 'Blake Kostner',
            updated_at: new Date()
        });
    });
}
exports.seed = seed;

//# sourceMappingURL=003-users.js.map
