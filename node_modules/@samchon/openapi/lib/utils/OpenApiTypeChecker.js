"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiTypeChecker = void 0;
const OpenApiTypeCheckerBase_1 = require("./internal/OpenApiTypeCheckerBase");
/**
 * Type checker of OpenAPI type schema.
 *
 * `OpenApiTypeChecker` is a type checker of {@link OpenApi.IJsonSchema}.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var OpenApiTypeChecker;
(function (OpenApiTypeChecker) {
    /* -----------------------------------------------------------
      TYPE CHECKERS
    ----------------------------------------------------------- */
    /**
     * Test whether the schema is a nul type.
     *
     * @param schema Target schema
     * @returns Whether null type or not
     */
    OpenApiTypeChecker.isNull = (schema) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.isNull(schema);
    /**
     * Test whether the schema is an unknown type.
     *
     * @param schema Target schema
     * @returns Whether unknown type or not
     */
    OpenApiTypeChecker.isUnknown = (schema) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.isUnknown(schema);
    /**
     * Test whether the schema is a constant type.
     *
     * @param schema Target schema
     * @returns Whether constant type or not
     */
    OpenApiTypeChecker.isConstant = (schema) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.isConstant(schema);
    /**
     * Test whether the schema is a boolean type.
     *
     * @param schema Target schema
     * @returns Whether boolean type or not
     */
    OpenApiTypeChecker.isBoolean = (schema) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.isBoolean(schema);
    /**
     * Test whether the schema is an integer type.
     *
     * @param schema Target schema
     * @returns Whether integer type or not
     */
    OpenApiTypeChecker.isInteger = (schema) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.isInteger(schema);
    /**
     * Test whether the schema is a number type.
     *
     * @param schema Target schema
     * @returns Whether number type or not
     */
    OpenApiTypeChecker.isNumber = (schema) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.isNumber(schema);
    /**
     * Test whether the schema is a string type.
     *
     * @param schema Target schema
     * @returns Whether string type or not
     */
    OpenApiTypeChecker.isString = (schema) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.isString(schema);
    /**
     * Test whether the schema is an array type.
     *
     * @param schema Target schema
     * @returns Whether array type or not
     */
    OpenApiTypeChecker.isArray = (schema) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.isArray(schema);
    /**
     * Test whether the schema is a tuple type.
     *
     * @param schema Target schema
     * @returns Whether tuple type or not
     */
    OpenApiTypeChecker.isTuple = (schema) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.isTuple(schema);
    /**
     * Test whether the schema is an object type.
     *
     * @param schema Target schema
     * @returns Whether object type or not
     */
    OpenApiTypeChecker.isObject = (schema) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.isObject(schema);
    /**
     * Test whether the schema is a reference type.
     *
     * @param schema Target schema
     * @returns Whether reference type or not
     */
    OpenApiTypeChecker.isReference = (schema) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.isReference(schema);
    /**
     * Test whether the schema is an union type.
     *
     * @param schema Target schema
     * @returns Whether union type or not
     */
    OpenApiTypeChecker.isOneOf = (schema) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.isOneOf(schema);
    /**
     * Test whether the schema is recursive reference type.
     *
     * Test whether the target schema is a reference type, and test one thing more
     * that the reference is self-recursive or not.
     *
     * @param props Properties for recursive reference test
     * @returns Whether the schema is recursive reference type or not
     */
    OpenApiTypeChecker.isRecursiveReference = (props) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.isRecursiveReference({
        prefix: "#/components/schemas/",
        components: props.components,
        schema: props.schema,
    });
    /* -----------------------------------------------------------
      OPERATORS
    ----------------------------------------------------------- */
    /**
     * Escape from the {@link OpenApi.IJsonSchema.IReference} type.
     *
     * Escape from the {@link OpenApi.IJsonSchema.IReference} type, replacing the
     * every references to the actual schemas. If the escape is successful, the
     * returned schema never contains any {@link OpenApi.IJsonSchema.IReference}
     * type in its structure.
     *
     * If the schema has a recursive reference, the recursive reference would be
     * repeated as much as the `props.recursive` depth. If you've configured the
     * `props.recursive` as `false` or `0`, it would be failed and return an
     * {@link IOpenApiSchemaError}. Also, if there's a
     * {@link OpenApi.IJsonSchema.IReference} type which cannot find the matched
     * type in the {@link OpenApi.IComponents.schemas}, it would also be failed and
     * return an {@link IOpenApiSchemaError} either.
     *
     * @param props Properties for escaping
     * @returns Escaped schema, or error with reason
     */
    OpenApiTypeChecker.escape = (props) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.escape(Object.assign(Object.assign({}, props), { prefix: "#/components/schemas/", method: "OpenApiTypeChecker.method" }));
    /**
     * Unreference the schema.
     *
     * Unreference the schema, replacing the {@link OpenApi.IJsonSchema.IReference}
     * type to the actual schema. Different with {@link escape} is, the
     * `unreference` function does not resolve every references in the schema, but
     * resolve only one time.
     *
     * If there's a {@link OpenApi.IJsonSchema.IReference} type which cannot find
     * the matched type in the {@link OpenApi.IComponents.schemas}, and you've
     * called this `unreference()` function with the reference, it would also be
     * failed and return an {@link IOpenApiSchemaError} value.
     *
     * @param props Properties of unreference
     * @returns Unreferenced schema
     */
    OpenApiTypeChecker.unreference = (props) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.unreference(Object.assign(Object.assign({}, props), { prefix: "#/components/schemas/", method: "OpenApiTypeChecker.unreference" }));
    /**
     * Visit every nested schemas.
     *
     * Visit every nested schemas of the target, and apply the `props.closure`
     * function.
     *
     * Here is the list of occurring nested visitings:
     *
     * - {@link OpenApi.IJsonSchema.IOneOf.oneOf}
     * - {@link OpenApi.IJsonSchema.IReference}
     * - {@link OpenApi.IJsonSchema.IObject.properties}
     * - {@link OpenApi.IJsonSchema.IObject.additionalProperties}
     * - {@link OpenApi.IJsonSchema.IArray.items}
     * - {@link OpenApi.IJsonSchema.ITuple.prefixItems}
     * - {@link OpenApi.IJsonSchema.ITuple.additionalItems}
     *
     * @param props Properties for visiting
     */
    OpenApiTypeChecker.visit = (props) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.visit(Object.assign(Object.assign({}, props), { prefix: "#/components/schemas/" }));
    /**
     * Test whether the `x` schema covers the `y` schema.
     *
     * @param props Properties for testing
     * @returns Whether the `x` schema covers the `y` schema
     */
    OpenApiTypeChecker.covers = (props) => OpenApiTypeCheckerBase_1.OpenApiTypeCheckerBase.covers({
        prefix: "#/components/schemas/",
        components: props.components,
        x: props.x,
        y: props.y,
    });
})(OpenApiTypeChecker || (exports.OpenApiTypeChecker = OpenApiTypeChecker = {}));
