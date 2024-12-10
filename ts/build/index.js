"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const numberDisplay_1 = __importDefault(require("./numberDisplay"));
const ram_1 = __importDefault(require("./ram"));
const ram = new ram_1.default(256);
const numberDisplay = new numberDisplay_1.default(ram, 252);
ram.set(252, 0);
ram.set(253, 0b0000001);
console.log(numberDisplay.toString());
for (let i = 0; i <= 300; i++) {
    if (i <= 256)
        ram.set(252, i & 255);
    if (i >= 256)
        ram.set(253, i >> 8 & 255);
    console.log(numberDisplay.toString());
}
