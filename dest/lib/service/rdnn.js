"use strict";
/**
 * houston/src/lib/service/rdnn.ts
 * Some higher level RDNN functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sanitizes an RDNN string for common mistakes and better unification
 * @see https://github.com/elementary/houston/issues/566
 *
 * @param {string} rdnn
 * @return {string}
 */
function sanitize(rdnn) {
    return rdnn
        .replace(/\s/gi, '_')
        .replace(/\.([0-9])/gi, '._$1')
        .replace(/\-/gi, '_')
        .toLowerCase();
}
exports.sanitize = sanitize;

//# sourceMappingURL=rdnn.js.map
