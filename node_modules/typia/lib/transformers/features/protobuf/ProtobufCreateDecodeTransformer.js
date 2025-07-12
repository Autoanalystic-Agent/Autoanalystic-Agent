"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufCreateDecodeTransformer = void 0;
const ProtobufDecodeProgrammer_1 = require("../../../programmers/protobuf/ProtobufDecodeProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var ProtobufCreateDecodeTransformer;
(function (ProtobufCreateDecodeTransformer) {
    ProtobufCreateDecodeTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "protobuf.createDecode", write: ProtobufDecodeProgrammer_1.ProtobufDecodeProgrammer.write }));
})(ProtobufCreateDecodeTransformer || (exports.ProtobufCreateDecodeTransformer = ProtobufCreateDecodeTransformer = {}));
//# sourceMappingURL=ProtobufCreateDecodeTransformer.js.map