import { Metadata } from '../../../schemas/metadata/Metadata.mjs';
import { MetadataConstant } from '../../../schemas/metadata/MetadataConstant.mjs';
import { MetadataConstantValue } from '../../../schemas/metadata/MetadataConstantValue.mjs';

var MetadataHelper;
(function (MetadataHelper) {
    MetadataHelper.literal_to_metadata = (key) => {
        const metadata = Metadata.initialize();
        metadata.constants.push(MetadataConstant.create({
            type: "string",
            values: [
                MetadataConstantValue.create({
                    value: key,
                    tags: [],
                }),
            ],
        }));
        return metadata;
    };
})(MetadataHelper || (MetadataHelper = {}));

export { MetadataHelper };
//# sourceMappingURL=MetadataHelper.mjs.map
