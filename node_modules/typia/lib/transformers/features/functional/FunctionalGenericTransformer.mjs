import { TypeFactory } from '../../../factories/TypeFactory.mjs';
import { TransformerError } from '../../TransformerError.mjs';

var FunctionalGenericTransformer;
(function (FunctionalGenericTransformer) {
    FunctionalGenericTransformer.transform = (spec) => (props) => {
        // CHECK PARAMETER
        if (props.expression.arguments.length === 0)
            throw new TransformerError({
                code: `typia.functional.${spec.method}`,
                message: `no input value.`,
            });
        // GET TYPE INFO
        const type = props.expression.typeArguments && props.expression.typeArguments[0]
            ? props.context.checker.getTypeFromTypeNode(props.expression.typeArguments[0])
            : props.context.checker.getTypeAtLocation(props.expression.arguments[0]);
        if (TypeFactory.isFunction(type) === false)
            throw new TransformerError({
                code: `typia.functional.${spec.method}`,
                message: `input value is not a function.`,
            });
        return spec.programmer({
            ...props,
            config: spec.config,
            expression: props.expression.arguments[0],
            declaration: type.symbol.declarations[0],
            init: props.expression.arguments[1],
        });
    };
})(FunctionalGenericTransformer || (FunctionalGenericTransformer = {}));

export { FunctionalGenericTransformer };
//# sourceMappingURL=FunctionalGenericTransformer.mjs.map
