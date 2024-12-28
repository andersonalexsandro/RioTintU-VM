"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flags = exports.FlagCode = void 0;
var FlagCode;
(function (FlagCode) {
    FlagCode[FlagCode["ZERO"] = 0] = "ZERO";
    FlagCode[FlagCode["NOT_ZERO"] = 1] = "NOT_ZERO";
    FlagCode[FlagCode["COUT"] = 2] = "COUT";
    FlagCode[FlagCode["NOT_COUT"] = 3] = "NOT_COUT";
    FlagCode[FlagCode["MSB"] = 4] = "MSB";
    FlagCode[FlagCode["NOT_MSB"] = 5] = "NOT_MSB";
    FlagCode[FlagCode["EVEN"] = 6] = "EVEN";
    FlagCode[FlagCode["NOT_EVEN"] = 7] = "NOT_EVEN";
})(FlagCode || (exports.FlagCode = FlagCode = {}));
class Flags {
    constructor(zero = false, cout = false, msb = false, even = false) {
        this.zero = zero;
        this.cout = cout;
        this.msb = msb;
        this.even = even;
    }
    getZero() {
        return this.zero;
    }
    getCout() {
        return this.cout;
    }
    getMsb() {
        return this.msb;
    }
    getEven() {
        return this.even;
    }
    setZero(value) {
        this.zero = value;
    }
    setCout(value) {
        this.cout = value;
    }
    setMsb(value) {
        this.msb = value;
    }
    setEven(value) {
        this.even = value;
    }
    setFlags(result) {
        const maskedResult = result & 255;
        this.cout = (result & 256) !== 0;
        this.zero = maskedResult === 0;
        this.even = (maskedResult % 2) === 0;
        this.msb = (maskedResult & 128) !== 0;
    }
    toString() {
        return `Flags: { zero: ${this.zero}, cout: ${this.cout}, msb: ${this.msb}, even: ${this.even} }`;
    }
}
exports.Flags = Flags;
