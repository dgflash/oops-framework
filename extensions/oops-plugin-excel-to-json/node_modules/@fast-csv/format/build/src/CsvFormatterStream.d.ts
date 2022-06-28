/// <reference types="node" />
import { Transform, TransformCallback } from 'stream';
import { FormatterOptions } from './FormatterOptions';
import { Row, RowTransformFunction } from './types';
export declare class CsvFormatterStream<I extends Row, O extends Row> extends Transform {
    private formatterOptions;
    private rowFormatter;
    private hasWrittenBOM;
    constructor(formatterOptions: FormatterOptions<I, O>);
    transform(transformFunction: RowTransformFunction<I, O>): CsvFormatterStream<I, O>;
    _transform(row: I, encoding: string, cb: TransformCallback): void;
    _flush(cb: TransformCallback): void;
}
