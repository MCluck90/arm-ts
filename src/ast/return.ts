import { AST } from '../types';

export class Return implements AST {
  constructor(public term: AST) {}

  emit() {
    // TODO
  }

  equals(other: AST): boolean {
    return other instanceof Return && other.term.equals(this.term);
  }
}
