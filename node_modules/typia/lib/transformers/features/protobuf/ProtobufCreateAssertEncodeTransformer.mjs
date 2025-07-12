import { ProtobufAssertEncodeProgrammer } from '../../../programmers/protobuf/ProtobufAssertEncodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufCreateAssertEncodeTransformer;
(function (ProtobufCreateAssertEncodeTransformer) {
    ProtobufCreateAssertEncodeTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "protobuf.createAssertEncode",
        write: ProtobufAssertEncodeProgrammer.write,
    });
})(ProtobufCreateAssertEncodeTransformer || (ProtobufCreateAssertEncodeTransformer = {}));

export { ProtobufCreateAssertEncodeTransformer };
//# sourceMappingURL=ProtobufCreateAssertEncodeTransformer.mjs.map
