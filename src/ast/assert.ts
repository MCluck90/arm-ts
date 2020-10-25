import { AST } from '../types';

export class Assert implements AST {
  constructor(public condition: AST) {}

  emit() {
    throw new Error('Not yet implemented');
  }

  equals(other: AST): boolean {
    return other instanceof Assert && other.condition.equals(this.condition);
  }
}
