import { ProtobufValidateEncodeProgrammer } from '../../../programmers/protobuf/ProtobufValidateEncodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufValidateEncodeTransformer;
(function (ProtobufValidateEncodeTransformer) {
    ProtobufValidateEncodeTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "protobuf.validateEncode",
        write: ProtobufValidateEncodeProgrammer.write,
    });
})(ProtobufValidateEncodeTransformer || (ProtobufValidateEncodeTransformer = {}));

export { ProtobufValidateEncodeTransformer };
//# sourceMappingURL=ProtobufValidateEncodeTransformer.mjs.map
