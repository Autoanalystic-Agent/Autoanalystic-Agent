"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emplace_metadata_tuple = void 0;
const typescript_1 = __importDefault(require("typescript"));
const Metadata_1 = require("../../../schemas/metadata/Metadata");
const Writable_1 = require("../../../typings/Writable");
const ArrayUtil_1 = require("../../../utils/ArrayUtil");
const explore_metadata_1 = require("./explore_metadata");
const emplace_metadata_tuple = (props) => {
    var _a, _b, _c;
    // CHECK EXISTENCE
    const [tuple, newbie, closure] = props.collection.emplaceTuple(props.checker, props.type);
    ArrayUtil_1.ArrayUtil.add(tuple.nullables, props.metadata.nullable);
    if (newbie === false)
        return tuple;
    // CONSTRUCT ELEMENT TYPES
    const flagList = (_c = (_a = props.type.elementFlags) !== null && _a !== void 0 ? _a : (_b = props.type.target) === null || _b === void 0 ? void 0 : _b.elementFlags) !== null && _c !== void 0 ? _c : [];
    const elements = props.checker
        .getTypeArguments(props.type)
        .map((elem, i) => {
        const child = (0, explore_metadata_1.explore_metadata)(Object.assign(Object.assign({}, props), { type: elem, explore: Object.assign(Object.assign({}, props.explore), { nested: tuple, aliased: false, escaped: false }), intersected: false }));
        // CHECK OPTIONAL
        const flag = flagList[i];
        if (flag === typescript_1.default.ElementFlags.Optional)
            (0, Writable_1.Writable)(child).optional = true;
        // REST TYPE
        if (flag !== typescript_1.default.ElementFlags.Rest)
            return child;
        const wrapper = Metadata_1.Metadata.initialize();
        (0, Writable_1.Writable)(wrapper).rest = child;
        return wrapper;
    });
    closure(elements);
    return tuple;
};
exports.emplace_metadata_tuple = emplace_metadata_tuple;
//# sourceMappingURL=emplace_metadata_tuple.js.map