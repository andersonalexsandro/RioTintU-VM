"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ram {
    constructor(lengthInBytes) {
        this.lengthInBytes = lengthInBytes;
        this.arrayBuffer = new ArrayBuffer(lengthInBytes);
        this.dataView = new DataView(this.arrayBuffer);
    }
    getArrayBuffer() {
        return this.arrayBuffer;
    }
    getDataView() {
        return this.dataView;
    }
    getLengthInBytes() {
        return this.lengthInBytes;
    }
    getValue(addres) {
        return this.dataView.getUint8(addres);
    }
    setValue(addres, value) {
        return this.dataView.setUint8(addres, value);
    }
    toString() {
        let toString = '';
        for (let i = 0; i < this.lengthInBytes; i++) {
            toString += `${i}: ${this.getValue(i)}\n`;
        }
        return toString;
    }
}
exports.default = Ram;
