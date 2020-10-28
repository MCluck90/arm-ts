import { AST } from '../ast';
import { Visitor } from '../visitor';

export class If implements AST {
  constructor(
    public conditional: AST,
    public consequence: AST,
    public alternative: AST | null
  ) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitIf(this);
  }

  equals(other: AST): boolean {
    if (!(other instanceof If)) {
      return false;
    }

    let alternativesMatch =
      this.alternative === null && other.alternative === null;
    if (this.alternative !== null && other.alternative !== null) {
      alternativesMatch = this.alternative.equals(other.alternative);
    }

    return (
      this.conditional.equals(other.conditional) &&
      this.consequence.equals(other.consequence) &&
      alternativesMatch
    );
  }
}
