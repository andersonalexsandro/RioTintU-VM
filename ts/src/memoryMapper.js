"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MemoryMapper = /** @class */ (function () {
    function MemoryMapper() {
        this.regions = [];
    }
    MemoryMapper.prototype.map = function (device, start, end, remap) {
        if (remap === void 0) { remap = true; }
        var region = {
            device: device,
            start: start,
            end: end,
            remap: remap
        };
        this.regions.push(region);
    };
    MemoryMapper.prototype.findRegion = function (address) {
        var region = this.regions.find(function (r) { return address >= r.start && address <= r.end; });
        if (!region)
            throw new Error("Region not found for address ".concat(address));
        return region;
    };
    MemoryMapper.prototype.get = function (address) {
        var region = this.findRegion(address);
        if (!region)
            throw new Error("Address ".concat(address, " out of bounds"));
        var finalAddress = region.remap ? address - region.start : address;
        return region.device.get(finalAddress);
    };
    MemoryMapper.prototype.set = function (address, value) {
        var region = this.findRegion(address);
        if (!region)
            throw new Error("Address ".concat(address, " out of bounds"));
        var finalAddress = region.remap ? address - region.start : address;
        region.device.set(finalAddress, value);
    };
    MemoryMapper.prototype.toString = function () {
        return this.regions.map(function (region) {
            return "Device: ".concat(region.device.constructor.name, ", Start: ").concat(region.start, ", End: ").concat(region.end, ", Remap: ").concat(region.remap);
        }).join('\n');
    };
    return MemoryMapper;
}());
exports.default = MemoryMapper;
