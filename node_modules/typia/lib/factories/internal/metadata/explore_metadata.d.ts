import ts from "typescript";
import { Metadata } from "../../../schemas/metadata/Metadata";
import { IMetadataIteratorProps } from "./IMetadataIteratorProps";
export declare const explore_metadata: (props: Required<IProps>) => Metadata;
interface IProps extends Omit<IMetadataIteratorProps, "metadata" | "type"> {
    type: ts.Type | null;
}
export {};
