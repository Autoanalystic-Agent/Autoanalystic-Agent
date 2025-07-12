"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufCreateValidateEncodeTransformer = void 0;
const ProtobufValidateEncodeProgrammer_1 = require("../../../programmers/protobuf/ProtobufValidateEncodeProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var ProtobufCreateValidateEncodeTransformer;
(function (ProtobufCreateValidateEncodeTransformer) {
    ProtobufCreateValidateEncodeTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "protobuf.createValidateEncode", write: ProtobufValidateEncodeProgrammer_1.ProtobufValidateEncodeProgrammer.write }));
})(ProtobufCreateValidateEncodeTransformer || (exports.ProtobufCreateValidateEncodeTransformer = ProtobufCreateValidateEncodeTransformer = {}));
//# sourceMappingURL=ProtobufCreateValidateEncodeTransformer.js.map