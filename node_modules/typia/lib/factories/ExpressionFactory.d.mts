import ts from "typescript";
import { ImportProgrammer } from "../programmers/ImportProgrammer";
export declare namespace ExpressionFactory {
    const number: (value: number) => ts.PrefixUnaryExpression | ts.NumericLiteral;
    const bigint: (value: number | bigint) => ts.CallExpression;
    const isRequired: (input: ts.Expression) => ts.Expression;
    const isArray: (input: ts.Expression) => ts.Expression;
    const isObject: (props: {
        checkNull: boolean;
        checkArray: boolean;
        input: ts.Expression;
    }) => ts.Expression;
    const isInstanceOf: (type: string, input: ts.Expression) => ts.Expression;
    const coalesce: (x: ts.Expression, y: ts.Expression) => ts.Expression;
    const currying: (props: {
        function: ts.Expression;
        arguments: ts.Expression[];
    }) => ts.CallExpression;
    const selfCall: (body: ts.ConciseBody, type?: ts.TypeNode | undefined) => ts.CallExpression;
    const getEscapedText: (props: {
        printer: ts.Printer;
        input: ts.Expression;
    }) => string;
    const transpile: (props: {
        transformer?: ts.TransformationContext;
        importer?: ImportProgrammer;
        script: string;
    }) => (input: ts.Expression) => ts.Expression;
}
