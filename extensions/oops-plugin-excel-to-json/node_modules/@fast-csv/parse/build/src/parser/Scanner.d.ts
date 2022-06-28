import { ParserOptions } from '../ParserOptions';
import { MaybeToken, Token } from './Token';
export interface ScannerArgs {
    line: string;
    parserOptions: ParserOptions;
    hasMoreData: boolean;
    cursor?: number;
}
export declare class Scanner {
    line: string;
    private readonly parserOptions;
    lineLength: number;
    readonly hasMoreData: boolean;
    cursor: number;
    constructor(args: ScannerArgs);
    get hasMoreCharacters(): boolean;
    get nextNonSpaceToken(): MaybeToken;
    get nextCharacterToken(): MaybeToken;
    get lineFromCursor(): string;
    advancePastLine(): Scanner | null;
    advanceTo(cursor: number): Scanner;
    advanceToToken(token: Token): Scanner;
    advancePastToken(token: Token): Scanner;
    truncateToCursor(): Scanner;
}
