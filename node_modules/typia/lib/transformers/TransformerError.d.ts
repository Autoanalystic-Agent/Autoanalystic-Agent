import { MetadataFactory } from "../factories/MetadataFactory";
export declare class TransformerError extends Error {
    readonly code: string;
    constructor(props: TransformerError.IProps);
}
export declare namespace TransformerError {
    interface IProps {
        code: string;
        message: string;
    }
    const from: (props: {
        code: string;
        errors: MetadataFactory.IError[];
    }) => TransformerError;
}
