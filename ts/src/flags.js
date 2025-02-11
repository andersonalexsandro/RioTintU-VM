"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flags = exports.FlagCode = void 0;
var FlagCode;
(function (FlagCode) {
    FlagCode[FlagCode["NOT_MSB"] = 0] = "NOT_MSB";
    FlagCode[FlagCode["MSB"] = 1] = "MSB";
    FlagCode[FlagCode["NOT_COUT"] = 2] = "NOT_COUT";
    FlagCode[FlagCode["COUT"] = 3] = "COUT";
    FlagCode[FlagCode["ZERO"] = 4] = "ZERO";
    FlagCode[FlagCode["NOT_ZERO"] = 5] = "NOT_ZERO";
    FlagCode[FlagCode["NOT_EVEN"] = 6] = "NOT_EVEN";
    FlagCode[FlagCode["EVEN"] = 7] = "EVEN";
})(FlagCode || (exports.FlagCode = FlagCode = {}));
var Flags = /** @class */ (function () {
    function Flags(zero, cout, msb, even) {
        if (zero === void 0) { zero = false; }
        if (cout === void 0) { cout = false; }
        if (msb === void 0) { msb = false; }
        if (even === void 0) { even = false; }
        this.zero = zero;
        this.cout = cout;
        this.msb = msb;
        this.even = even;
    }
    Flags.prototype.getZero = function () {
        return this.zero;
    };
    Flags.prototype.getCout = function () {
        return this.cout;
    };
    Flags.prototype.getMsb = function () {
        return this.msb;
    };
    Flags.prototype.getEven = function () {
        return this.even;
    };
    Flags.prototype.setZero = function (value) {
        this.zero = value;
    };
    Flags.prototype.setCout = function (value) {
        this.cout = value;
    };
    Flags.prototype.setMsb = function (value) {
        this.msb = value;
    };
    Flags.prototype.setEven = function (value) {
        this.even = value;
    };
    Flags.prototype.setFlags = function (result) {
        var maskedResult = result & 255;
        this.cout = (result & 256) !== 0;
        this.zero = maskedResult === 0;
        this.even = (maskedResult % 2) === 0;
        this.msb = (maskedResult & 128) !== 0;
    };
    Flags.prototype.toString = function () {
        return "Flags: { zero: ".concat(this.zero, ", cout: ").concat(this.cout, ", msb: ").concat(this.msb, ", even: ").concat(this.even, " }");
    };
    return Flags;
}());
exports.Flags = Flags;
