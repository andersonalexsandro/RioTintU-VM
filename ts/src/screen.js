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
var Screen = /** @class */ (function () {
    function Screen(ram, initialAddress, width, height) {
        this.ramAlocatedSpace = new DataView(ram.getArrayBuffer(), initialAddress, Screen.nBytesAlocated);
        this.width = width;
        this.height = height;
        this.screen = new Uint8Array(width * height);
        this.buffer = new Uint8Array(width * height);
    }
    Screen.prototype.getRamAlocatedSpace = function () {
        return this.ramAlocatedSpace;
    };
    Screen.prototype.getWidth = function () {
        return this.width;
    };
    Screen.prototype.getHeight = function () {
        return this.height;
    };
    Screen.prototype.getScreen = function () {
        return this.screen;
    };
    Screen.prototype.getBuffer = function () {
        return this.buffer;
    };
    Screen.prototype.get = function (address) {
        return 0;
    };
    Screen.prototype.set = function (address, value) {
        if (value === void 0) { value = 0; }
        switch (address) {
            case ReservedAddress.PIXEL_X:
                this.ramAlocatedSpace.setUint8(address, value);
                break;
            case ReservedAddress.PIXEL_Y:
                this.ramAlocatedSpace.setUint8(address, value);
                break;
            case ReservedAddress.DRAW_PIXEL:
                var intersection = this.getIntersectionIndex();
                this.buffer[intersection] = 255; // or 0b11111111 represents true
                break;
            case ReservedAddress.CLEAR_PIXEL:
                var intersectionClear = this.getIntersectionIndex();
                this.buffer[intersectionClear] = 0; // or 0b00000000 representes false
                break;
            case ReservedAddress.PUSH_SCREEN_BUFFER:
                for (var i = 0; i < this.buffer.length; i++)
                    this.screen[i] = this.buffer[i];
                break;
            case ReservedAddress.CLEAR_SCREEN_BUFFER:
                this.buffer = new Uint8Array(this.width * this.height);
                break;
        }
    };
    Screen.prototype.getIntersectionIndex = function () {
        var x = this.getX();
        var y = this.getY();
        var intersection = (y * this.width) + x;
        return intersection;
    };
    Screen.prototype.getX = function () {
        return this.ramAlocatedSpace.getUint8(ReservedAddress.PIXEL_X);
    };
    Screen.prototype.getY = function () {
        return this.ramAlocatedSpace.getUint8(ReservedAddress.PIXEL_Y);
    };
    Screen.prototype.toString = function () {
        var string = '';
        for (var i = 0; i < this.height * this.width; i++) {
            if (i % this.width === 0)
                string += '\n';
            string += (this.screen[i] === 255) ? '  ' : '██';
        }
        return string;
    };
    // Number of bytes alocated in the RAM: 246, 247, ..., 251 indexes (ISA Documentation). 
    // It is about how many address are reserved to I/O comunitcation
    Screen.nBytesAlocated = 6;
    return Screen;
}());
exports.default = Screen;
