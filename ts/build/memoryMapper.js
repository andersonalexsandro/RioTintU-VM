export default class MemoryMapper {
    regions;
    constructor() {
        this.regions = [];
    }
    map(device, start, end, remap = true) {
        const region = {
            device,
            start,
            end,
            remap
        };
        this.regions.push(region);
    }
    findRegion(address) {
        const region = this.regions.find(r => address >= r.start && address <= r.end);
        if (!region)
            throw new Error(`Region not found for address ${address}`);
        return region;
    }
    get(address) {
        const region = this.findRegion(address);
        if (!region)
            throw new Error(`Address ${address} out of bounds`);
        const finalAddress = region.remap ? address - region.start : address;
        return region.device.get(finalAddress);
    }
    set(address, value) {
        const region = this.findRegion(address);
        if (!region)
            throw new Error(`Address ${address} out of bounds`);
        const finalAddress = region.remap ? address - region.start : address;
        region.device.set(finalAddress, value);
    }
    toString() {
        return this.regions.map(region => `Device: ${region.device.constructor.name}, Start: ${region.start}, End: ${region.end}, Remap: ${region.remap}`).join('\n');
    }
}
