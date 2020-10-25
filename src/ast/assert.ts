import { AST } from '../types';

export class Assert implements AST {
  constructor(public condition: AST) {}

  emit() {
    // TODO
  }

  equals(other: AST): boolean {
    return other instanceof Assert && other.condition.equals(this.condition);
  }
}
