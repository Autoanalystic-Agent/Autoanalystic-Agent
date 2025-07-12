import ts from "typescript";
import { MetadataFactory } from "../../factories/MetadataFactory";
import { Metadata } from "../../schemas/metadata/Metadata";
import { IProgrammerProps } from "../../transformers/IProgrammerProps";
import { ITypiaContext } from "../../transformers/ITypiaContext";
import { FeatureProgrammer } from "../FeatureProgrammer";
import { FunctionProgrammer } from "../helpers/FunctionProgrammer";
export declare namespace HttpHeadersProgrammer {
    const INPUT_TYPE = "Record<string, string | string[] | undefined>";
    const decompose: (props: {
        context: ITypiaContext;
        functor: FunctionProgrammer;
        type: ts.Type;
        name: string | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (props: IProgrammerProps) => ts.CallExpression;
    const validate: (metadata: Metadata, explore: MetadataFactory.IExplore) => string[];
}
