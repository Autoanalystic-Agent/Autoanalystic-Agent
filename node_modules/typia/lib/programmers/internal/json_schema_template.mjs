import { Metadata } from '../../schemas/metadata/Metadata.mjs';
import { json_schema_plugin } from './json_schema_plugin.mjs';
import { metadata_to_pattern } from './metadata_to_pattern.mjs';

const json_schema_templates = (metadata) => {
    const pureTemplates = metadata.templates.filter((t) => isPure(t.tags ?? []) === true);
    const taggedTemplates = metadata.templates.filter((t) => isPure(t.tags ?? []) === false);
    const output = [];
    if (pureTemplates.length)
        output.push({
            type: "string",
            pattern: metadata_to_pattern({
                top: true,
                metadata: Metadata.create({
                    ...Metadata.initialize(),
                    templates: pureTemplates,
                }),
            }),
        });
    for (const tpl of taggedTemplates)
        output.push(...json_schema_plugin({
            schema: {
                type: "string",
                pattern: metadata_to_pattern({
                    top: false,
                    metadata: Metadata.create({
                        ...Metadata.initialize(),
                        templates: [tpl],
                    }),
                }),
            },
            tags: tpl.tags ?? [],
        }));
    return output;
};
const isPure = (matrix) => matrix.every((tags) => filter(tags).length === 0);
const filter = (tags) => tags.filter((t) => t.schema !== undefined);

export { json_schema_templates };
//# sourceMappingURL=json_schema_template.mjs.map
