"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_schema_tuple = void 0;
const json_schema_station_1 = require("./json_schema_station");
const json_schema_tuple = (props) => {
    var _a, _b;
    const tail = (_b = (_a = props.tuple.type.elements.at(-1)) === null || _a === void 0 ? void 0 : _a.rest) !== null && _b !== void 0 ? _b : null;
    const prefixItems = props.tuple.type.isRest()
        ? props.tuple.type.elements.slice(0, -1)
        : props.tuple.type.elements;
    return {
        type: "array",
        prefixItems: prefixItems.map((metadata) => (0, json_schema_station_1.json_schema_station)({
            blockNever: false,
            components: props.components,
            metadata,
            attribute: {},
        })),
        additionalItems: tail
            ? (0, json_schema_station_1.json_schema_station)({
                blockNever: false,
                components: props.components,
                metadata: tail,
                attribute: {},
            })
            : false,
    };
};
exports.json_schema_tuple = json_schema_tuple;
//# sourceMappingURL=json_schema_tuple.js.map