import { ParserOptions } from '../../ParserOptions';
import { Scanner } from '../Scanner';
export declare class NonQuotedColumnParser {
    private readonly parserOptions;
    private readonly columnFormatter;
    constructor(parserOptions: ParserOptions);
    parse(scanner: Scanner): string | null;
}
