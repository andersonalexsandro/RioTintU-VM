import Ram from "./ram";

export enum ReservedAddress{
    CLEAR_SCREEN_BUFFER= 0,
    PUSH_SCREEN_BUFFER= 1,
    CLEAR_PIXEL= 2,
    DRAW_PIXEL= 3,
    PIXEL_X= 4,
    PIXEL_Y= 5
}

export default class Screen{

    // Number of bytes alocated in the RAM: 246, 247, ..., 251 indexes (ISA Documentation). 
    // It is about how many address are reserved to I/O comunitcation
    public static readonly nBytesAlocated = 6;

    //Visualize part of the RAM arrayBuffer, start from n index of the ram, plus x more bytes indexes: 0 ~ x-1
    private ramAlocatedSpace: DataView;
  
    // Array of bytes with methods to deal with
    private screen: Uint8Array;
    
    // Screen Buffer: a stage before push motifications to screen
    private buffer: Uint8Array;
    
    private width: number;
    private height: number;
    
    constructor(ram: Ram, initialAddress: number, width: number, height: number){
        this.ramAlocatedSpace = new DataView(ram.getArrayBuffer(),initialAddress, Screen.nBytesAlocated); 
        this.width = width;
        this.height = height;
        this.screen = new Uint8Array(width * height);
        this.buffer = new Uint8Array(width * height);
    }

    public getRamAlocatedSpace(): DataView{
        return this.ramAlocatedSpace;
    }

    public getWidth(): number{
        return this.width;
    }

    public getHeight(): number{
        return this.height;
    }

    public getScreen(): Uint8Array{
        return this.screen;
    }

    public getBuffer(): Uint8Array{
        return this.buffer;
    }

    public getValue(address: number): number{
        return 0;
    }

    public setValue(address: number, value: number=0): void{
        switch(address) {
            case ReservedAddress.PIXEL_X:
                this.ramAlocatedSpace.setUint8(address, value);
                break;

            case ReservedAddress.PIXEL_Y:
                this.ramAlocatedSpace.setUint8(address, value);
                break;

            case ReservedAddress.DRAW_PIXEL:
                const intersection = this.getIntersectionIndex();
                this.buffer[intersection] = 255; // or 0b11111111 represents true
                break;

            case ReservedAddress.CLEAR_PIXEL:
                const intersectionClear = this.getIntersectionIndex();
                this.buffer[intersectionClear] = 0; // or 0b00000000 representes false
                break;

            case ReservedAddress.PUSH_SCREEN_BUFFER:
                for(let i=0; i<this.buffer.length; i++) this.screen[i] = this.buffer[i];
                break;

            case ReservedAddress.CLEAR_SCREEN_BUFFER:
                this.buffer = new Uint8Array(this.width * this.height);
                break;
        }
    }

    private getIntersectionIndex(): number{
        const x = this.getX();
        const y = this.getY();
        const intersection = (y * this.width) + x;
        return intersection;
    } 

    public getX(){
        return this.ramAlocatedSpace.getUint8(ReservedAddress.PIXEL_X);
    }

    public getY(){
        return this.ramAlocatedSpace.getUint8(ReservedAddress.PIXEL_Y);
    }

    public toString(): string {
        let string = '';
        for(let i=0; i<this.height * this.width; i++){
            if(i % this.width === 0) string +='\n'
            string += (this.screen[i] === 255) ? '  ' : '██'
        }
        return string
    }
}