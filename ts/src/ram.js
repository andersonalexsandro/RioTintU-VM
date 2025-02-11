"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ram = /** @class */ (function () {
    function Ram(lengthInBytes) {
        this.lengthInBytes = lengthInBytes;
        this.arrayBuffer = new ArrayBuffer(lengthInBytes);
        this.dataView = new DataView(this.arrayBuffer);
    }
    Ram.prototype.getArrayBuffer = function () {
        return this.arrayBuffer;
    };
    Ram.prototype.getDataView = function () {
        return this.dataView;
    };
    Ram.prototype.getLengthInBytes = function () {
        return this.lengthInBytes;
    };
    Ram.prototype.get = function (addres) {
        return this.dataView.getUint8(addres);
    };
    Ram.prototype.set = function (addres, value) {
        return this.dataView.setUint8(addres, value);
    };
    Ram.prototype.toString = function () {
        var toString = '';
        for (var i = 0; i < this.lengthInBytes; i++) {
            toString += "".concat(i, ": ").concat(this.get(i), "\n");
        }
        return toString;
    };
    return Ram;
}());
exports.default = Ram;
