import ts from "typescript";
export declare class FunctionProgrammer {
    readonly method: string;
    private readonly local_;
    private readonly unions_;
    private readonly variables_;
    private sequence_;
    constructor(method: string);
    useLocal(name: string): string;
    hasLocal(name: string): boolean;
    declare(includeUnions?: boolean): ts.Statement[];
    declareUnions(): ts.Statement[];
    increment(): number;
    emplaceUnion(prefix: string, name: string, factory: () => ts.ArrowFunction): string;
    emplaceVariable(name: string, value: ts.Expression): ts.Expression;
}
