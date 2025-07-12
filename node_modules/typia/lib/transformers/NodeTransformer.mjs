import ts from 'typescript';
import { CallExpressionTransformer } from './CallExpressionTransformer.mjs';

var NodeTransformer;
(function (NodeTransformer) {
    NodeTransformer.transform = (props) => ts.isCallExpression(props.node) && props.node.parent
        ? CallExpressionTransformer.transform({
            context: props.context,
            expression: props.node,
        })
        : props.node;
})(NodeTransformer || (NodeTransformer = {}));

export { NodeTransformer };
//# sourceMappingURL=NodeTransformer.mjs.map
