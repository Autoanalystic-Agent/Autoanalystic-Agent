"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionalGeneralProgrammer = void 0;
const TypeFactory_1 = require("../../../factories/TypeFactory");
var FunctionalGeneralProgrammer;
(function (FunctionalGeneralProgrammer) {
    FunctionalGeneralProgrammer.getReturnType = (props) => {
        var _a, _b;
        const signature = props.checker.getSignatureFromDeclaration(props.declaration);
        const type = (_a = signature === null || signature === void 0 ? void 0 : signature.getReturnType()) !== null && _a !== void 0 ? _a : props.checker.getTypeFromTypeNode(TypeFactory_1.TypeFactory.keyword("any"));
        if (((_b = type.symbol) === null || _b === void 0 ? void 0 : _b.name) === "Promise") {
            const generic = props.checker.getTypeArguments(type);
            return generic.length === 1
                ? { type: generic[0], async: true }
                : {
                    type: props.checker.getTypeFromTypeNode(TypeFactory_1.TypeFactory.keyword("any")),
                    async: false,
                };
        }
        return { type, async: false };
    };
})(FunctionalGeneralProgrammer || (exports.FunctionalGeneralProgrammer = FunctionalGeneralProgrammer = {}));
//# sourceMappingURL=FunctionalGeneralProgrammer.js.map