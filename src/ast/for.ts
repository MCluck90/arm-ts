import { AST } from '.';
import { Visitor } from '../visitor';

export class For implements AST {
  constructor(
    public initializer: AST | null,
    public conditional: AST,
    public postBodyStatement: AST | null,
    public body: AST
  ) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitFor(this);
  }

  equals(other: AST): boolean {
    if (!(other instanceof For)) {
      return false;
    }

    const initializersEqual =
      this.initializer === null
        ? other.initializer === null
        : other.initializer === null
        ? false
        : this.initializer.equals(other.initializer);
    const conditionalsEqual = this.conditional.equals(other.conditional);
    const postBodyStatementsEqual =
      this.postBodyStatement === null
        ? other.postBodyStatement === null
        : other.postBodyStatement === null
        ? false
        : this.postBodyStatement.equals(other.postBodyStatement);

    return (
      initializersEqual &&
      conditionalsEqual &&
      postBodyStatementsEqual &&
      this.body.equals(other.body)
    );
  }
}
