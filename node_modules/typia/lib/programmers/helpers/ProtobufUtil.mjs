var ProtobufUtil;
(function (ProtobufUtil) {
    ProtobufUtil.isStaticObject = (obj) => obj.properties.length >= 1 &&
        obj.properties.every((p) => p.key.isSoleLiteral());
    ProtobufUtil.size = (meta) => ProtobufUtil.getAtomics(meta).size +
        meta.arrays.length +
        meta.tuples.length +
        meta.natives.length +
        meta.objects.length +
        meta.maps.length;
    ProtobufUtil.getSequence = (tags) => {
        const sequence = tags.find((t) => t.kind === "sequence" &&
            typeof t.schema?.["x-protobuf-sequence"] === "number");
        if (sequence === undefined)
            return null;
        const value = Number(sequence.schema["x-protobuf-sequence"]);
        return Number.isNaN(value) ? null : value;
    };
    ProtobufUtil.isUnion = (meta) => ProtobufUtil.size(meta) > 1;
    ProtobufUtil.getAtomics = (meta, union) => {
        const map = union ?? new Map();
        // CONSTANTS
        for (const c of meta.constants)
            if (c.type === "boolean")
                map.set("bool", ProtobufUtil.getSequence(c.values[0]?.tags[0] ?? []));
            else if (c.type === "bigint") {
                const init = deduce_bigint_type(c.values.map((v) => BigInt(v.value)));
                for (const value of c.values)
                    decode_bigint({
                        map,
                        tags: value.tags,
                        default: init,
                    });
            }
            else if (c.type === "number") {
                const init = deduce_numeric_type(c.values.map((v) => v.value));
                for (const value of c.values)
                    decode_number({
                        map,
                        tags: value.tags,
                        default: init,
                    });
            }
            else if (c.type === "string")
                map.set("string", ProtobufUtil.getSequence(c.values[0]?.tags[0] ?? []));
        if (meta.templates.length)
            map.set("string", ProtobufUtil.getSequence(meta.templates[0]?.tags[0] ?? []));
        // ATOMICS
        for (const atomic of meta.atomics)
            if (atomic.type === "boolean")
                map.set("bool", ProtobufUtil.getSequence(atomic.tags[0] ?? []));
            else if (atomic.type === "bigint")
                decode_bigint({
                    map,
                    tags: atomic.tags,
                    default: "int64",
                });
            else if (atomic.type === "number")
                decode_number({
                    map,
                    tags: atomic.tags,
                    default: "double",
                });
            else if (atomic.type === "string")
                map.set("string", ProtobufUtil.getSequence(atomic.tags[0] ?? []));
        // SORTING IF REQUIRED
        if (Array.from(map.values()).some((v) => v === null))
            arrange(map);
        return map;
    };
    ProtobufUtil.getNumbers = (meta, union) => {
        const map = union ?? new Map();
        for (const c of meta.constants)
            if (c.type === "number") {
                const init = deduce_numeric_type(c.values.map((v) => v.value));
                for (const value of c.values)
                    decode_number({
                        map,
                        tags: value.tags,
                        default: init,
                    });
            }
        for (const atomic of meta.atomics)
            if (atomic.type === "number")
                decode_number({
                    map,
                    tags: atomic.tags,
                    default: "double",
                });
        if (Array.from(map.values()).some((v) => v === null))
            arrange(map);
        return map;
    };
    ProtobufUtil.getBigints = (meta, union) => {
        const map = union ?? new Map();
        for (const c of meta.constants)
            if (c.type === "bigint") {
                const init = deduce_bigint_type(c.values.map((v) => BigInt(v.value)));
                for (const value of c.values)
                    decode_bigint({
                        map,
                        tags: value.tags,
                        default: init,
                    });
            }
        for (const atomic of meta.atomics)
            if (atomic.type === "bigint")
                decode_bigint({
                    map,
                    tags: atomic.tags,
                    default: "int64",
                });
        if (Array.from(map.values()).some((v) => v === null))
            arrange(map);
        return map;
    };
    const arrange = (map) => {
        const entries = Array.from(map.entries()).sort((a, b) => ProtobufUtil.compare(a[0], b[0]));
        map.clear();
        for (const [key, value] of entries)
            map.set(key, value);
    };
    ProtobufUtil.compare = (x, y) => ATOMIC_ORDER.get(x) - ATOMIC_ORDER.get(y);
})(ProtobufUtil || (ProtobufUtil = {}));
const ATOMIC_ORDER = new Map([
    "bool",
    "int32",
    "uint32",
    "int64",
    "uint64",
    "float",
    "double",
    "string",
].map((str, i) => [str, i]));
const deduce_bigint_type = (values) => values.some((v) => v < 0) ? "int64" : "uint64";
const deduce_numeric_type = (values) => values.every((v) => Math.floor(v) === v)
    ? values.every((v) => -2147483648 <= v && v <= 2147483647)
        ? "int32"
        : "int64"
    : "double";
const decode_bigint = (next) => {
    if (next.tags.length === 0) {
        next.map.set(next.default, null);
        return;
    }
    for (const row of next.tags) {
        const value = row.find((tag) => tag.kind === "type" &&
            (tag.value === "int64" || tag.value === "uint64"))?.value;
        next.map.set(value ?? "int64", ProtobufUtil.getSequence(row));
    }
};
const decode_number = (next) => {
    if (next.tags.length === 0) {
        next.map.set(next.default, null);
        return;
    }
    for (const row of next.tags) {
        const value = row.find((tag) => tag.kind === "type" &&
            (tag.value === "int32" ||
                tag.value === "uint32" ||
                tag.value === "int64" ||
                tag.value === "uint64" ||
                tag.value === "float" ||
                tag.value === "double"))?.value;
        next.map.set(value ?? "double", ProtobufUtil.getSequence(row));
    }
};

export { ProtobufUtil };
//# sourceMappingURL=ProtobufUtil.mjs.map
