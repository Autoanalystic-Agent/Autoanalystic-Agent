import { ArrayUtil } from '../../utils/ArrayUtil.mjs';

var AtomicPredicator;
(function (AtomicPredicator) {
    AtomicPredicator.constant = (props) => !ArrayUtil.has(props.metadata.natives, (native) => native.name.toLowerCase() === props.name);
    AtomicPredicator.atomic = (props) => !ArrayUtil.has(props.metadata.natives, (native) => native.name.toLowerCase() === props.name);
    AtomicPredicator.native = (name) => LIKE.has(name.toLowerCase());
    AtomicPredicator.template = (metadata) => !ArrayUtil.has(metadata.natives, (native) => native.name.toLowerCase() === "string");
})(AtomicPredicator || (AtomicPredicator = {}));
const LIKE = new Set(["boolean", "bigint", "number", "string"]);

export { AtomicPredicator };
//# sourceMappingURL=AtomicPredicator.mjs.map
