"use strict";
/**
 * houston/src/lib/utility/template.ts
 * A simple way to template strings using ejs
 *
 * @example
 * ```
 *   import template from 'lib/utility/template'
 *
 *   return template('# <%= title %>', { title: 'testing' })
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ejs = require("ejs");
exports.default = ejs.render;

//# sourceMappingURL=template.js.map
