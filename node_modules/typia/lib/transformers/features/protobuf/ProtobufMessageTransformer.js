"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufMessageTransformer = void 0;
const ProtobufMessageProgrammer_1 = require("../../../programmers/protobuf/ProtobufMessageProgrammer");
const TransformerError_1 = require("../../TransformerError");
var ProtobufMessageTransformer;
(function (ProtobufMessageTransformer) {
    ProtobufMessageTransformer.transform = (props) => {
        // CHECK GENERIC ARGUMENT EXISTENCE
        if (!props.expression.typeArguments || !props.expression.typeArguments[0])
            throw new TransformerError_1.TransformerError({
                code: "typia.protobuf.message",
                message: "generic argument is not specified.",
            });
        // GET TYPE INFO
        const type = props.context.checker.getTypeFromTypeNode(props.expression.typeArguments[0]);
        if (type.isTypeParameter())
            throw new TransformerError_1.TransformerError({
                code: "tyipa.protobuf.message",
                message: "non-specified generic argument.",
            });
        // DO TRANSFORM
        return ProtobufMessageProgrammer_1.ProtobufMessageProgrammer.write({
            context: props.context,
            type,
        });
    };
})(ProtobufMessageTransformer || (exports.ProtobufMessageTransformer = ProtobufMessageTransformer = {}));
//# sourceMappingURL=ProtobufMessageTransformer.js.map