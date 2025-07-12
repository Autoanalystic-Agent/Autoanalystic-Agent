"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtomicPredicator = void 0;
const ArrayUtil_1 = require("../../utils/ArrayUtil");
var AtomicPredicator;
(function (AtomicPredicator) {
    AtomicPredicator.constant = (props) => !ArrayUtil_1.ArrayUtil.has(props.metadata.natives, (native) => native.name.toLowerCase() === props.name);
    AtomicPredicator.atomic = (props) => !ArrayUtil_1.ArrayUtil.has(props.metadata.natives, (native) => native.name.toLowerCase() === props.name);
    AtomicPredicator.native = (name) => LIKE.has(name.toLowerCase());
    AtomicPredicator.template = (metadata) => !ArrayUtil_1.ArrayUtil.has(metadata.natives, (native) => native.name.toLowerCase() === "string");
})(AtomicPredicator || (exports.AtomicPredicator = AtomicPredicator = {}));
const LIKE = new Set(["boolean", "bigint", "number", "string"]);
//# sourceMappingURL=AtomicPredicator.js.map