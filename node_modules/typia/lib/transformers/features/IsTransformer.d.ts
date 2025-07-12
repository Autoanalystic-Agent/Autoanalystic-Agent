import { IsProgrammer } from "../../programmers/IsProgrammer";
import { ITransformProps } from "../ITransformProps";
export declare namespace IsTransformer {
    const transform: (config: IsProgrammer.IConfig) => (props: ITransformProps) => import("typescript").CallExpression;
}
