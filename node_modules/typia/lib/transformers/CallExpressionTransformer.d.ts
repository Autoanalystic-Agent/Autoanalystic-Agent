import ts from "typescript";
import { ITypiaContext } from "./ITypiaContext";
export declare namespace CallExpressionTransformer {
    const transform: (props: {
        context: ITypiaContext;
        expression: ts.CallExpression;
    }) => ts.Expression | null;
}
