LDI r1 0
LDI r2 1
.fibonacci
ADD r1 r1 r2
ADD r2 r1 r2
JMP .fibonacci