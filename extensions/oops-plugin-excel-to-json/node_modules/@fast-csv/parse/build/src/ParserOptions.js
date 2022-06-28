"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserOptions = void 0;
const lodash_escaperegexp_1 = __importDefault(require("lodash.escaperegexp"));
const lodash_isnil_1 = __importDefault(require("lodash.isnil"));
class ParserOptions {
    constructor(opts) {
        var _a;
        this.objectMode = true;
        this.delimiter = ',';
        this.ignoreEmpty = false;
        this.quote = '"';
        this.escape = null;
        this.escapeChar = this.quote;
        this.comment = null;
        this.supportsComments = false;
        this.ltrim = false;
        this.rtrim = false;
        this.trim = false;
        this.headers = null;
        this.renameHeaders = false;
        this.strictColumnHandling = false;
        this.discardUnmappedColumns = false;
        this.carriageReturn = '\r';
        this.encoding = 'utf8';
        this.limitRows = false;
        this.maxRows = 0;
        this.skipLines = 0;
        this.skipRows = 0;
        Object.assign(this, opts || {});
        if (this.delimiter.length > 1) {
            throw new Error('delimiter option must be one character long');
        }
        this.escapedDelimiter = lodash_escaperegexp_1.default(this.delimiter);
        this.escapeChar = (_a = this.escape) !== null && _a !== void 0 ? _a : this.quote;
        this.supportsComments = !lodash_isnil_1.default(this.comment);
        this.NEXT_TOKEN_REGEXP = new RegExp(`([^\\s]|\\r\\n|\\n|\\r|${this.escapedDelimiter})`);
        if (this.maxRows > 0) {
            this.limitRows = true;
        }
    }
}
exports.ParserOptions = ParserOptions;
//# sourceMappingURL=ParserOptions.js.map