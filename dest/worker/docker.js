"use strict";
/**
 * houston/src/worker/docker.ts
 * A helpful class for using docker.
 *
 * @exports {Class} Docker - A helpful class for using docker.
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
const Dockerode = require("dockerode");
const fs = require("fs-extra");
class Docker {
    /**
     * Creates a new docker container class
     *
     * @param {Config} config - The configuration to use
     * @param {string} name - The docker image to use
     */
    constructor(config, name) {
        /**
         * tag
         * The docker image tag
         */
        this.tag = 'latest';
        /**
         * mounts
         * All of the directories that will be mounted on the container.
         * NOTE: Key is local folder, value is container folder.
         *
         * @var {object}
         */
        this.mounts = {};
        this.config = config;
        this.docker = new Dockerode(config.get('docker'));
        this.name = `houston-${name}`;
    }
    /**
     * options
     * All of the docker options that will get passed on running the container.
     *
     * @return {object}
     */
    get options() {
        const options = {
            Binds: []
        };
        Object.keys(this.mounts).forEach((local) => {
            options.Binds.push(`${local}:${this.mounts[local]}:rw`);
        });
        return options;
    }
    /**
     * mount
     * Adds a mount point to the container
     *
     * @param {string} from - The local directory to attach
     * @param {string} to - The container directory to mount to
     * @return {Docker}
     */
    mount(from, to) {
        this.mounts[from] = to;
        return this;
    }
    /**
     * exists
     * Checks if the image currently exists.
     *
     * @async
     * @param {string} tag - Docker image tag to check for
     * @return {boolean}
     */
    exists(tag = this.tag) {
        return __awaiter(this, void 0, void 0, function* () {
            const images = yield this.docker.listImages();
            const foundImages = images.filter((image) => {
                if (image.RepoTags == null) {
                    return false;
                }
                let found = false;
                image.RepoTags.forEach((imageTag) => {
                    if (imageTag === `${this.name}:${tag}`) {
                        found = true;
                    }
                });
                return found;
            });
            return (foundImages.length !== 0);
        });
    }
    /**
     * create
     * Creates a docker image from a directory of files.
     *
     * @async
     * @param {string} folder - The folder to create the image from
     * @return {void}
     */
    create(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield fs.readdir(folder);
            yield new Promise((resolve, reject) => {
                this.docker.buildImage({
                    context: folder,
                    src: files
                }, { t: this.name }, (err, stream) => {
                    if (err != null) {
                        return reject(err);
                    }
                    this.docker.modem.followProgress(stream, resolve);
                });
            });
        });
    }
    /**
     * run
     * Runs a container with the given command and mounts
     *
     * @param {string} cmd - Command to run
     * @param {object} [opts] - Additional options to pass to container
     * @return {number} - Container exit code
     */
    run(cmd, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const log = yield this.setupLog();
            const commands = cmd.split(' ');
            const options = Object.assign({}, this.options, opts);
            const container = yield this.docker.run(this.name, commands, log, options);
            yield container.remove();
            return container.output.StatusCode;
        });
    }
    /**
     * setupLog
     * Creates / Clears the log file
     *
     * @async
     * @return {Stream|null}
     */
    setupLog() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.log == null) {
                return null;
            }
            yield fs.ensureFile(this.log);
            return fs.createWriteStream(this.log);
        });
    }
}
exports.Docker = Docker;

//# sourceMappingURL=docker.js.map
