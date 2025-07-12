"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtobufCreateIsDecodeTransformer = void 0;
const ProtobufIsDecodeProgrammer_1 = require("../../../programmers/protobuf/ProtobufIsDecodeProgrammer");
const GenericTransformer_1 = require("../../internal/GenericTransformer");
var ProtobufCreateIsDecodeTransformer;
(function (ProtobufCreateIsDecodeTransformer) {
    ProtobufCreateIsDecodeTransformer.transform = (props) => GenericTransformer_1.GenericTransformer.factory(Object.assign(Object.assign({}, props), { method: "protobuf.createIsDecode", write: ProtobufIsDecodeProgrammer_1.ProtobufIsDecodeProgrammer.write }));
})(ProtobufCreateIsDecodeTransformer || (exports.ProtobufCreateIsDecodeTransformer = ProtobufCreateIsDecodeTransformer = {}));
//# sourceMappingURL=ProtobufCreateIsDecodeTransformer.js.map