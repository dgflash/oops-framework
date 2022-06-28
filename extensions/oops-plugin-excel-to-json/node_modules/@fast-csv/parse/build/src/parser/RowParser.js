"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowParser = void 0;
const column_1 = require("./column");
const Token_1 = require("./Token");
const EMPTY_STRING = '';
class RowParser {
    constructor(parserOptions) {
        this.parserOptions = parserOptions;
        this.columnParser = new column_1.ColumnParser(parserOptions);
    }
    static isEmptyRow(row) {
        return row.join(EMPTY_STRING).replace(/\s+/g, EMPTY_STRING) === EMPTY_STRING;
    }
    parse(scanner) {
        const { parserOptions } = this;
        const { hasMoreData } = scanner;
        const currentScanner = scanner;
        const columns = [];
        let currentToken = this.getStartToken(currentScanner, columns);
        while (currentToken) {
            if (Token_1.Token.isTokenRowDelimiter(currentToken)) {
                currentScanner.advancePastToken(currentToken);
                // if ends with CR and there is more data, keep unparsed due to possible
                // coming LF in CRLF
                if (!currentScanner.hasMoreCharacters &&
                    Token_1.Token.isTokenCarriageReturn(currentToken, parserOptions) &&
                    hasMoreData) {
                    return null;
                }
                currentScanner.truncateToCursor();
                return columns;
            }
            if (!this.shouldSkipColumnParse(currentScanner, currentToken, columns)) {
                const item = this.columnParser.parse(currentScanner);
                if (item === null) {
                    return null;
                }
                columns.push(item);
            }
            currentToken = currentScanner.nextNonSpaceToken;
        }
        if (!hasMoreData) {
            currentScanner.truncateToCursor();
            return columns;
        }
        return null;
    }
    getStartToken(scanner, columns) {
        const currentToken = scanner.nextNonSpaceToken;
        if (currentToken !== null && Token_1.Token.isTokenDelimiter(currentToken, this.parserOptions)) {
            columns.push('');
            return scanner.nextNonSpaceToken;
        }
        return currentToken;
    }
    shouldSkipColumnParse(scanner, currentToken, columns) {
        const { parserOptions } = this;
        if (Token_1.Token.isTokenDelimiter(currentToken, parserOptions)) {
            scanner.advancePastToken(currentToken);
            // if the delimiter is at the end of a line
            const nextToken = scanner.nextCharacterToken;
            if (!scanner.hasMoreCharacters || (nextToken !== null && Token_1.Token.isTokenRowDelimiter(nextToken))) {
                columns.push('');
                return true;
            }
            if (nextToken !== null && Token_1.Token.isTokenDelimiter(nextToken, parserOptions)) {
                columns.push('');
                return true;
            }
        }
        return false;
    }
}
exports.RowParser = RowParser;
//# sourceMappingURL=RowParser.js.map