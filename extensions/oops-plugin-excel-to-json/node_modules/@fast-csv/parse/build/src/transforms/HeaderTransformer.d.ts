import { ParserOptions } from '../ParserOptions';
import { HeaderArray, Row, RowArray, RowValidatorCallback } from '../types';
export declare class HeaderTransformer<O extends Row> {
    private readonly parserOptions;
    headers: HeaderArray | null;
    private receivedHeaders;
    private readonly shouldUseFirstRow;
    private processedFirstRow;
    private headersLength;
    private readonly headersTransform?;
    constructor(parserOptions: ParserOptions);
    transform(row: RowArray, cb: RowValidatorCallback<O>): void;
    private shouldMapRow;
    private processRow;
    private mapHeaders;
    private setHeaders;
}
