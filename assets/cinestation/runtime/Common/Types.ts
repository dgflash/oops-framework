export type Nullable<T> = T | null;
export type DataArray = number[] | ArrayBuffer | ArrayBufferView;
export type Constructor<T> = { new(...args: any[]): T; }
export type Table<T = any> = { [k: string]: T }