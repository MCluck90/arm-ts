import { AST } from '../ast';
import { Visitor } from '../visitor';

export class Program implements AST {
  constructor(public statements: AST[]) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitProgram(this);
  }

  equals(other: AST): boolean {
    return (
      other instanceof Program &&
      other.statements.length === this.statements.length &&
      other.statements.every((statement, i) =>
        statement.equals(this.statements[i])
      )
    );
  }
}
