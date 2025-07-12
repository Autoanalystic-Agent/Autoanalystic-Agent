import { TypeFactory } from '../../../factories/TypeFactory.mjs';

var FunctionalGeneralProgrammer;
(function (FunctionalGeneralProgrammer) {
    FunctionalGeneralProgrammer.getReturnType = (props) => {
        const signature = props.checker.getSignatureFromDeclaration(props.declaration);
        const type = signature?.getReturnType() ??
            props.checker.getTypeFromTypeNode(TypeFactory.keyword("any"));
        if (type.symbol?.name === "Promise") {
            const generic = props.checker.getTypeArguments(type);
            return generic.length === 1
                ? { type: generic[0], async: true }
                : {
                    type: props.checker.getTypeFromTypeNode(TypeFactory.keyword("any")),
                    async: false,
                };
        }
        return { type, async: false };
    };
})(FunctionalGeneralProgrammer || (FunctionalGeneralProgrammer = {}));

export { FunctionalGeneralProgrammer };
//# sourceMappingURL=FunctionalGeneralProgrammer.mjs.map
