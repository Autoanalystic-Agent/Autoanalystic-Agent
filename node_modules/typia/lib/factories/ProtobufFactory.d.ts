import ts from "typescript";
import { Metadata } from "../schemas/metadata/Metadata";
import { MetadataCollection } from "./MetadataCollection";
export declare namespace ProtobufFactory {
    interface IProps {
        method: string;
        checker: ts.TypeChecker;
        transformer?: ts.TransformationContext;
        collection: MetadataCollection;
        type: ts.Type;
    }
    const metadata: (props: IProps) => Metadata;
}
