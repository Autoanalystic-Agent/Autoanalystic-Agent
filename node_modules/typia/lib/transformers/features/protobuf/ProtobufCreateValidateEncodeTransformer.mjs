import { ProtobufValidateEncodeProgrammer } from '../../../programmers/protobuf/ProtobufValidateEncodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufCreateValidateEncodeTransformer;
(function (ProtobufCreateValidateEncodeTransformer) {
    ProtobufCreateValidateEncodeTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "protobuf.createValidateEncode",
        write: ProtobufValidateEncodeProgrammer.write,
    });
})(ProtobufCreateValidateEncodeTransformer || (ProtobufCreateValidateEncodeTransformer = {}));

export { ProtobufCreateValidateEncodeTransformer };
//# sourceMappingURL=ProtobufCreateValidateEncodeTransformer.mjs.map
