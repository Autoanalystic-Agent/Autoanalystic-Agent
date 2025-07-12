"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufCreateIsEncodeTransformer = void 0;
const ProtobufIsEncodeProgrammer_1 = require("../../../programmers/protobuf/ProtobufIsEncodeProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var ProtobufCreateIsEncodeTransformer;
(function (ProtobufCreateIsEncodeTransformer) {
    ProtobufCreateIsEncodeTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "protobuf.createIsEncode", write: ProtobufIsEncodeProgrammer_1.ProtobufIsEncodeProgrammer.write }));
})(ProtobufCreateIsEncodeTransformer || (exports.ProtobufCreateIsEncodeTransformer = ProtobufCreateIsEncodeTransformer = {}));
//# sourceMappingURL=ProtobufCreateIsEncodeTransformer.js.map