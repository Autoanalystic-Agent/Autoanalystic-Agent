import { Metadata } from "../../schemas/metadata/Metadata";
import { Atomic } from "../../typings/Atomic";
export declare namespace AtomicPredicator {
    const constant: (props: {
        metadata: Metadata;
        name: Atomic.Literal;
    }) => boolean;
    const atomic: (props: {
        metadata: Metadata;
        name: Atomic.Literal;
    }) => boolean;
    const native: (name: string) => boolean;
    const template: (metadata: Metadata) => boolean;
}
