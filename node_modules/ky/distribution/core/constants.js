export const supportsAbortController = typeof globalThis.AbortController === 'function';
export const supportsStreams = typeof globalThis.ReadableStream === 'function';
export const supportsFormData = typeof globalThis.FormData === 'function';
export const requestMethods = ['get', 'post', 'put', 'patch', 'head', 'delete'];
const validate = () => undefined;
validate();
export const responseTypes = {
    json: 'application/json',
    text: 'text/*',
    formData: 'multipart/form-data',
    arrayBuffer: '*/*',
    blob: '*/*',
};
// The maximum value of a 32bit int (see issue #117)
export const maxSafeTimeout = 2147483647;
export const stop = Symbol('stop');
//# sourceMappingURL=constants.js.map