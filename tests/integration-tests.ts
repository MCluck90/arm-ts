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
  assert(rand() != 42);
}`
  )
  .emit();
