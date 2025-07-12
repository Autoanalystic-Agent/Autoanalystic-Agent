"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringifyJoiner = void 0;
const typescript_1 = __importDefault(require("typescript"));
const IdentifierFactory_1 = require("../../factories/IdentifierFactory");
const TemplateFactory_1 = require("../../factories/TemplateFactory");
const stringify_dynamic_properties_1 = require("../internal/stringify_dynamic_properties");
const stringify_regular_properties_1 = require("../internal/stringify_regular_properties");
var StringifyJoiner;
(function (StringifyJoiner) {
    StringifyJoiner.object = (props) => {
        // CHECK AND SORT ENTRIES
        if (props.entries.length === 0)
            return typescript_1.default.factory.createStringLiteral("{}");
        // PROPERTIES
        const regular = props.entries.filter((entry) => entry.key.isSoleLiteral());
        const dynamic = props.entries.filter((entry) => !entry.key.isSoleLiteral());
        const expressions = [
            ...(0, stringify_regular_properties_1.stringify_regular_properties)({
                regular,
                dynamic,
            }),
            ...(dynamic.length
                ? [
                    (0, stringify_dynamic_properties_1.stringify_dynamic_properties)(dynamic, regular.map((r) => r.key.getSoleLiteral())),
                ]
                : []),
        ];
        // POP LAST COMMA, IF REQUIRED
        const filtered = (regular.length &&
            regular[regular.length - 1].meta.isRequired() &&
            dynamic.length === 0) ||
            (regular.length === 0 && dynamic.length)
            ? expressions
            : [
                typescript_1.default.factory.createCallExpression(props.context.importer.internal("jsonStringifyTail"), undefined, [TemplateFactory_1.TemplateFactory.generate(expressions)]),
            ];
        // RETURNS WITH OBJECT BRACKET
        return TemplateFactory_1.TemplateFactory.generate([
            typescript_1.default.factory.createStringLiteral(`{`),
            ...filtered,
            typescript_1.default.factory.createStringLiteral(`}`),
        ]);
    };
    StringifyJoiner.array = (props) => TemplateFactory_1.TemplateFactory.generate([
        typescript_1.default.factory.createStringLiteral(`[`),
        typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createPropertyAccessExpression(typescript_1.default.factory.createCallExpression(IdentifierFactory_1.IdentifierFactory.access(props.input, "map"), undefined, [props.arrow]), typescript_1.default.factory.createIdentifier("join")), undefined, [typescript_1.default.factory.createStringLiteral(`,`)]),
        typescript_1.default.factory.createStringLiteral(`]`),
    ]);
    StringifyJoiner.tuple = (props) => {
        if (props.elements.length === 0)
            return typescript_1.default.factory.createStringLiteral("[]");
        if (props.rest === null &&
            props.elements.every((child) => typescript_1.default.isStringLiteral(child)))
            return typescript_1.default.factory.createStringLiteral("[" +
                props.elements
                    .map((child) => child.text)
                    .join(",") +
                "]");
        const expressions = [typescript_1.default.factory.createStringLiteral(`[`)];
        props.elements.forEach((child, i) => {
            expressions.push(child);
            if (i !== props.elements.length - 1)
                expressions.push(typescript_1.default.factory.createStringLiteral(`,`));
        });
        if (props.rest !== null)
            expressions.push(props.rest);
        expressions.push(typescript_1.default.factory.createStringLiteral(`]`));
        return TemplateFactory_1.TemplateFactory.generate(expressions);
    };
})(StringifyJoiner || (exports.StringifyJoiner = StringifyJoiner = {}));
//# sourceMappingURL=StringifyJoinder.js.map