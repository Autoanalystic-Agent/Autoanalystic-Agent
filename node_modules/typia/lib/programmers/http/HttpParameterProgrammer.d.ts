import ts from "typescript";
import { Metadata } from "../../schemas/metadata/Metadata";
import { IProgrammerProps } from "../../transformers/IProgrammerProps";
export declare namespace HttpParameterProgrammer {
    const write: (props: IProgrammerProps) => ts.ArrowFunction;
    const validate: (meta: Metadata) => string[];
}
