import { MiscLiteralsProgrammer } from '../../../programmers/misc/MiscLiteralsProgrammer.mjs';
import { TransformerError } from '../../TransformerError.mjs';

var MiscLiteralsTransformer;
(function (MiscLiteralsTransformer) {
    MiscLiteralsTransformer.transform = (props) => {
        // CHECK GENERIC ARGUMENT EXISTENCE
        if (!props.expression.typeArguments?.[0])
            throw new TransformerError({
                code: "typia.misc.literals",
                message: "generic argument is not specified.",
            });
        // GET TYPE INFO
        const node = props.expression.typeArguments[0];
        const type = props.context.checker.getTypeFromTypeNode(node);
        if (type.isTypeParameter())
            throw new TransformerError({
                code: "typia.misc.literals",
                message: "non-specified generic argument.",
            });
        // DO TRANSFORM
        return MiscLiteralsProgrammer.write({
            context: props.context,
            type,
        });
    };
})(MiscLiteralsTransformer || (MiscLiteralsTransformer = {}));

export { MiscLiteralsTransformer };
//# sourceMappingURL=MiscLiteralsTransformer.mjs.map
