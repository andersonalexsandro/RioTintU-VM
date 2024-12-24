export class Registers implements Memory {

    private registerMap: { [key: string]: number };
    private registerNames: string[];
    private arrayBuffer: ArrayBuffer;
    private dataView: DataView;

    constructor(registerNames: string[]){
        this.registerNames = registerNames;
        this.arrayBuffer = new ArrayBuffer(this.registerNames.length);
        this.dataView = new DataView(this.arrayBuffer);

        this.registerMap = {};
        for (let i=0; i< registerNames.length; i++){
            this.registerMap[registerNames[i]] = i;
        }
    }

    getByName(name: string): number {
        return this.dataView.getUint8(this.registerMap[name])
    }

    get(address: number): number {
        return this.dataView.getUint8(address);
    }
    
    set(address: number, value: number): void {
        return this.dataView.setUint8(address, value);
    }

    toString(): string {
        return this.registerNames.map(name => 
            `${name}: ${this.getByName(name)}`
        ).join(', ');
    }
}