import ts from "typescript";
import { ITypiaContext } from "../../transformers/ITypiaContext";
export declare namespace ProtobufMessageProgrammer {
    interface IProps {
        context: ITypiaContext;
        type: ts.Type;
    }
    const write: (props: IProps) => ts.CallExpression;
}
