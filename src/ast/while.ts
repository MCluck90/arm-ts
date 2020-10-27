import { AST } from '../ast';
import { Visitor } from '../visitor';

export class While implements AST {
  constructor(public conditional: AST, public body: AST) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitWhile(this);
  }

  equals(other: AST): boolean {
    return (
      other instanceof While &&
      this.conditional.equals(other.conditional) &&
      this.body.equals(other.body)
    );
  }
}
