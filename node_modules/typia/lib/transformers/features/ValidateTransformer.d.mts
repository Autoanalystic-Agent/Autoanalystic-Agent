import { ValidateProgrammer } from "../../programmers/ValidateProgrammer";
import { ITransformProps } from "../ITransformProps";
export declare namespace ValidateTransformer {
    const transform: (config: ValidateProgrammer.IConfig) => (props: ITransformProps) => import("typescript").CallExpression;
}
