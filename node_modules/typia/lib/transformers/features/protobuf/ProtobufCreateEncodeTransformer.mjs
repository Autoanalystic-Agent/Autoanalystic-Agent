import { ProtobufEncodeProgrammer } from '../../../programmers/protobuf/ProtobufEncodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufCreateEncodeTransformer;
(function (ProtobufCreateEncodeTransformer) {
    ProtobufCreateEncodeTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "protobuf.createEncode",
        write: ProtobufEncodeProgrammer.write,
    });
})(ProtobufCreateEncodeTransformer || (ProtobufCreateEncodeTransformer = {}));

export { ProtobufCreateEncodeTransformer };
//# sourceMappingURL=ProtobufCreateEncodeTransformer.mjs.map
