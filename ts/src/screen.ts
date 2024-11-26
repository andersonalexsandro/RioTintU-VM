import Ram from "./ram";

class Screen{

    private ramAlocatedSpace: DataView;  
    private screenArrayBuffer: ArrayBuffer; // pure Array of bytes. Represents the visual pixels (dont have methods to deal with)
    private screenDataView: DataView; // manipulate the arrayBuffer


    constructor(ram: Ram, initialAddress: number){
        this.ramAlocatedSpace = new DataView(ram.getArrayBuffer(), 6); // share the content from inital address until 6 more bytes, indexes: 0 ~ 6
        this.screenArrayBuffer = new ArrayBuffer(32 * 32);
        this.screenDataView = new DataView(this.screenArrayBuffer);
    }
}

enum map{
    CLEAR_SCREEN_BUFFER= 0b00000000,
    PUSH_SCREEN_BUFFER= 0b00000001,
    CLEAR_PIXEL= 0b00000010,
    DRAW_PIXEL= 0b00000011,
    PIXEL_X= 0b00000100,
    PIXEL_Y= 0b00000101
}