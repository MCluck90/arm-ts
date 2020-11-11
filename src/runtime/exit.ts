// @ts-nocheck
function std__exit(code: number): void {
  asm`
  mov r0, #0
  bl fflush
  `;
  code;
  asm`
  mov r7, #1
  swi #0
  `;
}
