import ts from "typescript";
import { MetadataObjectType } from "../../schemas/metadata/MetadataObjectType";
import { IExpressionEntry } from "./IExpressionEntry";
export declare namespace PruneJoiner {
    const object: (props: {
        input: ts.Expression;
        entries: IExpressionEntry[];
        object: MetadataObjectType;
    }) => ts.ConciseBody;
    const array: (props: {
        input: ts.Expression;
        arrow: ts.ArrowFunction;
    }) => ts.CallExpression;
    const tuple: (props: {
        elements: ts.ConciseBody[];
        rest: ts.ConciseBody | null;
    }) => ts.Block;
}
