"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_constant = void 0;
const typescript_1 = __importDefault(require("typescript"));
const MetadataConstant_1 = require("../../../schemas/metadata/MetadataConstant");
const MetadataConstantValue_1 = require("../../../schemas/metadata/MetadataConstantValue");
const ArrayUtil_1 = require("../../../utils/ArrayUtil");
const CommentFactory_1 = require("../../CommentFactory");
const iterate_metadata_constant = (props) => {
    if (!props.options.constant)
        return false;
    const filter = (flag) => (props.type.getFlags() & flag) !== 0;
    const comment = () => {
        var _a, _b;
        if (!filter(typescript_1.default.TypeFlags.EnumLiteral))
            return {};
        return {
            jsDocTags: (_a = props.type.symbol) === null || _a === void 0 ? void 0 : _a.getJsDocTags(),
            description: props.type.symbol
                ? ((_b = CommentFactory_1.CommentFactory.description(props.type.symbol)) !== null && _b !== void 0 ? _b : null)
                : undefined,
        };
    };
    if (props.type.isLiteral()) {
        const value = typeof props.type.value === "object"
            ? BigInt(`${props.type.value.negative ? "-" : ""}${props.type.value.base10Value}`)
            : props.type.value;
        const constant = ArrayUtil_1.ArrayUtil.take(props.metadata.constants, (elem) => elem.type === typeof value, () => MetadataConstant_1.MetadataConstant.create({
            type: typeof value,
            values: [],
        }));
        ArrayUtil_1.ArrayUtil.add(constant.values, MetadataConstantValue_1.MetadataConstantValue.create(Object.assign({ value, tags: [] }, comment())), (a, b) => a.value === b.value);
        return true;
    }
    else if (filter(typescript_1.default.TypeFlags.BooleanLiteral)) {
        comment();
        const value = props.checker.typeToString(props.type) === "true";
        const constant = ArrayUtil_1.ArrayUtil.take(props.metadata.constants, (elem) => elem.type === "boolean", () => MetadataConstant_1.MetadataConstant.create({
            type: "boolean",
            values: [],
        }));
        ArrayUtil_1.ArrayUtil.add(constant.values, MetadataConstantValue_1.MetadataConstantValue.create(Object.assign({ value, tags: [] }, comment())), (a, b) => a.value === b.value);
        return true;
    }
    return false;
};
exports.iterate_metadata_constant = iterate_metadata_constant;
//# sourceMappingURL=iterate_metadata_constant.js.map