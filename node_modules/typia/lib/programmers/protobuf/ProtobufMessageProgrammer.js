"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufMessageProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const MetadataCollection_1 = require("../../factories/MetadataCollection");
const ProtobufFactory_1 = require("../../factories/ProtobufFactory");
const MapUtil_1 = require("../../utils/MapUtil");
const ProtobufNameEncoder_1 = require("../../utils/ProtobufNameEncoder");
var ProtobufMessageProgrammer;
(function (ProtobufMessageProgrammer) {
    ProtobufMessageProgrammer.write = (props) => {
        // PARSE TARGET TYPE
        const collection = new MetadataCollection_1.MetadataCollection();
        ProtobufFactory_1.ProtobufFactory.metadata({
            method: "message",
            checker: props.context.checker,
            transformer: props.context.transformer,
            collection,
            type: props.type,
        });
        // STRINGIFY
        const hierarchies = new Map();
        for (const object of collection.objects())
            if (is_dynamic_object(object) === false)
                emplace({
                    hierarchies,
                    object,
                });
        const content = `syntax = "proto3";\n\n` +
            [...hierarchies.values()]
                .map((hier) => write_hierarchy(hier))
                .join("\n\n");
        // RETURNS
        return typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(typescript_1.default.factory.createArrayLiteralExpression(content.split("\n").map((str) => typescript_1.default.factory.createStringLiteral(str)), true), "join"), undefined, [typescript_1.default.factory.createStringLiteral("\n")]);
    };
    const emplace = (props) => {
        let hierarchies = props.hierarchies;
        const accessors = props.object.name.split(".");
        accessors.forEach((access, i) => {
            const hierarchy = MapUtil_1.MapUtil.take(hierarchies, access, () => ({
                key: access,
                object: null,
                children: new Map(),
            }));
            hierarchies = hierarchy.children;
            if (i === accessors.length - 1)
                hierarchy.object = props.object;
        });
    };
    const is_dynamic_object = (object) => object.properties.length === 1 &&
        object.properties[0].key.isSoleLiteral() === false;
    const write_hierarchy = (hierarchy) => {
        const elements = [
            `message ${ProtobufNameEncoder_1.ProtobufNameEncoder.encode(hierarchy.key)} {`,
        ];
        if (hierarchy.object !== null) {
            const text = write_object(hierarchy.object);
            elements.push(...text.split("\n").map((str) => `  ${str}`));
        }
        if (hierarchy.children.size)
            elements.push([...hierarchy.children.values()]
                .map((child) => write_hierarchy(child))
                .map((body) => body
                .split("\n")
                .map((line) => `  ${line}`)
                .join("\n"))
                .join("\n\n"));
        elements.push("}");
        return elements.join("\n");
    };
    const write_object = (obj) => {
        return obj.properties
            .map((p) => {
            if (p.of_protobuf_ === undefined)
                ProtobufFactory_1.ProtobufFactory.emplaceObject(obj);
            const schema = p.of_protobuf_;
            const key = p.key.getSoleLiteral();
            return decodeProperty({
                key,
                value: p.value,
                union: schema.union,
            });
        })
            .join("\n");
    };
    /* -----------------------------------------------------------
      DECODERS
    ----------------------------------------------------------- */
    const decodeProperty = (props) => {
        if (props.union.length === 1) {
            const top = props.union[0];
            return [
                ...(top.type === "array" || top.type === "map"
                    ? []
                    : [
                        props.value.isRequired() && props.value.nullable === false
                            ? "required"
                            : "optional",
                    ]),
                decodeSchema(top),
                props.key,
                "=",
                `${top.index};`,
            ].join(" ");
        }
        return [
            `oneof ${props.key} {`,
            ...props.union
                .map((type) => `${decodeSchema(type)} v${type.index} = ${type.index};`)
                .map((str) => str.split("\n"))
                .map((str) => `  ${str}`),
            `}`,
        ].join("\n");
    };
    const decodeSchema = (schema) => {
        if (schema.type === "bytes" ||
            schema.type === "bool" ||
            schema.type === "string")
            return schema.type;
        else if (schema.type === "bigint" || schema.type === "number")
            return schema.name;
        else if (schema.type === "array")
            return `repeated ${decodeSchema(schema.value)}`;
        else if (schema.type === "object")
            return ProtobufNameEncoder_1.ProtobufNameEncoder.encode(schema.object.name);
        // else if (schema.type === "map")
        return `map<${decodeSchema(schema.key)}, ${decodeSchema(schema.value)}>`;
    };
})(ProtobufMessageProgrammer || (exports.ProtobufMessageProgrammer = ProtobufMessageProgrammer = {}));
//# sourceMappingURL=ProtobufMessageProgrammer.js.map