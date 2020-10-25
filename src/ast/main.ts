import { AST } from '../types';

export class Main implements AST {
  constructor(public statements: AST[]) {}

  emit() {
    // TODO
  }

  equals(other: AST): boolean {
    return (
      other instanceof Main &&
      this.statements.length === other.statements.length &&
      this.statements.every((statement, i) =>
        statement.equals(other.statements[i])
      )
    );
  }
}
