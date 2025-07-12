import { ProtobufIsEncodeProgrammer } from '../../../programmers/protobuf/ProtobufIsEncodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufIsEncodeTransformer;
(function (ProtobufIsEncodeTransformer) {
    ProtobufIsEncodeTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "protobuf.isEncode",
        write: ProtobufIsEncodeProgrammer.write,
    });
})(ProtobufIsEncodeTransformer || (ProtobufIsEncodeTransformer = {}));

export { ProtobufIsEncodeTransformer };
//# sourceMappingURL=ProtobufIsEncodeTransformer.mjs.map
