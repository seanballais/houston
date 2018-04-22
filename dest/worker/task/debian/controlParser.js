"use strict";
/**
 * houston/src/worker/task/debian/controlParser.ts
 * Reads and writes a Debian control file. I whould highly recommend reading the
 * Debian documentation about the Control file before editing too much of this
 * file.
 * @see https://www.debian.org/doc/debian-policy/ch-controlfields.html
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
class Parser {
    /**
     * Creates a new Parser class
     *
     * @param {string} file - The location to the file.
     */
    constructor(file) {
        this.file = file;
    }
    /**
     * Returns the type of line that is being parsed.
     *
     * @param {string} data - The raw string data
     * @param {number} line - The line to check type
     * @return {LineType}
     */
    static readLineType(data, line = 0) {
        const lines = data.split('\n').filter((l) => (l.trim() !== ''));
        const before = (lines[line - 1]) ? lines[line - 1] : '';
        const current = (lines[line]) ? lines[line] : '';
        const after = (lines[line + 1]) ? lines[line + 1] : '';
        if (before.trim().endsWith(',') || current.trim().endsWith(',')) {
            return 'folded';
        }
        if (current.startsWith(' ') || after.startsWith(' ')) {
            return 'multiline';
        }
        return 'simple';
    }
    /**
     * Given some JavaScript data, we tell you what type of line to write.
     *
     * @param {string|string[]} data - The data to check
     * @return {LineType}
     */
    static writeLineType(data) {
        if (Array.isArray(data)) {
            return 'folded';
        }
        if (data.indexOf('\n') !== -1) {
            return 'multiline';
        }
        return 'simple';
    }
    /**
     * Sorts an object to an array. It's pretty hacky, but we need to keep order.
     *
     * @param {Object} data
     * @return {array}
     */
    static sortProperties(data) {
        return Object.keys(data)
            .map((key) => [key, data[key]])
            .sort((a, b) => {
            const ai = this.order.indexOf(a[0]);
            const bi = this.order.indexOf(b[0]);
            if (ai === -1) {
                return 1;
            }
            else if (bi === -1) {
                return -1;
            }
            else {
                return ai - bi;
            }
        });
    }
    /**
     * Pads the left side of a string by a length
     *
     * @param {string} str
     * @param {Number} len
     * @return {string}
     */
    static leftPad(str, len) {
        return ' '.repeat(len) + str;
    }
    /**
     * Reads the file and parses it to easy to understand javascript.
     *
     * @async
     * @return {object}
     */
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield fs.pathExists(this.file);
            if (exists === false) {
                return {};
            }
            const output = {};
            let lastKey;
            const raw = yield fs.readFile(this.file, { encoding: 'utf8' });
            const lines = raw.split('\n').filter((l) => (l.trim() !== ''));
            lines.forEach((line, i) => {
                const type = Parser.readLineType(raw, i);
                if (type === 'simple') {
                    const breakIndex = line.indexOf(':');
                    const key = line.substring(0, breakIndex).trim();
                    const value = line.substring(breakIndex + 1).trim();
                    output[key] = value;
                    lastKey = key;
                    return;
                }
                if (type === 'folded') {
                    const breakIndex = line.indexOf(':');
                    let firstLine = true;
                    let key;
                    let value;
                    if (breakIndex !== -1) {
                        key = line.substring(0, breakIndex).trim();
                        value = line.substring(breakIndex + 1).trim();
                    }
                    else {
                        firstLine = false;
                        key = '';
                        value = line.trim();
                    }
                    // Avoid variables with ':' in them looking like fake key values
                    if (key.indexOf('${') !== -1) {
                        firstLine = false;
                        value = line.trim();
                    }
                    if (value.endsWith(',')) {
                        value = value.slice(0, -1);
                    }
                    if (firstLine) {
                        output[key] = [value];
                        lastKey = key;
                        return;
                    }
                    output[lastKey].push(value);
                    output[lastKey].sort();
                }
                if (type === 'multiline') {
                    const breakIndex = line.indexOf(':');
                    if (breakIndex !== -1) {
                        const key = line.substring(0, breakIndex).trim();
                        const value = line.substring(breakIndex + 1).trim();
                        output[key] = value;
                        lastKey = key;
                        return;
                    }
                    output[lastKey] += `\n${line.trim()}`;
                }
            });
            return output;
        });
    }
    /**
     * Reads the file and parses it to easy to understand javascript.
     *
     * @async
     * @param {object} data - The data to write to file
     * @return {string}
     */
    write(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs.ensureFile(this.file);
            let output = '';
            Parser.sortProperties(data).forEach(([key, line]) => {
                const type = Parser.writeLineType(line);
                switch (type) {
                    case 'folded':
                        output += `${key}: ${line[0]}`;
                        if (line.length < 2) {
                            break;
                        }
                        output += ',\n';
                        output += line
                            .slice(1)
                            .map((l) => Parser.leftPad(l, key.length + 2))
                            .join(',\n');
                        output += '\n\n';
                        break;
                    case 'multiline':
                        output += `${key}:`;
                        output += line
                            .split('\n')
                            .map((l) => ` ${l}`)
                            .join('\n');
                        output += '\n';
                        break;
                    default:
                        output += `${key}: ${line}\n`;
                        break;
                }
            });
            yield fs.writeFile(this.file, output, 'utf8');
            return output;
        });
    }
}
/**
 * The order that debian control file properties should be in
 *
 * @var {string[]}
 */
Parser.order = [
    'Source',
    'Maintainer',
    'Section',
    'Priority',
    'Standards-Version',
    'Vcs-Git',
    'Vcs-Browser',
    'Homepage',
    'Build-Depends',
    'Build-Depends-Indep',
    'Package',
    'Architecture',
    'Depends',
    'Recommends',
    'Description'
];
exports.Parser = Parser;

//# sourceMappingURL=controlParser.js.map
