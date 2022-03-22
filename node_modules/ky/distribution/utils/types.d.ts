export declare type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
export declare type ObjectEntries<T> = T extends ArrayLike<infer U> ? Array<[string, U]> : Array<{
    [K in keyof T]: [K, T[K]];
}[keyof T]>;
