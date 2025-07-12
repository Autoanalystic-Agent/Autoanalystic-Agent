import ts from 'typescript';
import { MetadataTemplate } from '../../../schemas/metadata/MetadataTemplate.mjs';
import { MetadataHelper } from './MetadataHelper.mjs';
import { explore_metadata } from './explore_metadata.mjs';

const iterate_metadata_template = (props) => {
    const filter = (flag) => (props.type.getFlags() & flag) !== 0;
    if (!filter(ts.TypeFlags.TemplateLiteral))
        return false;
    const template = props.type;
    const row = [];
    template.texts.forEach((text, i) => {
        // TEXT LITERAL TYPE
        if (text !== "")
            row.push(MetadataHelper.literal_to_metadata(text));
        // BINDED TEMPLATE TYPE
        const binded = template.types[i];
        if (binded)
            row.push(explore_metadata({
                ...props,
                type: binded,
                explore: {
                    ...props.explore,
                    escaped: false,
                    aliased: false,
                },
                intersected: false,
            }));
    });
    props.metadata.templates.push(MetadataTemplate.create({ row, tags: [] }));
    return true;
};

export { iterate_metadata_template };
//# sourceMappingURL=iterate_metadata_template.mjs.map
