// @ts-nocheck
function assert(condition: boolean): void {
  if (condition) {
    putchar('.');
  } else {
    putchar('X');
  }
}

function main() {
  var x = 0;
  assert(x == 0);
  asm`
  ldr r0, =1
  pop {r1, ip}
  add r0, r0, r1
  str r0, [fp, #-8]
`;
  assert(x == 1);
}
