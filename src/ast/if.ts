import { emit } from '../emit';
import { Label } from '../label';
import { AST } from '../types';

export class If implements AST {
  constructor(
    public conditional: AST,
    public consequence: AST,
    public alternative: AST
  ) {}

  emit() {
    const ifFalseLabel = new Label();
    const endIfLabel = new Label();
    this.conditional.emit();
    emit(`  cmp r0, #0`);
    emit(`  beq ${ifFalseLabel}`);
    this.consequence.emit();
    emit(`  b ${endIfLabel}`);
    emit(`${ifFalseLabel}:`);
    this.alternative.emit();
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
