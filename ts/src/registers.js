"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registers = void 0;
var Registers = /** @class */ (function () {
    function Registers(lengthInBytes) {
        this.arrayBuffer = new ArrayBuffer(lengthInBytes);
        this.dataView = new DataView(this.arrayBuffer);
        this.registerMap = {};
        this.registerNames = [];
    }
    Registers.prototype.getRegisterNames = function () {
        return this.registerNames;
    };
    Registers.prototype.setRegisterNames = function (registerNames) {
        this.registerNames = registerNames;
        for (var i = 0; i < registerNames.length; i++) {
            this.registerMap[registerNames[i]] = i;
        }
    };
    Registers.prototype.getByName = function (name) {
        return this.dataView.getUint8(this.registerMap[name]);
    };
    Registers.prototype.get = function (address) {
        return this.dataView.getUint8(address);
    };
    Registers.prototype.set = function (address, value) {
        if (address === 0)
            return;
        return this.dataView.setUint8(address, value);
    };
    Registers.prototype.toString = function () {
        var _this = this;
        return this.registerNames.map(function (name) {
            return "".concat(name, ": ").concat(_this.getByName(name));
        }).join(', ');
    };
    return Registers;
}());
exports.Registers = Registers;
