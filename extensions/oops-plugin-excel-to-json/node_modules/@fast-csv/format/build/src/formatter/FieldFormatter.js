"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldFormatter = void 0;
const lodash_isboolean_1 = __importDefault(require("lodash.isboolean"));
const lodash_isnil_1 = __importDefault(require("lodash.isnil"));
const lodash_escaperegexp_1 = __importDefault(require("lodash.escaperegexp"));
class FieldFormatter {
    constructor(formatterOptions) {
        this._headers = null;
        this.formatterOptions = formatterOptions;
        if (formatterOptions.headers !== null) {
            this.headers = formatterOptions.headers;
        }
        this.REPLACE_REGEXP = new RegExp(formatterOptions.quote, 'g');
        const escapePattern = `[${formatterOptions.delimiter}${lodash_escaperegexp_1.default(formatterOptions.rowDelimiter)}|\r|\n]`;
        this.ESCAPE_REGEXP = new RegExp(escapePattern);
    }
    set headers(headers) {
        this._headers = headers;
    }
    shouldQuote(fieldIndex, isHeader) {
        const quoteConfig = isHeader ? this.formatterOptions.quoteHeaders : this.formatterOptions.quoteColumns;
        if (lodash_isboolean_1.default(quoteConfig)) {
            return quoteConfig;
        }
        if (Array.isArray(quoteConfig)) {
            return quoteConfig[fieldIndex];
        }
        if (this._headers !== null) {
            return quoteConfig[this._headers[fieldIndex]];
        }
        return false;
    }
    format(field, fieldIndex, isHeader) {
        const preparedField = `${lodash_isnil_1.default(field) ? '' : field}`.replace(/\0/g, '');
        const { formatterOptions } = this;
        if (formatterOptions.quote !== '') {
            const shouldEscape = preparedField.indexOf(formatterOptions.quote) !== -1;
            if (shouldEscape) {
                return this.quoteField(preparedField.replace(this.REPLACE_REGEXP, formatterOptions.escapedQuote));
            }
        }
        const hasEscapeCharacters = preparedField.search(this.ESCAPE_REGEXP) !== -1;
        if (hasEscapeCharacters || this.shouldQuote(fieldIndex, isHeader)) {
            return this.quoteField(preparedField);
        }
        return preparedField;
    }
    quoteField(field) {
        const { quote } = this.formatterOptions;
        return `${quote}${field}${quote}`;
    }
}
exports.FieldFormatter = FieldFormatter;
//# sourceMappingURL=FieldFormatter.js.map