"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonMetadataFactory = void 0;
const AtomicPredicator_1 = require("../programmers/helpers/AtomicPredicator");
const TransformerError_1 = require("../transformers/TransformerError");
const MetadataCollection_1 = require("./MetadataCollection");
const MetadataFactory_1 = require("./MetadataFactory");
var JsonMetadataFactory;
(function (JsonMetadataFactory) {
    JsonMetadataFactory.analyze = (props) => {
        const collection = new MetadataCollection_1.MetadataCollection();
        const result = MetadataFactory_1.MetadataFactory.analyze({
            checker: props.checker,
            transformer: props.transformer,
            options: {
                absorb: true,
                escape: true,
                constant: true,
                validate: props.validate
                    ? (meta, explore) => {
                        const errors = JsonMetadataFactory.validate(meta);
                        errors.push(...props.validate(meta, explore));
                        return errors;
                    }
                    : JsonMetadataFactory.validate,
            },
            collection,
            type: props.type,
        });
        if (result.success === false)
            throw TransformerError_1.TransformerError.from({
                code: props.method,
                errors: result.errors,
            });
        return {
            collection,
            metadata: result.data,
        };
    };
    JsonMetadataFactory.validate = (meta) => {
        const output = [];
        if (meta.atomics.some((a) => a.type === "bigint") ||
            meta.constants.some((c) => c.type === "bigint"))
            output.push("JSON does not support bigint type.");
        if (meta.tuples.some((t) => t.type.elements.some((e) => e.isRequired() === false)) ||
            meta.arrays.some((a) => a.type.value.isRequired() === false))
            output.push("JSON does not support undefined type in array.");
        if (meta.maps.length)
            output.push("JSON does not support Map type.");
        if (meta.sets.length)
            output.push("JSON does not support Set type.");
        for (const native of meta.natives)
            if (AtomicPredicator_1.AtomicPredicator.native(native.name) === false &&
                native.name !== "Date")
                output.push(`JSON does not support ${native.name} type.`);
        return output;
    };
})(JsonMetadataFactory || (exports.JsonMetadataFactory = JsonMetadataFactory = {}));
//# sourceMappingURL=JsonMetadataFactory.js.map