import { RandomProgrammer } from '../../programmers/RandomProgrammer.mjs';
import { TransformerError } from '../TransformerError.mjs';

var CreateRandomTransformer;
(function (CreateRandomTransformer) {
    CreateRandomTransformer.transform = (props) => {
        // CHECK GENERIC ARGUMENT EXISTENCE
        if (!props.expression.typeArguments?.[0])
            throw new TransformerError({
                code: "typia.createRandom",
                message: "generic argument is not specified.",
            });
        // GET TYPE INFO
        const node = props.expression.typeArguments[0];
        const type = props.context.checker.getTypeFromTypeNode(node);
        if (type.isTypeParameter())
            throw new TransformerError({
                code: "typia.createRandom",
                message: "non-specified generic argument.",
            });
        // DO TRANSFORM
        return RandomProgrammer.write({
            context: {
                ...props.context,
                options: {
                    ...props.context.options,
                    functional: false,
                    numeric: false,
                },
            },
            modulo: props.modulo,
            type,
            name: node.getFullText().trim(),
            init: props.expression.arguments?.[0],
        });
    };
})(CreateRandomTransformer || (CreateRandomTransformer = {}));

export { CreateRandomTransformer };
//# sourceMappingURL=CreateRandomTransformer.mjs.map
