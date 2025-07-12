import ts from "typescript";
import { ITransformProps } from "../../ITransformProps";
export declare namespace LlmSchemaTransformer {
    const transform: (props: Omit<ITransformProps, "modulo">) => ts.Expression;
}
