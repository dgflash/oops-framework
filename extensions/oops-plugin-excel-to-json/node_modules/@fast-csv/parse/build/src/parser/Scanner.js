"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const Token_1 = require("./Token");
const ROW_DELIMITER = /((?:\r\n)|\n|\r)/;
class Scanner {
    constructor(args) {
        this.cursor = 0;
        this.line = args.line;
        this.lineLength = this.line.length;
        this.parserOptions = args.parserOptions;
        this.hasMoreData = args.hasMoreData;
        this.cursor = args.cursor || 0;
    }
    get hasMoreCharacters() {
        return this.lineLength > this.cursor;
    }
    get nextNonSpaceToken() {
        const { lineFromCursor } = this;
        const regex = this.parserOptions.NEXT_TOKEN_REGEXP;
        if (lineFromCursor.search(regex) === -1) {
            return null;
        }
        const match = regex.exec(lineFromCursor);
        if (match == null) {
            return null;
        }
        const token = match[1];
        const startCursor = this.cursor + (match.index || 0);
        return new Token_1.Token({
            token,
            startCursor,
            endCursor: startCursor + token.length - 1,
        });
    }
    get nextCharacterToken() {
        const { cursor, lineLength } = this;
        if (lineLength <= cursor) {
            return null;
        }
        return new Token_1.Token({
            token: this.line[cursor],
            startCursor: cursor,
            endCursor: cursor,
        });
    }
    get lineFromCursor() {
        return this.line.substr(this.cursor);
    }
    advancePastLine() {
        const match = ROW_DELIMITER.exec(this.lineFromCursor);
        if (!match) {
            if (this.hasMoreData) {
                return null;
            }
            this.cursor = this.lineLength;
            return this;
        }
        this.cursor += (match.index || 0) + match[0].length;
        return this;
    }
    advanceTo(cursor) {
        this.cursor = cursor;
        return this;
    }
    advanceToToken(token) {
        this.cursor = token.startCursor;
        return this;
    }
    advancePastToken(token) {
        this.cursor = token.endCursor + 1;
        return this;
    }
    truncateToCursor() {
        this.line = this.lineFromCursor;
        this.lineLength = this.line.length;
        this.cursor = 0;
        return this;
    }
}
exports.Scanner = Scanner;
//# sourceMappingURL=Scanner.js.map