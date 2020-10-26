import { AST } from '../ast';
import { emit } from '../emit';
import { Environment } from '../environment';

export class Id implements AST {
  constructor(public value: string) {}

  emit(env: Environment) {
    const offset = env.locals.get(this.value);
    if (offset) {
      emit(`  ldr r0, [fp, #${offset}]`);
    } else {
      throw new Error(`Undefined variable: ${this.value}`);
    }
  }

  equals(other: AST): boolean {
    return other instanceof Id && other.value === this.value;
  }
}
