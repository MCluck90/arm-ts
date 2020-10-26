import { AST } from '../ast';
import { emit } from '../emit';
import { Environment } from '../environment';

export class Assign implements AST {
  constructor(public name: string, public value: AST) {}

  emit(env: Environment) {
    this.value.emit(env);
    const offset = env.locals.get(this.name);
    if (offset) {
      emit(`  str r0, [fp, #${offset}]`);
    } else {
      throw new Error(`Undefined variable: ${this.name}`);
    }
  }

  equals(other: AST): boolean {
    return (
      other instanceof Assign &&
      other.name === this.name &&
      this.value.equals(other.value)
    );
  }
}
