"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservedAddress = void 0;
var ReservedAddress;
(function (ReservedAddress) {
    ReservedAddress[ReservedAddress["CLEAR_SCREEN_BUFFER"] = 0] = "CLEAR_SCREEN_BUFFER";
    ReservedAddress[ReservedAddress["PUSH_SCREEN_BUFFER"] = 1] = "PUSH_SCREEN_BUFFER";
    ReservedAddress[ReservedAddress["CLEAR_PIXEL"] = 2] = "CLEAR_PIXEL";
    ReservedAddress[ReservedAddress["DRAW_PIXEL"] = 3] = "DRAW_PIXEL";
    ReservedAddress[ReservedAddress["PIXEL_X"] = 4] = "PIXEL_X";
    ReservedAddress[ReservedAddress["PIXEL_Y"] = 5] = "PIXEL_Y";
})(ReservedAddress || (exports.ReservedAddress = ReservedAddress = {}));
class Screen {
    constructor(ram, initialAddress, width, height) {
        this.ramAlocatedSpace = new DataView(ram.getArrayBuffer(), initialAddress, Screen.nBytesAlocated);
        this.width = width;
        this.height = height;
        this.screen = new Uint8Array(width * height);
        this.buffer = new Uint8Array(width * height);
    }
    getRamAlocatedSpace() {
        return this.ramAlocatedSpace;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    getScreen() {
        return this.screen;
    }
    getBuffer() {
        return this.buffer;
    }
    getValue(address) {
        return 0;
    }
    setValue(address, value = 0) {
        switch (address) {
            case ReservedAddress.PIXEL_X:
                this.ramAlocatedSpace.setUint8(address, value);
                break;
            case ReservedAddress.PIXEL_Y:
                this.ramAlocatedSpace.setUint8(address, value);
                break;
            case ReservedAddress.DRAW_PIXEL:
                const intersection = this.getIntersectionIndex();
                this.buffer[intersection] = 255; // or 0b11111111 represents true
                break;
            case ReservedAddress.CLEAR_PIXEL:
                const intersectionClear = this.getIntersectionIndex();
                this.buffer[intersectionClear] = 0; // or 0b00000000 representes false
                break;
            case ReservedAddress.PUSH_SCREEN_BUFFER:
                for (let i = 0; i < this.buffer.length; i++)
                    this.screen[i] = this.buffer[i];
                break;
            case ReservedAddress.CLEAR_SCREEN_BUFFER:
                this.buffer = new Uint8Array(this.width * this.height);
                break;
        }
    }
    getIntersectionIndex() {
        const x = this.getX();
        const y = this.getY();
        const intersection = (y * this.width) + x;
        return intersection;
    }
    getX() {
        return this.ramAlocatedSpace.getUint8(ReservedAddress.PIXEL_X);
    }
    getY() {
        return this.ramAlocatedSpace.getUint8(ReservedAddress.PIXEL_Y);
    }
    toString() {
        let string = '';
        for (let i = 0; i < this.height * this.width; i++) {
            if (i % this.width === 0)
                string += '\n';
            string += (this.screen[i] === 255) ? '  ' : '██';
        }
        return string;
    }
}
// Number of bytes alocated in the RAM: 246, 247, ..., 251 indexes (ISA Documentation). 
// It is about how many address are reserved to I/O comunitcation
Screen.nBytesAlocated = 6;
exports.default = Screen;
