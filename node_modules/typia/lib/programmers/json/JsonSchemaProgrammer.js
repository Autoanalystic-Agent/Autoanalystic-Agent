"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonSchemaProgrammer = void 0;
const JsonSchemasProgrammer_1 = require("./JsonSchemasProgrammer");
var JsonSchemaProgrammer;
(function (JsonSchemaProgrammer) {
    JsonSchemaProgrammer.validate = (metadata) => JsonSchemasProgrammer_1.JsonSchemasProgrammer.validate(metadata);
    JsonSchemaProgrammer.write = (props) => {
        const collection = JsonSchemasProgrammer_1.JsonSchemasProgrammer.write({
            version: props.version,
            metadatas: [props.metadata],
        });
        return {
            version: collection.version,
            components: collection.components,
            schema: collection.schemas[0],
        };
    };
})(JsonSchemaProgrammer || (exports.JsonSchemaProgrammer = JsonSchemaProgrammer = {}));
//# sourceMappingURL=JsonSchemaProgrammer.js.map