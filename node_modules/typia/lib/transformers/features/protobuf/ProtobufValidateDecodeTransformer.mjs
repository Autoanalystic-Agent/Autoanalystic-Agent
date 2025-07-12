import { ProtobufValidateDecodeProgrammer } from '../../../programmers/protobuf/ProtobufValidateDecodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufValidateDecodeTransformer;
(function (ProtobufValidateDecodeTransformer) {
    ProtobufValidateDecodeTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "protobuf.validateDecode",
        write: ProtobufValidateDecodeProgrammer.write,
    });
})(ProtobufValidateDecodeTransformer || (ProtobufValidateDecodeTransformer = {}));

export { ProtobufValidateDecodeTransformer };
//# sourceMappingURL=ProtobufValidateDecodeTransformer.mjs.map
