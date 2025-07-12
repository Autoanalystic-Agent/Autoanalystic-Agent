"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufIsDecodeTransformer = void 0;
const ProtobufIsDecodeProgrammer_1 = require("../../../programmers/protobuf/ProtobufIsDecodeProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var ProtobufIsDecodeTransformer;
(function (ProtobufIsDecodeTransformer) {
    ProtobufIsDecodeTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "protobuf.isDecode", write: ProtobufIsDecodeProgrammer_1.ProtobufIsDecodeProgrammer.write }));
})(ProtobufIsDecodeTransformer || (exports.ProtobufIsDecodeTransformer = ProtobufIsDecodeTransformer = {}));
//# sourceMappingURL=ProtobufIsDecodeTransformer.js.map