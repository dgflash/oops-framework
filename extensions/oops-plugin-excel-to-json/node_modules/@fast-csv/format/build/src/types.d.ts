export declare type RowMap<V = any> = Record<string, V>;
export declare type RowHashArray<V = any> = [string, V][];
export declare type RowArray = string[];
export declare type Row = RowArray | RowHashArray | RowMap;
export declare type RowTransformCallback<R extends Row> = (error?: Error | null, row?: R) => void;
export declare type SyncRowTransform<I extends Row, O extends Row> = (row: I) => O;
export declare type AsyncRowTransform<I extends Row, O extends Row> = (row: I, cb: RowTransformCallback<O>) => void;
export declare type RowTransformFunction<I extends Row, O extends Row> = SyncRowTransform<I, O> | AsyncRowTransform<I, O>;
export declare const isSyncTransform: <I extends Row, O extends Row>(transform: RowTransformFunction<I, O>) => transform is SyncRowTransform<I, O>;
