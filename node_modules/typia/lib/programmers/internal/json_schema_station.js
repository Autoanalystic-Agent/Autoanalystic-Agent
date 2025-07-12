"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_schema_station = void 0;
const MetadataAtomic_1 = require("../../schemas/metadata/MetadataAtomic");
const MetadataNative_1 = require("../../schemas/metadata/MetadataNative");
const OpenApiExclusiveEmender_1 = require("@samchon/openapi/lib/utils/OpenApiExclusiveEmender");
const AtomicPredicator_1 = require("../helpers/AtomicPredicator");
const json_schema_alias_1 = require("./json_schema_alias");
const json_schema_array_1 = require("./json_schema_array");
const json_schema_bigint_1 = require("./json_schema_bigint");
const json_schema_boolean_1 = require("./json_schema_boolean");
const json_schema_constant_1 = require("./json_schema_constant");
const json_schema_discriminator_1 = require("./json_schema_discriminator");
const json_schema_escaped_1 = require("./json_schema_escaped");
const json_schema_native_1 = require("./json_schema_native");
const json_schema_number_1 = require("./json_schema_number");
const json_schema_object_1 = require("./json_schema_object");
const json_schema_string_1 = require("./json_schema_string");
const json_schema_template_1 = require("./json_schema_template");
const json_schema_tuple_1 = require("./json_schema_tuple");
const json_schema_station = (props) => {
    var _a, _b, _c;
    if (props.metadata.any === true)
        return Object.assign(Object.assign({}, props.attribute), { type: undefined });
    //----
    // GATHER UNION SCHEMAS
    //----
    const union = [];
    const insert = (schema) => union.push(schema);
    // NULLABLE
    if (props.metadata.nullable === true)
        insert({
            type: "null",
        });
    // toJSON() METHOD
    if (props.metadata.escaped !== null)
        (0, json_schema_escaped_1.json_schema_escaped)({
            components: props.components,
            escaped: props.metadata.escaped,
        }).forEach(insert);
    // ATOMIC TYPES
    if (props.metadata.templates.length &&
        AtomicPredicator_1.AtomicPredicator.template(props.metadata))
        (0, json_schema_template_1.json_schema_templates)(props.metadata).forEach(insert);
    for (const constant of props.metadata.constants)
        if (AtomicPredicator_1.AtomicPredicator.constant({
            metadata: props.metadata,
            name: constant.type,
        }) === false)
            continue;
        else
            (0, json_schema_constant_1.json_schema_constant)(constant).forEach(insert);
    for (const a of props.metadata.atomics)
        if (a.type === "boolean")
            (0, json_schema_boolean_1.json_schema_boolean)(a).forEach(insert);
        else if (a.type === "bigint")
            (0, json_schema_bigint_1.json_schema_bigint)(a).forEach(insert);
        else if (a.type === "number")
            (0, json_schema_number_1.json_schema_number)(a).map(OpenApiExclusiveEmender_1.OpenApiExclusiveEmender.emend).forEach(insert);
        else if (a.type === "string")
            (0, json_schema_string_1.json_schema_string)(a).forEach(insert);
    // ARRAY
    for (const array of props.metadata.arrays)
        (0, json_schema_array_1.json_schema_array)({
            components: props.components,
            array,
        }).forEach(insert);
    // TUPLE
    for (const tuple of props.metadata.tuples)
        insert((0, json_schema_tuple_1.json_schema_tuple)({
            components: props.components,
            tuple,
        }));
    // NATIVES
    for (const native of props.metadata.natives)
        if (AtomicPredicator_1.AtomicPredicator.native(native.name)) {
            const type = native.name.toLowerCase();
            if (props.metadata.atomics.some((a) => a.type === type))
                continue;
            else if (type === "boolean")
                (0, json_schema_boolean_1.json_schema_boolean)(MetadataAtomic_1.MetadataAtomic.create({
                    type: "boolean",
                    tags: [],
                })).map(insert);
            else if (type === "bigint")
                (0, json_schema_bigint_1.json_schema_bigint)(MetadataAtomic_1.MetadataAtomic.create({
                    type: "bigint",
                    tags: [],
                })).map(insert);
            else if (type === "number")
                (0, json_schema_number_1.json_schema_number)(MetadataAtomic_1.MetadataAtomic.create({
                    type: "number",
                    tags: [],
                })).map(insert);
            else if (type === "string")
                (0, json_schema_string_1.json_schema_string)(MetadataAtomic_1.MetadataAtomic.create({
                    type: "string",
                    tags: [],
                })).map(insert);
        }
        else
            (0, json_schema_native_1.json_schema_native)({
                components: props.components,
                native,
            }).forEach(insert);
    if (props.metadata.sets.length)
        (0, json_schema_native_1.json_schema_native)({
            native: MetadataNative_1.MetadataNative.create({
                name: "Set",
                tags: [],
            }),
            components: props.components,
        }).forEach(insert);
    if (props.metadata.maps.length)
        (0, json_schema_native_1.json_schema_native)({
            native: MetadataNative_1.MetadataNative.create({
                name: "Map",
                tags: [],
            }),
            components: props.components,
        }).forEach(insert);
    // OBJECT
    for (const object of props.metadata.objects)
        (0, json_schema_object_1.json_schema_object)({
            components: props.components,
            object,
        }).forEach(insert);
    // ALIASES
    for (const alias of props.metadata.aliases)
        (0, json_schema_alias_1.json_schema_alias)({
            alias,
            blockNever: props.blockNever,
            components: props.components,
        }).forEach(insert);
    //----
    // RETURNS
    //----
    if (union.length === 0 && props.blockNever === true)
        return null;
    const schema = union.length === 0
        ? { type: undefined }
        : union.length === 1
            ? union[0]
            : {
                oneOf: union,
                discriminator: (0, json_schema_discriminator_1.json_schema_discriminator)(props.metadata),
            };
    return Object.assign(Object.assign(Object.assign({}, schema), props.attribute), { title: (_a = props.attribute.title) !== null && _a !== void 0 ? _a : schema.title, description: (_b = props.attribute.description) !== null && _b !== void 0 ? _b : schema.description, deprecated: (_c = props.attribute.deprecated) !== null && _c !== void 0 ? _c : schema.deprecated });
};
exports.json_schema_station = json_schema_station;
//# sourceMappingURL=json_schema_station.js.map