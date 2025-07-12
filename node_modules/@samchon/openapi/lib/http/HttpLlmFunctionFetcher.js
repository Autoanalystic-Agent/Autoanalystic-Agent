"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpLlmFunctionFetcher = void 0;
const HttpMigrateRouteFetcher_1 = require("./HttpMigrateRouteFetcher");
var HttpLlmFunctionFetcher;
(function (HttpLlmFunctionFetcher) {
    HttpLlmFunctionFetcher.execute = (props) => HttpMigrateRouteFetcher_1.HttpMigrateRouteFetcher.execute(getFetchArguments("execute", props));
    HttpLlmFunctionFetcher.propagate = (props) => HttpMigrateRouteFetcher_1.HttpMigrateRouteFetcher.propagate(getFetchArguments("propagate", props));
    const getFetchArguments = (from, props) => {
        const route = props.function.route();
        const input = props.input;
        const valid = typeof input === "object" && input !== null;
        if (valid === false)
            throw new Error(`Error on HttpLlmFunctionFetcher.${from}(): keyworded arguments must be an object`);
        return {
            connection: props.connection,
            route,
            parameters: Object.fromEntries(route.parameters.map((p) => [p.key, input[p.key]])),
            query: input.query,
            body: input.body,
        };
    };
})(HttpLlmFunctionFetcher || (exports.HttpLlmFunctionFetcher = HttpLlmFunctionFetcher = {}));
