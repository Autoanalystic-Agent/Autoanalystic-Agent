import { MetadataObjectType } from "../schemas/metadata/MetadataObjectType";
export declare namespace MetadataTypeTagSchemaFactory {
    const object: (props: {
        report: (msg: string) => false;
        object: MetadataObjectType;
    }) => object | undefined;
}
