"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscLiteralsProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ExpressionFactory_1 = require("../../factories/ExpressionFactory");
const MetadataCollection_1 = require("../../factories/MetadataCollection");
const MetadataFactory_1 = require("../../factories/MetadataFactory");
const TransformerError_1 = require("../../transformers/TransformerError");
var MiscLiteralsProgrammer;
(function (MiscLiteralsProgrammer) {
    MiscLiteralsProgrammer.write = (props) => {
        const result = MetadataFactory_1.MetadataFactory.analyze({
            checker: props.context.checker,
            transformer: props.context.transformer,
            options: {
                escape: true,
                constant: true,
                absorb: true,
                validate: (meta) => {
                    const length = meta.constants
                        .map((c) => c.values.length)
                        .reduce((a, b) => a + b, 0) +
                        meta.atomics.filter((a) => a.type === "boolean").length;
                    if (0 === length)
                        return [ErrorMessages.NO];
                    else if (meta.size() !== length)
                        return [ErrorMessages.ONLY];
                    return [];
                },
            },
            collection: new MetadataCollection_1.MetadataCollection(),
            type: props.type,
        });
        if (result.success === false)
            throw TransformerError_1.TransformerError.from({
                code: `typia.misc.literals`,
                errors: result.errors,
            });
        const metadata = result.data;
        const values = new Set([
            ...metadata.constants.map((c) => c.values.map((v) => v.value)).flat(),
            ...(metadata.atomics.filter((a) => a.type === "boolean").length
                ? [true, false]
                : []),
            ...(metadata.nullable ? [null] : []),
        ]);
        return typescript_1.default.factory.createAsExpression(typescript_1.default.factory.createArrayLiteralExpression([...values].map((v) => v === null
            ? typescript_1.default.factory.createNull()
            : typeof v === "boolean"
                ? v
                    ? typescript_1.default.factory.createTrue()
                    : typescript_1.default.factory.createFalse()
                : typeof v === "number"
                    ? ExpressionFactory_1.ExpressionFactory.number(v)
                    : typeof v === "bigint"
                        ? ExpressionFactory_1.ExpressionFactory.bigint(Number(v))
                        : typescript_1.default.factory.createStringLiteral(v)), true), typescript_1.default.factory.createTypeReferenceNode("const"));
    };
})(MiscLiteralsProgrammer || (exports.MiscLiteralsProgrammer = MiscLiteralsProgrammer = {}));
var ErrorMessages;
(function (ErrorMessages) {
    ErrorMessages["NO"] = "no constant literal type found.";
    ErrorMessages["ONLY"] = "only constant literal types are allowed.";
})(ErrorMessages || (ErrorMessages = {}));
//# sourceMappingURL=MiscLiteralsProgrammer.js.map