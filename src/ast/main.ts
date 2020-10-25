import { emit } from '../emit';
import { AST } from '../types';

export class Main implements AST {
  constructor(public statements: AST[]) {}

  emit() {
    emit(`.global main`);
    emit(`main:`);
    emit(`  push {fp, lr}`);
    this.statements.forEach((statement) => statement.emit());
    emit(`  mov r0, #0`);
    emit(`  pop {fp, pc}`);
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
