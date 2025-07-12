import { Metadata } from "../../schemas/metadata/Metadata";
export declare namespace HttpMetadataUtil {
    const atomics: (metadata: Metadata) => Set<"boolean" | "bigint" | "number" | "string">;
    const isUnion: (metadata: Metadata) => boolean;
}
