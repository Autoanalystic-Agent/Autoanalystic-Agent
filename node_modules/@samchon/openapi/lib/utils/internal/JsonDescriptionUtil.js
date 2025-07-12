"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonDescriptionUtil = void 0;
const Escaper_1 = require("../Escaper");
const OpenApiTypeChecker_1 = require("../OpenApiTypeChecker");
var JsonDescriptionUtil;
(function (JsonDescriptionUtil) {
    JsonDescriptionUtil.cascade = (props) => {
        var _a, _b;
        const accessors = props.schema.$ref
            .split(props.prefix)[1]
            .split(".");
        const pReferences = accessors
            .slice(0, props.escape ? accessors.length : accessors.length - 1)
            .map((_, i, array) => array.slice(0, i + 1).join("."))
            .map((key) => {
            var _a, _b;
            return ({
                key,
                description: (_b = (_a = props.components.schemas) === null || _a === void 0 ? void 0 : _a[key]) === null || _b === void 0 ? void 0 : _b.description,
            });
        })
            .reverse()
            .filter((schema, i) => i === 0 || !!(schema === null || schema === void 0 ? void 0 : schema.description));
        if (!((_a = props.schema.description) === null || _a === void 0 ? void 0 : _a.length) && pReferences.length === 0)
            return undefined;
        return [
            ...(!!((_b = props.schema.description) === null || _b === void 0 ? void 0 : _b.length) ? [props.schema.description] : []),
            ...pReferences.map((pRef, i) => pRef.description === undefined
                ? `Current Type: {@link ${pRef.key}}`
                : `Description of the ${i === 0 && props.escape ? "current" : "parent"} {@link ${pRef.key}} type:\n\n` +
                    pRef.description
                        .split("\n")
                        .map((str) => `> ${str}`)
                        .join("\n")),
        ].join("\n\n------------------------------\n\n");
    };
    JsonDescriptionUtil.take = (o) => {
        var _a, _b;
        const result = [
            ...(!!((_a = o.description) === null || _a === void 0 ? void 0 : _a.length) ? [o.description] : []),
            ...Object.entries((_b = o.properties) !== null && _b !== void 0 ? _b : {})
                .filter(([_key, value]) => {
                var _a;
                return OpenApiTypeChecker_1.OpenApiTypeChecker.isReference(value) &&
                    !!((_a = value.description) === null || _a === void 0 ? void 0 : _a.length);
            })
                .map(([key, value]) => {
                var _a;
                return `### Description of {@link ${Escaper_1.Escaper.variable(key) ? key : JSON.stringify(key)}} property:\n\n` +
                    ((_a = value.description) !== null && _a !== void 0 ? _a : "")
                        .split("\n")
                        .map((str) => `> ${str}`)
                        .join("\n");
            }),
        ].join("\n\n");
        return !!result.length ? result : undefined;
    };
})(JsonDescriptionUtil || (exports.JsonDescriptionUtil = JsonDescriptionUtil = {}));
