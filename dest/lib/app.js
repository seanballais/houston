"use strict";
/**
 * houston/src/lib/app.ts
 * IOC container for houston. This is the entrypoint to anything and everything
 * sweat in life.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const config_1 = require("./config");
/**
 * App
 * A houston IOC container
 */
class App extends inversify_1.Container {
    /**
     * Creates a new App
     *
     * @param {Config} config
     */
    constructor(config) {
        super();
        this.bind(config_1.Config).toConstantValue(config);
        this.setupProviders();
    }
    /**
     * Sets up all of the providers we have throughout the application.
     *
     * @return {void}
     */
    setupProviders() {
        this.load(...App.providers);
    }
}
/**
 * A list of all the providers to load in the application.
 *
 * @var {ContainerModule[]}
 */
App.providers = [
    require('../repo/provider').provider,
    require('./database/provider').provider,
    require('./log/provider').provider,
    require('./queue/provider').provider,
    require('./server/provider').provider,
    require('./utility/faker/provider').provider
];
exports.App = App;

//# sourceMappingURL=app.js.map
