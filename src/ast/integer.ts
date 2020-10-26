import { emit } from '../emit';
import { AST } from '../ast';

export class Integer implements AST {
  constructor(public value: number) {}

  emit() {
    emit(`  ldr r0, =${this.value}`);
  }

  equals(other: AST): boolean {
    return other instanceof Integer && other.value === this.value;
  }
}
