import { Equality } from '../types';

export class If implements Equality {
  constructor(
    public conditional: Equality,
    public consequence: Equality,
    public alternative: Equality
  ) {}

  equals(other: Equality): boolean {
    return (
      other instanceof If &&
      this.conditional.equals(other.conditional) &&
      this.consequence.equals(other.consequence) &&
      this.alternative.equals(other.alternative)
    );
  }
}
