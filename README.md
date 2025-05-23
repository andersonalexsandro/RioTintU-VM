# RioTintU-VM

Inspiration to this VM - [youtube](https://www.youtube.com/playlist?list=PLP29wDx6QmW5DdwpdwHCRJsEubS5NrQ9b)

GUI: [Design](https://www.figma.com/design/reAwBcXTrX9SvhKPDcNfPZ/RioTintU-VM?node-id=0-1&node-type=canvas&t=g7MBf4HXQpEMsfbd-0)

Instruction Set Architecture: [ISA](https://docs.google.com/spreadsheets/d/1ce8okA9Iy8wLN9gtn3IzqqO52bT0SPEkzZ5C6IkLoVc/edit?gid=0#gid=0)

## 8 Bit Minecraft Computer Virtual Machine

This project is a Virtual Machine to logically emulate my 8 Bit Minecraft Computer, which is based on real computational concepts.

Runing Fibonacci sequence: [youtube](https://www.youtube.com/watch?v=nEHz9QRe7IQ)

## specifications

- 256 x 16 Bits Instruction Read Only Memory, 8 Bit address - 512Bytes ROM
- 8 Bit Program Counter - 0 ~ 255 PC
- 256 x 8 Bits Random Acess Memory, 8 Bit address - 256 Bytes RAM
- 8 Bit Arithmetic Logic Unit - Add and Bitwase operations -  [ISA](https://docs.google.com/spreadsheets/d/1ce8okA9Iy8wLN9gtn3IzqqO52bT0SPEkzZ5C6IkLoVc/edit?gid=0#gid=0)
- 8 ALU Flags (COUT, !COUT, ZERO, !ZERO, EVEN, !EVEN, MSB, !MSB)
- 16 x 8 Bit Dual Read Register - r0 Read Only zero
- 32 x 32 Display (Memory Maped I/O)
- 16 bit Number Display (Memory Maped I/O)


### Objectives:

- Create an Assembler for my customized Instruction Set Architecture [ISA](https://docs.google.com/spreadsheets/d/1ce8okA9Iy8wLN9gtn3IzqqO52bT0SPEkzZ5C6IkLoVc/edit?gid=0#gid=0)

- Run programs based on the assembled Machine code

- Emulate the states and content of every component

- Run programs in Debug mode
