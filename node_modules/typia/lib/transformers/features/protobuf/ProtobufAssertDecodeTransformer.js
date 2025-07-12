"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufAssertDecodeTransformer = void 0;
const ProtobufAssertDecodeProgrammer_1 = require("../../../programmers/protobuf/ProtobufAssertDecodeProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var ProtobufAssertDecodeTransformer;
(function (ProtobufAssertDecodeTransformer) {
    ProtobufAssertDecodeTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "protobuf.assertDecode", write: ProtobufAssertDecodeProgrammer_1.ProtobufAssertDecodeProgrammer.write }));
})(ProtobufAssertDecodeTransformer || (exports.ProtobufAssertDecodeTransformer = ProtobufAssertDecodeTransformer = {}));
//# sourceMappingURL=ProtobufAssertDecodeTransformer.js.map