import { ProtobufIsDecodeProgrammer } from '../../../programmers/protobuf/ProtobufIsDecodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufCreateIsDecodeTransformer;
(function (ProtobufCreateIsDecodeTransformer) {
    ProtobufCreateIsDecodeTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "protobuf.createIsDecode",
        write: ProtobufIsDecodeProgrammer.write,
    });
})(ProtobufCreateIsDecodeTransformer || (ProtobufCreateIsDecodeTransformer = {}));

export { ProtobufCreateIsDecodeTransformer };
//# sourceMappingURL=ProtobufCreateIsDecodeTransformer.mjs.map
