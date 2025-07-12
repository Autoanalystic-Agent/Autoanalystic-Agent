import ts from "typescript";
import { MetadataFactory } from "../../factories/MetadataFactory";
import { Metadata } from "../../schemas/metadata/Metadata";
import { IProgrammerProps } from "../../transformers/IProgrammerProps";
import { ITypiaContext } from "../../transformers/ITypiaContext";
import { FeatureProgrammer } from "../FeatureProgrammer";
import { FunctionProgrammer } from "../helpers/FunctionProgrammer";
export declare namespace HttpFormDataProgrammer {
    const decompose: (props: {
        context: ITypiaContext;
        functor: FunctionProgrammer;
        type: ts.Type;
        name: string | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (props: IProgrammerProps) => ts.CallExpression;
    const validate: (meta: Metadata, explore: MetadataFactory.IExplore) => string[];
}
