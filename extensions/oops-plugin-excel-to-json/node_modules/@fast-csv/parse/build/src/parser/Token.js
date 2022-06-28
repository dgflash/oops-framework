"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
class Token {
    constructor(tokenArgs) {
        this.token = tokenArgs.token;
        this.startCursor = tokenArgs.startCursor;
        this.endCursor = tokenArgs.endCursor;
    }
    static isTokenRowDelimiter(token) {
        const content = token.token;
        return content === '\r' || content === '\n' || content === '\r\n';
    }
    static isTokenCarriageReturn(token, parserOptions) {
        return token.token === parserOptions.carriageReturn;
    }
    static isTokenComment(token, parserOptions) {
        return parserOptions.supportsComments && !!token && token.token === parserOptions.comment;
    }
    static isTokenEscapeCharacter(token, parserOptions) {
        return token.token === parserOptions.escapeChar;
    }
    static isTokenQuote(token, parserOptions) {
        return token.token === parserOptions.quote;
    }
    static isTokenDelimiter(token, parserOptions) {
        return token.token === parserOptions.delimiter;
    }
}
exports.Token = Token;
//# sourceMappingURL=Token.js.map