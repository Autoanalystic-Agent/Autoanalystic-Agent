"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataHelper = void 0;
const Metadata_1 = require("../../../schemas/metadata/Metadata");
const MetadataConstant_1 = require("../../../schemas/metadata/MetadataConstant");
const MetadataConstantValue_1 = require("../../../schemas/metadata/MetadataConstantValue");
var MetadataHelper;
(function (MetadataHelper) {
    MetadataHelper.literal_to_metadata = (key) => {
        const metadata = Metadata_1.Metadata.initialize();
        metadata.constants.push(MetadataConstant_1.MetadataConstant.create({
            type: "string",
            values: [
                MetadataConstantValue_1.MetadataConstantValue.create({
                    value: key,
                    tags: [],
                }),
            ],
        }));
        return metadata;
    };
})(MetadataHelper || (exports.MetadataHelper = MetadataHelper = {}));
//# sourceMappingURL=MetadataHelper.js.map