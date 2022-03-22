export declare type Primitive = null | undefined | string | number | boolean | symbol | bigint;
export declare type Required<T, K extends keyof T = keyof T> = T & {
    [P in K]-?: T[P];
};
export declare type LiteralUnion<LiteralType extends BaseType, BaseType extends Primitive> = LiteralType | (BaseType & {
    _?: never;
});
