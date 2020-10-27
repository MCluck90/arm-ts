import { emit } from '../emit';
import { Environment } from '../environment';
import { AST } from './ast';

export class Boolean implements AST {
  constructor(public value: boolean) {}

  emit(_env: Environment) {
    emit(`  mov r0, #${+this.value}`);
  }

  equals(other: AST): boolean {
    return other instanceof Boolean && other.value === this.value;
  }
}
