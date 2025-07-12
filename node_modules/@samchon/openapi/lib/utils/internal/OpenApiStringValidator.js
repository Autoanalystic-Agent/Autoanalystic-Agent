"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiStringValidator = void 0;
const _isFormatByte_1 = require("../../functional/_isFormatByte");
const _isFormatDate_1 = require("../../functional/_isFormatDate");
const _isFormatDateTime_1 = require("../../functional/_isFormatDateTime");
const _isFormatDuration_1 = require("../../functional/_isFormatDuration");
const _isFormatEmail_1 = require("../../functional/_isFormatEmail");
const _isFormatHostname_1 = require("../../functional/_isFormatHostname");
const _isFormatIdnEmail_1 = require("../../functional/_isFormatIdnEmail");
const _isFormatIdnHostname_1 = require("../../functional/_isFormatIdnHostname");
const _isFormatIpv4_1 = require("../../functional/_isFormatIpv4");
const _isFormatIpv6_1 = require("../../functional/_isFormatIpv6");
const _isFormatIri_1 = require("../../functional/_isFormatIri");
const _isFormatIriReference_1 = require("../../functional/_isFormatIriReference");
const _isFormatJsonPointer_1 = require("../../functional/_isFormatJsonPointer");
const _isFormatRegex_1 = require("../../functional/_isFormatRegex");
const _isFormatRelativeJsonPointer_1 = require("../../functional/_isFormatRelativeJsonPointer");
const _isFormatTime_1 = require("../../functional/_isFormatTime");
const _isFormatUri_1 = require("../../functional/_isFormatUri");
const _isFormatUriReference_1 = require("../../functional/_isFormatUriReference");
const _isFormatUriTemplate_1 = require("../../functional/_isFormatUriTemplate");
const _isFormatUrl_1 = require("../../functional/_isFormatUrl");
const _isFormatUuid_1 = require("../../functional/_isFormatUuid");
var OpenApiStringValidator;
(function (OpenApiStringValidator) {
    OpenApiStringValidator.validate = (ctx) => {
        if (typeof ctx.value !== "string")
            return ctx.report(ctx);
        return ([
            ctx.schema.minLength !== undefined
                ? ctx.value.length >= ctx.schema.minLength ||
                    ctx.report(Object.assign(Object.assign({}, ctx), { expected: `string & MinLength<${ctx.schema.minLength}>` }))
                : true,
            ctx.schema.maxLength !== undefined
                ? ctx.value.length <= ctx.schema.maxLength ||
                    ctx.report(Object.assign(Object.assign({}, ctx), { expected: `string & MaxLength<${ctx.schema.maxLength}>` }))
                : true,
            ctx.schema.pattern !== undefined
                ? new RegExp(ctx.schema.pattern).test(ctx.value) ||
                    ctx.report(Object.assign(Object.assign({}, ctx), { expected: `string & Pattern<${JSON.stringify(ctx.schema.pattern)}>` }))
                : true,
            ctx.schema.format && FORMAT[ctx.schema.format]
                ? FORMAT[ctx.schema.format](ctx.value) ||
                    ctx.report(Object.assign(Object.assign({}, ctx), { expected: `string & Format<${JSON.stringify(ctx.schema.format)}>` }))
                : true,
        ].every((v) => v) || ctx.report(ctx));
    };
})(OpenApiStringValidator || (exports.OpenApiStringValidator = OpenApiStringValidator = {}));
const FORMAT = {
    byte: _isFormatByte_1._isFormatByte,
    regex: _isFormatRegex_1._isFormatRegex,
    uuid: _isFormatUuid_1._isFormatUuid,
    email: _isFormatEmail_1._isFormatEmail,
    hostname: _isFormatHostname_1._isFormatHostname,
    "idn-email": _isFormatIdnEmail_1._isFormatIdnEmail,
    "idn-hostname": _isFormatIdnHostname_1._isFormatIdnHostname,
    iri: _isFormatIri_1._isFormatIri,
    "iri-reference": _isFormatIriReference_1._isFormatIriReference,
    ipv4: _isFormatIpv4_1._isFormatIpv4,
    ipv6: _isFormatIpv6_1._isFormatIpv6,
    uri: _isFormatUri_1._isFormatUri,
    "uri-reference": _isFormatUriReference_1._isFormatUriReference,
    "uri-template": _isFormatUriTemplate_1._isFormatUriTemplate,
    url: _isFormatUrl_1._isFormatUrl,
    "date-time": _isFormatDateTime_1._isFormatDateTime,
    date: _isFormatDate_1._isFormatDate,
    time: _isFormatTime_1._isFormatTime,
    duration: _isFormatDuration_1._isFormatDuration,
    "json-pointer": _isFormatJsonPointer_1._isFormatJsonPointer,
    "relative-json-pointer": _isFormatRelativeJsonPointer_1._isFormatRelativeJsonPointer,
};
