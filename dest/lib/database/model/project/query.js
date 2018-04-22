"use strict";
/**
 * houston/src/lib/database/model/project/query.ts
 * Sets up some cool methods and overwrites then function for casting to model
 */
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("../base/query");
class Query extends query_1.Query {
    /**
     * Finds a project by the name_domain field
     *
     * @param {string} name - The domain name for the project
     * @return {Query}
     */
    whereNameDomain(name) {
        return this
            .select('projects.*')
            .where('name_domain', name)
            .first();
    }
    /**
     * Finds the newest projects, that have been released at one point or another.
     * NOTE: this does not give projects with the latest releases. Phrasing.
     *
     * @return {Query}
     */
    whereNewestReleased() {
        return this
            .select('projects.*')
            .leftJoin('releases', 'projects.id', 'releases.project_id')
            .leftJoin('builds', 'releases.id', 'builds.release_id')
            .where('projects.deleted_at', null)
            .where('releases.deleted_at', null)
            .where('builds.deleted_at', null)
            .where('builds.status', 'publish')
            .orderBy('projects.created_at', 'desc')
            .groupBy('projects.id');
    }
}
exports.Query = Query;

//# sourceMappingURL=query.js.map
