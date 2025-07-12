import { ProtobufIsEncodeProgrammer } from '../../../programmers/protobuf/ProtobufIsEncodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufCreateIsEncodeTransformer;
(function (ProtobufCreateIsEncodeTransformer) {
    ProtobufCreateIsEncodeTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "protobuf.createIsEncode",
        write: ProtobufIsEncodeProgrammer.write,
    });
})(ProtobufCreateIsEncodeTransformer || (ProtobufCreateIsEncodeTransformer = {}));

export { ProtobufCreateIsEncodeTransformer };
//# sourceMappingURL=ProtobufCreateIsEncodeTransformer.mjs.map
