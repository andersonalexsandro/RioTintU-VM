interface Region {
    device: Memory;
    start: number;
    end: number;
    remap: boolean;
}

export default class MemoryMapper implements Memory{
    
    private regions: Array<Region>

    constructor () {
        this.regions = [];
    }

    map(device: Memory, start: number, end: number, remap = true) {
        const region = {
            device,
            start,
            end,
            remap
        };
        this.regions.push(region)
    }

    findRegion(address: number) {
        return this.regions.find(r => address >= r.start && address <= r.end);
    }

    get(address: number): number{
        const region = this.findRegion(address);
        if (!region) throw new Error(`Address ${address} out of bounds`);
        const finalAddress = region.remap ? address - region.start : address;
        return region.device.get(finalAddress);
    }

    set(address: number, value: number): void {
        const region = this.findRegion(address);
        if (!region) throw new Error(`Address ${address} out of bounds`);
        const finalAddress = region.remap ? address - region.start : address;
        region.device.set(finalAddress, value);
    }
}