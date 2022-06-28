/// <reference types="node" />
import { Transform, TransformCallback } from 'stream';
import { ParserOptions } from './ParserOptions';
import { Row, RowTransformFunction, RowValidate } from './types';
export declare class CsvParserStream<I extends Row, O extends Row> extends Transform {
    private readonly parserOptions;
    private readonly decoder;
    private readonly parser;
    private readonly headerTransformer;
    private readonly rowTransformerValidator;
    private lines;
    private rowCount;
    private parsedRowCount;
    private parsedLineCount;
    private endEmitted;
    private headersEmitted;
    constructor(parserOptions: ParserOptions);
    private get hasHitRowLimit();
    private get shouldEmitRows();
    private get shouldSkipLine();
    transform(transformFunction: RowTransformFunction<I, O>): CsvParserStream<I, O>;
    validate(validateFunction: RowValidate<O>): CsvParserStream<I, O>;
    emit(event: string | symbol, ...rest: any[]): boolean;
    _transform(data: Buffer, encoding: string, done: TransformCallback): void;
    _flush(done: TransformCallback): void;
    private parse;
    private processRows;
    private transformRow;
    private checkAndEmitHeaders;
    private skipRow;
    private pushRow;
    private static wrapDoneCallback;
}
