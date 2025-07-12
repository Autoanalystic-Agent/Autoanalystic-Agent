import { OpenApi } from "../../OpenApi";
export declare namespace JsonDescriptionUtil {
    const cascade: (props: {
        prefix: string;
        components: OpenApi.IComponents;
        schema: OpenApi.IJsonSchema.IReference;
        escape: boolean;
    }) => string | undefined;
    const take: (o: OpenApi.IJsonSchema.IObject) => string | undefined;
}
