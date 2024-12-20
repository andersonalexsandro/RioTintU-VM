export default class ProgramRom16{

    private arrayBuffer: ArrayBuffer; // Pure array of Bytes, dont has methods to deal with
    private dataView: DataView;  // Visualize and manipulate ArrayBuffer
    private lengthInBytes: number;

    constructor(nBytes: number){
        this.lengthInBytes = nBytes;
        this.arrayBuffer = new ArrayBuffer(nBytes);
        this.dataView = new DataView(this.arrayBuffer);
    }

    public get16(address: number): number {
        return this.dataView.getUint16(2 * address);
    }

    public set16(address: number, value: number): void {
        this.dataView.setUint16(address * 2, value);
    }
    
    public setHighLowBits(address: number, high8: number, low8: number): void {
        this.dataView.setUint8(address, high8);
        this.dataView.setUint8(address + 1, low8)
    }

    public toString(): string{
        let toString: string = '';
        for(let i=0; i< this.lengthInBytes; i+=2){
            toString+= `${i}: ${this.get16(i)}\n`
        } 
        return toString;
    }
}