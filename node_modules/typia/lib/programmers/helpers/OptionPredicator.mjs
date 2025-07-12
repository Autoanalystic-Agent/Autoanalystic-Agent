var OptionPredicator;
(function (OptionPredicator) {
    OptionPredicator.numeric = (options) => OptionPredicator.finite(options) || options.numeric === true;
    OptionPredicator.functional = (options) => options.functional === true;
    OptionPredicator.finite = (options) => options.finite === true;
    OptionPredicator.undefined = (options) => options.undefined !== false;
})(OptionPredicator || (OptionPredicator = {}));

export { OptionPredicator };
//# sourceMappingURL=OptionPredicator.mjs.map
