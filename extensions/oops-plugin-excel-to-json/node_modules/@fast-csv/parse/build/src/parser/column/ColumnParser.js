"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnParser = void 0;
const NonQuotedColumnParser_1 = require("./NonQuotedColumnParser");
const QuotedColumnParser_1 = require("./QuotedColumnParser");
const Token_1 = require("../Token");
class ColumnParser {
    constructor(parserOptions) {
        this.parserOptions = parserOptions;
        this.quotedColumnParser = new QuotedColumnParser_1.QuotedColumnParser(parserOptions);
        this.nonQuotedColumnParser = new NonQuotedColumnParser_1.NonQuotedColumnParser(parserOptions);
    }
    parse(scanner) {
        const { nextNonSpaceToken } = scanner;
        if (nextNonSpaceToken !== null && Token_1.Token.isTokenQuote(nextNonSpaceToken, this.parserOptions)) {
            scanner.advanceToToken(nextNonSpaceToken);
            return this.quotedColumnParser.parse(scanner);
        }
        return this.nonQuotedColumnParser.parse(scanner);
    }
}
exports.ColumnParser = ColumnParser;
//# sourceMappingURL=ColumnParser.js.map