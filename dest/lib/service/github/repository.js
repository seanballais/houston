"use strict";
/**
 * houston/src/lib/service/github/repository.ts
 * Handles interaction with GitHub repositories.
 *
 * @return {class} Repository - A GitHub repository class
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
const Git = require("nodegit");
const os = require("os");
const path = require("path");
const agent = require("superagent");
const uuid = require("uuid/v4");
const rdnn_1 = require("../rdnn");
class Repository {
    /**
     * Creates a new GitHub Repository
     *
     * @param {string} url - The full github url
     */
    constructor(url) {
        /**
         * reference
         * The reference to branch or tag.
         *
         * @var {string}
         */
        this.reference = 'refs/heads/master';
        this.url = url;
    }
    /**
     * url
     * Returns the Git URL for the repository
     *
     * @return {string}
     */
    get url() {
        if (this.auth != null) {
            return `https://${this.auth}@github.com/${this.username}/${this.repository}.git`;
        }
        return `https://github.com/${this.username}/${this.repository}.git`;
    }
    /**
     * url
     * Sets the Git URL for the repository
     * NOTE: Auth code is case sensitive, so we can't lowercase the whole url
     *
     * @return {string}
     */
    set url(p) {
        if (p.indexOf('github') === -1) {
            throw new Error('Given URL is not a GitHub repository');
        }
        const chunks = p.split(/[@\/:\.]/);
        const reverseChunks = [...chunks].reverse();
        if (reverseChunks[0].toLowerCase() === 'git') {
            this.username = reverseChunks[2];
            this.repository = reverseChunks[1];
        }
        else {
            this.username = reverseChunks[1];
            this.repository = reverseChunks[0];
        }
        if (chunks[0].toLowerCase() === 'https' || chunks[0].toLowerCase() === 'http') {
            if (chunks[3].toLowerCase() !== 'github') {
                this.auth = chunks[3];
            }
        }
    }
    /**
     * Returns the default RDNN value for this repository
     *
     * @return {string}
     */
    get rdnn() {
        return rdnn_1.sanitize(`com.github.${this.username}.${this.repository}`);
    }
    /**
     * clone
     * Clones the repository to a folder
     *
     * @async
     * @param {string} p - The path to clone to
     * @param {string} [reference] - The branch to clone
     * @return {void}
     */
    clone(p, reference = this.reference) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = yield Git.Clone(this.url, p);
            const ref = yield Git.Reference.lookup(repo, reference);
            yield repo.checkoutRef(ref);
            yield fs.remove(path.resolve(p, '.git'));
        });
    }
    /**
     * references
     * Returns a list of references this repository has
     * TODO: Try to figure out a more optimized way
     *
     * @async
     * @return {string[]}
     */
    references() {
        return __awaiter(this, void 0, void 0, function* () {
            const p = path.resolve(Repository.tmpFolder, uuid());
            const repo = yield Git.Clone(this.url, p);
            const branches = yield repo.getReferenceNames(Git.Reference.TYPE.LISTALL);
            console.log('found references: ', branches);
            yield fs.remove(p);
            return branches;
        });
    }
    /**
     * Uploads an asset to a GitHub release.
     *
     * @async
     * @param {string} reference
     * @param {string} p
     * @param {string} type - The HTTP Content-Type ("text/markdown")
     * @param {string} name
     * @param {string} [description]
     * @return {void}
     */
    asset(reference, p, type, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.username}/${this.repository}/releases/tags/${reference}`;
            const { body } = yield agent
                .get(`https://api.github.com/repos/${url}`)
                .set('accept', 'application/vnd.github.v3+json')
                .set('authorization', `token ${this.auth}`);
            if (body.upload_url == null) {
                throw new Error('No Upload URL for GitHub release');
            }
            // TODO: Should we remove existing assets that would conflict?
            const stat = yield fs.stat(p);
            const file = yield fs.createReadStream(p);
            yield new Promise((resolve, reject) => {
                const res = agent
                    .post(body.upload_url.replace('{?name,label}', ''))
                    .set('content-type', type)
                    .set('content-length', stat.size)
                    .set('authorization', `token ${this.auth}`)
                    .query({ name })
                    .query((description != null) ? { label: description } : {})
                    .on('error', reject)
                    .on('end', resolve);
                file.pipe(res);
            });
        });
    }
}
/**
 * tmpFolder
 * Folder to use as scratch space for cloning repos
 *
 * @var {string}
 */
Repository.tmpFolder = path.resolve(os.tmpdir(), 'houston');
exports.Repository = Repository;

//# sourceMappingURL=repository.js.map
