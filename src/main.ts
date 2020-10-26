import { parser } from './parser';

parser
  .parseStringToCompletion(
    `
function main() {
  putchar('.');
}`
  )
  .emit();
