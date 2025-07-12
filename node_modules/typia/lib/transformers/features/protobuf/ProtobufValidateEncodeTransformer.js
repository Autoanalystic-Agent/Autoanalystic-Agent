"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufValidateEncodeTransformer = void 0;
const ProtobufValidateEncodeProgrammer_1 = require("../../../programmers/protobuf/ProtobufValidateEncodeProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var ProtobufValidateEncodeTransformer;
(function (ProtobufValidateEncodeTransformer) {
    ProtobufValidateEncodeTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.scalar(Object.assign(Object.assign({}, props), { method: "protobuf.validateEncode", write: ProtobufValidateEncodeProgrammer_1.ProtobufValidateEncodeProgrammer.write }));
})(ProtobufValidateEncodeTransformer || (exports.ProtobufValidateEncodeTransformer = ProtobufValidateEncodeTransformer = {}));
//# sourceMappingURL=ProtobufValidateEncodeTransformer.js.map