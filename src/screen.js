class Screen {
    constructor(RAMab) {
        this.RAM = new DataView(RAMab, 246, 6); // Mapped RAM addresses to screen
        this.screen = new Uint8Array(32 * 32); // Screen Size
        this.buffer = new Uint8Array(this.screen.length);
    }

    getX() {
        return this.RAM.getUint8(ScreenMap.PIXEL_X) & 0b00011111;
    }

    getY() {
        return this.RAM.getUint8(ScreenMap.PIXEL_Y) & 0b00011111;
    }

    getUint8(address) {
        return 0b00000000;
    }

    setUint8(address, value) {
        switch(address) {
            case ScreenMap.PIXEL_X:
                this.RAM.setUint8(address, value);
                break;

            case ScreenMap.PIXEL_Y:
                this.RAM.setUint8(address, value);
                break;

            case ScreenMap.DRAW_PIXEL:
                const pointDraw = this.getPointerIndex();
                this.buffer[pointDraw] = 0b11111111;
                break;

            case ScreenMap.CLEAR_PIXEL:
                const pointClear = this.getPointerIndex();
                this.buffer[pointClear] = ScreenMap.CLEAR_COMMAND;
                break;

            case ScreenMap.BUFFER_SCREEN:
                for (let i = 0; i < this.buffer.length; i++) {
                    const bufferContent = this.buffer[i];

                    if (bufferContent === 0b00000000) continue;

                    if (bufferContent === 0b11111111) {
                        this.screen[i] = bufferContent;
                        continue;
                    } 

                    if (bufferContent === ScreenMap.CLEAR_COMMAND) {
                        this.screen[i] = 0b00000000;
                        continue;
                    } 

                    throw new Error("Screen - Not a valid Buffer state: " + bufferContent);
                }
                this.buffer = new Uint8Array(this.screen.length);
                break;

            case ScreenMap.CLEAR_SCREEN_BUFFER:
                this.buffer = new Uint8Array(this.screen.length);
                break;

            default:
                throw new Error("Screen - Invalid address: " + address);

        }
    }

    getPointerIndex() {
        const x = this.getX();
        const y = this.getY();
        const point = (y * 32) + x;
        return point;
    }
}

const ScreenMap = {
    CLEAR_SCREEN_BUFFER: 0b00000000,
    PUSH_SCREEN_BUFFER: 0b00000001,
    CLEAR_PIXEL: 0b00000010,
    DRAW_PIXEL: 0b00000011,
    PIXEL_X: 0b00000100,
    PIXEL_Y: 0b00000101,
    CLEAR_COMMAND: 0b10101010
};

module.exports = Screen;