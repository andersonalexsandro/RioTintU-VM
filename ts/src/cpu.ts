export enum Instructions {
    NOP = 0b0000,
    HLT = 0b0001,
    ADD = 0b0010,
    SUB = 0b0011,
    NOR = 0b0100,
    AND = 0b0101,
    XOR = 0b0110,
    RSH = 0b0111,
    LDI = 0b1000,
    ADI = 0b1001,
    JMP = 0b1010,
    BRH = 0b1011,
    JID = 0b1100,
    ADC = 0b1101,
    LOD = 0b1110,
    STR = 0b1111
}

export default class CPU {
}