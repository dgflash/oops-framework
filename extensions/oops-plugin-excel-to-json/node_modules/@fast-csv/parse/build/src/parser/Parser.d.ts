import { ParserOptions } from '../ParserOptions';
export interface ParseResult {
    line: string;
    rows: string[][];
}
export declare class Parser {
    private static removeBOM;
    private readonly parserOptions;
    private readonly rowParser;
    constructor(parserOptions: ParserOptions);
    parse(line: string, hasMoreData: boolean): ParseResult;
    private parseWithoutComments;
    private parseWithComments;
    private parseRow;
}
