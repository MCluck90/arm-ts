import { emit } from '../emit';
import { Label } from '../label';
import { AST } from '../ast';
import { Environment } from '../environment';

export class If implements AST {
  constructor(
    public conditional: AST,
    public consequence: AST,
    public alternative: AST
  ) {}

  emit(env: Environment) {
    const ifFalseLabel = new Label();
    const endIfLabel = new Label();
    this.conditional.emit(env);
    emit(`  cmp r0, #0`);
    emit(`  beq ${ifFalseLabel}`);
    this.consequence.emit(env);
    emit(`  b ${endIfLabel}`);
    emit(`${ifFalseLabel}:`);
    this.alternative.emit(env);
    emit(`${endIfLabel}:`);
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
