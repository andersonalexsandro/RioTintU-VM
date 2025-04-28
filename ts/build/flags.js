export var FlagCode;
(function (FlagCode) {
    FlagCode[FlagCode["NOT_MSB"] = 0] = "NOT_MSB";
    FlagCode[FlagCode["MSB"] = 1] = "MSB";
    FlagCode[FlagCode["NOT_COUT"] = 2] = "NOT_COUT";
    FlagCode[FlagCode["COUT"] = 3] = "COUT";
    FlagCode[FlagCode["ZERO"] = 4] = "ZERO";
    FlagCode[FlagCode["NOT_ZERO"] = 5] = "NOT_ZERO";
    FlagCode[FlagCode["NOT_EVEN"] = 6] = "NOT_EVEN";
    FlagCode[FlagCode["EVEN"] = 7] = "EVEN";
})(FlagCode || (FlagCode = {}));
export class Flags {
    zero;
    cout;
    msb;
    even;
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
