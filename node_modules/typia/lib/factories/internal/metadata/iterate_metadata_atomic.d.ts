import ts from "typescript";
import { Metadata } from "../../../schemas/metadata/Metadata";
export declare const iterate_metadata_atomic: (props: {
    metadata: Metadata;
    type: ts.Type;
}) => boolean;
