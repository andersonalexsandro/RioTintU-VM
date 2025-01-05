import { describe, expect, test } from '@jest/globals';
import Assembler from '../src/assembler/assembler';
import { Instructions } from '../src/cpu'; // Certifique-se de que `Instructions` contém todos os opcodes necessários.
import { FlagCode } from '../src/flags';

describe('Assembler', () => {
    const assembler = new Assembler();
    const registers = [
        'r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7',
        'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15',
    ];

    test('LDI r1 10', () => {
        const assembly = ['LDI r1 10'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const r1 = toBinary(registers.indexOf('r1'), 4);
        const immediate = toBinary(10, 8);
        expect(assembled[0]).toBe(immediate + r1 + opcode);
    });

    test('LDI using define', () => {
        const assembly = [
            'DEFINE VALUE 42',
            'LDI r2 VALUE'
        ];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const r2 = toBinary(registers.indexOf('r2'), 4);
        const immediate = toBinary(42, 8); // VALUE resolves to 42
        expect(assembled[0]).toBe(immediate + r2 + opcode);
    });

    test('ADD r4 r2 r3', () => {
        const assembly = ['ADD r4 r2 r3'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.ADD, 4);
        const r2 = toBinary(registers.indexOf('r2'), 4);
        const r3 = toBinary(registers.indexOf('r3'), 4);
        const r4 = toBinary(registers.indexOf('r4'), 4);
        expect(assembled[0]).toBe(r2 + r3 + r4 + opcode);
    });

    test('SUB r7 r5 r6', () => {
        const assembly = ['SUB r7 r5 r6'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.SUB, 4);
        const r5 = toBinary(registers.indexOf('r5'), 4);
        const r6 = toBinary(registers.indexOf('r6'), 4);
        const r7 = toBinary(registers.indexOf('r7'), 4);
        expect(assembled[0]).toBe(r5 + r6 + r7 + opcode);
    });

    test('XOR r10 r8 r9', () => {
        const assembly = ['XOR r10 r8 r9'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.XOR, 4);
        const r8 = toBinary(registers.indexOf('r8'), 4);
        const r9 = toBinary(registers.indexOf('r9'), 4);
        const r10 = toBinary(registers.indexOf('r10'), 4);
        expect(assembled[0]).toBe(r8 + r9 + r10 + opcode);
    });

    test('AND r13 r11 r12', () => {
        const assembly = ['AND r13 r11 r12'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.AND, 4);
        const r11 = toBinary(registers.indexOf('r11'), 4);
        const r12 = toBinary(registers.indexOf('r12'), 4);
        const r13 = toBinary(registers.indexOf('r13'), 4);
        expect(assembled[0]).toBe(r11 + r12 + r13 + opcode);
    });

    test('RSH r1 r2', () => {
        const assembly = ['RSH r1 r2'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.RSH, 4);
        const r1 = toBinary(registers.indexOf('r1'), 4);
        const r2 = toBinary(registers.indexOf('r2'), 4);
        expect(assembled[0]).toBe(r2 + '0000' + r1 + opcode);
    });

    test('ADI r1 1', () => {
        const assembly = ['ADI r1 1'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.ADI, 4);
        const r1 = toBinary(registers.indexOf('r1'), 4);
        const immediate = toBinary(1, 8);
        expect(assembled[0]).toBe(immediate + r1 + opcode);
    });

    test('ADI using define', () => {
        const assembly = [
            'DEFINE VALUE 20',
            'ADI r1 VALUE'
        ];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.ADI, 4);
        const r1 = toBinary(registers.indexOf('r1'), 4);
        const immediate = toBinary(20, 8); // VALUE resolves to 20
        expect(assembled[0]).toBe(immediate + r1 + opcode);
    });

    test('JMP using immediate value', () => {
        const assembly = ['JMP 10'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.JMP, 4);
        const immediate = toBinary(10, 8); // Literal value 10
        expect(assembled[0]).toBe(immediate + '0000' + opcode);
    });
    
    test('JMP using label', () => {
        const assembly = ['.label', 'JMP .label'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.JMP, 4);
        const immediate = toBinary(0, 8); // `.label` resolves to address 0
        expect(assembled[0]).toBe(immediate + '0000' + opcode);
    });
    
    test('JMP using define', () => {
        const assembly = ['DEFINE CONST 15', 'JMP CONST'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.JMP, 4);
        const immediate = toBinary(15, 8); // Defined constant resolves to 15
        expect(assembled[0]).toBe(immediate + '0000' + opcode);
    });

    test('BRH >0', () => {
        const assembly = ['BRH >0 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.NOT_MSB, 4)
        const opcode = toBinary(Instructions.BRH, 4)
        expect(assembled[0]).toBe(immediate + condition + opcode);
    })
    test('BRH <0', () => {
        const assembly = ['BRH <0 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.MSB, 4)
        const opcode = toBinary(Instructions.BRH, 4)
        expect(assembled[0]).toBe(immediate + condition + opcode);
    })

    test('BRH <', () => {
        const assembly = ['BRH < 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.NOT_COUT, 4)
        const opcode = toBinary(Instructions.BRH, 4)
        expect(assembled[0]).toBe(immediate + condition + opcode);
    })

    test('BRH >=', () => {
        const assembly = ['BRH >= 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.COUT, 4)
        const opcode = toBinary(Instructions.BRH, 4)
        expect(assembled[0]).toBe(immediate + condition + opcode);
    })

    test('BRH =', () => {
        const assembly = ['BRH = 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.ZERO, 4)
        const opcode = toBinary(Instructions.BRH, 4)
        expect(assembled[0]).toBe(immediate + condition + opcode);
    })

    test('BRH !=', () => {
        const assembly = ['BRH != 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.NOT_ZERO, 4)
        const opcode = toBinary(Instructions.BRH, 4)
        expect(assembled[0]).toBe(immediate + condition + opcode);
    })

    test('BRH !%2', () => {
        const assembly = ['BRH !%2 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.NOT_EVEN, 4)
        const opcode = toBinary(Instructions.BRH, 4)
        expect(assembled[0]).toBe(immediate + condition + opcode);
    })

    test('BRH %2', () => {
        const assembly = ['BRH %2 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.EVEN, 4)
        const opcode = toBinary(Instructions.BRH, 4)
        expect(assembled[0]).toBe(immediate + condition + opcode);
    })

    test('BRH pos', () => {
        const assembly = ['BRH pos 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.NOT_MSB, 4); // Same as >0
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH neg', () => {
        const assembly = ['BRH neg 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.MSB, 4); // Same as <0
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH lt', () => {
        const assembly = ['BRH lt 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.NOT_COUT, 4); // Same as <
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH ge', () => {
        const assembly = ['BRH ge 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.COUT, 4); // Same as >=
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH eq', () => {
        const assembly = ['BRH eq 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.ZERO, 4); // Same as =
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH ne', () => {
        const assembly = ['BRH ne 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.NOT_ZERO, 4); // Same as !=
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH odd', () => {
        const assembly = ['BRH odd 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.NOT_EVEN, 4); // Same as !%2
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH even', () => {
        const assembly = ['BRH even 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.EVEN, 4); // Same as %2
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH notmsb', () => {
        const assembly = ['BRH notmsb 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.NOT_MSB, 4); // Same as pos or >0
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH msb', () => {
        const assembly = ['BRH msb 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.MSB, 4); // Same as neg or <0
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH notcarry', () => {
        const assembly = ['BRH notcarry 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.NOT_COUT, 4); // Same as lt or <
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH carry', () => {
        const assembly = ['BRH carry 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.COUT, 4); // Same as ge or >=
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH zero', () => {
        const assembly = ['BRH zero 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.ZERO, 4); // Same as eq or =
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH notzero', () => {
        const assembly = ['BRH notzero 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.NOT_ZERO, 4); // Same as ne or !=
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH noteven', () => {
        const assembly = ['BRH noteven 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.NOT_EVEN, 4); // Same as odd or !%2
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });
    
    test('BRH even (symbol)', () => {
        const assembly = ['BRH even 1'];
        const assembled = assembler.assemble(assembly);
        const immediate = toBinary(1, 8);
        const condition = toBinary(FlagCode.EVEN, 4); // Same as %2
        const opcode = toBinary(Instructions.BRH, 4);
        expect(assembled[0]).toBe(immediate + condition + opcode);
    });

    const baseAddress = 246; // Base address for ports

    test('LDI using port clear_sreen_buffer', () => {
        const assembly = ['LDI r1 clear_sreen_buffer'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const r1 = toBinary(1, 4); // Register r1
        const immediate = toBinary(baseAddress, 8); // Address of 'clear_sreen_buffer'
        expect(assembled[0]).toBe(immediate + r1 + opcode);
    });

    test('LDI using port buffer_screen', () => {
        const assembly = ['LDI r2 buffer_screen'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const r2 = toBinary(2, 4); // Register r2
        const immediate = toBinary(baseAddress + 1, 8); // Address of 'buffer_screen'
        expect(assembled[0]).toBe(immediate + r2 + opcode);
    });

    test('LDI using port clear_pixel', () => {
        const assembly = ['LDI r3 clear_pixel'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const r3 = toBinary(3, 4); // Register r3
        const immediate = toBinary(baseAddress + 2, 8); // Address of 'clear_pixel'
        expect(assembled[0]).toBe(immediate + r3 + opcode);
    });

    test('LDI using port draw_pixel', () => {
        const assembly = ['LDI r4 draw_pixel'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const r4 = toBinary(4, 4); // Register r4
        const immediate = toBinary(baseAddress + 3, 8); // Address of 'draw_pixel'
        expect(assembled[0]).toBe(immediate + r4 + opcode);
    });

    test('LDI using port pixel_x', () => {
        const assembly = ['LDI r5 pixel_x'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const r5 = toBinary(5, 4); // Register r5
        const immediate = toBinary(baseAddress + 4, 8); // Address of 'pixel_x'
        expect(assembled[0]).toBe(immediate + r5 + opcode);
    });

    test('LDI using port pixel_y', () => {
        const assembly = ['LDI r6 pixel_y'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const r6 = toBinary(6, 4); // Register r6
        const immediate = toBinary(baseAddress + 5, 8); // Address of 'pixel_y'
        expect(assembled[0]).toBe(immediate + r6 + opcode);
    });

    test('LDI using port number_display_low_8', () => {
        const assembly = ['LDI r7 number_display_low_8'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const r7 = toBinary(7, 4); // Register r7
        const immediate = toBinary(baseAddress + 6, 8); // Address of 'number_display_low_8'
        expect(assembled[0]).toBe(immediate + r7 + opcode);
    });

    test('LDI using port number_display_high8', () => {
        const assembly = ['LDI r8 number_display_high8'];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const r8 = toBinary(8, 4); // Register r8
        const immediate = toBinary(baseAddress + 7, 8); // Address of 'number_display_high8'
        expect(assembled[0]).toBe(immediate + r8 + opcode);
    });

    test('LDI using define and I/O port', () => {
        const assembly = [
            'DEFINE PORT pixel_x',
            'LDI r1 PORT'
        ];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const immediate = toBinary(246 + 4, 8); // Address of 'pixel_x' (base 246 + 4)
        const r1 = toBinary(1, 4); // Register r1
        
        expect(assembled[0]).toBe(immediate + r1 + opcode);
    });

    test('LDI using define within define', () => {
        const assembly = [
            'DEFINE PORT pixel_x',
            'DEFINE PORT2 PORT',
            'LDI r1 PORT2'
        ];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.LDI, 4);
        const immediate = toBinary(246 + 4, 8); // Address of 'pixel_x' (base 246 + 4)
        const r1 = toBinary(1, 4); // Register r1        
        expect(assembled[0]).toBe(immediate + r1 + opcode);
    });

    test('ADI using define and I/O port (pixel_x)', () => {
        const assembly = [
            'DEFINE PORT pixel_x',
            'ADI r2 PORT'
        ];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.ADI, 4);
        const r2 = toBinary(2, 4); // Register r2
        const immediate = toBinary(246 + 4, 8); // Address of 'pixel_x' (base 246 + 4)
        expect(assembled[0]).toBe(immediate + r2 + opcode);
    });
    
    test('ADI using define with I/O port (number_display_high8)', () => {
        const assembly = [
            'DEFINE PORT number_display_high8',
            'DEFINE PORT2 PORT',
            'ADI r3 PORT2'
        ];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.ADI, 4);
        const r3 = toBinary(3, 4); // Register r3
        const immediate = toBinary(246 + 7, 8); // Address of 'number_display_high8' (base 246 + 7)
        expect(assembled[0]).toBe(immediate + r3 + opcode);
    });

    test('ADI using I/O port (number_display_high8)', () => {
        const assembly = [
            'ADI r3 number_display_high8'
        ];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.ADI, 4);
        const r3 = toBinary(3, 4); // Register r3
        const immediate = toBinary(246 + 7, 8); // Address of 'number_display_high8' (base 246 + 7)
        expect(assembled[0]).toBe(immediate + r3 + opcode);
    });

    test('ADD using define', () => {
        const assembly = [
            'DEFINE REG1 r4',
            'DEFINE REG2 r5',
            'DEFINE REG3 r6',
            'ADD REG1 REG2 REG3'
        ];
        const assembled = assembler.assemble(assembly);
        const opcode = toBinary(Instructions.ADD, 4);
        const reg4 = toBinary(registers.indexOf('r4'), 4); // REG1 resolves to r4
        const reg5 = toBinary(registers.indexOf('r5'), 4); // REG2 resolves to r5
        const reg6 = toBinary(registers.indexOf('r6'), 4); // REG3 resolves to r6
        expect(assembled[0]).toBe(reg5 + reg6 + reg4 + opcode);
    });
    

    test('JID', () =>{
        
    })    
});

const toBinary = (value: number, nBits: number): string => {
    if (value < 0) {
        const twosComplement = (1 << nBits) + value;
        return twosComplement.toString(2).padStart(nBits, '0');
    }
    return value.toString(2).padStart(nBits, '0');
};
