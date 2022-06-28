/// <reference types="node" />
import { ParserOptionsArgs } from './ParserOptions';
import { CsvParserStream } from './CsvParserStream';
import { Row } from './types';
export * from './types';
export { CsvParserStream } from './CsvParserStream';
export { ParserOptions, ParserOptionsArgs } from './ParserOptions';
export declare const parse: <I extends Row<any>, O extends Row<any>>(args?: ParserOptionsArgs | undefined) => CsvParserStream<I, O>;
export declare const parseStream: <I extends Row<any>, O extends Row<any>>(stream: NodeJS.ReadableStream, options?: ParserOptionsArgs | undefined) => CsvParserStream<I, O>;
export declare const parseFile: <I extends Row<any>, O extends Row<any>>(location: string, options?: ParserOptionsArgs) => CsvParserStream<I, O>;
export declare const parseString: <I extends Row<any>, O extends Row<any>>(string: string, options?: ParserOptionsArgs | undefined) => CsvParserStream<I, O>;
