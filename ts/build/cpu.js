"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instructions = void 0;
var Instructions;
(function (Instructions) {
    Instructions[Instructions["NOP"] = 0] = "NOP";
    Instructions[Instructions["HLT"] = 1] = "HLT";
    Instructions[Instructions["ADD"] = 2] = "ADD";
    Instructions[Instructions["SUB"] = 3] = "SUB";
    Instructions[Instructions["NOR"] = 4] = "NOR";
    Instructions[Instructions["AND"] = 5] = "AND";
    Instructions[Instructions["XOR"] = 6] = "XOR";
    Instructions[Instructions["RSH"] = 7] = "RSH";
    Instructions[Instructions["LDI"] = 8] = "LDI";
    Instructions[Instructions["ADI"] = 9] = "ADI";
    Instructions[Instructions["JMP"] = 10] = "JMP";
    Instructions[Instructions["BRH"] = 11] = "BRH";
    Instructions[Instructions["JID"] = 12] = "JID";
    Instructions[Instructions["ADC"] = 13] = "ADC";
    Instructions[Instructions["LOD"] = 14] = "LOD";
    Instructions[Instructions["STR"] = 15] = "STR";
})(Instructions || (exports.Instructions = Instructions = {}));
class CPU {
}
exports.default = CPU;
