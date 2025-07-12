"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explore_metadata = void 0;
const Metadata_1 = require("../../../schemas/metadata/Metadata");
const emend_metadata_atomics_1 = require("./emend_metadata_atomics");
const iterate_metadata_1 = require("./iterate_metadata");
const explore_metadata = (props) => {
    var _a;
    // CONSTRUCT METADATA
    const metadata = Metadata_1.Metadata.initialize(props.explore.escaped);
    if (props.type === null)
        return metadata;
    // ITERATE TYPESCRIPT TYPES
    (_a = props.intersected) !== null && _a !== void 0 ? _a : (props.intersected = false);
    (0, iterate_metadata_1.iterate_metadata)(Object.assign(Object.assign({}, props), { metadata, type: props.type }));
    (0, emend_metadata_atomics_1.emend_metadata_atomics)(metadata);
    if (metadata.escaped) {
        (0, emend_metadata_atomics_1.emend_metadata_atomics)(metadata.escaped.original);
        (0, emend_metadata_atomics_1.emend_metadata_atomics)(metadata.escaped.returns);
    }
    return metadata;
};
exports.explore_metadata = explore_metadata;
//# sourceMappingURL=explore_metadata.js.map