import { ProtobufDecodeProgrammer } from '../../../programmers/protobuf/ProtobufDecodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufDecodeTransformer;
(function (ProtobufDecodeTransformer) {
    ProtobufDecodeTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "protobuf.decode",
        write: ProtobufDecodeProgrammer.write,
    });
})(ProtobufDecodeTransformer || (ProtobufDecodeTransformer = {}));

export { ProtobufDecodeTransformer };
//# sourceMappingURL=ProtobufDecodeTransformer.mjs.map
