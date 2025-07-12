import { ProtobufDecodeProgrammer } from '../../../programmers/protobuf/ProtobufDecodeProgrammer.mjs';
import { GenericTransformer } from '../../internal/GenericTransformer.mjs';

var ProtobufCreateDecodeTransformer;
(function (ProtobufCreateDecodeTransformer) {
    ProtobufCreateDecodeTransformer.transform = (props) => GenericTransformer.factory({
        ...props,
        method: "protobuf.createDecode",
        write: ProtobufDecodeProgrammer.write,
    });
})(ProtobufCreateDecodeTransformer || (ProtobufCreateDecodeTransformer = {}));

export { ProtobufCreateDecodeTransformer };
//# sourceMappingURL=ProtobufCreateDecodeTransformer.mjs.map
