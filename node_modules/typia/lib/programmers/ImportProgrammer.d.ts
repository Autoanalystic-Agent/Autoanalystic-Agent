import ts from "typescript";
export declare class ImportProgrammer {
    private readonly assets_;
    private readonly options_;
    constructor(options?: Partial<ImportProgrammer.IOptions>);
    default(props: ImportProgrammer.IDefault): ts.Identifier;
    instance(props: ImportProgrammer.IInstance): ts.Identifier;
    namespace(props: ImportProgrammer.INamespace): ts.Identifier;
    type(props: {
        file: string;
        name: string | ts.EntityName;
        arguments?: ts.TypeNode[];
    }): ts.ImportTypeNode;
    private alias;
    toStatements(): ts.ImportDeclaration[];
}
export declare namespace ImportProgrammer {
    interface IOptions {
        internalPrefix: string;
    }
    interface IDefault {
        file: string;
        name: string;
        type: boolean;
    }
    interface IInstance {
        file: string;
        name: string;
        alias: string | null;
    }
    interface INamespace {
        file: string;
        name: string;
    }
}
