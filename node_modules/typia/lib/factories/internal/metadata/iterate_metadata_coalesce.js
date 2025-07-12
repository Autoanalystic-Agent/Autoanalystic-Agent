"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_coalesce = void 0;
const typescript_1 = __importDefault(require("typescript"));
const Writable_1 = require("../../../typings/Writable");
const iterate_metadata_coalesce = (props) => {
    const filter = (flag) => (props.type.getFlags() & flag) !== 0;
    if (filter(typescript_1.default.TypeFlags.Unknown) || filter(typescript_1.default.TypeFlags.Any)) {
        (0, Writable_1.Writable)(props.metadata).any = true;
        return true;
    }
    else if (filter(typescript_1.default.TypeFlags.Null)) {
        (0, Writable_1.Writable)(props.metadata).nullable = true;
        return true;
    }
    else if (filter(typescript_1.default.TypeFlags.Undefined) ||
        filter(typescript_1.default.TypeFlags.Never) ||
        filter(typescript_1.default.TypeFlags.Void) ||
        filter(typescript_1.default.TypeFlags.VoidLike)) {
        (0, Writable_1.Writable)(props.metadata).required = false;
        return true;
    }
    return false;
};
exports.iterate_metadata_coalesce = iterate_metadata_coalesce;
//# sourceMappingURL=iterate_metadata_coalesce.js.map