"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterate_metadata_comment_tags = void 0;
const MetadataCommentTagFactory_1 = require("../../MetadataCommentTagFactory");
const iterate_metadata_comment_tags = (props) => {
    if (props.object.tagged_ === true)
        return;
    props.object.tagged_ = true;
    for (const property of props.object.properties) {
        MetadataCommentTagFactory_1.MetadataCommentTagFactory.analyze({
            errors: props.errors,
            metadata: property.value,
            tags: property.jsDocTags,
            explore: {
                top: false,
                object: props.object,
                property: property.key.isSoleLiteral()
                    ? property.key.getSoleLiteral()
                    : {},
                parameter: null,
                nested: null,
                aliased: false,
                escaped: false,
                output: false,
            },
        });
    }
};
exports.iterate_metadata_comment_tags = iterate_metadata_comment_tags;
//# sourceMappingURL=iterate_metadata_comment_tags.js.map