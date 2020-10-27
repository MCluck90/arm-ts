import { AST } from '../ast';
import { Visitor } from '../visitor';

export class If implements AST {
  constructor(
    public conditional: AST,
    public consequence: AST,
    public alternative: AST
  ) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitIf(this);
  }

  equals(other: AST): boolean {
    return (
      other instanceof If &&
      this.conditional.equals(other.conditional) &&
      this.consequence.equals(other.consequence) &&
      this.alternative.equals(other.alternative)
    );
  }
}
