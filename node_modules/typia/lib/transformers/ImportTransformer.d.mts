import ts from "typescript";
export declare namespace ImportTransformer {
    const transform: (props: {
        from: string;
        to: string;
    }) => (context: ts.TransformationContext) => (file: ts.SourceFile) => ts.SourceFile;
}
