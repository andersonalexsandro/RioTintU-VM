class Ram {

    private lenghtInBytes: number; 
    private arrayBuffer; // pure Array of bytes (dont have methods to deal with)
    private dataView; // manipulate the arrayBuffer

    constructor(lenghtInBytes: number){
        this.lenghtInBytes = lenghtInBytes;
        this.arrayBuffer = new ArrayBuffer(lenghtInBytes);
        this.dataView = new DataView(this.arrayBuffer);
    }

    public getArrayBuffer(): ArrayBuffer{
        return this.arrayBuffer;
    }

    public getDataView(): DataView{
        return this.dataView;
    }

    public getLenghtInBytes(): number{
        return this.lenghtInBytes;
    }

    public getValue(addres: number){
        return this.dataView.getUint8(addres);
    }

    public setValue(addres: number, value: number){
        return this.dataView.setUint8(addres, value)
    }

    public toString(): string{
        let toString: string = '';
        for(let i=0; i< this.lenghtInBytes; i++){
            toString+= `${i}: ${this.getValue(i)}\n`
        } 
        return toString;
    }
}