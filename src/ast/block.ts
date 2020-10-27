import { AST } from '../ast';
import { Visitor } from '../visitor';

export class Block implements AST {
  constructor(public statements: AST[]) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitBlock(this);
  }

  equals(other: AST): boolean {
    return (
      other instanceof Block &&
      other.statements.length === this.statements.length &&
      this.statements.every((statement, i) =>
        statement.equals(other.statements[i])
      )
    );
  }
}
