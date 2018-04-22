"use strict";
/**
 * houston/src/lib/server/middleware/report.ts
 * Catches and reports errors.
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
const transform_1 = require("../error/transform");
/**
 * A middleware factory function for reporting errors
 *
 * @param {Config} config
 * @return {Function}
 */
function report(config) {
    /**
     * Reports error logs
     *
     * @async
     * @param {Context} context
     * @return {Function} - A compression function
     */
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield next(ctx);
        }
        catch (e) {
            transform_1.transform(e).httpRender(ctx);
        }
    });
}
exports.report = report;

//# sourceMappingURL=report.js.map
