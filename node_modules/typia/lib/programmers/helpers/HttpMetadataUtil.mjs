var HttpMetadataUtil;
(function (HttpMetadataUtil) {
    HttpMetadataUtil.atomics = (metadata) => new Set([
        ...metadata.atomics.map((a) => a.type),
        ...metadata.constants.map((c) => c.type),
        ...(metadata.templates.length ? ["string"] : []),
    ]);
    HttpMetadataUtil.isUnion = (metadata) => HttpMetadataUtil.atomics(metadata).size +
        metadata.arrays.length +
        metadata.tuples.length +
        metadata.natives.length +
        metadata.maps.length +
        metadata.objects.length >
        1;
})(HttpMetadataUtil || (HttpMetadataUtil = {}));

export { HttpMetadataUtil };
//# sourceMappingURL=HttpMetadataUtil.mjs.map
