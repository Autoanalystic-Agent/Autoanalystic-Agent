import { ProtobufAssertDecodeProgrammer } from '../../../programmers/protobuf/ProtobufAssertDecodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufAssertDecodeTransformer;
(function (ProtobufAssertDecodeTransformer) {
    ProtobufAssertDecodeTransformer.transform = (props) => GenericTransformer.scalar({
        ...props,
        method: "protobuf.assertDecode",
        write: ProtobufAssertDecodeProgrammer.write,
    });
})(ProtobufAssertDecodeTransformer || (ProtobufAssertDecodeTransformer = {}));

export { ProtobufAssertDecodeTransformer };
//# sourceMappingURL=ProtobufAssertDecodeTransformer.mjs.map
