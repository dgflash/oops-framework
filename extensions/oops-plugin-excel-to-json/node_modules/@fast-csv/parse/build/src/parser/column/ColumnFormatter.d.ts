import { ParserOptions } from '../../ParserOptions';
export declare class ColumnFormatter {
    readonly format: (col: string) => string;
    constructor(parserOptions: ParserOptions);
}
