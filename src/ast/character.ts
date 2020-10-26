import { emit } from '../emit';
import { AST } from '../types';

export class Character implements AST {
  constructor(public value: string) {}

  emit() {
    emit(`  ldr r0, =${this.value.charCodeAt(0)}`);
  }

  equals(other: AST): boolean {
    return other instanceof Character && other.value === this.value;
  }
}
