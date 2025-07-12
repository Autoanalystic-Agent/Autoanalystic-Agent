"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertMcpController = assertMcpController;
const __typia_transform__assertGuard = __importStar(require("typia/lib/internal/_assertGuard.js"));
const __typia_transform__accessExpressionAsString = __importStar(require("typia/lib/internal/_accessExpressionAsString.js"));
const openapi_1 = require("@samchon/openapi");
const typia_1 = __importDefault(require("typia"));
/**
 * Create an MCP controller with type assertion.
 *
 * Create an {@link IAgenticaController.IMcp} instance which represents
 * an MCP (Model Context Protocol) controller with LLM function calling
 * schemas and client connection.
 *
 * @param props Properties to create the MCP controller
 * @param props.name Name of the MCP implementation.
 * @param props.client Client connection to the MCP implementation.
 * @param props.model Model schema of the LLM function calling.
 * @param props.options Options to create the MCP controller.
 * @returns MCP LLM application instance
 * @author sunrabbit123
 */
function assertMcpController(props) {
    return __awaiter(this, void 0, void 0, function* () {
        // for peerDependencies
        const { ListToolsResultSchema } = yield Promise.resolve().then(() => __importStar(require("@modelcontextprotocol/sdk/types.js")));
        // get list of tools
        const { tools } = yield props.client.request({ method: "tools/list" }, ListToolsResultSchema);
        const application = openapi_1.McpLlm.application({
            model: props.model,
            tools: (() => { const _io0 = input => "string" === typeof input.name && input.name.length <= 64 && (undefined === input.description || "string" === typeof input.description) && ("object" === typeof input.inputSchema && null !== input.inputSchema && _iu1(input.inputSchema)); const _io1 = input => (undefined === input.nullable || "boolean" === typeof input.nullable) && (undefined === input.properties || "object" === typeof input.properties && null !== input.properties && false === Array.isArray(input.properties) && _io2(input.properties)) && (undefined === input.required || Array.isArray(input.required) && input.required.every(elem => "string" === typeof elem)) && (null !== input.additionalProperties && (undefined === input.additionalProperties || "boolean" === typeof input.additionalProperties || "object" === typeof input.additionalProperties && null !== input.additionalProperties && false === Array.isArray(input.additionalProperties) && _iu0(input.additionalProperties))) && (undefined === input.maxProperties || "number" === typeof input.maxProperties) && (undefined === input.minProperties || "number" === typeof input.minProperties) && "object" === input.type && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))) && (undefined === input.$defs || "object" === typeof input.$defs && null !== input.$defs && false === Array.isArray(input.$defs) && _io2(input.$defs)); const _io2 = input => Object.keys(input).every(key => {
                const value = input[key];
                if (undefined === value)
                    return true;
                return "object" === typeof value && null !== value && false === Array.isArray(value) && _iu0(value);
            }); const _io3 = input => (undefined === input.nullable || "boolean" === typeof input.nullable) && (undefined === input.properties || "object" === typeof input.properties && null !== input.properties && false === Array.isArray(input.properties) && _io2(input.properties)) && (undefined === input.required || Array.isArray(input.required) && input.required.every(elem => "string" === typeof elem)) && (null !== input.additionalProperties && (undefined === input.additionalProperties || "boolean" === typeof input.additionalProperties || "object" === typeof input.additionalProperties && null !== input.additionalProperties && false === Array.isArray(input.additionalProperties) && _iu0(input.additionalProperties))) && (undefined === input.maxProperties || "number" === typeof input.maxProperties) && (undefined === input.minProperties || "number" === typeof input.minProperties) && "object" === input.type && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))); const _io4 = input => Array.isArray(input.type) && input.type.every(elem => "string" === elem || "number" === elem || "boolean" === elem || "object" === elem || "integer" === elem || "array" === elem || "null" === elem) && (null === input["default"] || undefined === input["default"] || Array.isArray(input["default"])) && (undefined === input["enum"] || Array.isArray(input["enum"])) && ("string" === typeof input["const"] || "number" === typeof input["const"] || "boolean" === typeof input["const"]) && (undefined === input.nullable || "boolean" === typeof input.nullable) && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))) && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true && (undefined === input.minimum || "number" === typeof input.minimum) && (undefined === input.maximum || "number" === typeof input.maximum) && (undefined === input.multipleOf || "number" === typeof input.multipleOf && 0 < input.multipleOf) && (undefined === input.exclusiveMinimum || "number" === typeof input.exclusiveMinimum || "boolean" === typeof input.exclusiveMinimum) && (undefined === input.exclusiveMaximum || "number" === typeof input.exclusiveMaximum || "boolean" === typeof input.exclusiveMaximum) && (undefined === input.format || "string" === typeof input.format) && (undefined === input.maxLength || "number" === typeof input.maxLength && (Math.floor(input.maxLength) === input.maxLength && 0 <= input.maxLength && input.maxLength <= 18446744073709552000)) && (undefined === input.pattern || "string" === typeof input.pattern) && (undefined === input.contentMediaType || "string" === typeof input.contentMediaType) && (undefined === input.minLength || "number" === typeof input.minLength && (Math.floor(input.minLength) === input.minLength && 0 <= input.minLength && input.minLength <= 18446744073709552000)) && (null !== input.items && (undefined === input.items || (Array.isArray(input.items) && input.items.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _iu0(elem)) || "object" === typeof input.items && null !== input.items && false === Array.isArray(input.items) && _iu0(input.items)))) && (undefined === input.prefixItems || Array.isArray(input.prefixItems) && input.prefixItems.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _iu0(elem))) && (undefined === input.uniqueItems || "boolean" === typeof input.uniqueItems) && (null !== input.additionalItems && (undefined === input.additionalItems || "boolean" === typeof input.additionalItems || "object" === typeof input.additionalItems && null !== input.additionalItems && false === Array.isArray(input.additionalItems) && _iu0(input.additionalItems))) && (undefined === input.minItems || "number" === typeof input.minItems && (Math.floor(input.minItems) === input.minItems && 0 <= input.minItems && input.minItems <= 18446744073709552000)) && (undefined === input.maxItems || "number" === typeof input.maxItems && (Math.floor(input.maxItems) === input.maxItems && 0 <= input.maxItems && input.maxItems <= 18446744073709552000)) && (null !== input.additionalProperties && (undefined === input.additionalProperties || "boolean" === typeof input.additionalProperties || "object" === typeof input.additionalProperties && null !== input.additionalProperties && false === Array.isArray(input.additionalProperties) && _iu0(input.additionalProperties))) && (undefined === input.properties || "object" === typeof input.properties && null !== input.properties && false === Array.isArray(input.properties) && _io2(input.properties)) && (undefined === input.required || Array.isArray(input.required) && input.required.every(elem => "string" === typeof elem)) && (undefined === input.maxProperties || "number" === typeof input.maxProperties) && (undefined === input.minProperties || "number" === typeof input.minProperties) && (Array.isArray(input.oneOf) && input.oneOf.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _iu0(elem))) && (undefined === input.discriminator || "object" === typeof input.discriminator && null !== input.discriminator && _io17(input.discriminator)) && (Array.isArray(input.anyOf) && input.anyOf.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _iu0(elem))) && (Array.isArray(input.allOf) && input.allOf.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _iu0(elem))) && "string" === typeof input.$ref; const _io5 = input => Object.keys(input).every(key => {
                const value = input[key];
                if (undefined === value)
                    return true;
                return true;
            }); const _io6 = input => ("string" === typeof input["const"] || "number" === typeof input["const"] || "boolean" === typeof input["const"]) && (undefined === input.nullable || "boolean" === typeof input.nullable) && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))) && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true; const _io7 = input => (undefined === input.nullable || "boolean" === typeof input.nullable) && (null === input["default"] || undefined === input["default"] || "boolean" === typeof input["default"]) && (undefined === input["enum"] || Array.isArray(input["enum"]) && input["enum"].every(elem => null === elem || "boolean" === typeof elem)) && "boolean" === input.type && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))); const _io8 = input => (undefined === input.nullable || "boolean" === typeof input.nullable) && (null === input["default"] || undefined === input["default"] || "number" === typeof input["default"] && (Math.floor(input["default"]) === input["default"] && -9223372036854776000 <= input["default"] && input["default"] <= 9223372036854776000)) && (undefined === input["enum"] || Array.isArray(input["enum"]) && input["enum"].every(elem => null === elem || "number" === typeof elem)) && (undefined === input.minimum || "number" === typeof input.minimum && (Math.floor(input.minimum) === input.minimum && -9223372036854776000 <= input.minimum && input.minimum <= 9223372036854776000)) && (undefined === input.maximum || "number" === typeof input.maximum && (Math.floor(input.maximum) === input.maximum && -9223372036854776000 <= input.maximum && input.maximum <= 9223372036854776000)) && (undefined === input.exclusiveMinimum || "number" === typeof input.exclusiveMinimum && (Math.floor(input.exclusiveMinimum) === input.exclusiveMinimum && -9223372036854776000 <= input.exclusiveMinimum && input.exclusiveMinimum <= 9223372036854776000) || "boolean" === typeof input.exclusiveMinimum) && (undefined === input.exclusiveMaximum || "number" === typeof input.exclusiveMaximum && (Math.floor(input.exclusiveMaximum) === input.exclusiveMaximum && -9223372036854776000 <= input.exclusiveMaximum && input.exclusiveMaximum <= 9223372036854776000) || "boolean" === typeof input.exclusiveMaximum) && (undefined === input.multipleOf || "number" === typeof input.multipleOf && (Math.floor(input.multipleOf) === input.multipleOf && 0 <= input.multipleOf && input.multipleOf <= 18446744073709552000 && 0 < input.multipleOf)) && "integer" === input.type && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))); const _io9 = input => (undefined === input.nullable || "boolean" === typeof input.nullable) && (null === input["default"] || undefined === input["default"] || "number" === typeof input["default"]) && (undefined === input["enum"] || Array.isArray(input["enum"]) && input["enum"].every(elem => null === elem || "number" === typeof elem)) && (undefined === input.minimum || "number" === typeof input.minimum) && (undefined === input.maximum || "number" === typeof input.maximum) && (undefined === input.exclusiveMinimum || "number" === typeof input.exclusiveMinimum || "boolean" === typeof input.exclusiveMinimum) && (undefined === input.exclusiveMaximum || "number" === typeof input.exclusiveMaximum || "boolean" === typeof input.exclusiveMaximum) && (undefined === input.multipleOf || "number" === typeof input.multipleOf && 0 < input.multipleOf) && "number" === input.type && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))); const _io10 = input => (undefined === input.nullable || "boolean" === typeof input.nullable) && (null === input["default"] || undefined === input["default"] || "string" === typeof input["default"]) && (undefined === input["enum"] || Array.isArray(input["enum"]) && input["enum"].every(elem => null === elem || "string" === typeof elem)) && (undefined === input.format || "string" === typeof input.format) && (undefined === input.pattern || "string" === typeof input.pattern) && (undefined === input.contentMediaType || "string" === typeof input.contentMediaType) && (undefined === input.minLength || "number" === typeof input.minLength && (Math.floor(input.minLength) === input.minLength && 0 <= input.minLength && input.minLength <= 18446744073709552000)) && (undefined === input.maxLength || "number" === typeof input.maxLength && (Math.floor(input.maxLength) === input.maxLength && 0 <= input.maxLength && input.maxLength <= 18446744073709552000)) && "string" === input.type && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))); const _io11 = input => (undefined === input.nullable || "boolean" === typeof input.nullable) && (null !== input.items && (undefined === input.items || (Array.isArray(input.items) && input.items.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _iu0(elem)) || "object" === typeof input.items && null !== input.items && false === Array.isArray(input.items) && _iu0(input.items)))) && (undefined === input.prefixItems || Array.isArray(input.prefixItems) && input.prefixItems.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _iu0(elem))) && (undefined === input.uniqueItems || "boolean" === typeof input.uniqueItems) && (null !== input.additionalItems && (undefined === input.additionalItems || "boolean" === typeof input.additionalItems || "object" === typeof input.additionalItems && null !== input.additionalItems && false === Array.isArray(input.additionalItems) && _iu0(input.additionalItems))) && (undefined === input.minItems || "number" === typeof input.minItems && (Math.floor(input.minItems) === input.minItems && 0 <= input.minItems && input.minItems <= 18446744073709552000)) && (undefined === input.maxItems || "number" === typeof input.maxItems && (Math.floor(input.maxItems) === input.maxItems && 0 <= input.maxItems && input.maxItems <= 18446744073709552000)) && "array" === input.type && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))); const _io12 = input => "string" === typeof input.$ref && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))) && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true; const _io13 = input => "string" === typeof input.$recursiveRef && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))) && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true; const _io14 = input => Array.isArray(input.allOf) && input.allOf.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _iu0(elem)) && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))) && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true; const _io15 = input => Array.isArray(input.anyOf) && input.anyOf.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _iu0(elem)) && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))) && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true; const _io16 = input => Array.isArray(input.oneOf) && input.oneOf.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _iu0(elem)) && (undefined === input.discriminator || "object" === typeof input.discriminator && null !== input.discriminator && _io17(input.discriminator)) && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))) && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true; const _io17 = input => "string" === typeof input.propertyName && (undefined === input.mapping || "object" === typeof input.mapping && null !== input.mapping && false === Array.isArray(input.mapping) && _io18(input.mapping)); const _io18 = input => Object.keys(input).every(key => {
                const value = input[key];
                if (undefined === value)
                    return true;
                return "string" === typeof value;
            }); const _io19 = input => (null === input["default"] || undefined === input["default"]) && "null" === input.type && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))); const _io20 = input => null !== input.type && undefined === input.type && true && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))); const _io21 = input => "string" === typeof input.$ref && (null !== input.examples && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _io5(input.examples)))) && (undefined === input.title || "string" === typeof input.title) && (undefined === input.description || "string" === typeof input.description) && (undefined === input.deprecated || "boolean" === typeof input.deprecated) && true && (undefined === input.$defs || "object" === typeof input.$defs && null !== input.$defs && false === Array.isArray(input.$defs) && _io2(input.$defs)); const _iu0 = input => (() => {
                if ("object" === input.type)
                    return _io3(input);
                else if (Array.isArray(input.type) && input.type.every(elem => "string" === elem || "number" === elem || "boolean" === elem || "object" === elem || "integer" === elem || "array" === elem || "null" === elem))
                    return _io4(input);
                else if ("boolean" === input.type)
                    return _io7(input);
                else if ("number" === input.type)
                    return _io9(input);
                else if ("integer" === input.type)
                    return _io8(input);
                else if ("string" === input.type)
                    return _io10(input);
                else if ("array" === input.type)
                    return _io11(input);
                else if (undefined !== input.$recursiveRef)
                    return _io13(input);
                else if ("null" === input.type)
                    return _io19(input);
                else
                    return (() => {
                        if (undefined !== input["const"])
                            return _io6(input);
                        else if (undefined !== input.$ref)
                            return _io12(input);
                        else if (undefined !== input.allOf)
                            return _io14(input);
                        else if (undefined !== input.anyOf)
                            return _io15(input);
                        else if (undefined !== input.oneOf)
                            return _io16(input);
                        else
                            return _io20(input);
                    })();
            })(); const _iu1 = input => (() => {
                if (undefined !== input.type)
                    return _io1(input);
                else if (undefined !== input.$ref)
                    return _io21(input);
                else
                    return false;
            })(); const _ao0 = (input, _path, _exceptionable = true) => ("string" === typeof input.name && (input.name.length <= 64 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".name",
                expected: "string & MaxLength<64>",
                value: input.name
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".name",
                expected: "(string & MaxLength<64>)",
                value: input.name
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (("object" === typeof input.inputSchema && null !== input.inputSchema || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".inputSchema",
                expected: "(IObject & { $defs?: Record<string, IJsonSchema> | undefined; } | IReference<string> & { $defs?: Record<string, IJsonSchema> | undefined; })",
                value: input.inputSchema
            }, _errorFactory)) && _au1(input.inputSchema, _path + ".inputSchema", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".inputSchema",
                expected: "(IObject & { $defs?: Record<string, IJsonSchema> | undefined; } | IReference<string> & { $defs?: Record<string, IJsonSchema> | undefined; })",
                value: input.inputSchema
            }, _errorFactory)); const _ao1 = (input, _path, _exceptionable = true) => (undefined === input.nullable || "boolean" === typeof input.nullable || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".nullable",
                expected: "(boolean | undefined)",
                value: input.nullable
            }, _errorFactory)) && (undefined === input.properties || ("object" === typeof input.properties && null !== input.properties && false === Array.isArray(input.properties) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".properties",
                expected: "(Record<string, OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.properties
            }, _errorFactory)) && _ao2(input.properties, _path + ".properties", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".properties",
                expected: "(Record<string, OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.properties
            }, _errorFactory)) && (undefined === input.required || (Array.isArray(input.required) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".required",
                expected: "(Array<string> | undefined)",
                value: input.required
            }, _errorFactory)) && input.required.every((elem, _index22) => "string" === typeof elem || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".required[" + _index22 + "]",
                expected: "string",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".required",
                expected: "(Array<string> | undefined)",
                value: input.required
            }, _errorFactory)) && ((null !== input.additionalProperties || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalProperties",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalProperties
            }, _errorFactory)) && (undefined === input.additionalProperties || "boolean" === typeof input.additionalProperties || ("object" === typeof input.additionalProperties && null !== input.additionalProperties && false === Array.isArray(input.additionalProperties) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalProperties",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalProperties
            }, _errorFactory)) && _au0(input.additionalProperties, _path + ".additionalProperties", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalProperties",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalProperties
            }, _errorFactory))) && (undefined === input.maxProperties || "number" === typeof input.maxProperties || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maxProperties",
                expected: "(number | undefined)",
                value: input.maxProperties
            }, _errorFactory)) && (undefined === input.minProperties || "number" === typeof input.minProperties || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minProperties",
                expected: "(number | undefined)",
                value: input.minProperties
            }, _errorFactory)) && ("object" === input.type || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".type",
                expected: "\"object\"",
                value: input.type
            }, _errorFactory)) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))) && (undefined === input.$defs || ("object" === typeof input.$defs && null !== input.$defs && false === Array.isArray(input.$defs) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".$defs",
                expected: "(Record<string, OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.$defs
            }, _errorFactory)) && _ao2(input.$defs, _path + ".$defs", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".$defs",
                expected: "(Record<string, OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.$defs
            }, _errorFactory)); const _ao2 = (input, _path, _exceptionable = true) => false === _exceptionable || Object.keys(input).every(key => {
                const value = input[key];
                if (undefined === value)
                    return true;
                return ("object" === typeof value && null !== value && false === Array.isArray(value) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                    method: "typia.assert",
                    path: _path + __typia_transform__accessExpressionAsString._accessExpressionAsString(key),
                    expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                    value: value
                }, _errorFactory)) && _au0(value, _path + __typia_transform__accessExpressionAsString._accessExpressionAsString(key), true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                    method: "typia.assert",
                    path: _path + __typia_transform__accessExpressionAsString._accessExpressionAsString(key),
                    expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                    value: value
                }, _errorFactory);
            }); const _ao3 = (input, _path, _exceptionable = true) => (undefined === input.nullable || "boolean" === typeof input.nullable || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".nullable",
                expected: "(boolean | undefined)",
                value: input.nullable
            }, _errorFactory)) && (undefined === input.properties || ("object" === typeof input.properties && null !== input.properties && false === Array.isArray(input.properties) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".properties",
                expected: "(Record<string, OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.properties
            }, _errorFactory)) && _ao2(input.properties, _path + ".properties", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".properties",
                expected: "(Record<string, OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.properties
            }, _errorFactory)) && (undefined === input.required || (Array.isArray(input.required) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".required",
                expected: "(Array<string> | undefined)",
                value: input.required
            }, _errorFactory)) && input.required.every((elem, _index23) => "string" === typeof elem || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".required[" + _index23 + "]",
                expected: "string",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".required",
                expected: "(Array<string> | undefined)",
                value: input.required
            }, _errorFactory)) && ((null !== input.additionalProperties || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalProperties",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalProperties
            }, _errorFactory)) && (undefined === input.additionalProperties || "boolean" === typeof input.additionalProperties || ("object" === typeof input.additionalProperties && null !== input.additionalProperties && false === Array.isArray(input.additionalProperties) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalProperties",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalProperties
            }, _errorFactory)) && _au0(input.additionalProperties, _path + ".additionalProperties", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalProperties",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalProperties
            }, _errorFactory))) && (undefined === input.maxProperties || "number" === typeof input.maxProperties || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maxProperties",
                expected: "(number | undefined)",
                value: input.maxProperties
            }, _errorFactory)) && (undefined === input.minProperties || "number" === typeof input.minProperties || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minProperties",
                expected: "(number | undefined)",
                value: input.minProperties
            }, _errorFactory)) && ("object" === input.type || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".type",
                expected: "\"object\"",
                value: input.type
            }, _errorFactory)) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))); const _ao4 = (input, _path, _exceptionable = true) => ((Array.isArray(input.type) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".type",
                expected: "Array<\"string\" | \"number\" | \"boolean\" | \"object\" | \"integer\" | \"array\" | \"null\">",
                value: input.type
            }, _errorFactory)) && input.type.every((elem, _index24) => "string" === elem || "number" === elem || "boolean" === elem || "object" === elem || "integer" === elem || "array" === elem || "null" === elem || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".type[" + _index24 + "]",
                expected: "(\"array\" | \"boolean\" | \"integer\" | \"null\" | \"number\" | \"object\" | \"string\")",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".type",
                expected: "Array<\"string\" | \"number\" | \"boolean\" | \"object\" | \"integer\" | \"array\" | \"null\">",
                value: input.type
            }, _errorFactory)) && (null === input["default"] || undefined === input["default"] || Array.isArray(input["default"]) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"default\"]",
                expected: "(Array<any> | null | undefined)",
                value: input["default"]
            }, _errorFactory)) && (undefined === input["enum"] || Array.isArray(input["enum"]) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"enum\"]",
                expected: "(Array<any> | undefined)",
                value: input["enum"]
            }, _errorFactory)) && ("string" === typeof input["const"] || "number" === typeof input["const"] || "boolean" === typeof input["const"] || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"const\"]",
                expected: "(boolean | number | string)",
                value: input["const"]
            }, _errorFactory)) && (undefined === input.nullable || "boolean" === typeof input.nullable || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".nullable",
                expected: "(boolean | undefined)",
                value: input.nullable
            }, _errorFactory)) && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true && (undefined === input.minimum || "number" === typeof input.minimum || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minimum",
                expected: "(number | undefined)",
                value: input.minimum
            }, _errorFactory)) && (undefined === input.maximum || "number" === typeof input.maximum || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maximum",
                expected: "(number | undefined)",
                value: input.maximum
            }, _errorFactory)) && (undefined === input.multipleOf || "number" === typeof input.multipleOf && (0 < input.multipleOf || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".multipleOf",
                expected: "number & ExclusiveMinimum<0>",
                value: input.multipleOf
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".multipleOf",
                expected: "((number & ExclusiveMinimum<0>) | undefined)",
                value: input.multipleOf
            }, _errorFactory)) && (undefined === input.exclusiveMinimum || "number" === typeof input.exclusiveMinimum || "boolean" === typeof input.exclusiveMinimum || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".exclusiveMinimum",
                expected: "(boolean | number | undefined)",
                value: input.exclusiveMinimum
            }, _errorFactory)) && (undefined === input.exclusiveMaximum || "number" === typeof input.exclusiveMaximum || "boolean" === typeof input.exclusiveMaximum || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".exclusiveMaximum",
                expected: "(boolean | number | undefined)",
                value: input.exclusiveMaximum
            }, _errorFactory)) && (undefined === input.format || "string" === typeof input.format || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".format",
                expected: "(string | undefined)",
                value: input.format
            }, _errorFactory)) && (undefined === input.maxLength || "number" === typeof input.maxLength && (Math.floor(input.maxLength) === input.maxLength && 0 <= input.maxLength && input.maxLength <= 18446744073709552000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maxLength",
                expected: "number & Type<\"uint64\">",
                value: input.maxLength
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maxLength",
                expected: "((number & Type<\"uint64\">) | undefined)",
                value: input.maxLength
            }, _errorFactory)) && (undefined === input.pattern || "string" === typeof input.pattern || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".pattern",
                expected: "(string | undefined)",
                value: input.pattern
            }, _errorFactory)) && (undefined === input.contentMediaType || "string" === typeof input.contentMediaType || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".contentMediaType",
                expected: "(string | undefined)",
                value: input.contentMediaType
            }, _errorFactory)) && (undefined === input.minLength || "number" === typeof input.minLength && (Math.floor(input.minLength) === input.minLength && 0 <= input.minLength && input.minLength <= 18446744073709552000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minLength",
                expected: "number & Type<\"uint64\">",
                value: input.minLength
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minLength",
                expected: "((number & Type<\"uint64\">) | undefined)",
                value: input.minLength
            }, _errorFactory)) && ((null !== input.items || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".items",
                expected: "(Array<OpenApiV3_1.IJsonSchema> | OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | undefined)",
                value: input.items
            }, _errorFactory)) && (undefined === input.items || (Array.isArray(input.items) && input.items.every((elem, _index25) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".items[" + _index25 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) && _au0(elem, _path + ".items[" + _index25 + "]", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".items[" + _index25 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) || "object" === typeof input.items && null !== input.items && false === Array.isArray(input.items) && _au0(input.items, _path + ".items", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".items",
                expected: "(Array<OpenApiV3_1.IJsonSchema> | OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | undefined)",
                value: input.items
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".items",
                expected: "(Array<OpenApiV3_1.IJsonSchema> | OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | undefined)",
                value: input.items
            }, _errorFactory))) && (undefined === input.prefixItems || (Array.isArray(input.prefixItems) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".prefixItems",
                expected: "(Array<OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.prefixItems
            }, _errorFactory)) && input.prefixItems.every((elem, _index26) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".prefixItems[" + _index26 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) && _au0(elem, _path + ".prefixItems[" + _index26 + "]", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".prefixItems[" + _index26 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".prefixItems",
                expected: "(Array<OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.prefixItems
            }, _errorFactory)) && (undefined === input.uniqueItems || "boolean" === typeof input.uniqueItems || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".uniqueItems",
                expected: "(boolean | undefined)",
                value: input.uniqueItems
            }, _errorFactory)) && ((null !== input.additionalItems || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalItems",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalItems
            }, _errorFactory)) && (undefined === input.additionalItems || "boolean" === typeof input.additionalItems || ("object" === typeof input.additionalItems && null !== input.additionalItems && false === Array.isArray(input.additionalItems) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalItems",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalItems
            }, _errorFactory)) && _au0(input.additionalItems, _path + ".additionalItems", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalItems",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalItems
            }, _errorFactory))) && (undefined === input.minItems || "number" === typeof input.minItems && (Math.floor(input.minItems) === input.minItems && 0 <= input.minItems && input.minItems <= 18446744073709552000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minItems",
                expected: "number & Type<\"uint64\">",
                value: input.minItems
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minItems",
                expected: "((number & Type<\"uint64\">) | undefined)",
                value: input.minItems
            }, _errorFactory)) && (undefined === input.maxItems || "number" === typeof input.maxItems && (Math.floor(input.maxItems) === input.maxItems && 0 <= input.maxItems && input.maxItems <= 18446744073709552000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maxItems",
                expected: "number & Type<\"uint64\">",
                value: input.maxItems
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maxItems",
                expected: "((number & Type<\"uint64\">) | undefined)",
                value: input.maxItems
            }, _errorFactory)) && ((null !== input.additionalProperties || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalProperties",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalProperties
            }, _errorFactory)) && (undefined === input.additionalProperties || "boolean" === typeof input.additionalProperties || ("object" === typeof input.additionalProperties && null !== input.additionalProperties && false === Array.isArray(input.additionalProperties) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalProperties",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalProperties
            }, _errorFactory)) && _au0(input.additionalProperties, _path + ".additionalProperties", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalProperties",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalProperties
            }, _errorFactory))) && (undefined === input.properties || ("object" === typeof input.properties && null !== input.properties && false === Array.isArray(input.properties) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".properties",
                expected: "(Record<string, OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.properties
            }, _errorFactory)) && _ao2(input.properties, _path + ".properties", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".properties",
                expected: "(Record<string, OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.properties
            }, _errorFactory)) && (undefined === input.required || (Array.isArray(input.required) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".required",
                expected: "(Array<string> | undefined)",
                value: input.required
            }, _errorFactory)) && input.required.every((elem, _index27) => "string" === typeof elem || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".required[" + _index27 + "]",
                expected: "string",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".required",
                expected: "(Array<string> | undefined)",
                value: input.required
            }, _errorFactory)) && (undefined === input.maxProperties || "number" === typeof input.maxProperties || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maxProperties",
                expected: "(number | undefined)",
                value: input.maxProperties
            }, _errorFactory)) && (undefined === input.minProperties || "number" === typeof input.minProperties || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minProperties",
                expected: "(number | undefined)",
                value: input.minProperties
            }, _errorFactory)) && ((Array.isArray(input.oneOf) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".oneOf",
                expected: "Array<OpenApiV3_1.IJsonSchema>",
                value: input.oneOf
            }, _errorFactory)) && input.oneOf.every((elem, _index28) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".oneOf[" + _index28 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) && _au0(elem, _path + ".oneOf[" + _index28 + "]", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".oneOf[" + _index28 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".oneOf",
                expected: "Array<OpenApiV3_1.IJsonSchema>",
                value: input.oneOf
            }, _errorFactory)) && (undefined === input.discriminator || ("object" === typeof input.discriminator && null !== input.discriminator || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".discriminator",
                expected: "(OpenApiV3_1.IJsonSchema.IOneOf.IDiscriminator | undefined)",
                value: input.discriminator
            }, _errorFactory)) && _ao17(input.discriminator, _path + ".discriminator", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".discriminator",
                expected: "(OpenApiV3_1.IJsonSchema.IOneOf.IDiscriminator | undefined)",
                value: input.discriminator
            }, _errorFactory)) && ((Array.isArray(input.anyOf) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".anyOf",
                expected: "Array<OpenApiV3_1.IJsonSchema>",
                value: input.anyOf
            }, _errorFactory)) && input.anyOf.every((elem, _index29) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".anyOf[" + _index29 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) && _au0(elem, _path + ".anyOf[" + _index29 + "]", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".anyOf[" + _index29 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".anyOf",
                expected: "Array<OpenApiV3_1.IJsonSchema>",
                value: input.anyOf
            }, _errorFactory)) && ((Array.isArray(input.allOf) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".allOf",
                expected: "Array<OpenApiV3_1.IJsonSchema>",
                value: input.allOf
            }, _errorFactory)) && input.allOf.every((elem, _index30) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".allOf[" + _index30 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) && _au0(elem, _path + ".allOf[" + _index30 + "]", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".allOf[" + _index30 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".allOf",
                expected: "Array<OpenApiV3_1.IJsonSchema>",
                value: input.allOf
            }, _errorFactory)) && ("string" === typeof input.$ref || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".$ref",
                expected: "string",
                value: input.$ref
            }, _errorFactory)); const _ao5 = (input, _path, _exceptionable = true) => false === _exceptionable || Object.keys(input).every(key => {
                const value = input[key];
                if (undefined === value)
                    return true;
                return true;
            }); const _ao6 = (input, _path, _exceptionable = true) => ("string" === typeof input["const"] || "number" === typeof input["const"] || "boolean" === typeof input["const"] || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"const\"]",
                expected: "(boolean | number | string)",
                value: input["const"]
            }, _errorFactory)) && (undefined === input.nullable || "boolean" === typeof input.nullable || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".nullable",
                expected: "(boolean | undefined)",
                value: input.nullable
            }, _errorFactory)) && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true; const _ao7 = (input, _path, _exceptionable = true) => (undefined === input.nullable || "boolean" === typeof input.nullable || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".nullable",
                expected: "(boolean | undefined)",
                value: input.nullable
            }, _errorFactory)) && (null === input["default"] || undefined === input["default"] || "boolean" === typeof input["default"] || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"default\"]",
                expected: "(boolean | null | undefined)",
                value: input["default"]
            }, _errorFactory)) && (undefined === input["enum"] || (Array.isArray(input["enum"]) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"enum\"]",
                expected: "(Array<boolean | null> | undefined)",
                value: input["enum"]
            }, _errorFactory)) && input["enum"].every((elem, _index31) => null === elem || "boolean" === typeof elem || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"enum\"][" + _index31 + "]",
                expected: "(boolean | null)",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"enum\"]",
                expected: "(Array<boolean | null> | undefined)",
                value: input["enum"]
            }, _errorFactory)) && ("boolean" === input.type || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".type",
                expected: "\"boolean\"",
                value: input.type
            }, _errorFactory)) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))); const _ao8 = (input, _path, _exceptionable = true) => (undefined === input.nullable || "boolean" === typeof input.nullable || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".nullable",
                expected: "(boolean | undefined)",
                value: input.nullable
            }, _errorFactory)) && (null === input["default"] || undefined === input["default"] || "number" === typeof input["default"] && (Math.floor(input["default"]) === input["default"] && -9223372036854776000 <= input["default"] && input["default"] <= 9223372036854776000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"default\"]",
                expected: "number & Type<\"int64\">",
                value: input["default"]
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"default\"]",
                expected: "((number & Type<\"int64\">) | null | undefined)",
                value: input["default"]
            }, _errorFactory)) && (undefined === input["enum"] || (Array.isArray(input["enum"]) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"enum\"]",
                expected: "(Array<number | null> | undefined)",
                value: input["enum"]
            }, _errorFactory)) && input["enum"].every((elem, _index32) => null === elem || "number" === typeof elem || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"enum\"][" + _index32 + "]",
                expected: "(null | number)",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"enum\"]",
                expected: "(Array<number | null> | undefined)",
                value: input["enum"]
            }, _errorFactory)) && (undefined === input.minimum || "number" === typeof input.minimum && (Math.floor(input.minimum) === input.minimum && -9223372036854776000 <= input.minimum && input.minimum <= 9223372036854776000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minimum",
                expected: "number & Type<\"int64\">",
                value: input.minimum
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minimum",
                expected: "((number & Type<\"int64\">) | undefined)",
                value: input.minimum
            }, _errorFactory)) && (undefined === input.maximum || "number" === typeof input.maximum && (Math.floor(input.maximum) === input.maximum && -9223372036854776000 <= input.maximum && input.maximum <= 9223372036854776000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maximum",
                expected: "number & Type<\"int64\">",
                value: input.maximum
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maximum",
                expected: "((number & Type<\"int64\">) | undefined)",
                value: input.maximum
            }, _errorFactory)) && (undefined === input.exclusiveMinimum || "number" === typeof input.exclusiveMinimum && (Math.floor(input.exclusiveMinimum) === input.exclusiveMinimum && -9223372036854776000 <= input.exclusiveMinimum && input.exclusiveMinimum <= 9223372036854776000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".exclusiveMinimum",
                expected: "number & Type<\"int64\">",
                value: input.exclusiveMinimum
            }, _errorFactory)) || "boolean" === typeof input.exclusiveMinimum || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".exclusiveMinimum",
                expected: "((number & Type<\"int64\">) | boolean | undefined)",
                value: input.exclusiveMinimum
            }, _errorFactory)) && (undefined === input.exclusiveMaximum || "number" === typeof input.exclusiveMaximum && (Math.floor(input.exclusiveMaximum) === input.exclusiveMaximum && -9223372036854776000 <= input.exclusiveMaximum && input.exclusiveMaximum <= 9223372036854776000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".exclusiveMaximum",
                expected: "number & Type<\"int64\">",
                value: input.exclusiveMaximum
            }, _errorFactory)) || "boolean" === typeof input.exclusiveMaximum || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".exclusiveMaximum",
                expected: "((number & Type<\"int64\">) | boolean | undefined)",
                value: input.exclusiveMaximum
            }, _errorFactory)) && (undefined === input.multipleOf || "number" === typeof input.multipleOf && (Math.floor(input.multipleOf) === input.multipleOf && 0 <= input.multipleOf && input.multipleOf <= 18446744073709552000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".multipleOf",
                expected: "number & Type<\"uint64\">",
                value: input.multipleOf
            }, _errorFactory)) && (0 < input.multipleOf || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".multipleOf",
                expected: "number & ExclusiveMinimum<0>",
                value: input.multipleOf
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".multipleOf",
                expected: "((number & Type<\"uint64\"> & ExclusiveMinimum<0>) | undefined)",
                value: input.multipleOf
            }, _errorFactory)) && ("integer" === input.type || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".type",
                expected: "\"integer\"",
                value: input.type
            }, _errorFactory)) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))); const _ao9 = (input, _path, _exceptionable = true) => (undefined === input.nullable || "boolean" === typeof input.nullable || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".nullable",
                expected: "(boolean | undefined)",
                value: input.nullable
            }, _errorFactory)) && (null === input["default"] || undefined === input["default"] || "number" === typeof input["default"] || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"default\"]",
                expected: "(null | number | undefined)",
                value: input["default"]
            }, _errorFactory)) && (undefined === input["enum"] || (Array.isArray(input["enum"]) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"enum\"]",
                expected: "(Array<number | null> | undefined)",
                value: input["enum"]
            }, _errorFactory)) && input["enum"].every((elem, _index33) => null === elem || "number" === typeof elem || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"enum\"][" + _index33 + "]",
                expected: "(null | number)",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"enum\"]",
                expected: "(Array<number | null> | undefined)",
                value: input["enum"]
            }, _errorFactory)) && (undefined === input.minimum || "number" === typeof input.minimum || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minimum",
                expected: "(number | undefined)",
                value: input.minimum
            }, _errorFactory)) && (undefined === input.maximum || "number" === typeof input.maximum || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maximum",
                expected: "(number | undefined)",
                value: input.maximum
            }, _errorFactory)) && (undefined === input.exclusiveMinimum || "number" === typeof input.exclusiveMinimum || "boolean" === typeof input.exclusiveMinimum || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".exclusiveMinimum",
                expected: "(boolean | number | undefined)",
                value: input.exclusiveMinimum
            }, _errorFactory)) && (undefined === input.exclusiveMaximum || "number" === typeof input.exclusiveMaximum || "boolean" === typeof input.exclusiveMaximum || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".exclusiveMaximum",
                expected: "(boolean | number | undefined)",
                value: input.exclusiveMaximum
            }, _errorFactory)) && (undefined === input.multipleOf || "number" === typeof input.multipleOf && (0 < input.multipleOf || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".multipleOf",
                expected: "number & ExclusiveMinimum<0>",
                value: input.multipleOf
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".multipleOf",
                expected: "((number & ExclusiveMinimum<0>) | undefined)",
                value: input.multipleOf
            }, _errorFactory)) && ("number" === input.type || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".type",
                expected: "\"number\"",
                value: input.type
            }, _errorFactory)) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))); const _ao10 = (input, _path, _exceptionable = true) => (undefined === input.nullable || "boolean" === typeof input.nullable || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".nullable",
                expected: "(boolean | undefined)",
                value: input.nullable
            }, _errorFactory)) && (null === input["default"] || undefined === input["default"] || "string" === typeof input["default"] || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"default\"]",
                expected: "(null | string | undefined)",
                value: input["default"]
            }, _errorFactory)) && (undefined === input["enum"] || (Array.isArray(input["enum"]) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"enum\"]",
                expected: "(Array<string | null> | undefined)",
                value: input["enum"]
            }, _errorFactory)) && input["enum"].every((elem, _index34) => null === elem || "string" === typeof elem || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"enum\"][" + _index34 + "]",
                expected: "(null | string)",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"enum\"]",
                expected: "(Array<string | null> | undefined)",
                value: input["enum"]
            }, _errorFactory)) && (undefined === input.format || "string" === typeof input.format || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".format",
                expected: "(string | undefined)",
                value: input.format
            }, _errorFactory)) && (undefined === input.pattern || "string" === typeof input.pattern || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".pattern",
                expected: "(string | undefined)",
                value: input.pattern
            }, _errorFactory)) && (undefined === input.contentMediaType || "string" === typeof input.contentMediaType || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".contentMediaType",
                expected: "(string | undefined)",
                value: input.contentMediaType
            }, _errorFactory)) && (undefined === input.minLength || "number" === typeof input.minLength && (Math.floor(input.minLength) === input.minLength && 0 <= input.minLength && input.minLength <= 18446744073709552000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minLength",
                expected: "number & Type<\"uint64\">",
                value: input.minLength
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minLength",
                expected: "((number & Type<\"uint64\">) | undefined)",
                value: input.minLength
            }, _errorFactory)) && (undefined === input.maxLength || "number" === typeof input.maxLength && (Math.floor(input.maxLength) === input.maxLength && 0 <= input.maxLength && input.maxLength <= 18446744073709552000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maxLength",
                expected: "number & Type<\"uint64\">",
                value: input.maxLength
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maxLength",
                expected: "((number & Type<\"uint64\">) | undefined)",
                value: input.maxLength
            }, _errorFactory)) && ("string" === input.type || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".type",
                expected: "\"string\"",
                value: input.type
            }, _errorFactory)) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))); const _ao11 = (input, _path, _exceptionable = true) => (undefined === input.nullable || "boolean" === typeof input.nullable || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".nullable",
                expected: "(boolean | undefined)",
                value: input.nullable
            }, _errorFactory)) && ((null !== input.items || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".items",
                expected: "(Array<OpenApiV3_1.IJsonSchema> | OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | undefined)",
                value: input.items
            }, _errorFactory)) && (undefined === input.items || (Array.isArray(input.items) && input.items.every((elem, _index35) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".items[" + _index35 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) && _au0(elem, _path + ".items[" + _index35 + "]", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".items[" + _index35 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) || "object" === typeof input.items && null !== input.items && false === Array.isArray(input.items) && _au0(input.items, _path + ".items", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".items",
                expected: "(Array<OpenApiV3_1.IJsonSchema> | OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | undefined)",
                value: input.items
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".items",
                expected: "(Array<OpenApiV3_1.IJsonSchema> | OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | undefined)",
                value: input.items
            }, _errorFactory))) && (undefined === input.prefixItems || (Array.isArray(input.prefixItems) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".prefixItems",
                expected: "(Array<OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.prefixItems
            }, _errorFactory)) && input.prefixItems.every((elem, _index36) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".prefixItems[" + _index36 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) && _au0(elem, _path + ".prefixItems[" + _index36 + "]", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".prefixItems[" + _index36 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".prefixItems",
                expected: "(Array<OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.prefixItems
            }, _errorFactory)) && (undefined === input.uniqueItems || "boolean" === typeof input.uniqueItems || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".uniqueItems",
                expected: "(boolean | undefined)",
                value: input.uniqueItems
            }, _errorFactory)) && ((null !== input.additionalItems || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalItems",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalItems
            }, _errorFactory)) && (undefined === input.additionalItems || "boolean" === typeof input.additionalItems || ("object" === typeof input.additionalItems && null !== input.additionalItems && false === Array.isArray(input.additionalItems) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalItems",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalItems
            }, _errorFactory)) && _au0(input.additionalItems, _path + ".additionalItems", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".additionalItems",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown | boolean | undefined)",
                value: input.additionalItems
            }, _errorFactory))) && (undefined === input.minItems || "number" === typeof input.minItems && (Math.floor(input.minItems) === input.minItems && 0 <= input.minItems && input.minItems <= 18446744073709552000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minItems",
                expected: "number & Type<\"uint64\">",
                value: input.minItems
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".minItems",
                expected: "((number & Type<\"uint64\">) | undefined)",
                value: input.minItems
            }, _errorFactory)) && (undefined === input.maxItems || "number" === typeof input.maxItems && (Math.floor(input.maxItems) === input.maxItems && 0 <= input.maxItems && input.maxItems <= 18446744073709552000 || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maxItems",
                expected: "number & Type<\"uint64\">",
                value: input.maxItems
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".maxItems",
                expected: "((number & Type<\"uint64\">) | undefined)",
                value: input.maxItems
            }, _errorFactory)) && ("array" === input.type || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".type",
                expected: "\"array\"",
                value: input.type
            }, _errorFactory)) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))); const _ao12 = (input, _path, _exceptionable = true) => ("string" === typeof input.$ref || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".$ref",
                expected: "string",
                value: input.$ref
            }, _errorFactory)) && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true; const _ao13 = (input, _path, _exceptionable = true) => ("string" === typeof input.$recursiveRef || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".$recursiveRef",
                expected: "string",
                value: input.$recursiveRef
            }, _errorFactory)) && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true; const _ao14 = (input, _path, _exceptionable = true) => ((Array.isArray(input.allOf) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".allOf",
                expected: "Array<OpenApiV3_1.IJsonSchema>",
                value: input.allOf
            }, _errorFactory)) && input.allOf.every((elem, _index37) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".allOf[" + _index37 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) && _au0(elem, _path + ".allOf[" + _index37 + "]", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".allOf[" + _index37 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".allOf",
                expected: "Array<OpenApiV3_1.IJsonSchema>",
                value: input.allOf
            }, _errorFactory)) && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true; const _ao15 = (input, _path, _exceptionable = true) => ((Array.isArray(input.anyOf) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".anyOf",
                expected: "Array<OpenApiV3_1.IJsonSchema>",
                value: input.anyOf
            }, _errorFactory)) && input.anyOf.every((elem, _index38) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".anyOf[" + _index38 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) && _au0(elem, _path + ".anyOf[" + _index38 + "]", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".anyOf[" + _index38 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".anyOf",
                expected: "Array<OpenApiV3_1.IJsonSchema>",
                value: input.anyOf
            }, _errorFactory)) && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true; const _ao16 = (input, _path, _exceptionable = true) => ((Array.isArray(input.oneOf) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".oneOf",
                expected: "Array<OpenApiV3_1.IJsonSchema>",
                value: input.oneOf
            }, _errorFactory)) && input.oneOf.every((elem, _index39) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".oneOf[" + _index39 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) && _au0(elem, _path + ".oneOf[" + _index39 + "]", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".oneOf[" + _index39 + "]",
                expected: "(OpenApiV3_1.IJsonSchema.IAllOf | OpenApiV3_1.IJsonSchema.IAnyOf | OpenApiV3_1.IJsonSchema.IArray | OpenApiV3_1.IJsonSchema.IBoolean | OpenApiV3_1.IJsonSchema.IConstant | OpenApiV3_1.IJsonSchema.IInteger | OpenApiV3_1.IJsonSchema.IMixed | OpenApiV3_1.IJsonSchema.INull | OpenApiV3_1.IJsonSchema.INumber | OpenApiV3_1.IJsonSchema.IObject | OpenApiV3_1.IJsonSchema.IOneOf | OpenApiV3_1.IJsonSchema.IRecursiveReference | OpenApiV3_1.IJsonSchema.IReference<string> | OpenApiV3_1.IJsonSchema.IString | OpenApiV3_1.IJsonSchema.IUnknown)",
                value: elem
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".oneOf",
                expected: "Array<OpenApiV3_1.IJsonSchema>",
                value: input.oneOf
            }, _errorFactory)) && (undefined === input.discriminator || ("object" === typeof input.discriminator && null !== input.discriminator || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".discriminator",
                expected: "(OpenApiV3_1.IJsonSchema.IOneOf.IDiscriminator | undefined)",
                value: input.discriminator
            }, _errorFactory)) && _ao17(input.discriminator, _path + ".discriminator", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".discriminator",
                expected: "(OpenApiV3_1.IJsonSchema.IOneOf.IDiscriminator | undefined)",
                value: input.discriminator
            }, _errorFactory)) && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true; const _ao17 = (input, _path, _exceptionable = true) => ("string" === typeof input.propertyName || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".propertyName",
                expected: "string",
                value: input.propertyName
            }, _errorFactory)) && (undefined === input.mapping || ("object" === typeof input.mapping && null !== input.mapping && false === Array.isArray(input.mapping) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".mapping",
                expected: "(Record<string, string> | undefined)",
                value: input.mapping
            }, _errorFactory)) && _ao18(input.mapping, _path + ".mapping", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".mapping",
                expected: "(Record<string, string> | undefined)",
                value: input.mapping
            }, _errorFactory)); const _ao18 = (input, _path, _exceptionable = true) => false === _exceptionable || Object.keys(input).every(key => {
                const value = input[key];
                if (undefined === value)
                    return true;
                return "string" === typeof value || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                    method: "typia.assert",
                    path: _path + __typia_transform__accessExpressionAsString._accessExpressionAsString(key),
                    expected: "string",
                    value: value
                }, _errorFactory);
            }); const _ao19 = (input, _path, _exceptionable = true) => (null === input["default"] || undefined === input["default"] || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + "[\"default\"]",
                expected: "(null | undefined)",
                value: input["default"]
            }, _errorFactory)) && ("null" === input.type || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".type",
                expected: "\"null\"",
                value: input.type
            }, _errorFactory)) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))); const _ao20 = (input, _path, _exceptionable = true) => (null !== input.type || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".type",
                expected: "undefined",
                value: input.type
            }, _errorFactory)) && (undefined === input.type || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".type",
                expected: "undefined",
                value: input.type
            }, _errorFactory)) && true && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))); const _ao21 = (input, _path, _exceptionable = true) => ("string" === typeof input.$ref || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".$ref",
                expected: "string",
                value: input.$ref
            }, _errorFactory)) && ((null !== input.examples || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) && (undefined === input.examples || (Array.isArray(input.examples) || "object" === typeof input.examples && null !== input.examples && false === Array.isArray(input.examples) && _ao5(input.examples, _path + ".examples", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".examples",
                expected: "(Array<any> | Record<string, any> | undefined)",
                value: input.examples
            }, _errorFactory))) && (undefined === input.title || "string" === typeof input.title || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".title",
                expected: "(string | undefined)",
                value: input.title
            }, _errorFactory)) && (undefined === input.description || "string" === typeof input.description || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".description",
                expected: "(string | undefined)",
                value: input.description
            }, _errorFactory)) && (undefined === input.deprecated || "boolean" === typeof input.deprecated || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".deprecated",
                expected: "(boolean | undefined)",
                value: input.deprecated
            }, _errorFactory)) && true && (undefined === input.$defs || ("object" === typeof input.$defs && null !== input.$defs && false === Array.isArray(input.$defs) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".$defs",
                expected: "(Record<string, OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.$defs
            }, _errorFactory)) && _ao2(input.$defs, _path + ".$defs", true && _exceptionable) || __typia_transform__assertGuard._assertGuard(_exceptionable, {
                method: "typia.assert",
                path: _path + ".$defs",
                expected: "(Record<string, OpenApiV3_1.IJsonSchema> | undefined)",
                value: input.$defs
            }, _errorFactory)); const _au0 = (input, _path, _exceptionable = true) => (() => {
                if ("object" === input.type)
                    return _ao3(input, _path, true && _exceptionable);
                else if (Array.isArray(input.type) && input.type.every((elem, _index40) => "string" === elem || "number" === elem || "boolean" === elem || "object" === elem || "integer" === elem || "array" === elem || "null" === elem))
                    return _ao4(input, _path, true && _exceptionable);
                else if ("boolean" === input.type)
                    return _ao7(input, _path, true && _exceptionable);
                else if ("number" === input.type)
                    return _ao9(input, _path, true && _exceptionable);
                else if ("integer" === input.type)
                    return _ao8(input, _path, true && _exceptionable);
                else if ("string" === input.type)
                    return _ao10(input, _path, true && _exceptionable);
                else if ("array" === input.type)
                    return _ao11(input, _path, true && _exceptionable);
                else if (undefined !== input.$recursiveRef)
                    return _ao13(input, _path, true && _exceptionable);
                else if ("null" === input.type)
                    return _ao19(input, _path, true && _exceptionable);
                else
                    return (() => {
                        if (undefined !== input["const"])
                            return _ao6(input, _path, true && _exceptionable);
                        else if (undefined !== input.$ref)
                            return _ao12(input, _path, true && _exceptionable);
                        else if (undefined !== input.allOf)
                            return _ao14(input, _path, true && _exceptionable);
                        else if (undefined !== input.anyOf)
                            return _ao15(input, _path, true && _exceptionable);
                        else if (undefined !== input.oneOf)
                            return _ao16(input, _path, true && _exceptionable);
                        else
                            return _ao20(input, _path, true && _exceptionable);
                    })();
            })(); const _au1 = (input, _path, _exceptionable = true) => (() => {
                if (undefined !== input.type)
                    return _ao1(input, _path, true && _exceptionable);
                else if (undefined !== input.$ref)
                    return _ao21(input, _path, true && _exceptionable);
                else
                    return __typia_transform__assertGuard._assertGuard(_exceptionable, {
                        method: "typia.assert",
                        path: _path,
                        expected: "(IObject & { $defs?: Record<string, IJsonSchema> | undefined; } | IReference<string> & { $defs?: Record<string, IJsonSchema> | undefined; })",
                        value: input
                    }, _errorFactory);
            })(); const __is = input => Array.isArray(input) && input.every(elem => "object" === typeof elem && null !== elem && _io0(elem)); let _errorFactory; return (input, errorFactory) => {
                if (false === __is(input)) {
                    _errorFactory = errorFactory;
                    ((input, _path, _exceptionable = true) => (Array.isArray(input) || __typia_transform__assertGuard._assertGuard(true, {
                        method: "typia.assert",
                        path: _path + "",
                        expected: "Array<IMcpTool>",
                        value: input
                    }, _errorFactory)) && input.every((elem, _index21) => ("object" === typeof elem && null !== elem || __typia_transform__assertGuard._assertGuard(true, {
                        method: "typia.assert",
                        path: _path + "[" + _index21 + "]",
                        expected: "IMcpTool",
                        value: elem
                    }, _errorFactory)) && _ao0(elem, _path + "[" + _index21 + "]", true) || __typia_transform__assertGuard._assertGuard(true, {
                        method: "typia.assert",
                        path: _path + "[" + _index21 + "]",
                        expected: "IMcpTool",
                        value: elem
                    }, _errorFactory)) || __typia_transform__assertGuard._assertGuard(true, {
                        method: "typia.assert",
                        path: _path + "",
                        expected: "Array<IMcpTool>",
                        value: input
                    }, _errorFactory))(input, "$input", true);
                }
                return input;
            }; })()(tools),
        });
        return {
            protocol: "mcp",
            name: props.name,
            client: props.client,
            application,
        };
    });
}
//# sourceMappingURL=assertMcpController.js.map