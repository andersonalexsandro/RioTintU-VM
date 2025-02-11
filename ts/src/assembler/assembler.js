"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assembler = void 0;
var Assembler = /** @class */ (function () {
    function Assembler() {
        this.opcodes = [
            'nop', 'hlt', 'add', 'sub',
            'nor', 'and', 'xor', 'rsh',
            'ldi', 'adi', 'jmp', 'brh',
            'jid', 'adc', 'lod', 'str',
            'cmp', 'mov', 'neg', 'not',
            'inc', 'dec', 'lsh'
        ];
        this.registers = [
            'r0', 'r1', 'r2', 'r3',
            'r4', 'r5', 'r6', 'r7',
            'r8', 'r9', 'r10', 'r11',
            'r12', 'r13', 'r14', 'r15'
        ];
        // 000 - NOT MSB | Positive (>0)
        // 001 - MSB  | Negative (<0)
        // 010 - NOT COUT  | Less Than (C==false)
        // 011 - COUT | Greater Than or Equal (c==true)
        // 100 - ZERO | Equal (Z==true)
        // 101 - NOT ZERO | Not Equal (z==false)
        // 110 - NOT EVEN | odd (%2 == 1)
        // 111 - EVEN (%2 == 0)
        this.conditions1 = ['pos', 'neg', 'lt', 'ge', 'eq', 'ne', 'odd', 'even'];
        this.conditions2 = ['>0', '<0', '<', '>=', '=', '!=', '!%2', '%2'];
        this.conditions4 = ['notmsb', 'msb', 'notcarry', 'carry', 'zero', 'notzero', 'noteven', 'even'];
        this.ports = [
            'clear_sreen_buffer', 'buffer_screen', 'clear_pixel', 'draw_pixel',
            'pixel_x', 'pixel_y', 'number_display_low_8', 'number_display_high8'
        ];
        this.labels = new Map();
        this.symbols = new Map();
        this.initializeSymbols();
    }
    Assembler.prototype.initializeSymbols = function () {
        for (var _i = 0, _a = this.registers.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], index = _b[0], symbol = _b[1];
            this.symbols.set(symbol, index);
        }
        for (var _c = 0, _d = this.opcodes.entries(); _c < _d.length; _c++) {
            var _e = _d[_c], index = _e[0], symbol = _e[1];
            this.symbols.set(symbol, index);
        }
        for (var _f = 0, _g = this.conditions1.entries(); _f < _g.length; _f++) {
            var _h = _g[_f], index = _h[0], symbol = _h[1];
            this.symbols.set(symbol, index);
        }
        for (var _j = 0, _k = this.conditions2.entries(); _j < _k.length; _j++) {
            var _l = _k[_j], index = _l[0], symbol = _l[1];
            this.symbols.set(symbol, index);
        }
        for (var _m = 0, _o = this.conditions4.entries(); _m < _o.length; _m++) {
            var _p = _o[_m], index = _p[0], symbol = _p[1];
            this.symbols.set(symbol, index);
        }
        for (var _q = 0, _r = this.ports.entries(); _q < _r.length; _q++) {
            var _s = _r[_q], index = _s[0], symbol = _s[1];
            this.symbols.set(symbol, index + 246);
        }
    };
    Assembler.prototype.assemble = function (assemblyList) {
        var _a;
        var machineCode = [];
        this.resolveLabelsAndDefines(assemblyList); // Resolve labels e define
        for (var i = 0; i < assemblyList.length; i++) {
            var line = assemblyList[i].trim();
            var args = line.split(/\s+/);
            var opcode = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            var assembled = void 0;
            if (opcode.startsWith('.'))
                continue; // Ignore labels
            if (opcode === 'define') {
                continue;
            }
            if (['ldi', 'adi', 'jid'].includes(opcode)) {
                assembled = this.immediateOperation(args);
                machineCode.push(assembled);
                continue;
            }
            if (['add', 'sub', 'nor', 'and', 'xor', 'adc'].includes(opcode)) {
                assembled = this.logicArithmeticOperation(args);
                machineCode.push(assembled);
                continue;
            }
            if (['lod', 'str'].includes(opcode)) {
                assembled = this.memoryOperation(args);
                machineCode.push(assembled);
                continue;
            }
            if (opcode === 'rsh') {
                assembled = this.rsh(args);
                machineCode.push(assembled);
                continue;
            }
            if (opcode === 'jmp') {
                assembled = this.jmp(args);
                machineCode.push(assembled);
                continue;
            }
            if (opcode === 'brh') {
                assembled = this.brh(args);
                machineCode.push(assembled);
                continue;
            }
            if (['hlt', 'nop'].includes(opcode)) {
                machineCode.push("000000000000".concat(this.symbolToBinary(args[0], 4)));
                continue;
            }
            if (opcode === 'cmp') {
                assembled = this.cmp(args);
                machineCode.push(assembled);
                continue;
            }
            if (opcode === 'mov') {
                assembled = this.mov(args);
                machineCode.push(assembled);
                continue;
            }
            if (opcode === 'lsh') {
                assembled = this.lsh(args);
                machineCode.push(assembled);
                continue;
            }
            if (['inc', 'dec'].includes(opcode)) {
                assembled = this.pseudoImmediate(args);
                machineCode.push(assembled);
                continue;
            }
            if (opcode === 'not') {
                assembled = this.not(args);
                machineCode.push(assembled);
                continue;
            }
            if (opcode === 'neg') {
                assembled = this.neg(args);
                machineCode.push(assembled);
                continue;
            }
        }
        return machineCode;
    };
    Assembler.prototype.resolveLabelsAndDefines = function (assemblyList) {
        var _a;
        var currentAddress = 0;
        for (var i = 0; i < assemblyList.length; i++) {
            var line = assemblyList[i].trim();
            if (!line || line.startsWith('/') || line.startsWith('#'))
                continue;
            var tokens = line.split(/\s+/);
            var firstToken = (_a = tokens[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (firstToken === 'define') {
                var def = tokens[0], symbol = tokens[1], value = tokens[2];
                if (this.symbols.has(value.toLowerCase())) {
                    value = this.symbols.get(value.toLowerCase()).toString();
                }
                this.symbols.set(symbol.toLowerCase(), parseInt(value, 10));
                continue;
            }
            if (firstToken.startsWith('.')) {
                var labelName = firstToken.toLowerCase();
                if (this.labels.has(labelName)) {
                    throw new Error("Duplicate label definition: ".concat(labelName));
                }
                this.labels.set(labelName, currentAddress);
                continue;
            }
            // Increment address for instructions
            currentAddress++;
        }
    };
    Assembler.prototype.jmp = function (args) {
        var opcode = this.symbolToBinary(args[0], 4);
        var immediate = this.toBinary(args[1], 8); // Resolve to label, define, or literal        
        return "".concat(immediate, "0000").concat(opcode);
    };
    Assembler.prototype.toBinary = function (value, bits) {
        if (typeof value === 'string') {
            // Resolve labels
            if (this.labels.has(value.toLowerCase())) {
                value = this.labels.get(value.toLowerCase());
            }
            // Resolve symbols or defines
            else if (this.symbols.has(value.toLowerCase())) {
                value = this.symbols.get(value.toLowerCase());
            }
            // Check if numeric literal
            else if (this.isNumeric(value)) {
                value = Number(value);
            }
            else {
                throw new Error("Undefined label or invalid value: ".concat(value));
            }
        }
        var binary = Number(value).toString(2);
        if (binary.length > bits) {
            throw new Error("Value ".concat(value, " exceeds the limit of ").concat(bits, " bits"));
        }
        return binary.padStart(bits, '0');
    };
    Assembler.prototype.neg = function (args) {
        var A = this.symbolToBinary('r0', 4);
        var B = this.symbolToBinary(args[2], 4);
        var C = this.symbolToBinary(args[1], 4);
        var opcode = this.symbolToBinary('sub', 4);
        return "".concat(A).concat(B).concat(C).concat(opcode);
    };
    Assembler.prototype.pseudoImmediate = function (args) {
        var opcode = this.symbolToBinary('adi', 4);
        var C = this.symbolToBinary(args[1], 4);
        var immediate;
        if (args[0].toLowerCase() === 'inc') {
            immediate = this.toBinary(1, 8);
        }
        else {
            var oneTwoComp = 255;
            immediate = this.toBinary(oneTwoComp, 8);
        }
        return "".concat(immediate).concat(C).concat(opcode);
    };
    Assembler.prototype.not = function (args) {
        var A = this.symbolToBinary(args[2], 4);
        var B = this.symbolToBinary('r0', 4);
        var C = this.symbolToBinary(args[1], 4);
        var opcode = this.symbolToBinary('nor', 4);
        return "".concat(A).concat(B).concat(C).concat(opcode);
    };
    Assembler.prototype.lsh = function (args) {
        var A = this.symbolToBinary(args[2], 4);
        var B = this.symbolToBinary(args[2], 4);
        var C = this.symbolToBinary(args[1], 4);
        var opcode = this.symbolToBinary('add', 4);
        return "".concat(A).concat(B).concat(C).concat(opcode);
    };
    Assembler.prototype.cmp = function (args) {
        var A = this.symbolToBinary(args[1], 4);
        var B = this.symbolToBinary(args[2], 4);
        var C = this.symbolToBinary('r0', 4);
        var opcode = this.symbolToBinary('sub', 4);
        return "".concat(A).concat(B).concat(C).concat(opcode);
    };
    Assembler.prototype.mov = function (args) {
        var A = this.symbolToBinary(args[2], 4);
        var B = this.symbolToBinary('r0', 4);
        var C = this.symbolToBinary(args[1], 4);
        var opcode = this.symbolToBinary('add', 4);
        return "".concat(A).concat(B).concat(C).concat(opcode);
    };
    Assembler.prototype.brh = function (args) {
        var opcode = this.symbolToBinary(args[0], 4);
        var condition = this.symbolToBinary(args[1], 4);
        var immediate = this.toBinary(args[2], 8);
        return "".concat(immediate).concat(condition).concat(opcode);
    };
    Assembler.prototype.rsh = function (args) {
        var opcode = this.symbolToBinary(args[0], 4);
        var regC = this.symbolToBinary(args[1], 4);
        var regA = this.symbolToBinary(args[2], 4);
        return "".concat(regA).concat('0000').concat(regC).concat(opcode);
    };
    Assembler.prototype.memoryOperation = function (args) {
        var opcode = this.symbolToBinary(args[0], 4);
        var regC = this.symbolToBinary(args[1], 4);
        var regA = this.symbolToBinary(args[2], 4);
        var immediate = this.toBinary(Number(args[3] || 0), 4);
        return "".concat(regA).concat(immediate).concat(regC).concat(opcode);
    };
    Assembler.prototype.immediateOperation = function (args) {
        var immediate = this.toBinary(args[2] || 0, 8); // Handle both numeric literals and defined symbols
        var reg = this.symbolToBinary(args[1], 4);
        var opcodeBinary = this.symbolToBinary(args[0], 4);
        var assembled = "".concat(immediate).concat(reg).concat(opcodeBinary);
        return assembled;
    };
    Assembler.prototype.logicArithmeticOperation = function (args) {
        var regABin = this.symbolToBinary(args[2], 4);
        var regBBin = this.symbolToBinary(args[3], 4);
        var regCBin = this.symbolToBinary(args[1], 4);
        var opcodeBin = this.symbolToBinary(args[0], 4);
        var assembled = "".concat(regABin).concat(regBBin).concat(regCBin).concat(opcodeBin);
        return assembled;
    };
    Assembler.prototype.symbolToBinary = function (symbol, bits) {
        var value = this.symbols.get(symbol.toLowerCase());
        return this.toBinary(value, bits);
    };
    Assembler.prototype.isNumeric = function (value) {
        return !isNaN(Number(value));
    };
    Assembler.prototype.validateAssembly = function (assemblyList) {
        var _this = this;
        var _a;
        var errors = [];
        var _loop_1 = function (i) {
            var line = assemblyList[i].trim();
            // Ignore empty lines and comments
            if (!line || line.startsWith('/') || line.startsWith('#'))
                return "continue";
            var args = line.split(/\s+/);
            var instruction = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            // Check for invalid instructions
            if (!this_1.opcodes.includes(instruction) && instruction !== 'define' && !instruction.startsWith('.')) {
                errors.push({
                    line: i,
                    message: "Invalid instruction: ".concat(instruction),
                });
                return "continue";
            }
            // Check DEFINE
            if (instruction === 'define') {
                if (args.length < 3) {
                    errors.push({
                        line: i,
                        message: "Invalid DEFINE syntax. Expected: \"DEFINE SYMBOL VALUE\"",
                    });
                }
                else if (isNaN(Number(args[2])) && !this_1.symbols.has(args[2].toLowerCase())) {
                    errors.push({
                        line: i + 1,
                        message: "Invalid DEFINE value: ".concat(args[2]),
                    });
                }
                return "continue";
            }
            // Check labels
            if (instruction.startsWith('.')) {
                if (args.length > 1) {
                    errors.push({
                        line: i + 1,
                        message: "Invalid label syntax. Labels should be standalone.",
                    });
                }
                return "continue";
            }
            // Check arguments based on the instruction
            var opcodeIndex = this_1.opcodes.indexOf(instruction);
            if (opcodeIndex !== -1) {
                var expectedArgs = this_1.getExpectedArguments(instruction);
                if (args.length - 1 < expectedArgs) {
                    errors.push({
                        line: i,
                        message: "Instruction \"".concat(instruction, "\" expects ").concat(expectedArgs, " arguments but got ").concat(args.length - 1, "."),
                    });
                }
                // Check for invalid registers or symbols
                args.slice(1).forEach(function (arg, index) {
                    if (!_this.registers.includes(arg.toLowerCase()) &&
                        !_this.symbols.has(arg.toLowerCase()) &&
                        !_this.isNumeric(arg)) {
                        errors.push({
                            line: i + 1,
                            message: "Invalid argument \"".concat(arg, "\" for instruction \"").concat(instruction, "\" at position ").concat(index + 1, "."),
                        });
                    }
                });
            }
        };
        var this_1 = this;
        for (var i = 0; i < assemblyList.length; i++) {
            _loop_1(i);
        }
        return errors;
    };
    Assembler.prototype.getExpectedArguments = function (instruction) {
        // Define the expected number of arguments for each instruction
        var argumentCounts = {
            ldi: 2,
            adi: 2,
            add: 3,
            sub: 3,
            xor: 3,
            and: 3,
            nor: 3,
            brh: 2,
            jmp: 1,
            jid: 2,
            lod: 3,
            str: 3,
            mov: 2,
            cmp: 2,
            inc: 1,
            dec: 1,
            not: 2,
            neg: 2,
            lsh: 2,
            rsh: 2,
        };
        return argumentCounts[instruction] || 0;
    };
    return Assembler;
}());
exports.Assembler = Assembler;
exports.default = Assembler;
