import { AST } from './ast';

export class Return implements AST {
  constructor(public term: AST) {}

  equals(other: AST): boolean {
    return other instanceof Return && other.term.equals(this.term);
  }
}
