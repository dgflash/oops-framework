import { ParserOptions } from '../ParserOptions';
export declare type MaybeToken = Token | null;
export interface TokenArgs {
    token: string;
    startCursor: number;
    endCursor: number;
}
export declare class Token {
    static isTokenRowDelimiter(token: Token): boolean;
    static isTokenCarriageReturn(token: Token, parserOptions: ParserOptions): boolean;
    static isTokenComment(token: Token, parserOptions: ParserOptions): boolean;
    static isTokenEscapeCharacter(token: Token, parserOptions: ParserOptions): boolean;
    static isTokenQuote(token: Token, parserOptions: ParserOptions): boolean;
    static isTokenDelimiter(token: Token, parserOptions: ParserOptions): boolean;
    readonly token: string;
    readonly startCursor: number;
    readonly endCursor: number;
    constructor(tokenArgs: TokenArgs);
}
