"use strict";
/**
 * houston/src/lib/server/middleware.ts
 * A basic interface for a server controller.
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const Router = require("koa-router");
let Controller = class Controller {
    /**
     * Creates a new controller
     */
    constructor() {
        /**
         * The prefix for the controller.
         *
         * @var {String}
         */
        this.prefix = '/';
        this.router = new Router({
            prefix: this.prefix
        });
    }
    /**
     * Sets up all of the given routes with the router.
     *
     * @return {void}
     */
    setupRoutes() {
        return;
    }
    /**
     * Returns a list of middleware / routes to run.
     *
     * @async
     * @return {IMiddleware}
     */
    middleware() {
        return (ctx, next) => __awaiter(this, void 0, void 0, function* () { return next(); });
    }
};
Controller = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], Controller);
exports.Controller = Controller;

//# sourceMappingURL=middleware.js.map
