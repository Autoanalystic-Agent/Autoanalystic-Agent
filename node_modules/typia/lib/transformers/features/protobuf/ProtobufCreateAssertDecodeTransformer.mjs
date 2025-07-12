import { ProtobufAssertDecodeProgrammer } from '../../../programmers/protobuf/ProtobufAssertDecodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufCreateAssertDecodeTransformer;
(function (ProtobufCreateAssertDecodeTransformer) {
    ProtobufCreateAssertDecodeTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "protobuf.createAssertDecode",
        write: ProtobufAssertDecodeProgrammer.write,
    });
})(ProtobufCreateAssertDecodeTransformer || (ProtobufCreateAssertDecodeTransformer = {}));

export { ProtobufCreateAssertDecodeTransformer };
//# sourceMappingURL=ProtobufCreateAssertDecodeTransformer.mjs.map
