"use strict";
/**
 * houston/src/lib/config/loader.ts
 * This file is responsible for loading the configuration file.
 *
 * @exports {Function} environmentToDot
 * @exports {Function} findEnvironmentConfig
 * @exports {Function} findProgramConfig
 * @exports {Function} findFileConfig
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const index_1 = require("./index");
/**
 * The prefix required for environment variables to be used.
 *
 * @var {string}
 */
const environmentPrefix = 'HOUSTON';
/**
 * A list of possible paths the houston configuration file could be.
 *
 * @var {string[]}
 */
const configurationPaths = [
    path.resolve(process.cwd(), 'config.js'),
    path.resolve('/etc/houston/config.js')
];
/**
 * stringToDot
 * Transforms an environmental variable name to dot notation.
 *
 * @example `HOUSTON_LOG_LEVEL` to `log.level`
 *
 * @param {string} str - The string to transform
 * @return {string}
 */
function stringToDot(str) {
    return str
        .toLowerCase()
        .split('_')
        .splice(1)
        .join('.')
        .replace('env', 'environment');
}
exports.stringToDot = stringToDot;
/**
 * getEnvironmentConfig
 * Finds all the environment variables set and returns a built config.
 *
 * @return {Config}
 */
function getEnvironmentConfig() {
    const config = new index_1.Config();
    Object.keys(process.env).forEach((key) => {
        if (key.startsWith(environmentPrefix)) {
            const name = stringToDot(key);
            const numberValue = Number(process.env[key]);
            if (isNaN(numberValue) === false) {
                config.set(name, numberValue);
            }
            else {
                config.set(name, process.env[key]);
            }
        }
    });
    // Some special case variables
    if (process.env.NODE_ENV != null) {
        config.set('environment', process.env.NODE_ENV);
    }
    if (process.env.NODE_DEBUG != null) {
        config.set('log.console', 'debug');
    }
    return config.freeze();
}
exports.getEnvironmentConfig = getEnvironmentConfig;
/**
 * getProgramConfig
 * Returns a built config with program variables like git commit and package
 * version.
 *
 * @return {Config}
 */
function getProgramConfig() {
    const config = new index_1.Config();
    try {
        const pkg = require('../../../package.json');
        const [major, minor, patch] = pkg.version.split('-')[0].split('.');
        config.set('houston.version', pkg.version);
        config.set('houston.major', major);
        config.set('houston.minor', minor);
        config.set('houston.patch', patch);
    }
    catch (e) { } // tslint:disable-line no-empty
    try {
        const gitCommitPath = path.resolve(__dirname, '..', '..', '..', '.git', 'ORIG_HEAD');
        const exists = fs.statSync(gitCommitPath).isFile();
        if (exists === true) {
            const commit = fs.readFileSync(gitCommitPath, {
                encoding: 'utf8'
            }).trim();
            config.set('houston.commit', commit);
        }
    }
    catch (e) { } // tslint:disable-line no-empty
    try {
        const gitChangePath = path.resolve(__dirname, '..', '..', '..', '.git', 'COMMIT_EDITMSG');
        const exists = fs.statSync(gitChangePath).isFile();
        if (exists === true) {
            const change = fs.readFileSync(gitChangePath, {
                encoding: 'utf8'
            }).trim();
            config.set('houston.change', change);
        }
    }
    catch (e) { } // tslint:disable-line no-empty
    return config.freeze();
}
exports.getProgramConfig = getProgramConfig;
/**
 * getFileConfig
 * Tries to read configuration from a file.
 *
 * @param {string} [p] - The path to the file
 *
 * @throws {Error} - On 404 file not found
 * @return {Config}
 */
function getFileConfig(p) {
    const config = new index_1.Config();
    let file = {};
    if (p != null && p.startsWith('/')) {
        file = require(p); // tslint:disable-line non-literal-require
    }
    else if (p != null) {
        const relativeP = path.resolve(process.cwd(), p);
        file = require(relativeP); // tslint:disable-line non-literal-require
    }
    else {
        // Test for other global config file paths
        for (const possible of configurationPaths) {
            try {
                if (fs.statSync(possible).isFile()) {
                    file = require(possible); // tslint:disable-line non-literal-require
                    break;
                }
            }
            catch (e) { } // tslint:disable-line no-empty
        }
    }
    return config
        .merge(file)
        .freeze();
}
exports.getFileConfig = getFileConfig;
/**
 * getConfig
 * This creates a Config from all possible places.
 *
 * @param {string} [p] - The path to the configuration file
 *
 * @throws {Error} - On 404 file not found
 * @return {Config}
 */
function getConfig(p) {
    const environment = getEnvironmentConfig();
    const program = getProgramConfig();
    const file = getFileConfig(p);
    const config = new index_1.Config();
    return config
        .merge(program.get('.'))
        .merge(file.get('.'))
        .merge(environment.get('.'))
        .freeze();
}
exports.getConfig = getConfig;

//# sourceMappingURL=loader.js.map
