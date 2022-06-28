import { ParserOptions } from '../../ParserOptions';
import { NonQuotedColumnParser } from './NonQuotedColumnParser';
import { QuotedColumnParser } from './QuotedColumnParser';
import { Scanner } from '../Scanner';
export declare class ColumnParser {
    private readonly parserOptions;
    readonly nonQuotedColumnParser: NonQuotedColumnParser;
    readonly quotedColumnParser: QuotedColumnParser;
    constructor(parserOptions: ParserOptions);
    parse(scanner: Scanner): string | null;
}
