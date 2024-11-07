class CharDisplay {
    constructor(RAMab){
        this.RAM = new DataView(RAMab, 247, 3)
        this.display = new Uint8Array(10)
        this.buffer = new Uint8Array(this.display.length)
    }
}

const letters = [
    ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '.'
]

const displayMap = {
    WRITE: 0,
    BUFFER_CHARS: 1,
    CLEAR_CHARS_BUFFERS: 2
    
}