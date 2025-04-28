export default class NumberDisplay {
    static nBytesAlocated = 2; //16 bits to display
    content;
    ram;
    ramAlocated;
    constructor(ram, initialAddress) {
        this.ram = ram;
        this.ramAlocated = new DataView(this.ram.getArrayBuffer(), initialAddress, NumberDisplay.nBytesAlocated);
        this.content = 0;
    }
    set(addres, value) {
        this.ramAlocated.setUint8(addres, value);
        this.content = value;
    }
    get(addres) {
        return 0;
    }
    getramAlocated() {
        return this.ramAlocated;
    }
    toString() {
        return ("Display: " + this.ramAlocated.getUint16(0, true)); //Little-endian true: low 8bits are in the first index
    }
}
