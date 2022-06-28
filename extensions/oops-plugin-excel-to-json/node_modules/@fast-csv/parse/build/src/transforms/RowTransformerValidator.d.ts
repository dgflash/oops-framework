import { Row, RowTransformFunction, RowValidatorCallback, RowValidate } from '../types';
export declare class RowTransformerValidator<I extends Row, O extends Row> {
    private static createTransform;
    private static createValidator;
    private _rowTransform;
    private _rowValidator;
    set rowTransform(transformFunction: RowTransformFunction<I, O>);
    set rowValidator(validateFunction: RowValidate<O>);
    transformAndValidate(row: I, cb: RowValidatorCallback<O>): void;
    private callTransformer;
    private callValidator;
}
