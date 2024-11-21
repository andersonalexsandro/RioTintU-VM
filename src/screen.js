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
                const intersection = this.getIntersectionIndex();
                this.buffer[intersection] = 0b11111111;
                
                break;

            case ScreenMap.CLEAR_PIXEL:
                const intersectionClear = this.getIntersectionIndex();
                this.buffer[intersectionClear] = ScreenMap.CLEAR_COMMAND;
                break;

            case ScreenMap.PUSH_SCREEN_BUFFER:
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

    getIntersectionIndex() {
        const x = this.getX();
        const y = this.getY();
        const point = (y * 32) + x;
        return point;
    }

    moveTo(x, y) {
        process.stdout.write(`\x1b[${y};${x}H`);
    }

    log() {
        this.moveTo();
        process.stdout.write('█');
    }

    logScreenBuffer() {
       this.log(this.buffer)
    }

    logScreen(){
        this.log(this.screen)
    }

    log(screen) {
        console.log("Screen:");
        for (let i = 0; i < 32; i++) {
            let row = [];
            for (let j = 0; j < 32; j++) {
                row.push(screen[i * 32 + j] === 0b11111111 ? '  ' : '██');
            }
            console.log(row.join(''));
        }
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

// Exemplo de uso
const screen = new Screen(new ArrayBuffer(256));
screen.logScreenBuffer(); // Loga o buffer da tela no terminal
screen.logScreen(); // Loga a tela no terminal