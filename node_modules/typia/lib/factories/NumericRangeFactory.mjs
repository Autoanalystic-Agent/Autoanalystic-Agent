import ts from 'typescript';
import { ExpressionFactory } from './ExpressionFactory.mjs';

var NumericRangeFactory;
(function (NumericRangeFactory) {
    NumericRangeFactory.number = (type, input) => NumberPredicator[type](input);
    NumericRangeFactory.bigint = (type, input) => BigIntPredicator[type](input);
})(NumericRangeFactory || (NumericRangeFactory = {}));
var NumberPredicator;
(function (NumberPredicator) {
    NumberPredicator.int32 = (input) => ts.factory.createLogicalAnd(integer(input), between("-2147483648", "2147483647")(input));
    NumberPredicator.uint32 = (input) => ts.factory.createLogicalAnd(integer(input), between("0", "4294967295")(input));
    NumberPredicator.int64 = (input) => ts.factory.createLogicalAnd(integer(input), between("-9223372036854775808", "9223372036854775807")(input));
    NumberPredicator.uint64 = (input) => ts.factory.createLogicalAnd(integer(input), between("0", "18446744073709551615")(input));
    NumberPredicator.float = (input) => between("-1.175494351e38", "3.4028235e38")(input);
    NumberPredicator.double = () => ts.factory.createTrue();
})(NumberPredicator || (NumberPredicator = {}));
var BigIntPredicator;
(function (BigIntPredicator) {
    BigIntPredicator.int64 = () => ts.factory.createTrue();
    BigIntPredicator.uint64 = (input) => ts.factory.createLessThanEquals(ts.factory.createCallExpression(ts.factory.createIdentifier("BigInt"), undefined, [ExpressionFactory.number(0)]), input);
})(BigIntPredicator || (BigIntPredicator = {}));
const integer = (input) => ts.factory.createStrictEquality(ts.factory.createCallExpression(ts.factory.createIdentifier("Math.floor"), undefined, [input]), input);
const between = (x, y) => (input) => ts.factory.createLogicalAnd(ts.factory.createLessThanEquals(ts.factory.createIdentifier(x), input), ts.factory.createLessThanEquals(input, ts.factory.createIdentifier(y)));

export { NumericRangeFactory };
//# sourceMappingURL=NumericRangeFactory.mjs.map
