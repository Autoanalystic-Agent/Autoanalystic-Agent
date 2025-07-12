import { ProtobufAssertEncodeProgrammer } from '../../../programmers/protobuf/ProtobufAssertEncodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufAssertEncodeTransformer;
(function (ProtobufAssertEncodeTransformer) {
    ProtobufAssertEncodeTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "protobuf.assertEncode",
        write: ProtobufAssertEncodeProgrammer.write,
    });
})(ProtobufAssertEncodeTransformer || (ProtobufAssertEncodeTransformer = {}));

export { ProtobufAssertEncodeTransformer };
//# sourceMappingURL=ProtobufAssertEncodeTransformer.mjs.map
