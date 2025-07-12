import ts from "typescript";
import { ITransformOptions } from "./transformers/ITransformOptions";
import { ITypiaContext } from "./transformers/ITypiaContext";
export declare const transform: (program: ts.Program, options: ITransformOptions | undefined, extras: ITypiaContext["extras"]) => ts.TransformerFactory<ts.SourceFile>;
export default transform;
