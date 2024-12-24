import MemoryMapper from "./memoryMapper";
import NumberDisplay from "./numberDisplay";
import Ram from "./ram";
import Screen from "./screen";

let memoryMapper: MemoryMapper;
let screen: Screen;
let numberDisplay: NumberDisplay;
let ram: Ram;

const ramLength = 256;

const screenStart = 246;
const screenWidth = 32;
const screenHeigth = 32;

const numberDisplayStart = 252


ram = new Ram(ramLength);
screen = new Screen(ram, screenStart, screenWidth, screenHeigth);
numberDisplay = new NumberDisplay(ram, numberDisplayStart);
memoryMapper = new MemoryMapper();

memoryMapper.map(ram, 0, screenStart - 1, false);
memoryMapper.map(screen, screenStart, screenStart + Screen.nBytesAlocated - 1, true);
memoryMapper.map(numberDisplay, numberDisplayStart, numberDisplayStart + NumberDisplay.nBytesAlocated - 1, true); 

console.log(memoryMapper);