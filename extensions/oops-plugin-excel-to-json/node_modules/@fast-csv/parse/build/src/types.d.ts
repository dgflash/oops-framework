export declare type RowMap<V = any> = Record<string, V>;
export declare type RowArray<V = any> = V[];
export declare type Row<V = any> = RowMap<V> | RowArray<V>;
export interface RowValidationResult<R extends Row> {
    row: R | null;
    isValid: boolean;
    reason?: string;
}
export declare type RowValidatorCallback<R extends Row> = (error: Error | null, result?: RowValidationResult<R>) => void;
export declare type RowTransformCallback<R extends Row> = (error?: Error | null, row?: R) => void;
export declare type SyncRowTransform<I extends Row, O extends Row> = (row: I) => O;
export declare type AsyncRowTransform<I extends Row, O extends Row> = (row: I, cb: RowTransformCallback<O>) => void;
export declare type RowTransformFunction<I extends Row, O extends Row> = SyncRowTransform<I, O> | AsyncRowTransform<I, O>;
export declare const isSyncTransform: <I extends Row<any>, O extends Row<any>>(transform: RowTransformFunction<I, O>) => transform is SyncRowTransform<I, O>;
export declare type RowValidateCallback = (error?: Error | null, isValid?: boolean, reason?: string) => void;
export declare type SyncRowValidate<R extends Row> = (row: R) => boolean;
export declare type AsyncRowValidate<R extends Row> = (row: R, cb: RowValidateCallback) => void;
export declare type RowValidate<R extends Row> = AsyncRowValidate<R> | SyncRowValidate<R>;
export declare const isSyncValidate: <R extends Row<any>>(validate: RowValidate<R>) => validate is SyncRowValidate<R>;
export declare type HeaderArray = (string | undefined | null)[];
export declare type HeaderTransformFunction = (headers: HeaderArray) => HeaderArray;
