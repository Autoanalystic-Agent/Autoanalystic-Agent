import { ProtobufIsDecodeProgrammer } from '../../../programmers/protobuf/ProtobufIsDecodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufIsDecodeTransformer;
(function (ProtobufIsDecodeTransformer) {
    ProtobufIsDecodeTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "protobuf.isDecode",
        write: ProtobufIsDecodeProgrammer.write,
    });
})(ProtobufIsDecodeTransformer || (ProtobufIsDecodeTransformer = {}));

export { ProtobufIsDecodeTransformer };
//# sourceMappingURL=ProtobufIsDecodeTransformer.mjs.map
