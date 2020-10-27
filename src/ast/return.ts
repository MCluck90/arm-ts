import { AST } from '../ast';
import { Visitor } from '../visitor';

export class Return implements AST {
  constructor(public term: AST) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitReturn(this);
  }

  equals(other: AST): boolean {
    return other instanceof Return && other.term.equals(this.term);
  }
}
