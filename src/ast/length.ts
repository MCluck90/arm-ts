import { emit } from '../emit';
import { Environment } from '../environment';
import { AST } from './ast';

export class Length implements AST {
  constructor(public array: AST) {}

  emit(env: Environment) {
    this.array.emit(env);
    emit(`  ldr r0, [r0, #0]`);
  }

  equals(other: AST): boolean {
    return other instanceof Length && other.array.equals(this.array);
  }
}
