"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufIsEncodeTransformer = void 0;
const ProtobufIsEncodeProgrammer_1 = require("../../../programmers/protobuf/ProtobufIsEncodeProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var ProtobufIsEncodeTransformer;
(function (ProtobufIsEncodeTransformer) {
    ProtobufIsEncodeTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "protobuf.isEncode", write: ProtobufIsEncodeProgrammer_1.ProtobufIsEncodeProgrammer.write }));
})(ProtobufIsEncodeTransformer || (exports.ProtobufIsEncodeTransformer = ProtobufIsEncodeTransformer = {}));
//# sourceMappingURL=ProtobufIsEncodeTransformer.js.map