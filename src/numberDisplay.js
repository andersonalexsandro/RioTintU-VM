class NumberDisplay {
    constructor(RAMab) {
    this.RAM = new DataView(RAMab, 252, 2)
    }

    setUint8(address, value) {
        this.RAM.setUint8(address, value)
    }

    getUint8(address) {
        return 0b00000000
    }

    log() {
        const decimalValue = parseInt(this.RAM.getUint8(0), 2); // Converte de binário para decimal
        console.log(`Display: ${decimalValue}`);
    }
}

module.exports = NumberDisplay