import { ITransformProps } from "../../ITransformProps";
export declare namespace NotationValidateGeneralTransformer {
    const transform: (rename: (str: string) => string) => (props: ITransformProps) => import("typescript").CallExpression;
}
