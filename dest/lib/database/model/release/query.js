"use strict";
/**
 * houston/src/lib/database/model/project/query.ts
 * Sets up some cool methods and overwrites then function for casting to model
 */
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("../base/query");
class Query extends query_1.Query {
    /**
     * Finds a release by the project name domain and release version
     *
     * @param {string} name - The domain name for the project
     * @return {Query}
     */
    whereNameDomain(name) {
        return this
            .select('releases.*')
            .leftJoin('projects', 'projects.id', 'releases.project_id')
            .where('projects.name_domain', name);
    }
    /**
     * Finds a release by version
     *
     * @param {string} version - The version string that identifies the release
     * @return {Query}
     */
    whereVersion(version) {
        return this
            .select('releases.*')
            .where('version', version);
    }
    /**
     * Finds the newest projects, that have been released at one point or another.
     * NOTE: this does not give projects with the latest releases. Phrasing.
     *
     * @return {Query}
     */
    whereNewestReleased() {
        return this
            .select('releases.*')
            .leftJoin('projects', 'releases.project_id', 'projects.id')
            .leftJoin('builds', 'releases.id', 'builds.release_id')
            .where('projects.deleted_at', null)
            .where('releases.deleted_at', null)
            .where('builds.deleted_at', null)
            .where('builds.status', 'publish')
            .orderBy('releases.created_at', 'desc')
            .groupBy('projects.id');
    }
}
exports.Query = Query;

//# sourceMappingURL=query.js.map
