"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var screen_1 = require("../src/screen");
var ram_1 = require("../src/ram");
var screen_2 = require("../src/screen");
var width = 32;
var height = 32;
var ramLength = 256;
var initialAddress = 246;
var ram;
var screen;
(0, globals_1.beforeEach)(function () {
    ram = new ram_1.default(ramLength);
    screen = new screen_1.default(ram, initialAddress, width, height);
});
(0, globals_1.test)("get Height", function () {
    (0, globals_1.expect)(screen.getHeight()).toBe(height);
});
(0, globals_1.test)("get width", function () {
    (0, globals_1.expect)(screen.getWidth()).toBe(width);
});
(0, globals_1.test)("Verify nBytesAlocated and ramAlocatedSpace are the same ByteLength", function () {
    (0, globals_1.expect)(screen.getRamAlocatedSpace().byteLength).toBe(screen_1.default.nBytesAlocated);
});
(0, globals_1.test)("Screen Bytelength", function () {
    (0, globals_1.expect)(screen.getScreen().byteLength).toBe(width * height);
});
(0, globals_1.test)("Buffer Bytelength", function () {
    (0, globals_1.expect)(screen.getScreen().byteLength).toBe(width * height);
});
(0, globals_1.test)("Must share ram space from 246 until 251 inside ramAlocatedSpace", function () {
    for (var i = 0; i < screen_1.default.nBytesAlocated; i++) {
        ram.set(initialAddress + i, 255); // 0b11111111
        (0, globals_1.expect)(screen.getRamAlocatedSpace().getUint8(i)).toBe(255); // 0b11111111
    }
});
(0, globals_1.test)("buffer content", function () {
    for (var i = 0; i < width * height - 1; i++) {
        screen.getBuffer()[i] = 255;
        (0, globals_1.expect)(screen.getBuffer()[i]).toBe(255);
    }
});
(0, globals_1.test)("screen content", function () {
    for (var i = 0; i < width * height - 1; i++) {
        screen.getScreen()[i] = 255;
        (0, globals_1.expect)(screen.getScreen()[i]).toBe(255);
    }
});
(0, globals_1.test)("X value", function () {
    screen.set(screen_2.ReservedAddress.PIXEL_X, 255);
    (0, globals_1.expect)(screen.getX()).toBe(255);
});
(0, globals_1.test)("Y value", function () {
    screen.set(screen_2.ReservedAddress.PIXEL_Y, 255);
    (0, globals_1.expect)(screen.getY()).toBe(255);
});
(0, globals_1.test)("Draw Pixel at Buffer", function () {
    testItsClear();
    fulFillBuffer();
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            (0, globals_1.expect)(screen.getBuffer()[(i * width) + j]).toBe(255);
        }
    }
});
(0, globals_1.test)("Clear Pixel at Buffer", function () {
    fulFillBuffer();
    for (var i = 0; i < height; i++) {
        screen.set(screen_2.ReservedAddress.PIXEL_Y, i);
        for (var j = 0; j < width; j++) {
            screen.set(screen_2.ReservedAddress.PIXEL_X, j);
            screen.set(screen_2.ReservedAddress.CLEAR_PIXEL);
        }
    }
    testItsClear();
});
(0, globals_1.test)("Clear Buffer", function () {
    fulFillBuffer();
    screen.set(screen_2.ReservedAddress.CLEAR_SCREEN_BUFFER);
    testItsClear();
});
(0, globals_1.test)("Push Buffer", function () {
    fulFillBuffer();
    screen.set(screen_2.ReservedAddress.PUSH_SCREEN_BUFFER);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            (0, globals_1.expect)(screen.getScreen()[(i * width) + j]).toBe(255);
        }
    }
});
(0, globals_1.test)("Draw, Push, Clear, Push", function () {
    testItsClear();
    for (var i = 0; i < height; i++) {
        screen.set(screen_2.ReservedAddress.PIXEL_Y, i);
        for (var j = 0; j < width; j++) {
            screen.set(screen_2.ReservedAddress.PIXEL_X, j);
            screen.set(screen_2.ReservedAddress.DRAW_PIXEL);
            screen.set(screen_2.ReservedAddress.PUSH_SCREEN_BUFFER);
            (0, globals_1.expect)(screen.getScreen()[(i * width) + j]).toBe(255);
            screen.set(screen_2.ReservedAddress.CLEAR_PIXEL);
            screen.set(screen_2.ReservedAddress.PUSH_SCREEN_BUFFER);
            (0, globals_1.expect)(screen.getScreen()[(i * width) + j]).toBe(0);
        }
    }
});
function testItsClear() {
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            (0, globals_1.expect)(screen.getBuffer()[(i * width) + j]).toBe(0);
        }
    }
}
;
function fulFillBuffer() {
    for (var i = 0; i < height; i++) {
        screen.set(screen_2.ReservedAddress.PIXEL_Y, i);
        for (var j = 0; j < width; j++) {
            screen.set(screen_2.ReservedAddress.PIXEL_X, j);
            screen.set(screen_2.ReservedAddress.DRAW_PIXEL);
        }
    }
}
;
