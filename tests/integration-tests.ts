import { parser } from '../src/parser';
import { CodeGenerator } from '../src/passes/codegen';

parser
  .parseStringToCompletion(
    `
function main() {
  assert(1);
  assert(!0);
  assert(42 == 4 + 2 * (12 - 2) + 3 * (5 + 1));

  {
    assert(1);
    assert(1);
  }
  putchar(46);
  putchar('.');
  assert(rand() != 42);

  if (1) {
    assert(1);
  } else {
    assert(0);
  }

  if (0) {
    assert(0);
  } else {
    assert(1);
  }

  assert1234(1, 2, 3, 4);

  assert(factorial(5) == 120);

  variableDeclarations();
  assignment();
  whileLoop();

  assert(factorialLoop(5) == 120);

  chainedAssignments();
  booleans();
  nullAndUndefined();
}

function assert(x) {
  if (x) {
    putchar(46);
  } else {
    putchar(70);
  }
}

function assert1234(a, b, c, d) {
  assert(a == 1);
  assert(b == 2);
  assert(c == 3);
  assert(d == 4);
}

function factorial(n) {
  if (n == 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
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

function nullAndUndefined() {
  assert(null == null);
  assert(undefined == undefined);
}

function arrays() {
  var a = [1, 2, 3];
  assert(a[0] == 1);
  assert(a[0 + 1] == 2);
  assert(a[0 + 2] == (2 + 1));
}
`
  )
  .visit(new CodeGenerator());
