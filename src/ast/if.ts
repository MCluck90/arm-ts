import { AST } from '../types';

export class If implements AST {
  constructor(
    public conditional: AST,
    public consequence: AST,
    public alternative: AST
  ) {}

  emit() {
    // TODO
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
