import type { Input, InternalOptions, Options } from '../types/options.js';
import { ResponsePromise } from '../types/response.js';
export declare class Ky {
    static create(input: Input, options: Options): ResponsePromise;
    request: Request;
    protected abortController?: AbortController;
    protected _retryCount: number;
    protected _input: Input;
    protected _options: InternalOptions;
    constructor(input: Input, options?: Options);
    protected _calculateRetryDelay(error: unknown): number;
    protected _decorateResponse(response: Response): Response;
    protected _retry<T extends (...args: any) => Promise<any>>(fn: T): Promise<ReturnType<T> | void>;
    protected _fetch(): Promise<Response>;
    protected _stream(response: Response, onDownloadProgress: Options['onDownloadProgress']): Response;
}
