import { Equality } from '../types';

export class Block implements Equality {
  constructor(public statements: Equality[]) {}

  equals(other: Equality): boolean {
    return (
      other instanceof Block &&
      other.statements.length === this.statements.length &&
      this.statements.every((statement, i) =>
        statement.equals(other.statements[i])
      )
    );
  }
}
