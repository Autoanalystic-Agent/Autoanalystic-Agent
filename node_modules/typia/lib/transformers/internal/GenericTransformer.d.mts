import ts from "typescript";
import { IProgrammerProps } from "../IProgrammerProps";
import { ITransformProps } from "../ITransformProps";
export declare namespace GenericTransformer {
    interface IProps extends ITransformProps {
        method: string;
        write: (props: IProgrammerProps) => ts.Expression | ts.ArrowFunction;
    }
    const scalar: (props: IProps) => ts.CallExpression;
    const factory: (props: IProps) => ts.Expression | ts.ArrowFunction;
}
