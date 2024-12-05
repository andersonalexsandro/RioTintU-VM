export default class Ram implements Memory{

    private lengthInBytes: number; 
    private arrayBuffer; // pure Array of bytes (dont have methods to deal with)
    private dataView; // manipulate the arrayBuffer

    constructor(lengthInBytes: number){
        this.lengthInBytes = lengthInBytes;
        this.arrayBuffer = new ArrayBuffer(lengthInBytes);
        this.dataView = new DataView(this.arrayBuffer);
    }

    public getArrayBuffer(): ArrayBuffer{
        return this.arrayBuffer;
    }

    public getDataView(): DataView{
        return this.dataView;
    }

    public getLengthInBytes(): number{
        return this.lengthInBytes;
    }

    public getValue(addres: number){
        return this.dataView.getUint8(addres);
    }

    public setValue(addres: number, value: number): void{
        return this.dataView.setUint8(addres, value)
    }

    public toString(): string{
        let toString: string = '';
        for(let i=0; i< this.lengthInBytes; i++){
            toString+= `${i}: ${this.getValue(i)}\n`
        } 
        return toString;
    }
}