"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectMetadataTransformer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const LiteralFactory_1 = require("../../../factories/LiteralFactory");
const MetadataCollection_1 = require("../../../factories/MetadataCollection");
const MetadataFactory_1 = require("../../../factories/MetadataFactory");
const TransformerError_1 = require("../../TransformerError");
var ReflectMetadataTransformer;
(function (ReflectMetadataTransformer) {
    ReflectMetadataTransformer.transform = (props) => {
        var _a;
        if (!((_a = props.expression.typeArguments) === null || _a === void 0 ? void 0 : _a.length))
            throw new TransformerError_1.TransformerError({
                code: "typia.reflect.metadata",
                message: "no generic argument.",
            });
        // VALIDATE TUPLE ARGUMENTS
        const top = props.expression.typeArguments[0];
        if (!typescript_1.default.isTupleTypeNode(top))
            return props.expression;
        else if (top.elements.some((child) => !typescript_1.default.isTypeNode(child)))
            return props.expression;
        // GET TYPES
        const types = top.elements.map((child) => props.context.checker.getTypeFromTypeNode(child));
        if (types.some((t) => t.isTypeParameter()))
            throw new TransformerError_1.TransformerError({
                code: "typia.reflect.metadata",
                message: "non-specified generic argument(s).",
            });
        // METADATA
        const collection = new MetadataCollection_1.MetadataCollection();
        const metadatas = types.map((type) => {
            const result = MetadataFactory_1.MetadataFactory.analyze({
                checker: props.context.checker,
                transformer: props.context.transformer,
                options: {
                    escape: true,
                    constant: true,
                    absorb: true,
                    functional: true,
                },
                collection,
                type,
            });
            if (result.success === false)
                throw TransformerError_1.TransformerError.from({
                    code: "typia.reflect.metadata",
                    errors: result.errors,
                });
            return result.data;
        });
        // CONVERT TO PRIMITIVE TYPE
        const app = {
            metadatas: metadatas.map((metadata) => metadata.toJSON()),
            components: collection.toJSON(),
        };
        return LiteralFactory_1.LiteralFactory.write(app);
    };
})(ReflectMetadataTransformer || (exports.ReflectMetadataTransformer = ReflectMetadataTransformer = {}));
//# sourceMappingURL=ReflectMetadataTransformer.js.map