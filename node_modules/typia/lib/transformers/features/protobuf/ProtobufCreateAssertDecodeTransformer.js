"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufCreateAssertDecodeTransformer = void 0;
const ProtobufAssertDecodeProgrammer_1 = require("../../../programmers/protobuf/ProtobufAssertDecodeProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var ProtobufCreateAssertDecodeTransformer;
(function (ProtobufCreateAssertDecodeTransformer) {
    ProtobufCreateAssertDecodeTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "protobuf.createAssertDecode", write: ProtobufAssertDecodeProgrammer_1.ProtobufAssertDecodeProgrammer.write }));
})(ProtobufCreateAssertDecodeTransformer || (exports.ProtobufCreateAssertDecodeTransformer = ProtobufCreateAssertDecodeTransformer = {}));
//# sourceMappingURL=ProtobufCreateAssertDecodeTransformer.js.map