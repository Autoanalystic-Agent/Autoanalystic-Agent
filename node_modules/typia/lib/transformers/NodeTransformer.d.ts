import ts from "typescript";
import { ITypiaContext } from "./ITypiaContext";
export declare namespace NodeTransformer {
    const transform: (props: {
        context: ITypiaContext;
        node: ts.Node;
    }) => ts.Node | null;
}
