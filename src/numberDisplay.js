class NumberDisplay {
    constructor(RAMab) {
    this.RAM = new DataView(RAMab, 252, 2)
    this.display = new Uint16Array(1)
    }

    setUint8(address, value) {
        this.RAM.setUint8(address, value)
    }
}

module.exports = NumberDisplay