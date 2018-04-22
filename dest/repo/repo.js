"use strict";
/**
 * houston/src/repo/repo.ts
 * Entry point for repository syslog server. I whould highly recommend reading
 * some of the code from the node syslogd package and the dgram docs.
 *
 * TODO: We should cache download count for a while so we can mass increment
 *
 * @exports {Class} Repo - A repository syslog server
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
const dgram = require("dgram");
const inversify_1 = require("inversify");
const config_1 = require("../lib/config");
const database_1 = require("../lib/database/database");
const log_1 = require("../lib/log");
/**
 * Repo
 * A repository syslog server. Tries to mirror the Server class methods.
 *
 * @property {Socket} server
 * @property {number} port
 */
let Repo = class Repo {
    /**
     * Creates a new web server
     *
     * @param {Config} config - The configuration to use
     * @param {Database} database - The database connection to use
     * @param {Logger} logger - The log instance to use
     */
    constructor(config, database, logger) {
        this.config = config;
        this.database = database;
        this.logger = logger;
    }
    /**
     * onError
     * Handles a download message from web server
     *
     * @param {Error} err - An error that occured
     *
     * @return {void}
     */
    onError(err) {
        this.logger
            .error('Internal server error')
            .setError(err)
            .send();
    }
    /**
     * onMessage
     * Handles a download message from web server
     *
     * @async
     * @param {Buffer} buf - The message sent from the web server
     *
     * @return {void}
     */
    onMessage(buf) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = buf.toString('utf8').split(': ')[1];
            // Possibly a broken message?
            if (message == null || message === '') {
                return;
            }
            // Format: ip address | status code | path | bytes | user agent | time
            const [, status] = message.split('|');
            // Trying to get a file that errored, or does not exist.
            if (Number(status) >= 400) {
                return;
            }
            // TODO: Increment package download count
        });
    }
    /**
     * listen
     * Starts the repository syslogd server
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
            this.server = dgram.createSocket('udp4');
            this.server.on('error', (err) => this.onError(err));
            this.server.on('message', (msg) => this.onMessage(msg));
            try {
                yield new Promise((resolve, reject) => {
                    this.server.bind({ port }, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    });
                });
            }
            catch (err) {
                this.logger
                    .error(`Server unable to listen on port ${port} with ${env} configuration`)
                    .setError(err)
                    .send();
                throw err;
            }
            this.port = this.server.address().port;
            this.logger
                .info(`Server listening on port ${this.port} with ${env} configuration`)
                .send();
            return this;
        });
    }
    /**
     * close
     * Stops the syslog server
     *
     * @async
     *
     * @throws {Error} - When the Server class is messed up
     * @return {Server} - An inactive Server class
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.server != null) {
                yield new Promise((resolve) => {
                    this.server.close(() => resolve());
                });
                this.port = 0;
            }
            return this;
        });
    }
};
Repo = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(config_1.Config)),
    __param(1, inversify_1.inject(database_1.Database)),
    __param(2, inversify_1.inject(log_1.Logger)),
    __metadata("design:paramtypes", [config_1.Config,
        database_1.Database,
        log_1.Logger])
], Repo);
exports.Repo = Repo;

//# sourceMappingURL=repo.js.map
