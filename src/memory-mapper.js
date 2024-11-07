class MemoryMapper {
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
        this.regions.unshift(region);

        return () => {
            this.regions = this.regions.filter(x => x !== region);
        };
    }

    findRegion(address) {
        return this.regions.find(r => address >= r.start && address <= r.end);
    }

    getUint8(address) {
        const region = this.findRegion(address);
        if (!region) {
            throw new Error(`Address ${address} out of bounds`);
        }
        const finalAddress = region.remap ? address - region.start : address;
        return region.device.getUint8(finalAddress); // Certifique-se de que o método está correto
    }

    setUint8(address, value) {
        const region = this.findRegion(address);
        if (!region) {
            throw new Error(`Address ${address} out of bounds`);
        }
        const finalAddress = region.remap ? address - region.start : address;
        return region.device.setUint8(finalAddress, value);
    }
}

module.exports = MemoryMapper;