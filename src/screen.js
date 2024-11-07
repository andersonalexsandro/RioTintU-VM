class Screen {
    constructor(RAMab) {
        this.RAM = new DataView(RAMab, 240, 7); // Mapped RAM addresses to screen
        this.screen = new Uint8Array(32 * 32); // Screen Size
        this.buffer = new Uint8Array(this.screen.length);
    }

    getX() {
        return this.RAM.getUint8(ScreenMap.X) & 0b00011111;
    }

    getY() {
        return this.RAM.getUint8(ScreenMap.Y) & 0b00011111;
    }

    getUint8(address) {
        if (address === ScreenMap.LOAD) {
            const point = this.getPointerIndex();
            return this.screen[point] & 0b00000001;
        }
        return 0b00000000;
    }

    setUint8(address, value) {
        switch(address){
            case ScreenMap.X:
                this.RAM.setUint8(address, value)
                return

            case ScreenMap.Y:
                this.RAM.setUint8(address, value)
                return

            case ScreenMap.DRAW:
                const pointDraw = this.getPointerIndex();
                this.buffer[pointDraw] = 0b11111111
                return

            case ScreenMap.CLEAR:
                const pointClear = this.getPointerIndex();
                this.buffer[pointClear] = ScreenMap.CLEAR_COMMAND
                return

            case ScreenMap.BUFFER_PUSH:
                for (i = 0; i < this.buffer.length(); i++){
                    const bufferContent = this.buffer[i]

                    if (bufferContent === 0b00000000) continue

                    if (bufferContent === 0b11111111){
                        this.screen[i] = bufferContent
                        continue
                    } 

                    if (bufferContent === ScreenMap.CLEAR_COMMAND){
                        this.screen[i] = 0b00000000
                        continue
                    } 
                    
                    throw new Error("Not a valid Bufferstate: " + bufferContent)
                }

            case ScreenMap.BUFFER_PUSH:

        }
    }

    getPointerIndex(){
        const x = this.getX();
        const y = this.getY();
        const point = (y * 32) + x
        return point
    }
}

const ScreenMap = {
    X: 0b00000000,
    Y: 0b00000001,
    DRAW: 0b00000010,
    CLEAR: 0b00000011,
    LOAD: 0b00000100,
    BUFFER_PUSH: 0b00000101,
    CLEAR_BUFFER: 0b00000110,
    CLEAR_COMMAND: 0b10101010
}

module.exports = Screen;