export declare const supportsAbortController: boolean;
export declare const supportsStreams: boolean;
export declare const supportsFormData: boolean;
export declare const requestMethods: readonly ["get", "post", "put", "patch", "head", "delete"];
export declare const responseTypes: {
    readonly json: "application/json";
    readonly text: "text/*";
    readonly formData: "multipart/form-data";
    readonly arrayBuffer: "*/*";
    readonly blob: "*/*";
};
export declare const maxSafeTimeout = 2147483647;
export declare const stop: unique symbol;
