// @ts-nocheck
function assert1234(a, b, c, d) {
  assert(a == 1);
  assert(b == 2);
  assert(c == 3);
  assert(d == 4);
}

function factorial(n) {
  if (n <= 0) {
    return 1;
  }

  return n * factorial(n - 1);
}

function variableDeclarations() {
  var x = 4 + 2 * (12 - 2);
  var y = 3 * (5 + 1);
  var z = x + y;
  assert(z == 42);
}

function assignment() {
  var a = 1;
  var b = 2;
  var c = 3;
  var d = 4;
  assert(a == 1);
  assert(b == 2);
  assert(c == 3);
  assert(d == 4);
}

function whileLoop() {
  var i = 0;
  while (i != 3) {
    i = i + 1;
  }
  assert(i == 3);
}

function factorialLoop(n) {
  var result = 1;
  while (n != 1) {
    result = result * n;
    n = n - 1;
  }
  return result;
}

function chainedAssignments() {
  var a = 0;
  var b = 0;
  var c = 0;
  var d = 0;
  a = b = c = d = 1;
  assert(a == 1);
  assert(b == 1);
  assert(c == 1);
  assert(d == 1);
}

function booleans() {
  assert(true);
  assert(!false);
}

function useUndefined() {
  assert(undefined == undefined);
}

function arrays() {
  var a = [1, 2, 3];
  assert(a[0] == 1);
  assert(a[0 + 1] == 2);
  assert(a[0 + 2] == 2 + 1);
}

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
  assert(42 == 4 + 2 * (12 - 2) + 3 * (5 + 1));

  {
    assert(true);
    assert(true);
  }
  putchar(46);
  putchar('.');
  assert(rand() != 42);

  if (true) {
    assert(true);
  } else {
    assert(false);
  }

  if (false) {
    assert(false);
  } else {
    assert(true);
  }

  assert1234(1, 2, 3, 4);

  assert(factorial(5) == 120);

  variableDeclarations();
  assignment();
  whileLoop();

  assert(factorialLoop(5) == 120);

  chainedAssignments();
  booleans();
  useUndefined();
  arrays();
  comparisons();
  chainIfElse();
  forStatement();
  strings();
  stringTypes(`test`);
  assembly();

  printStrLn(`Success`);
  exit(0);
}