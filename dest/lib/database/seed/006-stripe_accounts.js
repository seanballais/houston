"use strict";
/**
 * houston/src/lib/database/seed/006-stripe_accounts.ts
 * Seeds the database
 *
 * @exports {Function} seed - Seeds the Stripe accounts table
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
 * Seeds the Stripe accounts table
 *
 * @param {Object} knex - An initalized Knex package
 */
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex('stripe_accounts').del();
        yield knex('stripe_accounts').insert({
            color: 'FFA500',
            created_at: new Date(),
            id: '326599e7-97ed-455a-9c38-122651a12be6',
            key: 4235823,
            name: 'btkostner',
            public_key: 'pk_test_uj0fjv0a9u9302fawfa2rasd',
            secret_key: 'sk_test_j89j2098vah803cnb83v298r',
            updated_at: new Date(),
            url: 'https://btkostner.io',
            user_id: '24ef2115-67e7-4ea9-8e18-ae6c44b63a71'
        });
    });
}
exports.seed = seed;

//# sourceMappingURL=006-stripe_accounts.js.map
