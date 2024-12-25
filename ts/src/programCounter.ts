export class ProgramCounter {
    private counter: number;

    constructor(counter: number = 0){
        this.counter = counter;
    }

    public jump(address: number): void{
        this.counter = address;
    }

    public incremment(): void{
        this.counter++;
    }
    
    public getCounter(){
        return this.counter;
    }

    public toString(){
        return "Program Counter: " + this.counter
    }

}