"use strict";
/**
 * houston/src/lib/queue/providers/redis/queue.ts
 * Wraps `bull` package in types for use in our queue system.
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
const BaseBull = require("bull");
const inversify_1 = require("inversify");
const config_1 = require("../../../config");
const job_1 = require("./job");
let Queue = class Queue {
    /**
     * Creates a new queue with the given name
     *
     * @param {String} name
     */
    constructor(config, name) {
        const connection = config.get('queue.connection');
        if (typeof config === 'object') {
            this.bull = new BaseBull(name, { redis: connection });
        }
        else {
            this.bull = new BaseBull(name, config);
        }
    }
    send(data, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield this.bull.add(data, opts);
            return new job_1.Job(job);
        });
    }
    handle(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bull.process(fn);
        });
    }
    pause(local) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bull.pause(local);
        });
    }
    resume(local) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bull.resume(local);
        });
    }
    empty() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bull.empty();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bull.close();
        });
    }
    count(state = null) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (state) {
                case (null):
                    return this.bull.count();
                case ('waiting'):
                    return this.bull.getWaitingCount();
                case ('active'):
                    return this.bull.getActiveCount();
                case ('completed'):
                    return this.bull.getCompletedCount();
                case ('failed'):
                    return this.bull.getFailedCount();
                case ('delayed'):
                    return this.bull.getDelayedCount();
                default:
                    return 0;
            }
        });
    }
    jobs(state) {
        return __awaiter(this, void 0, void 0, function* () {
            const bullJobs = yield this.bullJobs(state);
            return bullJobs.map((j) => new job_1.Job(j));
        });
    }
    onActive(fn) {
        this.bull.on('active', fn);
    }
    onProgress(fn) {
        this.bull.on('progress', fn);
    }
    onFailed(fn) {
        this.bull.on('failed', fn);
    }
    onCompleted(fn) {
        this.bull.on('completed', fn);
    }
    bullJobs(state) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (state) {
                case ('waiting'):
                    return this.bull.getWaiting();
                case ('active'):
                    return this.bull.getActive();
                case ('completed'):
                    return this.bull.getCompleted();
                case ('failed'):
                    return this.bull.getFailed();
                case ('delayed'):
                    return this.bull.getDelayed();
                default:
                    return [];
            }
        });
    }
};
Queue = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(config_1.Config)),
    __metadata("design:paramtypes", [config_1.Config, String])
], Queue);
exports.Queue = Queue;

//# sourceMappingURL=queue.js.map
