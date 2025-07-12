"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMigrateRouteFetcher = void 0;
const HttpError_1 = require("./HttpError");
var HttpMigrateRouteFetcher;
(function (HttpMigrateRouteFetcher) {
    HttpMigrateRouteFetcher.execute = (props) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const result = yield _Propagate("request", props);
        (_a = props.route.success) === null || _a === void 0 ? void 0 : _a.media;
        if (result.status !== 200 && result.status !== 201)
            throw new HttpError_1.HttpError(props.route.method.toUpperCase(), props.route.path, result.status, result.headers, result.body);
        return result.body;
    });
    HttpMigrateRouteFetcher.propagate = (props) => _Propagate("propagate", props);
})(HttpMigrateRouteFetcher || (exports.HttpMigrateRouteFetcher = HttpMigrateRouteFetcher = {}));
const _Propagate = (from, props) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // VALIDATE PARAMETERS
    const error = (message) => new Error(`Error on MigrateRouteFetcher.${from}(): ${message}`);
    if (Array.isArray(props.parameters)) {
        if (props.route.parameters.length !== props.parameters.length)
            throw error(`number of parameters is not matched.`);
    }
    else if (props.route.parameters.every((p) => props.parameters[p.key] !== undefined) === false)
        throw error(`number of parameters is not matched.`);
    // VALIDATE QUERY
    if (!!props.route.query !== !!props.query)
        throw error(`query is not matched.`);
    else if (!!props.route.body !== (props.body !== undefined))
        throw error(`body is not matched.`);
    // INIT REQUEST DATA
    const headers = Object.assign(Object.assign({}, ((_a = props.connection.headers) !== null && _a !== void 0 ? _a : {})), (((_b = props.route.body) === null || _b === void 0 ? void 0 : _b.type) &&
        props.route.body.type !== "multipart/form-data"
        ? { "Content-Type": props.route.body.type }
        : {}));
    const init = Object.assign(Object.assign({}, ((_c = props.connection.options) !== null && _c !== void 0 ? _c : {})), { method: props.route.method.toUpperCase(), headers: (() => {
            const output = [];
            for (const [key, value] of Object.entries(headers))
                if (value === undefined)
                    continue;
                else if (Array.isArray(value))
                    for (const v of value)
                        output.push([key, String(v)]);
                else
                    output.push([key, String(value)]);
            return output;
        })() });
    if (props.body !== undefined)
        init.body = (((_d = props.route.body) === null || _d === void 0 ? void 0 : _d.type) === "application/x-www-form-urlencoded"
            ? requestQueryBody(props.body)
            : ((_e = props.route.body) === null || _e === void 0 ? void 0 : _e.type) === "multipart/form-data"
                ? requestFormDataBody(props.body)
                : ((_f = props.route.body) === null || _f === void 0 ? void 0 : _f.type) === "application/json"
                    ? JSON.stringify(props.body)
                    : props.body);
    // DO REQUEST
    const resolvedPath = props.connection.host.endsWith("/") === false &&
        props.route.emendedPath.startsWith("/") === false
        ? `/${getPath(props)}`
        : getPath(props);
    const url = new URL(`${props.connection.host}${resolvedPath}`);
    const response = yield ((_g = props.connection.fetch) !== null && _g !== void 0 ? _g : fetch)(url, init);
    const status = response.status;
    const out = (body) => ({
        status,
        headers: responseHeaders(response.headers),
        body,
    });
    if (status === 200 || status === 201) {
        // SUCCESS CASE
        if (props.route.method.toUpperCase() === "HEAD")
            return out(undefined);
        else if (props.route.success === null ||
            props.route.success.type === "text/plain")
            return out(yield response.text());
        else if (props.route.success.type === "application/json") {
            const text = yield response.text();
            return out(text.length ? JSON.parse(text) : undefined);
        }
        else if (props.route.success.type === "application/x-www-form-urlencoded")
            return out(new URLSearchParams(yield response.text()));
        else if (props.route.success.type === "multipart/form-data")
            return out(yield response.formData());
        throw error("Unsupported response body type.");
    }
    else {
        // FAILURE CASE
        const type = ((_j = (_h = response.headers.get("content-type")) !== null && _h !== void 0 ? _h : response.headers.get("Content-Type")) !== null && _j !== void 0 ? _j : "")
            .split(";")[0]
            .trim();
        if (type === "" || type.startsWith("text/"))
            return out(yield response.text());
        else if (type === "application/json")
            return out(yield response.json());
        else if (type === "application/x-www-form-urlencoded")
            return out(new URLSearchParams(yield response.text()));
        else if (type === "multipart/form-data")
            return out(yield response.formData());
        else if (type === "application/octet-stream")
            return out(yield response.blob());
        return out(yield response.text());
    }
});
const getPath = (props) => {
    var _a;
    let path = props.route.emendedPath;
    props.route.parameters.forEach((p, i) => {
        var _a;
        path = path.replace(`:${p.key}`, encodeURIComponent(String((_a = (Array.isArray(props.parameters)
            ? props.parameters[i]
            : props.parameters[p.key])) !== null && _a !== void 0 ? _a : "null")));
    });
    if (props.route.query)
        path += getQueryPath((_a = props.query) !== null && _a !== void 0 ? _a : {});
    return path;
};
const getQueryPath = (query) => {
    const variables = new URLSearchParams();
    for (const [key, value] of Object.entries(query))
        if (undefined === value)
            continue;
        else if (Array.isArray(value))
            value.forEach((elem) => variables.append(key, String(elem)));
        else
            variables.set(key, String(value));
    return 0 === variables.size ? "" : `?${variables.toString()}`;
};
const requestQueryBody = (input) => {
    const q = new URLSearchParams();
    for (const [key, value] of Object.entries(input))
        if (value === undefined)
            continue;
        else if (Array.isArray(value))
            value.forEach((elem) => q.append(key, String(elem)));
        else
            q.set(key, String(value));
    return q;
};
const requestFormDataBody = (input) => {
    const encoded = new FormData();
    const append = (key) => (value) => {
        if (value === undefined)
            return;
        else if (typeof File === "function" && value instanceof File)
            encoded.append(key, value, value.name);
        else
            encoded.append(key, value);
    };
    for (const [key, value] of Object.entries(input))
        if (Array.isArray(value))
            value.map(append(key));
        else
            append(key)(value);
    return encoded;
};
const responseHeaders = (headers) => {
    const output = {};
    headers.forEach((value, key) => {
        var _a;
        if (key === "set-cookie") {
            (_a = output[key]) !== null && _a !== void 0 ? _a : (output[key] = []);
            output[key].push(...value.split(";").map((str) => str.trim()));
        }
        else
            output[key] = value;
    });
    return output;
};
