"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_sort = void 0;
const Metadata_1 = require("../../../schemas/metadata/Metadata");
const MetadataObjectType_1 = require("../../../schemas/metadata/MetadataObjectType");
const iterate_metadata_sort = (props) => {
    const visited = new Set();
    const next = (metadata) => iterate({
        visited,
        collection: props.collection,
        metadata,
    });
    for (const array of props.collection.arrays())
        next(array.value);
    for (const tuple of props.collection.tuples())
        for (const element of tuple.elements)
            next(element);
    for (const object of props.collection.objects())
        for (const property of object.properties)
            next(property.value);
    next(props.metadata);
};
exports.iterate_metadata_sort = iterate_metadata_sort;
const iterate = (props) => {
    if (props.visited.has(props.metadata))
        return;
    props.visited.add(props.metadata);
    const next = (metadata) => iterate(Object.assign(Object.assign({}, props), { metadata }));
    // ITERATE CHILDREN
    for (const map of props.metadata.maps)
        next(map.value);
    for (const set of props.metadata.sets)
        next(set.value);
    if (props.metadata.escaped !== null)
        next(props.metadata.escaped.returns);
    if (props.metadata.rest !== null)
        next(props.metadata.rest);
    // SORT OBJECTS
    if (props.metadata.objects.length > 1) {
        props.metadata.objects.sort((x, y) => MetadataObjectType_1.MetadataObjectType.covers(x.type, y.type)
            ? -1
            : MetadataObjectType_1.MetadataObjectType.covers(y.type, x.type)
                ? 1
                : 0);
        props.metadata.union_index = props.collection.getUnionIndex(props.metadata);
    }
    // SORT ARRAYS AND TUPLES
    if (props.metadata.arrays.length > 1)
        props.metadata.arrays.sort((x, y) => Metadata_1.Metadata.covers(x.type.value, y.type.value)
            ? -1
            : Metadata_1.Metadata.covers(y.type.value, x.type.value)
                ? 1
                : 0);
    if (props.metadata.tuples.length > 1)
        props.metadata.tuples.sort((x, y) => {
            const xt = Metadata_1.Metadata.initialize();
            const yt = Metadata_1.Metadata.initialize();
            xt.tuples.push(x);
            yt.tuples.push(y);
            return Metadata_1.Metadata.covers(xt, yt) ? -1 : Metadata_1.Metadata.covers(yt, xt) ? 1 : 0;
        });
    // SORT CONSTANT VALUES
    for (const constant of props.metadata.constants)
        if (constant.type === "string")
            constant.values.sort();
        else if (constant.type === "number")
            constant.values.sort((a, b) => a.value - b.value);
        else if (constant.type === "bigint")
            constant.values.sort((a, b) => a.value < b.value ? -1 : 1);
        else
            constant.values.sort((a, _b) => (a.value === false ? -1 : 1));
};
//# sourceMappingURL=iterate_metadata_sort.js.map