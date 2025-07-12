import { ITransformProps } from "../../ITransformProps";
export declare namespace NotationIsGeneralTransformer {
    const transform: (rename: (str: string) => string) => (props: ITransformProps) => import("typescript").CallExpression;
}
