import { ValidateProgrammer } from "../../programmers/ValidateProgrammer";
import { ITransformProps } from "../ITransformProps";
export declare namespace CreateValidateTransformer {
    const transform: (config: ValidateProgrammer.IConfig) => (props: ITransformProps) => import("typescript").Expression | import("typescript").ArrowFunction;
}
