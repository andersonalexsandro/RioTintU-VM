import NumberDisplay from "./numberDisplay";
import Ram from "./ram";


const ram = new Ram(256);
const numberDisplay = new NumberDisplay(ram, 252);

ram.setValue(252, 0);
ram.setValue(253, 0b0000001);
console.log(numberDisplay.toString())

for(let i=0; i<=300; i++){
    if(i <= 256) ram.setValue(252, i & 255);
    if(i >= 256) ram.setValue(253, i >> 8 & 255);
    console.log(numberDisplay.toString())
}