import { ITransformProps } from "../../ITransformProps";
export declare namespace NotationGeneralTransformer {
    const transform: (rename: (str: string) => string) => (props: ITransformProps) => import("typescript").CallExpression;
}
