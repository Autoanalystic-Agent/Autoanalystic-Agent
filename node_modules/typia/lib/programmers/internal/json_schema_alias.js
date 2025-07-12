"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_schema_alias = void 0;
const json_schema_description_1 = require("./json_schema_description");
const json_schema_object_1 = require("./json_schema_object");
const json_schema_station_1 = require("./json_schema_station");
const json_schema_title_1 = require("./json_schema_title");
const json_schema_alias = (props) => {
    var _a, _b;
    var _c;
    if (props.alias.type.value.size() === 1 &&
        props.alias.type.value.objects.length === 1)
        return (0, json_schema_object_1.json_schema_object)({
            components: props.components,
            object: props.alias.type.value.objects[0],
        });
    const $ref = `#/components/schemas/${props.alias.type.name}`;
    if (((_a = props.components.schemas) === null || _a === void 0 ? void 0 : _a[props.alias.type.name]) === undefined) {
        // TEMPORARY ASSIGNMENT
        (_b = (_c = props.components).schemas) !== null && _b !== void 0 ? _b : (_c.schemas = {});
        props.components.schemas[props.alias.type.name] = {};
        // GENERATE SCHEMA
        const schema = (0, json_schema_station_1.json_schema_station)({
            blockNever: props.blockNever,
            components: props.components,
            attribute: {
                deprecated: props.alias.type.jsDocTags.some((tag) => tag.name === "deprecated") ||
                    undefined,
                title: (0, json_schema_title_1.json_schema_title)(props.alias.type),
                description: (0, json_schema_description_1.json_schema_description)(props.alias.type),
            },
            metadata: props.alias.type.value,
        });
        if (schema !== null)
            Object.assign(props.components.schemas[props.alias.type.name], schema);
    }
    return [{ $ref }];
};
exports.json_schema_alias = json_schema_alias;
//# sourceMappingURL=json_schema_alias.js.map