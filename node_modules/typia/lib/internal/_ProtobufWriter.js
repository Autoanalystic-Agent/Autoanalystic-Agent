"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ProtobufWriter = void 0;
const Singleton_1 = require("../utils/Singleton");
/// @reference https://github.com/piotr-oles/as-proto/blob/main/packages/as-proto/assembly/internal/FixedWriter.ts
class _ProtobufWriter {
    constructor(sizer) {
        this.sizer = sizer;
        this.buf = new Uint8Array(sizer.len);
        this.view = new DataView(this.buf.buffer);
        this.ptr = 0;
        this.varlenidx = 0;
    }
    buffer() {
        return this.buf;
    }
    bool(value) {
        this.byte(value ? 1 : 0);
    }
    byte(value) {
        this.buf[this.ptr++] = value & 255;
    }
    int32(value) {
        if (value < 0)
            this.int64(value);
        else
            this.variant32(value >>> 0);
    }
    sint32(value) {
        this.variant32((value << 1) ^ (value >> 31));
    }
    uint32(value) {
        this.variant32(value);
    }
    sint64(value) {
        value = BigInt(value);
        this.variant64((value << BigInt(0x01)) ^ (value >> BigInt(0x3f)));
    }
    int64(value) {
        this.variant64(BigInt(value));
    }
    uint64(value) {
        this.variant64(BigInt(value));
    }
    float(val) {
        this.view.setFloat32(this.ptr, val, true);
        this.ptr += 4;
    }
    double(val) {
        this.view.setFloat64(this.ptr, val, true);
        this.ptr += 8;
    }
    bytes(value) {
        this.uint32(value.byteLength);
        for (let i = 0; i < value.byteLength; i++)
            this.buf[this.ptr++] = value[i];
    }
    string(value) {
        const len = this.varlen(); // use precomputed length
        this.uint32(len);
        const binary = utf8.get().encode(value);
        for (let i = 0; i < binary.byteLength; i++)
            this.buf[this.ptr++] = binary[i];
    }
    fork() {
        this.uint32(this.varlen()); // use precomputed length
    }
    ldelim() {
        // nothing to do - all dirty work done by sizer
    }
    finish() {
        return this.buf;
    }
    reset() {
        this.buf = new Uint8Array(this.sizer.len);
        this.view = new DataView(this.buf.buffer);
        this.ptr = 0;
        this.varlenidx = 0;
    }
    variant32(val) {
        while (val > 0x7f) {
            this.buf[this.ptr++] = (val & 0x7f) | 0x80;
            val = val >>> 7;
        }
        this.buf[this.ptr++] = val;
    }
    variant64(val) {
        val = BigInt.asUintN(64, val);
        while (val > BigInt(0x7f)) {
            this.buf[this.ptr++] = Number((val & BigInt(0x7f)) | BigInt(0x80));
            val = val >> BigInt(0x07);
        }
        this.buf[this.ptr++] = Number(val);
    }
    varlen() {
        return this.varlenidx >= this.sizer.varlen.length
            ? 0
            : this.sizer.varlen[this.varlenidx++];
    }
}
exports._ProtobufWriter = _ProtobufWriter;
const utf8 = /** @__PURE__ */ new Singleton_1.Singleton(() => new TextEncoder());
//# sourceMappingURL=_ProtobufWriter.js.map