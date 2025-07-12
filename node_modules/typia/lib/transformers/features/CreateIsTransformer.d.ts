import { IsProgrammer } from "../../programmers/IsProgrammer";
import { ITransformProps } from "../ITransformProps";
export declare namespace CreateIsTransformer {
    const transform: (config: IsProgrammer.IConfig) => (props: ITransformProps) => import("typescript").Expression | import("typescript").ArrowFunction;
}
