"use strict";
/**
 * houston/src/worker/task/workspace/setup.ts
 * Fills the workspace with files from git
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
const path = require("path");
const task_1 = require("../task");
class WorkspaceSetup extends task_1.Task {
    /**
     * Given two lists of strings we can find the first most common string.
     *
     * @param {String[]} references
     * @param {String[]} search - All of the reference parts we are looking for
     * @return {String[]}
     */
    static filterRefs(references, search) {
        // Gets the last part of a git reference "refs/origin/master" -> "master"
        const shortReferences = references
            .map((ref) => ref.split('/').reverse()[0]);
        return search
            .map((ref) => shortReferences.findIndex((short) => (short === ref)))
            .filter((ref) => (ref !== -1))
            .map((i) => references[i]);
    }
    /**
     * Fills the workspace by merging the release and package branches of a repo.
     *
     * @async
     * @return {void}
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.worker.emitAsync(`task:${this.constructor.name}:start`);
            yield fs.ensureDir(this.worker.workspace);
            const branches = yield this.branches();
            // Step 1: Download all the needed branches
            for (let i = 0; i < branches.length; i++) {
                // TODO: Maybe go and slugify the branch for easier debugging of folders
                const gitFolder = path.resolve(this.worker.workspace, 'repository', `${i}`);
                yield this.worker.repository.clone(gitFolder, branches[i]);
            }
            // Step 2: Merge the downloaded branches to form a single folder
            for (let i = 0; i < branches.length; i++) {
                const from = path.resolve(this.worker.workspace, 'repository', `${i}`);
                const to = path.resolve(this.worker.workspace, 'clean');
                yield fs.copy(from, to, { overwrite: true });
            }
            // Step 3: Copy pasta to the dirty directory
            const clean = path.resolve(this.worker.workspace, 'clean');
            const dirty = path.resolve(this.worker.workspace, 'dirty');
            yield fs.ensureDir(clean);
            yield fs.ensureDir(dirty);
            yield fs.copy(clean, dirty);
            // TODO: We need to fork for every build configuration
            this.worker.context.packageSystem = 'deb';
            // Step 4: Profit
            yield this.worker.emitAsync(`task:${this.constructor.name}:end`);
        });
    }
    /**
     * Returns a list of branches to use to make the directory.
     * The given branch will always be first, followed possibly by a package branch.
     *
     * @async
     * @return {String[]}
     */
    branches() {
        return __awaiter(this, void 0, void 0, function* () {
            const repositoryReferences = yield this.worker.repository.references();
            console.log('setup refs: ', repositoryReferences);
            const mergableReferences = [
                `${this.worker.context.distribution}`,
                `${this.worker.context.packageSystem}-packaging`,
                `${this.worker.context.packageSystem}-packaging-${this.worker.context.distribution}`
            ];
            if (this.worker.context.references[0] != null) {
                const shortBranch = this.worker.context.references[0].split('/').reverse()[0];
                mergableReferences.push(`${this.worker.context.packageSystem}-packaging-${this.worker.context.distribution}-${shortBranch}`);
            }
            console.log('wanted refs: ', mergableReferences);
            const packageReferences = WorkspaceSetup.filterRefs(repositoryReferences, mergableReferences);
            console.log('matching refs: ', packageReferences);
            // Returns a unique array. No dups.
            return [...new Set([...this.worker.context.references, ...packageReferences])];
        });
    }
}
exports.WorkspaceSetup = WorkspaceSetup;

//# sourceMappingURL=setup.js.map
