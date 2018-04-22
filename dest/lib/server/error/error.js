"use strict";
/**
 * houston/src/lib/server/error/error.ts
 * A super basic easy to use http server error
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
class BasicHttpError extends Error {
    /**
     * Creates a new basic http error
     *
     * @param {Number} status
     * @param {String} message
     */
    constructor(status = 500, message = 'Internal Server Error') {
        super(message);
        this.httpStatus = status;
        this.httpMessage = message;
    }
    /**
     * Renders error to an http output
     *
     * @async
     * @param {Context} ctx
     * @return {void}
     */
    httpRender(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.status = this.httpStatus;
            ctx.body = `${this.httpStatus} - ${this.httpMessage}`;
            return;
        });
    }
}
exports.BasicHttpError = BasicHttpError;

//# sourceMappingURL=error.js.map
