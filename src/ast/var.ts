import { AST } from '../ast';
import { emit } from '../emit';
import { Environment } from '../environment';

export class Var implements AST {
  constructor(public name: string, public value: AST) {}

  emit(env: Environment) {
    this.value.emit(env);
    // OPTIMIZE: Avoid wasting stack space
    emit(`  push {r0, ip}`);
    env.locals.set(this.name, env.nextLocalOffset - 4);
    env.nextLocalOffset -= 8;
  }

  equals(other: AST): boolean {
    return (
      other instanceof Var &&
      other.name === this.name &&
      this.value.equals(other.value)
    );
  }
}
