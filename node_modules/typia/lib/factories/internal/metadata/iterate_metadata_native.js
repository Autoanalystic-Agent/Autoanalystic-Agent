"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_native = void 0;
const MetadataNative_1 = require("../../../schemas/metadata/MetadataNative");
const ArrayUtil_1 = require("../../../utils/ArrayUtil");
const TypeFactory_1 = require("../../TypeFactory");
const iterate_metadata_native = (props) => {
    const name = getNativeName(TypeFactory_1.TypeFactory.getFullName({
        checker: props.checker,
        type: props.type,
        symbol: props.type.getSymbol(),
    }));
    const simple = SIMPLES.get(name);
    if (simple !== undefined &&
        validate({
            checker: props.checker,
            type: props.type,
            info: simple,
        })) {
        ArrayUtil_1.ArrayUtil.take(props.metadata.natives, (native) => native.name === name, () => MetadataNative_1.MetadataNative.create({
            name,
            tags: [],
        }));
        return true;
    }
    for (const generic of GENERICS)
        if (name.substring(0, generic.name.length) === generic.name &&
            validate({
                checker: props.checker,
                type: props.type,
                info: generic,
            })) {
            ArrayUtil_1.ArrayUtil.take(props.metadata.natives, (native) => native.name === name, () => {
                var _a;
                return MetadataNative_1.MetadataNative.create({
                    name: (_a = generic.name) !== null && _a !== void 0 ? _a : name,
                    tags: [],
                });
            });
            return true;
        }
    return false;
};
exports.iterate_metadata_native = iterate_metadata_native;
const validate = (props) => {
    var _a, _b;
    return ((_a = props.info.methods) !== null && _a !== void 0 ? _a : []).every((method) => {
        var _a;
        const returnType = TypeFactory_1.TypeFactory.getReturnTypeOfClassMethod({
            checker: props.checker,
            class: props.type,
            function: method.name,
        });
        return (returnType !== null &&
            ((_a = props.checker.typeToString(returnType).split("<")) === null || _a === void 0 ? void 0 : _a[0]) === method.return);
    }) &&
        ((_b = props.info.properties) !== null && _b !== void 0 ? _b : []).every((property) => {
            var _a;
            const prop = props.checker.getPropertyOfType(props.type, property.name);
            const propType = (prop === null || prop === void 0 ? void 0 : prop.valueDeclaration)
                ? props.checker.getTypeAtLocation(prop === null || prop === void 0 ? void 0 : prop.valueDeclaration)
                : undefined;
            return (propType !== undefined &&
                ((_a = props.checker.typeToString(propType).split("<")) === null || _a === void 0 ? void 0 : _a[0]) === property.type);
        });
};
const getBinaryProps = (className) => ({
    name: className,
    methods: [
        ...["indexOf", "lastIndexOf"].map((name) => ({
            name,
            return: "number",
        })),
        ...["some", "every"].map((name) => ({
            name,
            return: "boolean",
        })),
        ...["join", "toLocaleString"].map((name) => ({
            name,
            return: "string",
        })),
        ...["reverse", "slice", "subarray"].map((name) => ({
            name,
            return: className,
        })),
    ],
    properties: ["BYTES_PER_ELEMENT", "length", "byteLength", "byteOffset"].map((name) => ({
        name,
        type: "number",
    })),
});
const getNativeName = (name) => {
    var _a, _b;
    name = (_b = (_a = name.split("<")) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "";
    if (name.startsWith('"') && name.slice(0).includes('".'))
        name = name.slice(name.indexOf('".', 1) + 2);
    return name;
};
const SIMPLES = new Map([
    [
        "Date",
        {
            methods: ["getTime", "getFullYear", "getMonth", "getMinutes"].map((name) => ({
                name,
                return: "number",
            })),
        },
    ],
    [
        "Boolean",
        {
            methods: [
                {
                    name: "valueOf",
                    return: "boolean",
                },
            ],
        },
    ],
    [
        "Number",
        {
            methods: [
                ...["toFixed", "toExponential", "toPrecision"].map((name) => ({
                    name,
                    return: "string",
                })),
                { name: "valueOf", return: "number" },
            ],
        },
    ],
    [
        "String",
        {
            methods: [
                "charAt",
                "concat",
                "valueOf",
                "trim",
                "replace",
                "substring",
            ].map((name) => ({ name, return: "string" })),
        },
    ],
    ...[
        "Uint8Array",
        "Uint8ClampedArray",
        "Uint16Array",
        "Uint32Array",
        "BigUint64Array",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "BigInt64Array",
        "Float32Array",
        "Float64Array",
    ].map((name) => [name, getBinaryProps(name)]),
    ...["ArrayBuffer", "SharedArrayBuffer"].map((className) => {
        const info = {
            methods: [{ name: "slice", return: className }],
            properties: [{ name: "byteLength", type: "number" }],
        };
        return [className, info];
    }),
    ...["Blob", "File"].map((className) => [
        className,
        {
            methods: [
                { name: "arrayBuffer", return: "Promise" },
                { name: "slice", return: "Blob" },
                { name: "text", return: "Promise" },
            ],
            properties: [
                { name: "size", type: "number" },
                { name: "type", type: "string" },
            ],
        },
    ]),
    [
        "DataView",
        {
            methods: [
                "getFloat32",
                "getFloat64",
                "getInt8",
                "getInt16",
                "getInt32",
                "getUint8",
                "getUint16",
                "getUint32",
            ].map((name) => ({
                name,
                return: "number",
            })),
        },
    ],
    [
        "RegExp",
        {
            methods: [
                {
                    name: "test",
                    return: "boolean",
                },
            ],
        },
    ],
]);
const GENERICS = [
    "WeakMap",
    "WeakSet",
].map((name) => ({
    name,
    methods: ["has", "delete"].map((name) => ({
        name,
        return: "boolean",
    })),
}));
//# sourceMappingURL=iterate_metadata_native.js.map