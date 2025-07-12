import ts from "typescript";
import { Metadata } from "../schemas/metadata/Metadata";
import { MetadataAliasType } from "../schemas/metadata/MetadataAliasType";
import { MetadataArrayType } from "../schemas/metadata/MetadataArrayType";
import { MetadataObjectType } from "../schemas/metadata/MetadataObjectType";
import { MetadataTupleType } from "../schemas/metadata/MetadataTupleType";
import { ValidationPipe } from "../typings/ValidationPipe";
import { MetadataCollection } from "./MetadataCollection";
export declare namespace MetadataFactory {
    type Validator = (meta: Metadata, explore: IExplore) => string[];
    interface IProps {
        checker: ts.TypeChecker;
        transformer: ts.TransformationContext | undefined;
        options: IOptions;
        collection: MetadataCollection;
        type: ts.Type | null;
    }
    interface IOptions {
        escape: boolean;
        constant: boolean;
        absorb: boolean;
        functional?: boolean;
        validate?: Validator;
        onError?: (node: ts.Node | undefined, message: string) => void;
    }
    interface IExplore {
        top: boolean;
        object: MetadataObjectType | null;
        property: string | object | null;
        nested: null | MetadataAliasType | MetadataArrayType | MetadataTupleType;
        parameter: string | null;
        output: boolean;
        escaped: boolean;
        aliased: boolean;
    }
    interface IError {
        name: string;
        explore: IExplore;
        messages: string[];
    }
    const analyze: (props: IProps) => ValidationPipe<Metadata, IError>;
    const validate: (props: {
        transformer?: ts.TransformationContext;
        options: IOptions;
        functor: Validator;
        metadata: Metadata;
    }) => IError[];
}
