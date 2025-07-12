import ts from "typescript";
export declare namespace FunctionalGeneralProgrammer {
    interface IProps {
        checker: ts.TypeChecker;
        declaration: ts.FunctionDeclaration | ts.SignatureDeclaration;
    }
    interface IOutput {
        type: ts.Type;
        async: boolean;
    }
    const getReturnType: (props: IProps) => IOutput;
}
