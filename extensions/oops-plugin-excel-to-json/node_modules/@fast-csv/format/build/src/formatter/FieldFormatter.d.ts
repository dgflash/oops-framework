import { FormatterOptions } from '../FormatterOptions';
import { Row } from '../types';
export declare class FieldFormatter<I extends Row, O extends Row> {
    private readonly formatterOptions;
    private _headers;
    private readonly REPLACE_REGEXP;
    private readonly ESCAPE_REGEXP;
    constructor(formatterOptions: FormatterOptions<I, O>);
    set headers(headers: string[]);
    private shouldQuote;
    format(field: string, fieldIndex: number, isHeader: boolean): string;
    private quoteField;
}
