import Ram from "./ram";

class NumberDisplay implements Memory{

    private ram: Ram;
    private display: Uint8Array;

    constructor(ram: Ram){
        this.ram = ram;
        this.display = new Uint8Array(2);        
    }

    setValue(addres: number, value: number): void{

    }

    getValue(addres: number): number{
        return 0;
    }
}