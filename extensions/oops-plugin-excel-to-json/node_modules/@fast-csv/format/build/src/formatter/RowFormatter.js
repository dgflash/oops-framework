"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowFormatter = void 0;
const lodash_isfunction_1 = __importDefault(require("lodash.isfunction"));
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const FieldFormatter_1 = require("./FieldFormatter");
const types_1 = require("../types");
class RowFormatter {
    constructor(formatterOptions) {
        this.rowCount = 0;
        this.formatterOptions = formatterOptions;
        this.fieldFormatter = new FieldFormatter_1.FieldFormatter(formatterOptions);
        this.headers = formatterOptions.headers;
        this.shouldWriteHeaders = formatterOptions.shouldWriteHeaders;
        this.hasWrittenHeaders = false;
        if (this.headers !== null) {
            this.fieldFormatter.headers = this.headers;
        }
        if (formatterOptions.transform) {
            this.rowTransform = formatterOptions.transform;
        }
    }
    static isRowHashArray(row) {
        if (Array.isArray(row)) {
            return Array.isArray(row[0]) && row[0].length === 2;
        }
        return false;
    }
    static isRowArray(row) {
        return Array.isArray(row) && !this.isRowHashArray(row);
    }
    // get headers from a row item
    static gatherHeaders(row) {
        if (RowFormatter.isRowHashArray(row)) {
            // lets assume a multi-dimesional array with item 0 being the header
            return row.map((it) => it[0]);
        }
        if (Array.isArray(row)) {
            return row;
        }
        return Object.keys(row);
    }
    // eslint-disable-next-line @typescript-eslint/no-shadow
    static createTransform(transformFunction) {
        if (types_1.isSyncTransform(transformFunction)) {
            return (row, cb) => {
                let transformedRow = null;
                try {
                    transformedRow = transformFunction(row);
                }
                catch (e) {
                    return cb(e);
                }
                return cb(null, transformedRow);
            };
        }
        return (row, cb) => {
            transformFunction(row, cb);
        };
    }
    set rowTransform(transformFunction) {
        if (!lodash_isfunction_1.default(transformFunction)) {
            throw new TypeError('The transform should be a function');
        }
        this._rowTransform = RowFormatter.createTransform(transformFunction);
    }
    format(row, cb) {
        this.callTransformer(row, (err, transformedRow) => {
            if (err) {
                return cb(err);
            }
            if (!row) {
                return cb(null);
            }
            const rows = [];
            if (transformedRow) {
                const { shouldFormatColumns, headers } = this.checkHeaders(transformedRow);
                if (this.shouldWriteHeaders && headers && !this.hasWrittenHeaders) {
                    rows.push(this.formatColumns(headers, true));
                    this.hasWrittenHeaders = true;
                }
                if (shouldFormatColumns) {
                    const columns = this.gatherColumns(transformedRow);
                    rows.push(this.formatColumns(columns, false));
                }
            }
            return cb(null, rows);
        });
    }
    finish(cb) {
        const rows = [];
        // check if we should write headers and we didnt get any rows
        if (this.formatterOptions.alwaysWriteHeaders && this.rowCount === 0) {
            if (!this.headers) {
                return cb(new Error('`alwaysWriteHeaders` option is set to true but `headers` option not provided.'));
            }
            rows.push(this.formatColumns(this.headers, true));
        }
        if (this.formatterOptions.includeEndRowDelimiter) {
            rows.push(this.formatterOptions.rowDelimiter);
        }
        return cb(null, rows);
    }
    // check if we need to write header return true if we should also write a row
    // could be false if headers is true and the header row(first item) is passed in
    checkHeaders(row) {
        if (this.headers) {
            // either the headers were provided by the user or we have already gathered them.
            return { shouldFormatColumns: true, headers: this.headers };
        }
        const headers = RowFormatter.gatherHeaders(row);
        this.headers = headers;
        this.fieldFormatter.headers = headers;
        if (!this.shouldWriteHeaders) {
            // if we are not supposed to write the headers then
            // always format the columns
            return { shouldFormatColumns: true, headers: null };
        }
        // if the row is equal to headers dont format
        return { shouldFormatColumns: !lodash_isequal_1.default(headers, row), headers };
    }
    // todo change this method to unknown[]
    gatherColumns(row) {
        if (this.headers === null) {
            throw new Error('Headers is currently null');
        }
        if (!Array.isArray(row)) {
            return this.headers.map((header) => row[header]);
        }
        if (RowFormatter.isRowHashArray(row)) {
            return this.headers.map((header, i) => {
                const col = row[i];
                if (col) {
                    return col[1];
                }
                return '';
            });
        }
        // if its a one dimensional array and headers were not provided
        // then just return the row
        if (RowFormatter.isRowArray(row) && !this.shouldWriteHeaders) {
            return row;
        }
        return this.headers.map((header, i) => row[i]);
    }
    callTransformer(row, cb) {
        if (!this._rowTransform) {
            return cb(null, row);
        }
        return this._rowTransform(row, cb);
    }
    formatColumns(columns, isHeadersRow) {
        const formattedCols = columns
            .map((field, i) => this.fieldFormatter.format(field, i, isHeadersRow))
            .join(this.formatterOptions.delimiter);
        const { rowCount } = this;
        this.rowCount += 1;
        if (rowCount) {
            return [this.formatterOptions.rowDelimiter, formattedCols].join('');
        }
        return formattedCols;
    }
}
exports.RowFormatter = RowFormatter;
//# sourceMappingURL=RowFormatter.js.map