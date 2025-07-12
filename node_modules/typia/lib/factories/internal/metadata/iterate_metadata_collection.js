"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_collection = void 0;
const iterate_metadata_comment_tags_1 = require("./iterate_metadata_comment_tags");
const iterate_metadata_collection = (props) => {
    for (const array of props.collection.arrays())
        if (array.recursive === null)
            props.collection.setArrayRecursive(array, isArrayRecursive({
                visited: new Set(),
                array,
                metadata: array.value,
            }));
    for (const tuple of props.collection.tuples())
        if (tuple.recursive === null) {
            const visited = new Set();
            props.collection.setTupleRecursive(tuple, tuple.elements.some((e) => isTupleRecursive({
                visited,
                tuple,
                metadata: e,
            })));
        }
    for (const object of props.collection.objects()) {
        (0, iterate_metadata_comment_tags_1.iterate_metadata_comment_tags)({
            errors: props.errors,
            object,
        });
        if (object.recursive === null) {
            const visited = new Set();
            props.collection.setObjectRecursive(object, object.properties.some((p) => isObjectRecursive({
                visited,
                object,
                metadata: p.value,
            })));
        }
    }
};
exports.iterate_metadata_collection = iterate_metadata_collection;
const isArrayRecursive = (props) => {
    if (props.visited.has(props.metadata))
        return false;
    props.visited.add(props.metadata);
    const next = (metadata) => isArrayRecursive(Object.assign(Object.assign({}, props), { metadata }));
    return (props.metadata.arrays.some((a) => a.type === props.array || next(a.type.value)) ||
        props.metadata.aliases.some((alias) => next(alias.type.value)) ||
        props.metadata.tuples.some((t) => !t.type.recursive && t.type.elements.some(next)) ||
        props.metadata.maps.some((m) => next(m.value)) ||
        props.metadata.sets.some((s) => next(s.value)) ||
        (props.metadata.escaped !== null && next(props.metadata.escaped.returns)) ||
        (props.metadata.rest !== null && next(props.metadata.rest)));
};
const isTupleRecursive = (props) => {
    if (props.visited.has(props.metadata))
        return false;
    props.visited.add(props.metadata);
    const next = (metadata) => isTupleRecursive(Object.assign(Object.assign({}, props), { metadata }));
    return (props.metadata.tuples.some((t) => t.type === props.tuple || t.type.elements.some(next)) ||
        props.metadata.arrays.some((a) => !a.type.recursive && next(a.type.value)) ||
        props.metadata.maps.some((m) => next(m.value)) ||
        props.metadata.sets.some((s) => next(s.value)) ||
        props.metadata.aliases.some((alias) => next(alias.type.value)) ||
        (props.metadata.escaped !== null && next(props.metadata.escaped.returns)) ||
        (props.metadata.rest !== null && next(props.metadata.rest)));
};
const isObjectRecursive = (props) => {
    if (props.visited.has(props.metadata))
        return false;
    props.visited.add(props.metadata);
    const next = (metadata) => isObjectRecursive(Object.assign(Object.assign({}, props), { metadata }));
    return (props.metadata.objects.some((o) => props.object === o.type ||
        o.type.properties.some((prop) => next(prop.value))) ||
        props.metadata.aliases.some((alias) => next(alias.type.value)) ||
        props.metadata.arrays.some((array) => !array.type.recursive && next(array.type.value)) ||
        props.metadata.tuples.some((tuple) => !tuple.type.recursive && tuple.type.elements.some(next)) ||
        props.metadata.maps.some((map) => next(map.value)) ||
        props.metadata.sets.some((set) => next(set.value)) ||
        (props.metadata.escaped !== null && next(props.metadata.escaped.returns)) ||
        (props.metadata.rest !== null && next(props.metadata.rest)));
};
//# sourceMappingURL=iterate_metadata_collection.js.map