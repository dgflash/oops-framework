"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnFormatter = void 0;
class ColumnFormatter {
    constructor(parserOptions) {
        if (parserOptions.trim) {
            this.format = (col) => col.trim();
        }
        else if (parserOptions.ltrim) {
            this.format = (col) => col.trimLeft();
        }
        else if (parserOptions.rtrim) {
            this.format = (col) => col.trimRight();
        }
        else {
            this.format = (col) => col;
        }
    }
}
exports.ColumnFormatter = ColumnFormatter;
//# sourceMappingURL=ColumnFormatter.js.map