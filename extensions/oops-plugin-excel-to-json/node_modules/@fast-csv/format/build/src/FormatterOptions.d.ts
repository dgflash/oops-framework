import { Row, RowTransformFunction } from './types';
interface QuoteColumnMap {
    [s: string]: boolean;
}
declare type QuoteColumns = boolean | boolean[] | QuoteColumnMap;
export interface FormatterOptionsArgs<I extends Row, O extends Row> {
    objectMode?: boolean;
    delimiter?: string;
    rowDelimiter?: string;
    quote?: string | boolean;
    escape?: string;
    quoteColumns?: QuoteColumns;
    quoteHeaders?: QuoteColumns;
    headers?: null | boolean | string[];
    writeHeaders?: boolean;
    includeEndRowDelimiter?: boolean;
    writeBOM?: boolean;
    transform?: RowTransformFunction<I, O>;
    alwaysWriteHeaders?: boolean;
}
export declare class FormatterOptions<I extends Row, O extends Row> {
    readonly objectMode: boolean;
    readonly delimiter: string;
    readonly rowDelimiter: string;
    readonly quote: string;
    readonly escape: string;
    readonly quoteColumns: QuoteColumns;
    readonly quoteHeaders: QuoteColumns;
    readonly headers: null | string[];
    readonly includeEndRowDelimiter: boolean;
    readonly transform?: RowTransformFunction<I, O>;
    readonly shouldWriteHeaders: boolean;
    readonly writeBOM: boolean;
    readonly escapedQuote: string;
    readonly BOM: string;
    readonly alwaysWriteHeaders: boolean;
    constructor(opts?: FormatterOptionsArgs<I, O>);
}
export {};
