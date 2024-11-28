const concat4bits = require("./utils")

class NumberDisplay {
    constructor(RAMab) {
    this.RAM = new DataView(RAMab, 252, 2)
    this.display = new Uint8Array(2)
    }

    setUint8(address, value) {
        switch(address){
            case (0b00000000):
                this.display[0] = value
                console.log("Low")
                break
            
            case (0b00000001):
                this.display.setUint8[1] = value
                console.log("High")
                break
            
        }
    }

    log() {
        const high8bit = this.display[1]
        const low8bit = this.display[0]
        const fullNumber = high8bit << 4 | low8bit
        console.log("Display:" + fullNumber)
    }
}

module.exports = NumberDisplay