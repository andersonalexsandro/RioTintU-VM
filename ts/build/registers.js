export class Registers {
    registerMap;
    registerNames;
    arrayBuffer;
    dataView;
    constructor(lengthInBytes) {
        this.arrayBuffer = new ArrayBuffer(lengthInBytes);
        this.dataView = new DataView(this.arrayBuffer);
        this.registerMap = {};
        this.registerNames = [];
    }
    getRegisterNames() {
        return this.registerNames;
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
        if (address === 0)
            return;
        return this.dataView.setUint8(address, value);
    }
    toString() {
        return this.registerNames.map(name => `${name}: ${this.getByName(name)}`).join(', ');
    }
}
