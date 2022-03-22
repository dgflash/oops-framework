export declare type TimeoutOptions = {
    timeout: number;
    fetch: typeof fetch;
};
export declare const timeout: (request: Request, abortController: AbortController | undefined, options: TimeoutOptions) => Promise<Response>;
export declare const delay: (ms: number) => Promise<unknown>;
