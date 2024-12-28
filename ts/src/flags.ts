
export enum FlagCode{
    ZERO = 0,
    NOT_ZERO = 1,
    COUT = 2,
    NOT_COUT = 3,
    MSB = 4,
    NOT_MSB = 5,
    EVEN = 6,
    NOT_EVEN = 7
}

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

    setFlags(result: number): void {
        const maskedResult = result & 255; 
        this.cout = (result & 256) !== 0;
        this.zero = maskedResult === 0;
        this.even = (maskedResult % 2) === 0;
        this.msb = (maskedResult & 128) !== 0;
    }

    toString(): string {
        return `Flags: { zero: ${this.zero}, cout: ${this.cout}, msb: ${this.msb}, even: ${this.even} }`;
    }
}