"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_escape = void 0;
const Metadata_1 = require("../../../schemas/metadata/Metadata");
const MetadataEscaped_1 = require("../../../schemas/metadata/MetadataEscaped");
const Writable_1 = require("../../../typings/Writable");
const TypeFactory_1 = require("../../TypeFactory");
const iterate_metadata_1 = require("./iterate_metadata");
const iterate_metadata_escape = (props) => {
    if (props.options.escape === false || props.explore.escaped === true)
        return false;
    const escaped = TypeFactory_1.TypeFactory.getReturnTypeOfClassMethod({
        checker: props.checker,
        class: props.type,
        function: "toJSON",
    });
    if (escaped === null)
        return false;
    if (props.metadata.escaped === null) {
        (0, Writable_1.Writable)(props.metadata).escaped = MetadataEscaped_1.MetadataEscaped.create({
            original: Metadata_1.Metadata.initialize(),
            returns: Metadata_1.Metadata.initialize(),
        });
    }
    (0, iterate_metadata_1.iterate_metadata)(Object.assign(Object.assign({}, props), { metadata: props.metadata.escaped.original, explore: Object.assign(Object.assign({}, props.explore), { escaped: true }) }));
    (0, iterate_metadata_1.iterate_metadata)(Object.assign(Object.assign({}, props), { metadata: props.metadata.escaped.returns, type: escaped, explore: Object.assign(Object.assign({}, props.explore), { escaped: true }) }));
    return true;
};
exports.iterate_metadata_escape = iterate_metadata_escape;
//# sourceMappingURL=iterate_metadata_escape.js.map