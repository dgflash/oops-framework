/// <reference types="node" />
import * as fs from 'fs';
import { Row } from './types';
import { FormatterOptionsArgs } from './FormatterOptions';
import { CsvFormatterStream } from './CsvFormatterStream';
export * from './types';
export { CsvFormatterStream } from './CsvFormatterStream';
export { FormatterOptions, FormatterOptionsArgs } from './FormatterOptions';
export declare const format: <I extends Row, O extends Row>(options?: FormatterOptionsArgs<I, O> | undefined) => CsvFormatterStream<I, O>;
export declare const write: <I extends Row, O extends Row>(rows: I[], options?: FormatterOptionsArgs<I, O> | undefined) => CsvFormatterStream<I, O>;
export declare const writeToStream: <T extends NodeJS.WritableStream, I extends Row, O extends Row>(ws: T, rows: I[], options?: FormatterOptionsArgs<I, O> | undefined) => T;
export declare const writeToBuffer: <I extends Row, O extends Row>(rows: I[], opts?: FormatterOptionsArgs<I, O>) => Promise<Buffer>;
export declare const writeToString: <I extends Row, O extends Row>(rows: I[], options?: FormatterOptionsArgs<I, O> | undefined) => Promise<string>;
export declare const writeToPath: <I extends Row, O extends Row>(path: string, rows: I[], options?: FormatterOptionsArgs<I, O> | undefined) => fs.WriteStream;
