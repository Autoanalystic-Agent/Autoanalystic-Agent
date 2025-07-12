import ts from "typescript";
import { IExpressionEntry } from "./IExpressionEntry";
export declare namespace NotationJoiner {
    const object: (props: {
        rename: (str: string) => string;
        input: ts.Expression;
        entries: IExpressionEntry<ts.Expression>[];
    }) => ts.ConciseBody;
    const tuple: (props: {
        elements: ts.Expression[];
        rest: ts.Expression | null;
    }) => ts.Expression;
    const array: (props: {
        input: ts.Expression;
        arrow: ts.Expression;
    }) => ts.CallExpression;
}
