"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonApplicationProgrammer = void 0;
const Metadata_1 = require("../../schemas/metadata/Metadata");
const JsonSchemasProgrammer_1 = require("./JsonSchemasProgrammer");
var JsonApplicationProgrammer;
(function (JsonApplicationProgrammer) {
    JsonApplicationProgrammer.validate = (metadata, explore) => {
        var _a;
        if (explore.top === false)
            return JsonSchemasProgrammer_1.JsonSchemasProgrammer.validate(metadata);
        const output = [];
        const valid = metadata.size() === 1 &&
            metadata.objects.length === 1 &&
            metadata.isRequired() === true &&
            metadata.nullable === false;
        if (valid === false)
            output.push("JSON application's generic argument must be a class/interface type.");
        const object = (_a = metadata.objects[0]) === null || _a === void 0 ? void 0 : _a.type;
        if (object !== undefined) {
            if (object.properties.some((p) => p.key.isSoleLiteral() === false))
                output.push("JSON application does not allow dynamic keys.");
            let least = false;
            for (const p of object.properties) {
                const value = p.value;
                if (value.functions.length) {
                    least || (least = true);
                    if (valid === false) {
                        if (value.functions.length !== 1 || value.size() !== 1)
                            output.push("JSON application's function type does not allow union type.");
                        if (value.isRequired() === false)
                            output.push("JSON application's function type must be required.");
                        if (value.nullable === true)
                            output.push("JSON application's function type must not be nullable.");
                    }
                }
            }
            if (least === false)
                output.push("JSON application's target type must have at least a function type.");
        }
        return output;
    };
    JsonApplicationProgrammer.write = (props) => {
        const object = props.metadata.objects[0].type;
        const definitions = [];
        const setters = [];
        const collect = (metadata, setter) => {
            definitions.push(metadata);
            setters.push(setter);
        };
        const functions = object.properties
            .filter((p) => p.key.isSoleLiteral() &&
            p.value.size() === 1 &&
            p.value.nullable === false &&
            p.value.isRequired() === true &&
            Metadata_1.Metadata.unalias(p.value).functions.length === 1)
            .filter((p) => p.jsDocTags.find((tag) => tag.name === "hidden" || tag.name === "internal") === undefined &&
            (props.filter === undefined || props.filter(p) === true))
            .map((r) => collectFunction({
            version: props.version,
            name: r.key.getSoleLiteral(),
            function: Metadata_1.Metadata.unalias(r.value).functions[0],
            description: r.description,
            jsDocTags: r.jsDocTags,
            collect,
        }));
        const { components, schemas } = JsonSchemasProgrammer_1.JsonSchemasProgrammer.write({
            version: props.version,
            metadatas: definitions,
        });
        schemas.forEach((s, i) => { var _a; return (_a = setters[i]) === null || _a === void 0 ? void 0 : _a.call(setters, s); });
        return {
            version: props.version,
            components: components,
            functions,
        };
    };
    JsonApplicationProgrammer.writeDescription = (props) => {
        var _a;
        const title = (() => {
            var _a;
            const [explicit] = getJsDocTexts({
                jsDocTags: props.jsDocTags,
                name: props.kind,
            });
            if (explicit === null || explicit === void 0 ? void 0 : explicit.length)
                return explicit;
            else if (!((_a = props.description) === null || _a === void 0 ? void 0 : _a.length))
                return undefined;
            const index = props.description.indexOf("\n");
            const top = (index === -1 ? props.description : props.description.substring(0, index)).trim();
            return top.endsWith(".") ? top.substring(0, top.length - 1) : undefined;
        })();
        return {
            [props.kind]: title,
            description: ((_a = props.description) === null || _a === void 0 ? void 0 : _a.length) ? props.description : undefined,
        };
    };
    const collectFunction = (props) => {
        var _a;
        const deprecated = props.jsDocTags.some((tag) => tag.name === "deprecated");
        const tags = props.jsDocTags
            .map((tag) => {
            var _a, _b;
            return tag.name === "tag"
                ? ((_b = (_a = tag.text) === null || _a === void 0 ? void 0 : _a.filter((elem) => elem.kind === "text")) !== null && _b !== void 0 ? _b : [])
                : [];
        })
            .flat()
            .map((elem) => elem.text)
            .map((str) => { var _a; return (_a = str.trim().split(" ")[0]) !== null && _a !== void 0 ? _a : ""; })
            .filter((str) => !!str.length);
        return {
            name: props.name,
            async: props.function.async,
            parameters: props.function.parameters.map((param) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                const appParam = Object.assign(Object.assign({ name: param.name }, JsonApplicationProgrammer.writeDescription({
                    description: (_h = (_e = (_a = param.description) !== null && _a !== void 0 ? _a : (_d = (_c = (_b = param.jsDocTags.find((tag) => tag.name === "description")) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text) !== null && _e !== void 0 ? _e : (_g = (_f = props.jsDocTags
                        .find((tag) => { var _a, _b; return tag.name === "param" && ((_b = (_a = tag.text) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.text) === param.name; })) === null || _f === void 0 ? void 0 : _f.text) === null || _g === void 0 ? void 0 : _g.map((e) => e.text).join("").substring(param.name.length)) !== null && _h !== void 0 ? _h : null,
                    jsDocTags: props.jsDocTags,
                    kind: "title",
                })), { required: param.type.isRequired(), schema: null });
                props.collect(param.type, (schema) => (appParam.schema = schema));
                return appParam;
            }),
            output: props.function.output.size()
                ? (() => {
                    var _a, _b;
                    const appOutput = {
                        schema: null,
                        required: props.function.output.isRequired(),
                        description: (_b = (_a = writeDescriptionFromJsDocTag({
                            jsDocTags: props.jsDocTags,
                            name: "return",
                        })) !== null && _a !== void 0 ? _a : writeDescriptionFromJsDocTag({
                            jsDocTags: props.jsDocTags,
                            name: "returns",
                        })) !== null && _b !== void 0 ? _b : undefined,
                    };
                    props.collect(props.function.output, (schema) => (appOutput.schema = schema));
                    return appOutput;
                })()
                : undefined,
            description: (_a = props.description) !== null && _a !== void 0 ? _a : undefined,
            deprecated: deprecated || undefined,
            tags: tags.length ? tags : undefined,
        };
    };
})(JsonApplicationProgrammer || (exports.JsonApplicationProgrammer = JsonApplicationProgrammer = {}));
const writeDescriptionFromJsDocTag = (props) => {
    var _a, _b;
    const parametric = props.parameter
        ? (tag) => tag.text.find((elem) => elem.kind === "parameterName" && elem.text === props.parameter) !== undefined
        : () => true;
    const tag = props.jsDocTags.find((tag) => tag.name === props.name && tag.text && parametric(tag));
    return tag && tag.text
        ? ((_b = (_a = tag.text.find((elem) => elem.kind === "text")) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : null)
        : null;
};
const getJsDocTexts = (props) => props.jsDocTags
    .filter((tag) => tag.name === props.name &&
    tag.text &&
    tag.text.find((elem) => elem.kind === "text" && elem.text.length) !==
        undefined)
    .map((tag) => tag.text.find((elem) => elem.kind === "text").text);
//# sourceMappingURL=JsonApplicationProgrammer.js.map