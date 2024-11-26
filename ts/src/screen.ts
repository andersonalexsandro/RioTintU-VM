import Ram from "./ram";

class Screen{

    //Visualize part of the RAM arrayBuffer, start from n index of the ram, plus x more bytes indexes: 0 ~ x-1
    private ramAlocatedSpace: DataView;
  
    // Array of bytes with methods to deal with
    private screen: Uint8Array;
    
    // Screen Buffer: a stage before push motifications to screen
    private buffer: Uint8Array;
    
    private width: number;
    private height: number;
    
    constructor(ram: Ram, initialAddress: number, width: number, height: number){
        //Visualize part of the RAM arrayBuffer, start from n index of the ram, plus x more bytes. indexes: 0 ~ x -1
        this.ramAlocatedSpace = new DataView(ram.getArrayBuffer(),246, 6); 
        this.screen = new Uint8Array(width * height);
        this.buffer = new Uint8Array(width * height);
        this.width = width;
        this.height = height;
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

    private getX(){
        return this.ramAlocatedSpace.getUint8(ScreenAddress.PIXEL_X);
    }

    private getY(){
        return this.ramAlocatedSpace.getUint8(ScreenAddress.PIXEL_Y);
    }

    private getIntersectionIndex(): number{
        const x = this.getX();
        const y = this.getY();
        const intersection = (y * this.width) + x;
        return intersection;
    } 

    public setValue(address: number, value: number): void{
        switch(address) {
            case ScreenAddress.PIXEL_X:
                this.ramAlocatedSpace.setUint8(address, value);
                break;

            case ScreenAddress.PIXEL_Y:
                this.ramAlocatedSpace.setUint8(address, value);
                break;

            case ScreenAddress.DRAW_PIXEL:
                const intersection = this.getIntersectionIndex();
                this.buffer[intersection] = 255; // or 0b11111111 represents true
                break;

            case ScreenAddress.CLEAR_PIXEL:
                const intersectionClear = this.getIntersectionIndex();
                this.buffer[intersectionClear] = 0; // or 0b00000000 representes false
                break;

            case ScreenAddress.PUSH_SCREEN_BUFFER:
                for(let i=0; i<this.buffer.length; i++) this.screen[i] = this.buffer[i];
                break;

            case ScreenAddress.CLEAR_SCREEN_BUFFER:
                this.buffer = new Uint8Array(this.width * this.height);
                break;
        }
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

enum ScreenAddress{
    CLEAR_SCREEN_BUFFER= 0b00000000,
    PUSH_SCREEN_BUFFER= 0b00000001,
    CLEAR_PIXEL= 0b00000010,
    DRAW_PIXEL= 0b00000011,
    PIXEL_X= 0b00000100,
    PIXEL_Y= 0b00000101
}