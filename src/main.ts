import { parser } from './parser';

parser
  .parseStringToCompletion(
    `
function main() {
  assert(1);
  assert(!0);
  assert(42 == 4 + 2 * (12 - 2) + 3 * (5 + 1));
}`
  )
  .emit();
