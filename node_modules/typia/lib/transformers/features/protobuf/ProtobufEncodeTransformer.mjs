import { ProtobufEncodeProgrammer } from '../../../programmers/protobuf/ProtobufEncodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufEncodeTransformer;
(function (ProtobufEncodeTransformer) {
    ProtobufEncodeTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "protobuf.encode",
        write: ProtobufEncodeProgrammer.write,
    });
})(ProtobufEncodeTransformer || (ProtobufEncodeTransformer = {}));

export { ProtobufEncodeTransformer };
//# sourceMappingURL=ProtobufEncodeTransformer.mjs.map
