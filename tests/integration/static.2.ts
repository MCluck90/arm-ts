// @ts-nocheck
function comparisons() {
  assert(1 < 2);
  assert(1 <= 2);
  assert(1 <= 1);
  assert(1 < 0 == false);
  assert(1 <= 0 == false);

  assert(1 > 0);
  assert(1 >= 0);
  assert(1 >= 1);
  assert(1 > 2 == false);
  assert(1 >= 2 == false);
}

function chainIfElse() {
  if (false) {
    assert(false);
  } else if (false) {
    assert(false);
  } else {
    assert(true);
  }
}

function forStatement() {
  for (var i = 0; i < 3; i = i + 1) {
    assert(true);
  }
  var x = 0;
  for (; x < 3; x = x + 1) {}
  assert(x == 3);
}

function strings() {
  var hello = `Hello world`;
  assert(length(hello) == 11);
}

function stringTypes(str: string) {
  assert(true);
}

function assembly() {
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

function main() {
  comparisons();
  chainIfElse();
  forStatement();
  strings();
  stringTypes(`test`);
  assembly();

  printStrLn(`Success`);
  exit(0);
}
