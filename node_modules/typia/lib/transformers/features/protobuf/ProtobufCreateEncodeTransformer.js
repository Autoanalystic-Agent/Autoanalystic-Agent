"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufCreateEncodeTransformer = void 0;
const ProtobufEncodeProgrammer_1 = require("../../../programmers/protobuf/ProtobufEncodeProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var ProtobufCreateEncodeTransformer;
(function (ProtobufCreateEncodeTransformer) {
    ProtobufCreateEncodeTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "protobuf.createEncode", write: ProtobufEncodeProgrammer_1.ProtobufEncodeProgrammer.write }));
})(ProtobufCreateEncodeTransformer || (exports.ProtobufCreateEncodeTransformer = ProtobufCreateEncodeTransformer = {}));
//# sourceMappingURL=ProtobufCreateEncodeTransformer.js.map