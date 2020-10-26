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
}`
  )
  .emit();
