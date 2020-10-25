import { AST } from '../types';

export class Return implements AST {
  constructor(public term: AST) {}

  emit() {
    throw new Error('Not yet implemented');
  }

  equals(other: AST): boolean {
    return other instanceof Return && other.term.equals(this.term);
  }
}
