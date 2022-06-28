/// <reference types="node" />
import { HeaderArray, HeaderTransformFunction } from './types';
export interface ParserOptionsArgs {
    objectMode?: boolean;
    delimiter?: string;
    quote?: string | null;
    escape?: string;
    headers?: boolean | HeaderTransformFunction | HeaderArray;
    renameHeaders?: boolean;
    ignoreEmpty?: boolean;
    comment?: string;
    strictColumnHandling?: boolean;
    discardUnmappedColumns?: boolean;
    trim?: boolean;
    ltrim?: boolean;
    rtrim?: boolean;
    encoding?: string;
    maxRows?: number;
    skipLines?: number;
    skipRows?: number;
}
export declare class ParserOptions {
    readonly escapedDelimiter: string;
    readonly objectMode: boolean;
    readonly delimiter: string;
    readonly ignoreEmpty: boolean;
    readonly quote: string | null;
    readonly escape: string | null;
    readonly escapeChar: string | null;
    readonly comment: string | null;
    readonly supportsComments: boolean;
    readonly ltrim: boolean;
    readonly rtrim: boolean;
    readonly trim: boolean;
    readonly headers: boolean | HeaderTransformFunction | HeaderArray | null;
    readonly renameHeaders: boolean;
    readonly strictColumnHandling: boolean;
    readonly discardUnmappedColumns: boolean;
    readonly carriageReturn: string;
    readonly NEXT_TOKEN_REGEXP: RegExp;
    readonly encoding: BufferEncoding;
    readonly limitRows: boolean;
    readonly maxRows: number;
    readonly skipLines: number;
    readonly skipRows: number;
    constructor(opts?: ParserOptionsArgs);
}
