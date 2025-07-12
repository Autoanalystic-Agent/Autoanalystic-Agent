import { ProtobufValidateDecodeProgrammer } from '../../../programmers/protobuf/ProtobufValidateDecodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufCreateValidateDecodeTransformer;
(function (ProtobufCreateValidateDecodeTransformer) {
    ProtobufCreateValidateDecodeTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "protobuf.createValidateDecode",
        write: ProtobufValidateDecodeProgrammer.write,
    });
})(ProtobufCreateValidateDecodeTransformer || (ProtobufCreateValidateDecodeTransformer = {}));

export { ProtobufCreateValidateDecodeTransformer };
//# sourceMappingURL=ProtobufCreateValidateDecodeTransformer.mjs.map
