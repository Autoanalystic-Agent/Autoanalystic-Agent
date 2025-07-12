import ts from "typescript";
import { MetadataArrayType } from "../../../schemas/metadata/MetadataArrayType";
import { IMetadataIteratorProps } from "./IMetadataIteratorProps";
interface IProps extends IMetadataIteratorProps {
    array: ts.Type;
}
export declare const emplace_metadata_array_type: (props: IProps) => MetadataArrayType;
export {};
