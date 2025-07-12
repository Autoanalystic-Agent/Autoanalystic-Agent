"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufDecodeTransformer = void 0;
const ProtobufDecodeProgrammer_1 = require("../../../programmers/protobuf/ProtobufDecodeProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var ProtobufDecodeTransformer;
(function (ProtobufDecodeTransformer) {
    ProtobufDecodeTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "protobuf.decode", write: ProtobufDecodeProgrammer_1.ProtobufDecodeProgrammer.write }));
})(ProtobufDecodeTransformer || (exports.ProtobufDecodeTransformer = ProtobufDecodeTransformer = {}));
//# sourceMappingURL=ProtobufDecodeTransformer.js.map