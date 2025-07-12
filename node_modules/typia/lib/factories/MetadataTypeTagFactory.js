"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataTypeTagFactory = void 0;
const MetadataTypeTagSchemaFactory_1 = require("./MetadataTypeTagSchemaFactory");
var MetadataTypeTagFactory;
(function (MetadataTypeTagFactory) {
    MetadataTypeTagFactory.is = (obj) => {
        if (obj.properties.length !== 1)
            return false;
        const top = obj.properties[0];
        if (top.key.isSoleLiteral() === false)
            return false;
        else if (top.key.getSoleLiteral() !== "typia.tag")
            return false;
        const value = top.value;
        if (value.size() !== 1 ||
            value.objects.length !== 1 ||
            value.isRequired() === true ||
            value.nullable === true)
            return false;
        const tag = top.value.objects[0].type;
        const statics = tag.properties
            .map((p) => p.key.getSoleLiteral())
            .filter((str) => str !== null);
        if (ESSENTIAL_FIELDS.some((f) => !statics.includes(f)))
            return false;
        return true;
    };
    MetadataTypeTagFactory.analyze = (props) => {
        const messages = [];
        const report = (next) => {
            messages.push(`the property ${next.property === null
                ? `["typia.tag"]`
                : `["typia.tag.${next.property}"]`} ${next.message}.`);
            return false;
        };
        //----
        // VALIDATION PROCESS
        //----
        const filtered = props.objects.filter((obj) => {
            // ONLY ONE PROPERTY
            if (obj.properties.length !== 1)
                return false;
            // THE TAG.TYPE PROPERTY MUST BE
            const top = obj.properties[0];
            if (top.key.getSoleLiteral() !== "typia.tag" ||
                top.value.size() !== 1 ||
                top.value.objects.length !== 1)
                return false;
            else if (top.value.optional === false)
                return report({
                    property: null,
                    message: "must be optional object",
                });
            // CHECK LIST OF PROPERTIES
            const tag = top.value.objects[0].type;
            const statistics = tag.properties
                .map((p) => p.key.getSoleLiteral())
                .filter((str) => str !== null);
            if (ESSENTIAL_FIELDS.some((f) => !statistics.includes(f)))
                return report({
                    property: null,
                    message: `must have at least three properties - ${ESSENTIAL_FIELDS.map((str) => `'${str}'`).join(", ")}`,
                });
            const each = tag.properties.map((p) => {
                const key = p.key.getSoleLiteral();
                if (key === null)
                    return true;
                else if (FIELDS.includes(key) === false)
                    return true;
                return validate_property({
                    report,
                    key,
                    value: p.value,
                });
            });
            return each.every((v) => v === true);
        });
        if (filtered.length === 0)
            return [];
        //----
        // CONSTRUCT TYPE TAGS
        //----
        // CREATE 1ST
        const tagList = filtered.map((object) => create_metadata_type_tag({
            report,
            object,
        }));
        const output = [];
        for (const tag of tagList)
            if (tag !== null)
                output.push({
                    target: tag.target.some((str) => str === props.type)
                        ? props.type
                        : null,
                    name: tag.name,
                    kind: tag.kind,
                    value: tag.value,
                    validate: tag.validate[props.type],
                    exclusive: tag.exclusive,
                    schema: tag.schema,
                });
        MetadataTypeTagFactory.validate({
            report,
            type: props.type,
            tags: output,
        });
        if (messages.length > 0) {
            props.errors.push({
                name: [props.type, ...props.objects.map((o) => o.name)].join(" & "),
                explore: props.explore,
                messages,
            });
            return [];
        }
        return output;
    };
    MetadataTypeTagFactory.validate = (props) => {
        let success = true;
        for (const tag of props.tags)
            if (tag.target !== props.type) {
                success && (success = props.report({
                    property: null,
                    message: `target must contain ${props.type} type`,
                }));
            }
        props.tags.forEach((tag, i) => {
            if (tag.exclusive === false)
                return;
            else if (tag.exclusive === true) {
                const some = props.tags.some((opposite, j) => i !== j && opposite.kind === tag.kind);
                if (some === true)
                    success && (success = props.report({
                        property: null,
                        message: `kind '${tag.kind}' can't be duplicated`,
                    }));
            }
            else if (Array.isArray(tag.exclusive)) {
                const some = props.tags.find((opposite, j) => i !== j &&
                    opposite.kind === tag.kind &&
                    tag.exclusive.includes(opposite.name));
                if (some !== undefined)
                    success !== null && success !== void 0 ? success : (success = props.report({
                        property: null,
                        message: `kind '${tag.kind}' can't be used with '${some.name}'`,
                    }));
            }
        });
        return success;
    };
    const validate_property = (props) => {
        var _a;
        if (
        // TARGET
        props.key === "target" &&
            (props.value.constants.length !== 1 ||
                props.value.constants[0].values.length !== props.value.size() ||
                props.value.constants[0].values.some((v) => v.value !== "boolean" &&
                    v.value !== "bigint" &&
                    v.value !== "number" &&
                    v.value !== "string" &&
                    v.value !== "array" &&
                    v.value !== "object")))
            return props.report({
                property: props.key,
                message: `must be one of 'boolean', 'bigint', 'number', 'string', 'array', 'object'`,
            });
        else if (
        // KIND
        props.key === "kind" &&
            (props.value.size() !== 1 ||
                props.value.constants.length !== 1 ||
                props.value.constants[0].type !== "string" ||
                props.value.constants[0].values.length !== 1))
            return props.report({
                property: props.key,
                message: "must be a string literal type",
            });
        else if (
        // VALUE
        props.key === "value" &&
            !((props.value.size() === 0 && props.value.isRequired() === false) ||
                (props.value.size() === 1 &&
                    (props.value.objects.length === 1 ||
                        props.value.constants.length === 1))))
            return props.report({
                property: props.key,
                message: "must be a literal type or undefined value",
            });
        else if (props.key === "exclusive")
            return get_exclusive(props) !== null;
        else if (props.key === "validate") {
            //----
            // VALIDATE
            //----
            // UNDEFINED CASE
            if (props.value.size() === 0 &&
                props.value.isRequired() === false &&
                props.value.nullable === false)
                return true;
            // STRING CASE
            if (props.value.size() === 1 &&
                props.value.constants.length === 1 &&
                props.value.constants[0].type === "string" &&
                (props.value.constants[0].values.length === 1) === true)
                return true;
            // RECORD<TARGET, STRING>
            const target = (_a = props.value.objects[0]) === null || _a === void 0 ? void 0 : _a.type.properties.map((p) => p.key.getSoleLiteral()).filter((str) => str !== null);
            if (target === undefined)
                return props.report({
                    property: "target",
                    message: `must be one of 'boolean', 'bigint', 'number', 'string', 'array', 'object`,
                });
            const variadic = props.value.size() === 1 &&
                props.value.objects.length === 1 &&
                props.value.objects[0].type.properties.every((vp) => vp.value.size() === 1 &&
                    vp.value.isRequired() &&
                    vp.value.nullable === false &&
                    vp.value.constants.length === 1 &&
                    vp.value.constants[0].type === "string" &&
                    vp.value.constants[0].values.length === 1 &&
                    target.includes(vp.key.getSoleLiteral()));
            if (variadic === false)
                return props.report({
                    property: props.key,
                    message: `must be a string literal type or Record<Target, string> type.`,
                });
        }
        return true;
    };
    const create_metadata_type_tag = (props) => {
        var _a, _b, _c;
        const find = (key) => {
            var _a, _b;
            return (_b = (_a = props.object.properties[0]) === null || _a === void 0 ? void 0 : _a.value.objects[0]) === null || _b === void 0 ? void 0 : _b.type.properties.find((p) => p.key.getSoleLiteral() === key);
        };
        const target = find("target").value.constants[0].values.map((v) => v.value);
        const kind = find("kind").value.constants[0].values[0]
            .value;
        const value = (_b = (_a = find("value")) === null || _a === void 0 ? void 0 : _a.value.constants[0]) === null || _b === void 0 ? void 0 : _b.values[0].value;
        const exclusive = get_exclusive({
            report: props.report,
            key: "exclusive",
            value: (_c = find("exclusive")) === null || _c === void 0 ? void 0 : _c.value,
        });
        if (exclusive === null)
            return null;
        const validate = (() => {
            var _a;
            const validate = (_a = find("validate")) === null || _a === void 0 ? void 0 : _a.value;
            if (!validate || validate.size() === 0)
                return {};
            else if (validate.constants.length)
                return Object.fromEntries(target.map((t) => [
                    t,
                    validate.constants[0].values[0].value,
                ]));
            return Object.fromEntries(validate.objects[0].type.properties.map((p) => [
                p.key.getSoleLiteral(),
                p.value.constants[0].values[0].value,
            ]));
        })();
        const schema = (() => {
            var _a;
            const p = (_a = find("schema")) === null || _a === void 0 ? void 0 : _a.value;
            if (p === undefined)
                return undefined;
            else if (p.size() === 0 && p.isRequired() === false)
                return undefined;
            else if (p.size() === 1 &&
                p.nullable === false &&
                p.isRequired() === true &&
                p.any === false)
                return MetadataTypeTagSchemaFactory_1.MetadataTypeTagSchemaFactory.object({
                    report: (message) => props.report({
                        property: "schema",
                        message,
                    }),
                    object: p.objects[0].type,
                });
            props.report({
                property: "schema",
                message: "must be an object type",
            });
            return undefined;
        })();
        return {
            name: props.object.name,
            target,
            kind,
            value,
            validate,
            exclusive: exclusive !== null && exclusive !== void 0 ? exclusive : false,
            schema,
        };
    };
    const get_exclusive = (props) => {
        if (props.value === undefined)
            return false;
        else if (props.value.size() === 1 &&
            props.value.constants.length === 1 &&
            props.value.constants[0].type === "boolean" &&
            props.value.constants[0].values.length === 1)
            return props.value.constants[0].values[0].value;
        else if (props.value.size() === 1 &&
            props.value.tuples.length === 1 &&
            props.value.tuples[0].type.elements.every((elem) => elem.size() === 1 &&
                elem.constants.length === 1 &&
                elem.constants[0].type === "string" &&
                elem.constants[0].values.length === 1))
            return props.value.tuples[0].type.elements.map((elem) => elem.constants[0].values[0].value);
        props.report({
            property: props.key,
            message: "must a boolean literal type or a tuple of string literal types.",
        });
        return null;
    };
})(MetadataTypeTagFactory || (exports.MetadataTypeTagFactory = MetadataTypeTagFactory = {}));
const ESSENTIAL_FIELDS = ["target", "kind", "value"];
const FIELDS = [...ESSENTIAL_FIELDS, "validate", "exclusive"];
//# sourceMappingURL=MetadataTypeTagFactory.js.map