import { IProtobufSchema } from "./IProtobufSchema";
export type IProtobufPropertyType = IProtobufPropertyType.IByte | IProtobufPropertyType.IBoolean | IProtobufPropertyType.IBigint | IProtobufPropertyType.INumber | IProtobufPropertyType.IString | IProtobufPropertyType.IArray | IProtobufPropertyType.IObject | IProtobufPropertyType.IMap;
export declare namespace IProtobufPropertyType {
    interface IByte extends IProtobufSchema.IByte {
        index: number;
    }
    interface IBoolean extends IProtobufSchema.IBoolean {
        index: number;
    }
    interface IBigint extends IProtobufSchema.IBigint {
        index: number;
    }
    interface INumber extends IProtobufSchema.INumber {
        index: number;
    }
    interface IString extends IProtobufSchema.IString {
        index: number;
    }
    interface IArray extends IProtobufSchema.IArray {
        index: number;
    }
    interface IObject extends IProtobufSchema.IObject {
        index: number;
    }
    interface IMap extends IProtobufSchema.IMap {
        index: number;
    }
}
