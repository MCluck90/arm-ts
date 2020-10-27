import { emit } from '../emit';
import { Environment } from '../environment';
import { AST } from './ast';

export class ArrayLookup implements AST {
  constructor(public array: AST, public index: AST) {}

  emit(env: Environment) {
    this.array.emit(env);
    emit(`  push {r0, ip}`);
    this.index.emit(env);
    emit(`  pop {r1, ip}`);
    emit(`  ldr r2, [r1]`);
    emit(`  cmp r0, r2`);
    emit(`  movhs r0, #0`);
    emit(`  addlo r1, r1, #4`);
    emit(`  lsllo r0, r0, #2`);
    emit(`  ldrlo r0, [r1, r0]`);
  }

  equals(other: AST): boolean {
    return (
      other instanceof ArrayLookup &&
      other.array.equals(this.array) &&
      other.index.equals(this.index)
    );
  }
}
