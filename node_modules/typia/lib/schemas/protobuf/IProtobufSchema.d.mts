import { MetadataArrayType } from "../metadata/MetadataArrayType";
import { MetadataMap } from "../metadata/MetadataMap";
import { MetadataObjectType } from "../metadata/MetadataObjectType";
export type IProtobufSchema = IProtobufSchema.IByte | IProtobufSchema.IBoolean | IProtobufSchema.IBigint | IProtobufSchema.INumber | IProtobufSchema.IString | IProtobufSchema.IArray | IProtobufSchema.IObject | IProtobufSchema.IMap;
export declare namespace IProtobufSchema {
    interface IByte {
        type: "bytes";
    }
    interface IBoolean {
        type: "bool";
    }
    interface IBigint {
        type: "bigint";
        name: "int64" | "uint64";
    }
    interface INumber {
        type: "number";
        name: "int32" | "int64" | "uint32" | "uint64" | "float" | "double";
    }
    interface IString {
        type: "string";
    }
    interface IArray {
        type: "array";
        array: MetadataArrayType;
        value: Exclude<IProtobufSchema, IArray | IMap>;
    }
    interface IObject {
        type: "object";
        object: MetadataObjectType;
    }
    interface IMap {
        type: "map";
        map: MetadataMap | MetadataObjectType;
        key: IProtobufSchema.IBoolean | IProtobufSchema.INumber | IProtobufSchema.IString;
        value: Exclude<IProtobufSchema, IArray | IMap>;
    }
}
