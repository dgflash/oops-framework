/*! MIT License © Sindre Sorhus */
import type { KyInstance } from './types/ky.js';
declare const ky: KyInstance;
export default ky;
export { Options, NormalizedOptions, RetryOptions, SearchParamsOption, DownloadProgress, } from './types/options.js';
export { Hooks, BeforeRequestHook, BeforeRetryHook, BeforeErrorHook, AfterResponseHook, } from './types/hooks.js';
export { ResponsePromise } from './types/response.js';
export { HTTPError } from './errors/HTTPError.js';
export { TimeoutError } from './errors/TimeoutError.js';
