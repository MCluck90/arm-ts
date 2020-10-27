import { emit } from '../emit';
import { Environment } from '../environment';
import { AST } from './ast';

export class Undefined implements AST {
  constructor() {}

  emit(_env: Environment) {
    emit(`  mov r0, #0`);
  }

  equals(other: AST): boolean {
    return other instanceof Undefined;
  }
}
