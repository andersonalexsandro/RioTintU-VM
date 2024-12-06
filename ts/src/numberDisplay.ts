import Ram from "./ram";

export default class NumberDisplay implements Memory{

    public static readonly nBytesAlocated = 2; //16 bits to display

    private ram: Ram;
    private display: DataView;
    private ramAlocated: DataView;

    constructor(ram: Ram, initialAddress: number){
        this.ram = ram;
        this.ramAlocated = new DataView(this.ram.getArrayBuffer(), initialAddress, NumberDisplay.nBytesAlocated);
        this.display = new DataView(this.ramAlocated.buffer);        
    }

    public setValue(addres: number, value: number): void{
        this.ramAlocated.setUint8(addres, value);
    }

    public getValue(addres: number): number{
        return 0;
    }

    public getramAlocated(): DataView{
        return this.ramAlocated;
    }

    public toString(): string{
        return("Display: " + this.display.getUint16(0, true)) //Little-endian true: low 8bits are in the first index
    }
}