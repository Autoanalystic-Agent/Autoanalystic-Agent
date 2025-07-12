var StringifyPredicator;
(function (StringifyPredicator) {
    StringifyPredicator.require_escape = (value) => value.split("").some((ch) => ESCAPED.some((escaped) => escaped === ch));
    StringifyPredicator.undefindable = (metadata) => metadata.isRequired() === false ||
        (metadata.escaped !== null &&
            metadata.escaped.returns.isRequired() === false);
    const ESCAPED = ['"', "\\", "\b", "\f", "\n", "\n", "\r", "\t"];
})(StringifyPredicator || (StringifyPredicator = {}));

export { StringifyPredicator };
//# sourceMappingURL=StringifyPredicator.mjs.map
