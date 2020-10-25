import { emit } from '../emit';
import { AST } from '../types';

export class Assert implements AST {
  constructor(public condition: AST) {}

  emit() {
    this.condition.emit();
    emit(`  cmp r0, #1`);
    emit(`  moveq r0, #'.'`);
    emit(`  movne r0, #'F'`);
    emit(`  bl putchar`);
  }

  equals(other: AST): boolean {
    return other instanceof Assert && other.condition.equals(this.condition);
  }
}
