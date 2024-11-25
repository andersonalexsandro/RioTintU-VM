"use strict";
class Ram {
    constructor(lenghtInBytes) {
        this.lenghtInBytes = lenghtInBytes;
        this.arrayBuffer = new ArrayBuffer(lenghtInBytes);
        this.dataView = new DataView(this.arrayBuffer);
    }
    getArrayBuffer() {
        return this.arrayBuffer;
    }
    getDataView() {
        return this.dataView;
    }
    getLenghtInBytes() {
        return this.lenghtInBytes;
    }
    getValue(addres) {
        return this.dataView.getUint8(addres);
    }
    setValue(addres, value) {
        return this.dataView.setUint8(addres, value);
    }
    toString() {
        let toString = '';
        for (let i = 0; i < this.lenghtInBytes; i++) {
            toString += `${i}: ${this.getValue(i)}\n`;
        }
        return toString;
    }
}
