import { parser } from './parser';

parser
  .parseStringToCompletion(
    `
function main() {
  assert(1);
  assert(!0);
}`
  )
  .emit();
