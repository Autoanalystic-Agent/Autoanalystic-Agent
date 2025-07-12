"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufCreateValidateDecodeTransformer = void 0;
const ProtobufValidateDecodeProgrammer_1 = require("../../../programmers/protobuf/ProtobufValidateDecodeProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var ProtobufCreateValidateDecodeTransformer;
(function (ProtobufCreateValidateDecodeTransformer) {
    ProtobufCreateValidateDecodeTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "protobuf.createValidateDecode", write: ProtobufValidateDecodeProgrammer_1.ProtobufValidateDecodeProgrammer.write }));
})(ProtobufCreateValidateDecodeTransformer || (exports.ProtobufCreateValidateDecodeTransformer = ProtobufCreateValidateDecodeTransformer = {}));
//# sourceMappingURL=ProtobufCreateValidateDecodeTransformer.js.map