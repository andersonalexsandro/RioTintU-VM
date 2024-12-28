export default class ProgramRom16{

    private arrayBuffer: ArrayBuffer; // Pure array of Bytes, dont has methods to deal with
    private dataView: DataView;  // Visualize and manipulate ArrayBuffer
    private lengthInBytes: number;

    constructor(lengthInBytes: number){
        this.lengthInBytes = lengthInBytes;
        this.arrayBuffer = new ArrayBuffer(lengthInBytes);
        this.dataView = new DataView(this.arrayBuffer);
    }

    public get16(address: number): number {
        return this.dataView.getUint16(2 * address);
    }

    public set16(address: number, value: number): void {
        this.dataView.setUint16(address * 2, value);
    }
    
    public setHighLowBits(address: number, high8: number, low8: number): void {
        this.dataView.setUint8(address * 2, high8);
        this.dataView.setUint8(address * 2 + 1, low8)
    }

    public setWithImmadiate(address: number, immediate: number, C: number, OP:number){
        const high = immediate;
        const low = (C << 4) | OP;
        this.setHighLowBits(address, high, low)
    }

    public setPer4Bits(address:  number, A: number, B: number, C: number, OP: number){
        const high = (A << 4) | B;
        const low = (C << 4) | OP;
        this.setHighLowBits(address, high, low); 
    }

    public logPer4Bits(address: number): void {
        console.log(this.StringPer4Bits(address));
    }

    public StringPer4Bits(address: number): string {
        const value = this.get16(address);
        const bits4_1 = ((value >> 12) & 0b1111).toString(2).padStart(4, '0'); // Bits 15-12
        const bits4_2 = ((value >> 8) & 0b1111).toString(2).padStart(4, '0');  // Bits 11-8
        const bits4_3 = ((value >> 4) & 0b1111).toString(2).padStart(4, '0');  // Bits 7-4
        const bits4_4 = (value & 0b1111).toString(2).padStart(4, '0');         // Bits 3-0
        return `Address: ${address}, Bits: ${bits4_1} ${bits4_2} ${bits4_3} ${bits4_4}`;
    }

    public toString(): string {
        let result: string = '';
        for (let i = 0; i < this.lengthInBytes; i++) {
            const value = this.get16(i);
            const bits4_1 = ((value >> 12) & 0b1111).toString(2).padStart(4, '0'); // Bits 15-12
            const bits4_2 = ((value >> 8) & 0b1111).toString(2).padStart(4, '0');  // Bits 11-8
            const bits4_3 = ((value >> 4) & 0b1111).toString(2).padStart(4, '0');  // Bits 7-4
            const bits4_4 = (value & 0b1111).toString(2).padStart(4, '0');         // Bits 3-0
    
            result += `Address: ${i}, Bits: ${bits4_1} ${bits4_2} ${bits4_3} ${bits4_4}`;
            if (i < this.lengthInBytes - 1) {
                result += ', ';
            }
        }
        return result;
    }
}