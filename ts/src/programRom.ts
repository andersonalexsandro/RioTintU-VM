class ProgramRom16{

    private romAb: ArrayBuffer; // Pure array of Bytes, dont has methods to deal with
    private rom: DataView;  // Visualize and manipulate ArrayBuffer
    private lengthInBytes: number;

    constructor(nBytes: number){
        this.lengthInBytes = nBytes;
        this.romAb = new ArrayBuffer(nBytes);
        this.rom = new DataView(this.romAb);
    }

    public get16(address: number): number {
        return this.rom.getUint16(2 * address);
    }

    public set16(address: number, value: number): void {
        this.rom.setUint16(address * 2, value);
    }
    
    public setHighLowBits(address: number, high8: number, low8: number): void {
        this.rom.setUint8(address, high8);
        this.rom.setUint8(address + 1, low8)
    }

    public toString(): string{
        let toString: string = '';
        for(let i=0; i< this.lengthInBytes; i++){
            toString+= `${i}: ${this.get16(i)}\n`
        } 
        return toString;
    }
}