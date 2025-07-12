import ts from "typescript";
import { ITypiaContext } from "../../transformers/ITypiaContext";
import { IExpressionEntry } from "./IExpressionEntry";
export declare namespace StringifyJoiner {
    const object: (props: {
        context: ITypiaContext;
        entries: IExpressionEntry<ts.Expression>[];
    }) => ts.Expression;
    const array: (props: {
        input: ts.Expression;
        arrow: ts.ArrowFunction;
    }) => ts.Expression;
    const tuple: (props: {
        elements: ts.Expression[];
        rest: ts.Expression | null;
    }) => ts.Expression;
}
