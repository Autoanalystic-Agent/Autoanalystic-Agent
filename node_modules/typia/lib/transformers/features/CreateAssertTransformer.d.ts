import { AssertProgrammer } from "../../programmers/AssertProgrammer";
import { ITransformProps } from "../ITransformProps";
export declare namespace CreateAssertTransformer {
    const transform: (config: AssertProgrammer.IConfig) => (props: ITransformProps) => import("typescript").Expression | import("typescript").ArrowFunction;
}
