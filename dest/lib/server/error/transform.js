"use strict";
/**
 * houston/src/lib/server/error/interface.ts
 * An interface for any error able to be rendered
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
const error_1 = require("./error");
/**
 * Makes any sort of error an HTTP handleable error.
 *
 * @param {Error} error
 * @return {HttpError}
 */
function transform(e) {
    // TODO: I have yet to find a nice way to convert things. More ninja skill needed
    // tslint:disable-next-line no-any
    const error = e;
    try {
        if (typeof error.httpStatus !== 'number') {
            error.httpStatus = 500;
        }
        // That's very weird. Probably a third party error.
        if (error.httpStatus < 200 || error.httpStatus >= 600) {
            error.httpStatus = 500;
        }
        if (typeof error.httpRender !== 'function') {
            // We can just set the status and let koa or the browser deal with what to show.
            error.httpRender = (ctx) => __awaiter(this, void 0, void 0, function* () {
                ctx.status = error.httpStatus;
                return;
            });
        }
    }
    catch (e) {
        // If there was some weird error trying to convert, cover it up and hope we don't expose secrets.
        return new error_1.BasicHttpError();
    }
    return error;
}
exports.transform = transform;

//# sourceMappingURL=transform.js.map
