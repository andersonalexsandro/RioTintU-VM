"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registers = void 0;
class Registers {
    constructor(lengthInBytes) {
        this.arrayBuffer = new ArrayBuffer(lengthInBytes);
        this.dataView = new DataView(this.arrayBuffer);
        this.registerMap = {};
        this.registerNames = [];
    }
    setRegisterNames(registerNames) {
        this.registerNames = registerNames;
        for (let i = 0; i < registerNames.length; i++) {
            this.registerMap[registerNames[i]] = i;
        }
    }
    getByName(name) {
        return this.dataView.getUint8(this.registerMap[name]);
    }
    get(address) {
        return this.dataView.getUint8(address);
    }
    set(address, value) {
        return this.dataView.setUint8(address, value);
    }
    toString() {
        return this.registerNames.map(name => `${name}: ${this.getByName(name)}`).join(', ');
    }
}
exports.Registers = Registers;
