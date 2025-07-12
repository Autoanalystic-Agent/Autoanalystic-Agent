import ts from "typescript";
import { ITypiaContext } from "./ITypiaContext";
export declare namespace FileTransformer {
    const transform: (environments: Omit<ITypiaContext, "transformer" | "importer">) => (transformer: ts.TransformationContext) => (file: ts.SourceFile) => ts.SourceFile;
}
