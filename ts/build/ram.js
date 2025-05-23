export default class Ram {
    lengthInBytes;
    arrayBuffer; // pure Array of bytes (dont have methods to deal with)
    dataView; // manipulate the arrayBuffer
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
    get(addres) {
        return this.dataView.getUint8(addres);
    }
    set(addres, value) {
        return this.dataView.setUint8(addres, value);
    }
    toString() {
        let toString = '';
        for (let i = 0; i < this.lengthInBytes; i++) {
            toString += `${i}: ${this.get(i)}\n`;
        }
        return toString;
    }
}
