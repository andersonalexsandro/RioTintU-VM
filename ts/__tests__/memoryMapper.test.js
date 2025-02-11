"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var ram_1 = require("../src/ram");
var memoryMapper_1 = require("../src/memoryMapper");
var screen_1 = require("../src/screen");
var numberDisplay_1 = require("../src/numberDisplay");
var memoryMapper;
var screen;
var numberDisplay;
var ram;
var ramLength = 256;
var screenStart = 246;
var screenWidth = 32;
var screenHeigth = 32;
var numberDisplayStart = 252;
(0, globals_1.beforeEach)(function () {
    ram = new ram_1.default(ramLength);
    screen = new screen_1.default(ram, screenStart, screenWidth, screenHeigth);
    numberDisplay = new numberDisplay_1.default(ram, numberDisplayStart);
    memoryMapper = new memoryMapper_1.default();
    memoryMapper.map(ram, 0, screenStart - 1, false);
    memoryMapper.map(screen, screenStart, screenStart + screen_1.default.nBytesAlocated - 1, true);
    memoryMapper.map(numberDisplay, numberDisplayStart, numberDisplayStart + numberDisplay_1.default.nBytesAlocated - 1, true);
});
(0, globals_1.test)("Range for each Device", function () {
    var region = memoryMapper.findRegion(0);
    (0, globals_1.expect)(region.device instanceof ram_1.default);
    (0, globals_1.expect)(region.start).toBe(0);
    (0, globals_1.expect)(region.end).toBe(screenStart - 1);
    region = memoryMapper.findRegion(screenStart);
    (0, globals_1.expect)(region.device instanceof screen_1.default);
    (0, globals_1.expect)(region.start).toBe(screenStart);
    (0, globals_1.expect)(region.end).toBe(numberDisplayStart - 1);
    region = memoryMapper.findRegion(numberDisplayStart);
    (0, globals_1.expect)(region.device instanceof numberDisplay_1.default);
    (0, globals_1.expect)(region.start).toBe(numberDisplayStart);
    (0, globals_1.expect)(region.end).toBe(numberDisplayStart + numberDisplay_1.default.nBytesAlocated - 1);
});
(0, globals_1.test)("Get each device", function () {
    for (var i = 0; i < numberDisplayStart + numberDisplay_1.default.nBytesAlocated; i++) {
        var region = memoryMapper.findRegion(i);
        if (i > 0 && i < screenStart) {
            (0, globals_1.expect)(region.device instanceof ram_1.default).toBe(true);
        }
        if (i >= screenStart && i < screen_1.default.nBytesAlocated + screenStart) {
            (0, globals_1.expect)(region.device instanceof screen_1.default);
        }
        if (i >= screen_1.default.nBytesAlocated + screenStart && i < numberDisplayStart) {
            (0, globals_1.expect)(region.device instanceof numberDisplay_1.default);
        }
    }
});
