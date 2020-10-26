import { Environment } from './environment';
import { parser } from './parser';

parser
  .parseStringToCompletion(
    `
function main() {
  putchar('.');
}`
  )
  .emit(new Environment(new Map()));
