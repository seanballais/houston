"use strict";
/**
 * houston/src/lib/server/server.ts
 * A basic HTTP web server used for various processes.
 *
 * @exports {Class} Server - An HTTP web server
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const inversify_1 = require("inversify");
const Koa = require("koa");
const Router = require("koa-router");
const report_1 = require("./middleware/report");
const config_1 = require("../config");
const log_1 = require("../log");
/**
 * Server
 * A basic HTTP web server
 *
 * @property {Server} server
 * @property {number} port
 *
 * @property {boolean} active
 */
let Server = class Server {
    /**
     * Creates a new web server
     *
     * @param {Config} config - The configuration to use
     * @param {Log} log - The logger instance to use
     */
    constructor(config, logger) {
        /**
         * A list of controllers this server has
         *
         * @var {Controller[]}
         */
        this.controllers = [];
        /**
         * A list of middlewares that will be ran on every route
         *
         * @var {Middleware[]}
         */
        this.middlewares = [
            report_1.report
        ];
        this.config = config;
        this.logger = logger;
        this.koa = new Koa();
        this.router = new Router();
        this.koa.env = config.get('environment', 'production');
    }
    /**
     * Returns true if the http server is currently active.
     *
     * @return {boolean}
     */
    get active() {
        return (this.server !== undefined);
    }
    /**
     * listen
     * Starts web server services
     *
     * @async
     * @param {number} [port] - A port to listen on. Kept for backwards support
     *
     * @throws {Error} - When unable to listen to requested port
     * @return {Server} - An active Server class
     */
    listen(port = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const env = this.config.get('environment');
            try {
                this.server = this
                    .registerControllers()
                    .registerMiddleware()
                    .http();
                yield new Promise((resolve, reject) => {
                    this.server.listen(port, undefined, undefined, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    });
                });
            }
            catch (err) {
                this.logger.error(`Server unable to listen on port ${port} with ${env} configuration`)
                    .setError(err)
                    .send();
                throw err;
            }
            this.port = this.server.address().port;
            this.logger.info(`Server listening on port ${this.port} with ${env} configuration`).send();
            return this;
        });
    }
    /**
     * close
     * Stops the HTTP server
     *
     * @async
     *
     * @throws {Error} - When the Server class is messed up
     * @return {Server} - An inactive Server class
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.server != null) {
                yield new Promise((resolve, reject) => {
                    this.server.close((err) => {
                        if (err != null) {
                            return reject(err);
                        }
                        return resolve();
                    });
                });
            }
            this.server = null;
            this.port = null;
            return this;
        });
    }
    /**
     * http
     * Returns an http server wrapping current server. Used for testing and low
     * level plugins
     *
     * @return {http.Server} - HTTP web server
     */
    http() {
        return http.createServer(this.koa.callback());
    }
    /**
     * Adds all of the controllers to the server.
     *
     * @return {Server}
     */
    registerControllers() {
        this.controllers.forEach((controller) => {
            this.koa.use(controller.middleware());
        });
        return this;
    }
    /**
     * Adds all of the middleware functions to the server.
     *
     * @return {Server}
     */
    registerMiddleware() {
        this.middlewares.forEach((middleware) => {
            this.koa.use(middleware(this.config));
        });
        return this;
    }
};
Server = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(config_1.Config)),
    __param(1, inversify_1.inject(log_1.Logger)),
    __metadata("design:paramtypes", [config_1.Config,
        log_1.Logger])
], Server);
exports.Server = Server;

//# sourceMappingURL=server.js.map
