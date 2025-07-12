import { ITransformProps } from "../../ITransformProps";
export declare namespace NotationCreateIsGeneralTransformer {
    const transform: (rename: (str: string) => string) => (props: ITransformProps) => import("typescript").Expression | import("typescript").ArrowFunction;
}
