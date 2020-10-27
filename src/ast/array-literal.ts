import { emit } from '../emit';
import { Environment } from '../environment';
import { AST } from './ast';

export class ArrayLiteral implements AST {
  constructor(public elements: AST[]) {}

  emit(env: Environment) {
    const { length } = this.elements;
    emit(`  ldr r0, =${4 * (length + 1)}`);
    emit(`  bl malloc`);
    emit(`  push {r4, ip}`);
    emit(`  mov r4, r0`);
    emit(`  ldr r0, =${length}`);
    emit(`  str r0, [r4]`);
    this.elements.forEach((element, i) => {
      element.emit(env);
      emit(`  str r0, [r4, #${4 * (i + 1)}]`);
    });
    emit(`  mov r0, r4`);
    emit(`  pop {r4, ip}`);
  }

  equals(other: AST): boolean {
    return (
      other instanceof ArrayLiteral &&
      other.elements.length === this.elements.length &&
      other.elements.every((arg, i) => arg.equals(this.elements[i]))
    );
  }
}
