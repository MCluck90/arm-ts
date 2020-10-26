import { AST } from '../ast';
import { emit } from '../emit';
import { Environment } from '../environment';
import { Label } from '../label';

export class While implements AST {
  constructor(public conditional: AST, public body: AST) {}

  emit(env: Environment) {
    const loopStart = new Label();
    const loopEnd = new Label();

    emit(`${loopStart}:`);
    this.conditional.emit(env);
    emit(`  cmp r0, #0`);
    emit(`  beq ${loopEnd}`);
    this.body.emit(env);
    emit(`  b ${loopStart}`);
    emit(`${loopEnd}:`);
  }

  equals(other: AST): boolean {
    return (
      other instanceof While &&
      this.conditional.equals(other.conditional) &&
      this.body.equals(other.body)
    );
  }
}
