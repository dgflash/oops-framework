import { FormatterOptions } from '../FormatterOptions';
import { Row, RowArray, RowTransformFunction } from '../types';
declare type RowFormatterCallback = (error: Error | null, data?: RowArray) => void;
export declare class RowFormatter<I extends Row, O extends Row> {
    private static isRowHashArray;
    private static isRowArray;
    private static gatherHeaders;
    private static createTransform;
    private readonly formatterOptions;
    private readonly fieldFormatter;
    private readonly shouldWriteHeaders;
    private _rowTransform?;
    private headers;
    private hasWrittenHeaders;
    private rowCount;
    constructor(formatterOptions: FormatterOptions<I, O>);
    set rowTransform(transformFunction: RowTransformFunction<I, O>);
    format(row: I, cb: RowFormatterCallback): void;
    finish(cb: RowFormatterCallback): void;
    private checkHeaders;
    private gatherColumns;
    private callTransformer;
    private formatColumns;
}
export {};
