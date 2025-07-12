"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata = void 0;
const TypeFactory_1 = require("../../TypeFactory");
const iterate_metadata_alias_1 = require("./iterate_metadata_alias");
const iterate_metadata_array_1 = require("./iterate_metadata_array");
const iterate_metadata_atomic_1 = require("./iterate_metadata_atomic");
const iterate_metadata_coalesce_1 = require("./iterate_metadata_coalesce");
const iterate_metadata_constant_1 = require("./iterate_metadata_constant");
const iterate_metadata_escape_1 = require("./iterate_metadata_escape");
const iterate_metadata_function_1 = require("./iterate_metadata_function");
const iterate_metadata_intersection_1 = require("./iterate_metadata_intersection");
const iterate_metadata_map_1 = require("./iterate_metadata_map");
const iterate_metadata_native_1 = require("./iterate_metadata_native");
const iterate_metadata_object_1 = require("./iterate_metadata_object");
const iterate_metadata_set_1 = require("./iterate_metadata_set");
const iterate_metadata_template_1 = require("./iterate_metadata_template");
const iterate_metadata_tuple_1 = require("./iterate_metadata_tuple");
const iterate_metadata_union_1 = require("./iterate_metadata_union");
const iterate_metadata = (props) => {
    if (props.type.isTypeParameter() === true) {
        props.errors.push({
            name: TypeFactory_1.TypeFactory.getFullName({
                checker: props.checker,
                type: props.type,
            }),
            explore: Object.assign({}, props.explore),
            messages: ["non-specified generic argument found."],
        });
        return;
    }
    // CHECK SPECIAL CASES
    if ((props.explore.aliased !== true && (0, iterate_metadata_alias_1.iterate_metadata_alias)(props)) ||
        (0, iterate_metadata_intersection_1.iterate_metadata_intersection)(props) ||
        (0, iterate_metadata_union_1.iterate_metadata_union)(props) ||
        (0, iterate_metadata_escape_1.iterate_metadata_escape)(props))
        return;
    // ITERATE CASES
    (0, iterate_metadata_coalesce_1.iterate_metadata_coalesce)(props) ||
        (0, iterate_metadata_function_1.iterate_metadata_function)(props) ||
        (0, iterate_metadata_constant_1.iterate_metadata_constant)(props) ||
        (0, iterate_metadata_template_1.iterate_metadata_template)(props) ||
        (0, iterate_metadata_atomic_1.iterate_metadata_atomic)(props) ||
        (0, iterate_metadata_tuple_1.iterate_metadata_tuple)(props) ||
        (0, iterate_metadata_array_1.iterate_metadata_array)(props) ||
        (0, iterate_metadata_native_1.iterate_metadata_native)(props) ||
        (0, iterate_metadata_map_1.iterate_metadata_map)(props) ||
        (0, iterate_metadata_set_1.iterate_metadata_set)(props) ||
        (0, iterate_metadata_object_1.iterate_metadata_object)(props);
};
exports.iterate_metadata = iterate_metadata;
//# sourceMappingURL=iterate_metadata.js.map