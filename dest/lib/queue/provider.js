"use strict";
/**
 * houston/src/lib/queue/provider.ts
 * Sets up the needed providers for the Queue system
 */
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const config_1 = require("../config");
const index_1 = require("./index");
const redis_1 = require("./providers/redis");
exports.provider = new inversify_1.ContainerModule((bind) => {
    bind(index_1.Queue).toFactory((context) => {
        return function QueueFactory(name) {
            const config = context.container.get(config_1.Config);
            if (config.get('queue.client') === 'redis') {
                try {
                    require.resolve('bull');
                }
                catch (e) {
                    throw new Error('Package "bull" is not installed. Please install it.');
                }
                return new redis_1.Queue(config, name);
            }
            if (config.has('queue.client') === false) {
                throw new Error('No queue client configured');
            }
            else {
                throw new Error(`Unknown queue client of "${config.get('queue.client')}" configured`);
            }
        };
    });
    bind(index_1.workerQueue).toDynamicValue((context) => {
        const queueConstructor = context.container.get(index_1.Queue);
        return queueConstructor('WorkerQueue');
    });
});

//# sourceMappingURL=provider.js.map
