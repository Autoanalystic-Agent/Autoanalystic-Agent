import ts from "typescript";
import { Metadata } from "../schemas/metadata/Metadata";
import { MetadataCollection } from "./MetadataCollection";
import { MetadataFactory } from "./MetadataFactory";
export declare namespace JsonMetadataFactory {
    interface IProps {
        method: string;
        checker: ts.TypeChecker;
        transformer?: ts.TransformationContext;
        type: ts.Type;
        validate?: MetadataFactory.Validator;
    }
    interface IOutput {
        collection: MetadataCollection;
        metadata: Metadata;
    }
    const analyze: (props: IProps) => IOutput;
    const validate: (meta: Metadata) => string[];
}
