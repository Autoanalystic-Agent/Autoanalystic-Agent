import ts from "typescript";
import { MetadataFactory } from "../../factories/MetadataFactory";
import { Metadata } from "../../schemas/metadata/Metadata";
import { IProgrammerProps } from "../../transformers/IProgrammerProps";
import { ITypiaContext } from "../../transformers/ITypiaContext";
import { FeatureProgrammer } from "../FeatureProgrammer";
import { FunctionProgrammer } from "../helpers/FunctionProgrammer";
export declare namespace HttpQueryProgrammer {
    interface IProps extends IProgrammerProps {
        allowOptional?: boolean;
    }
    const decompose: (props: {
        context: ITypiaContext;
        functor: FunctionProgrammer;
        allowOptional: boolean;
        type: ts.Type;
        name: string | undefined;
    }) => FeatureProgrammer.IDecomposed;
    const write: (props: IProps) => ts.CallExpression;
    const validate: (meta: Metadata, explore: MetadataFactory.IExplore, allowOptional?: boolean) => string[];
}
