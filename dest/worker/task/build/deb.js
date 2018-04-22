"use strict";
/**
 * houston/src/worker/task/build/deb.ts
 * Builds a debian package
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
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const glob_1 = require("../../../lib/utility/glob");
const docker_1 = require("../../docker");
const log_1 = require("../../log");
const task_1 = require("../task");
class BuildDeb extends task_1.Task {
    /**
     * Returns the path of the liftoff cache
     *
     * @return {string}
     */
    static get cachePath() {
        return path.resolve(os.tmpdir(), 'liftoff');
    }
    /**
     * Location of the liftoff log
     *
     * @return {string}
     */
    get logPath() {
        return path.resolve(this.worker.workspace, 'build.log');
    }
    /**
     * Location of the directory to build
     *
     * @return {string}
     */
    get path() {
        return path.resolve(this.worker.workspace, 'build');
    }
    /**
     * Returns the liftoff distribution to use.
     * NOTE: Because liftoff does not know about elementary distros, we map
     * them to the Ubuntu equivalents
     *
     * @return {string}
     */
    get distribution() {
        switch (this.worker.context.distribution) {
            case ('loki'):
                return 'xenial';
            case ('juno'):
                return 'bionic';
            default:
                return this.worker.context.distribution;
        }
    }
    /**
     * Runs liftoff
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setup();
            const docker = yield this.docker();
            const arch = this.worker.context.architecture;
            const dist = this.distribution;
            const cmd = `-a ${arch} -d ${dist} -o /tmp/houston`;
            // Liftoff uses chroot, so we need higher permissions to run
            const exit = yield docker.run(cmd, { Privileged: true });
            if (exit !== 0) {
                throw yield this.log();
            }
            yield this.teardown();
        });
    }
    /**
     * Ensures the build directory is ready for docker
     *
     * @async
     * @return {void}
     */
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const from = path.resolve(this.worker.workspace, 'clean');
            yield fs.ensureDir(this.path);
            yield fs.copy(from, this.path);
        });
    }
    /**
     * Returns the first known good package path. Used for when projects make
     * more than one package. We need to run tests on the main one.
     * TODO: Do tests on all the packages made
     *
     * @async
     * @return {IPackage|null}
     */
    package() {
        return __awaiter(this, void 0, void 0, function* () {
            const context = this.worker.context;
            // The correct name scheme
            const domainName = `${context.nameDomain}_${context.version}_${context.architecture}.${context.packageSystem}`;
            const domainNamed = yield glob_1.glob(path.resolve(this.path, domainName));
            if (domainNamed[0] != null) {
                return { path: domainNamed[0], type: 'deb' };
            }
            const allNames = yield glob_1.glob(path.resolve(this.path, `*.${context.packageSystem}`));
            // Try to intelligently filter out the _extra_ packages.
            const filteredNames = allNames
                .map((n) => path.basename(n)) // The file name without full path
                .filter((n) => !n.startsWith('lib'))
                .filter((n) => (n.indexOf('-dev') === -1))
                .filter((n) => (n.indexOf('-dbg') === -1));
            if (filteredNames[0] != null) {
                return { path: path.resolve(this.path, filteredNames[0]), type: 'deb' };
            }
            // So... Last effort, we get all the package files, sort them by length, and
            // Pick the shortest one.
            const sortedNames = allNames.sort((a, b) => (a.length - b.length));
            if (sortedNames[0] != null) {
                return { path: sortedNames[0], type: 'deb' };
            }
        });
    }
    /**
     * Removes the messy build directory after copying the package to workspace
     *
     * @async
     * @return {void}
     */
    teardown() {
        return __awaiter(this, void 0, void 0, function* () {
            const deb = yield this.package();
            if (deb == null) {
                throw new log_1.Log(log_1.Log.Level.ERROR, 'Build completed but no Debian package was found');
            }
            const to = path.resolve(this.worker.workspace, 'package.deb');
            yield fs.copy(deb.path, to);
            this.worker.context.packagePath = to;
            yield fs.remove(this.path);
        });
    }
    /**
     * Formats a liftoff error
     *
     * @async
     * @return {Log}
     */
    log() {
        return __awaiter(this, void 0, void 0, function* () {
            const p = path.resolve(__dirname, 'deb.md');
            const log = yield fs.readFile(this.logPath, 'utf8');
            return log_1.Log.template(log_1.Log.Level.ERROR, p, {
                log,
                storage: this.worker.context
            });
        });
    }
    /**
     * Returns a docker instance to use for liftoff
     *
     * @async
     * @return {Docker}
     */
    docker() {
        return __awaiter(this, void 0, void 0, function* () {
            const docker = new docker_1.Docker(this.worker.config, 'build-deb');
            const exists = yield docker.exists();
            if (exists === false) {
                const folder = path.resolve(__dirname, 'deb');
                yield docker.create(folder);
            }
            docker.log = this.logPath;
            docker.mount(BuildDeb.cachePath, '/var/cache/liftoff');
            docker.mount(this.path, '/tmp/houston');
            return docker;
        });
    }
}
exports.BuildDeb = BuildDeb;

//# sourceMappingURL=deb.js.map
