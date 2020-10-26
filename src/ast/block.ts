import { AST } from '../ast';
import { Environment } from '../environment';

export class Block implements AST {
  constructor(public statements: AST[]) {}

  emit(env: Environment) {
    this.statements.forEach((statement) => statement.emit(env));
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
