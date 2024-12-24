export class Flags {
    private zero: boolean;
    private cout: boolean;
    private msb: boolean;
    private even: boolean;

    constructor(zero: boolean = false, cout: boolean = false, msb: boolean = false, even: boolean = false) {
        this.zero = zero;
        this.cout = cout;
        this.msb = msb;
        this.even = even;
    }

    getZero(): boolean {
        return this.zero;
    }

    getCout(): boolean {
        return this.cout;
    }

    getMsb(): boolean {
        return this.msb;
    }

    getEven(): boolean {
        return this.even;
    }

    setZero(value: boolean): void {
        this.zero = value;
    }

    setCout(value: boolean): void {
        this.cout = value;
    }

    setMsb(value: boolean): void {
        this.msb = value;
    }

    setEven(value: boolean): void {
        this.even = value;
    }

    toString(): string {
        return `Flags: { zero: ${this.zero}, cout: ${this.cout}, msb: ${this.msb}, even: ${this.even} }`;
    }
}