"use strict";
/**
 * houston/src/lib/utility/markdown.ts
 * Parses markdown to an html string
 *
 * @example
 * ```
 *   import markdown from 'lib/utility/markdown'
 *
 *   return markdown('# this is a string')
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const Markdown = require("markdown-it");
const DEFAULT_OPTS = {
    breaks: true,
    html: false,
    linkify: true,
    quotes: '“”‘’',
    typographer: true,
    xhtmlOut: true
};
/**
 * Renders a markdown string to html
 *
 * @param {String} str
 * @param {Object} [opts]
 * @return {string}
 */
function default_1(str, opts = {}) {
    const markdown = new Markdown(lodash_1.defaultsDeep({}, DEFAULT_OPTS, opts));
    return markdown.render(str);
}
exports.default = default_1;

//# sourceMappingURL=markdown.js.map
