import { CommentFactory } from '../../factories/CommentFactory.mjs';

const json_schema_title = (schema) => {
    const info = schema.jsDocTags?.find((tag) => tag.name === "title");
    return !!info?.text?.length ? CommentFactory.merge(info.text) : undefined;
};

export { json_schema_title };
//# sourceMappingURL=json_schema_title.mjs.map
