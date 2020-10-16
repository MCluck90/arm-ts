import { AST } from './ast';

export class Block implements AST {
  constructor(public statements: AST[]) {}

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
