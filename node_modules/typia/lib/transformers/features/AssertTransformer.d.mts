import { AssertProgrammer } from "../../programmers/AssertProgrammer";
import { ITransformProps } from "../ITransformProps";
export declare namespace AssertTransformer {
    const transform: (config: AssertProgrammer.IConfig) => (props: ITransformProps) => import("typescript").CallExpression;
}
