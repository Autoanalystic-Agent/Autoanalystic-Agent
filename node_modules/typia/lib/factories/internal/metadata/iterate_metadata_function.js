"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_function = void 0;
const FunctionalGeneralProgrammer_1 = require("../../../programmers/functional/internal/FunctionalGeneralProgrammer");
const Metadata_1 = require("../../../schemas/metadata/Metadata");
const MetadataFunction_1 = require("../../../schemas/metadata/MetadataFunction");
const MetadataParameter_1 = require("../../../schemas/metadata/MetadataParameter");
const CommentFactory_1 = require("../../CommentFactory");
const TypeFactory_1 = require("../../TypeFactory");
const explore_metadata_1 = require("./explore_metadata");
const iterate_metadata_function = (props) => {
    var _a, _b;
    const declaration = TypeFactory_1.TypeFactory.getFunction(props.type);
    if (declaration === null)
        return false;
    else if (!props.options.functional) {
        if (props.metadata.functions.length === 0)
            props.metadata.functions.push(MetadataFunction_1.MetadataFunction.create({
                parameters: [],
                output: Metadata_1.Metadata.initialize(),
                async: false,
            }));
    }
    else {
        const [signature] = props.type.getCallSignatures();
        if (signature === undefined || signature.declaration === undefined)
            props.metadata.functions.push(MetadataFunction_1.MetadataFunction.create({
                parameters: [],
                output: Metadata_1.Metadata.initialize(),
                async: false,
            }));
        else {
            const { async } = FunctionalGeneralProgrammer_1.FunctionalGeneralProgrammer.getReturnType({
                checker: props.checker,
                declaration,
            });
            props.metadata.functions.push(MetadataFunction_1.MetadataFunction.create({
                parameters: signature.parameters.map((p) => {
                    var _a, _b;
                    return MetadataParameter_1.MetadataParameter.create({
                        name: p.name,
                        type: (0, explore_metadata_1.explore_metadata)(Object.assign(Object.assign({}, props), { type: props.checker.getTypeOfSymbol(p), explore: Object.assign(Object.assign({}, props.explore), { top: false, parameter: p.name }), intersected: false })),
                        tsType: props.checker.getTypeOfSymbol(p),
                        description: (_a = CommentFactory_1.CommentFactory.description(p)) !== null && _a !== void 0 ? _a : null,
                        jsDocTags: (_b = p === null || p === void 0 ? void 0 : p.getJsDocTags()) !== null && _b !== void 0 ? _b : [],
                    });
                }),
                async,
                output: (0, explore_metadata_1.explore_metadata)(Object.assign(Object.assign({}, props), { options: Object.assign(Object.assign({}, props.options), { functional: false }), type: async
                        ? ((_b = (_a = props.checker.getTypeArguments(signature.getReturnType())) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : props.checker.getTypeFromTypeNode(TypeFactory_1.TypeFactory.keyword("any")))
                        : signature.getReturnType(), explore: Object.assign(Object.assign({}, props.explore), { top: false, output: true }), intersected: false })),
            }));
        }
    }
    return true;
};
exports.iterate_metadata_function = iterate_metadata_function;
//# sourceMappingURL=iterate_metadata_function.js.map