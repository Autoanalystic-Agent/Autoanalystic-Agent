import { ProtobufMessageProgrammer } from '../../../programmers/protobuf/ProtobufMessageProgrammer.mjs';
import { TransformerError } from '../../TransformerError.mjs';

var ProtobufMessageTransformer;
(function (ProtobufMessageTransformer) {
    ProtobufMessageTransformer.transform = (props) => {
        // CHECK GENERIC ARGUMENT EXISTENCE
        if (!props.expression.typeArguments || !props.expression.typeArguments[0])
            throw new TransformerError({
                code: "typia.protobuf.message",
                message: "generic argument is not specified.",
            });
        // GET TYPE INFO
        const type = props.context.checker.getTypeFromTypeNode(props.expression.typeArguments[0]);
        if (type.isTypeParameter())
            throw new TransformerError({
                code: "tyipa.protobuf.message",
                message: "non-specified generic argument.",
            });
        // DO TRANSFORM
        return ProtobufMessageProgrammer.write({
            context: props.context,
            type,
        });
    };
})(ProtobufMessageTransformer || (ProtobufMessageTransformer = {}));

export { ProtobufMessageTransformer };
//# sourceMappingURL=ProtobufMessageTransformer.mjs.map
