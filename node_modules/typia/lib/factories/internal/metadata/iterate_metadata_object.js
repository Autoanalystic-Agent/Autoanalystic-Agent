"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_object = void 0;
const typescript_1 = __importDefault(require("typescript"));
const MetadataObject_1 = require("../../../schemas/metadata/MetadataObject");
const ArrayUtil_1 = require("../../../utils/ArrayUtil");
const emplace_metadata_object_1 = require("./emplace_metadata_object");
const iterate_metadata_object = (props, ensure = false) => {
    if (ensure === false) {
        const filter = (flag) => (props.type.getFlags() & flag) !== 0;
        if (!filter(typescript_1.default.TypeFlags.Object) &&
            !props.type.isIntersection() &&
            props.type.intrinsicName !== "object")
            return false;
    }
    const obj = (0, emplace_metadata_object_1.emplace_metadata_object)(props);
    ArrayUtil_1.ArrayUtil.add(props.metadata.objects, MetadataObject_1.MetadataObject.create({
        type: obj,
        tags: [],
    }), (elem) => elem.type.name === obj.name);
    return true;
};
exports.iterate_metadata_object = iterate_metadata_object;
//# sourceMappingURL=iterate_metadata_object.js.map