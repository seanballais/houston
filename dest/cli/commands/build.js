"use strict";
/**
 * houston/src/cli/commands/build.ts
 * Builds a project with the worker
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
// Command line files are allowed to have console log statements
// tslint:disable no-console
const fs = require("fs-extra");
const path = require("path");
const semver = require("semver");
const config_1 = require("../../lib/config");
const rdnn_1 = require("../../lib/service/rdnn");
const repository_1 = require("../../lib/service/repository");
const build_1 = require("../../worker/preset/build");
const utilities_1 = require("../utilities");
exports.command = 'build <repo> <version>';
exports.describe = 'Builds a repository with the worker process';
exports.builder = (yargs) => {
    return yargs
        .positional('repo', {
        describe: 'Full repository URL',
        type: 'string'
    })
        .positional('version', {
        coerce: semver.valid,
        default: '0.0.1',
        describe: 'Semver version to build for',
        type: 'string'
    })
        .option('type', {
        choices: ['app', 'system-app', 'library'],
        default: 'app',
        describe: 'The type of project',
        type: 'string'
    })
        .option('architecture', {
        default: 'amd64',
        describe: 'Architecture to build for',
        type: 'string'
    })
        .option('distribution', {
        default: 'loki',
        describe: 'Distribution to build for',
        type: 'string'
    })
        .option('name-appstream', {
        coerce: rdnn_1.sanitize,
        describe: 'AppStream id',
        type: 'string'
    })
        .option('name-developer', {
        describe: 'Developer\'s name',
        type: 'string'
    })
        .option('name-domain', {
        alias: 'n',
        coerce: rdnn_1.sanitize,
        describe: 'Reverse Domain Name Notation',
        type: 'string'
    })
        .option('name-human', {
        describe: 'Human readable name',
        type: 'string'
    })
        .option('package-system', {
        choices: ['deb'],
        default: 'deb',
        describe: 'Package system',
        type: 'string'
    })
        .option('references', {
        default: [],
        describe: 'References to pull',
        type: 'array'
    });
};
/**
 * Creates a basic context object for information about the build
 *
 * @param {object} argv
 * @param {Repository} repository
 * @return {IContext}
 */
function buildContext(argv, repository) {
    const nameDomain = argv['name-domain'] || repository.rdnn;
    const nameAppstream = argv['name-appstream'] || `${nameDomain}.desktop`;
    const nameDeveloper = argv['name-developer'] || 'Rabbitbot';
    const nameHuman = argv['name-human'] || 'Application'; // TODO: Better name?
    const obj = {
        appcenter: {},
        appstream: '',
        architecture: argv.architecture,
        changelog: [],
        distribution: argv.distribution,
        logs: [],
        nameAppstream,
        nameDeveloper,
        nameDomain,
        nameHuman,
        packageSystem: argv['package-system'],
        references: argv.references,
        type: argv.type,
        version: argv.version
    };
    return obj;
}
function logSpacer() {
    console.log('');
    console.log('='.repeat(80));
    console.log('');
}
/**
 * Logs all of the logs to the console
 *
 * @param {Log[]} logs
 * @return {void}
 */
function logLogs(logs) {
    for (const log of logs.sort((a, b) => (b.level - a.level))) {
        logSpacer();
        console.log(log.toString());
    }
}
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const { app } = utilities_1.setup(argv);
        const config = app.get(config_1.Config);
        const repository = repository_1.create(argv.repo);
        const context = buildContext(argv, repository);
        const worker = build_1.Build(config, repository, context);
        console.log(`Running build for ${argv.repo} version ${argv.version}`);
        yield worker.setup();
        yield worker.run();
        for (const pkg of worker.result.packages) {
            if (pkg.path != null && (yield fs.exists(pkg.path))) {
                const fileName = path.resolve(process.cwd(), path.basename(pkg.path));
                yield fs.copy(pkg.path, fileName, { overwrite: true });
            }
        }
        if (worker.fails) {
            console.error(`Error while running build for ${argv.repo} for ${argv.version}`);
            logLogs(worker.result.logs);
            logSpacer();
            process.exit(1);
        }
        else {
            console.log(`Built ${argv.repo} for version ${argv.version}`);
            logLogs(worker.result.logs);
            logSpacer();
            process.exit(0);
        }
    });
}
exports.handler = handler;

//# sourceMappingURL=build.js.map
