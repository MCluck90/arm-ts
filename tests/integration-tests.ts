import { Environment } from '../src/environment';
import { parser } from '../src/parser';

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
`
  )
  .emit(new Environment(new Map()));
