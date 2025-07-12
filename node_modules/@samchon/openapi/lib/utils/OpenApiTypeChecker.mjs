import { OpenApiTypeCheckerBase } from "./internal/OpenApiTypeCheckerBase.mjs";

var OpenApiTypeChecker;

(function(OpenApiTypeChecker) {
    OpenApiTypeChecker.isNull = schema => OpenApiTypeCheckerBase.isNull(schema);
    OpenApiTypeChecker.isUnknown = schema => OpenApiTypeCheckerBase.isUnknown(schema);
    OpenApiTypeChecker.isConstant = schema => OpenApiTypeCheckerBase.isConstant(schema);
    OpenApiTypeChecker.isBoolean = schema => OpenApiTypeCheckerBase.isBoolean(schema);
    OpenApiTypeChecker.isInteger = schema => OpenApiTypeCheckerBase.isInteger(schema);
    OpenApiTypeChecker.isNumber = schema => OpenApiTypeCheckerBase.isNumber(schema);
    OpenApiTypeChecker.isString = schema => OpenApiTypeCheckerBase.isString(schema);
    OpenApiTypeChecker.isArray = schema => OpenApiTypeCheckerBase.isArray(schema);
    OpenApiTypeChecker.isTuple = schema => OpenApiTypeCheckerBase.isTuple(schema);
    OpenApiTypeChecker.isObject = schema => OpenApiTypeCheckerBase.isObject(schema);
    OpenApiTypeChecker.isReference = schema => OpenApiTypeCheckerBase.isReference(schema);
    OpenApiTypeChecker.isOneOf = schema => OpenApiTypeCheckerBase.isOneOf(schema);
    OpenApiTypeChecker.isRecursiveReference = props => OpenApiTypeCheckerBase.isRecursiveReference({
        prefix: "#/components/schemas/",
        components: props.components,
        schema: props.schema
    });
    OpenApiTypeChecker.escape = props => OpenApiTypeCheckerBase.escape({
        ...props,
        prefix: "#/components/schemas/",
        method: "OpenApiTypeChecker.method"
    });
    OpenApiTypeChecker.unreference = props => OpenApiTypeCheckerBase.unreference({
        ...props,
        prefix: "#/components/schemas/",
        method: "OpenApiTypeChecker.unreference"
    });
    OpenApiTypeChecker.visit = props => OpenApiTypeCheckerBase.visit({
        ...props,
        prefix: "#/components/schemas/"
    });
    OpenApiTypeChecker.covers = props => OpenApiTypeCheckerBase.covers({
        prefix: "#/components/schemas/",
        components: props.components,
        x: props.x,
        y: props.y
    });
})(OpenApiTypeChecker || (OpenApiTypeChecker = {}));

export { OpenApiTypeChecker };
//# sourceMappingURL=OpenApiTypeChecker.mjs.map
