"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_schema_array = void 0;
const json_schema_plugin_1 = require("./json_schema_plugin");
const json_schema_station_1 = require("./json_schema_station");
const json_schema_array = (props) => {
    var _a, _b, _c;
    var _d, _e, _f;
    const factory = () => (0, json_schema_plugin_1.json_schema_plugin)({
        schema: {
            type: "array",
            items: (0, json_schema_station_1.json_schema_station)({
                blockNever: false,
                components: props.components,
                metadata: props.array.type.value,
                attribute: {},
            }),
        },
        tags: props.array.tags,
    });
    if (props.array.type.recursive === true) {
        const out = () => [
            {
                $ref: `#/components/schemas/${props.array.type.name}`,
            },
        ];
        if (((_a = props.components.schemas) === null || _a === void 0 ? void 0 : _a[props.array.type.name]) !== undefined)
            return out();
        (_b = (_d = props.components).schemas) !== null && _b !== void 0 ? _b : (_d.schemas = {});
        (_c = (_e = props.components.schemas)[_f = props.array.type.name]) !== null && _c !== void 0 ? _c : (_e[_f] = {});
        const oneOf = factory();
        Object.assign(props.components.schemas[props.array.type.name], oneOf.length === 1 ? oneOf[0] : { oneOf });
        return out();
    }
    return factory();
};
exports.json_schema_array = json_schema_array;
//# sourceMappingURL=json_schema_array.js.map