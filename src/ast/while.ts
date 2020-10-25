import { Equality } from '../types';

export class While implements Equality {
  constructor(public conditional: Equality, public body: Equality) {}

  equals(other: Equality): boolean {
    return (
      other instanceof While &&
      this.conditional.equals(other.conditional) &&
      this.body.equals(other.body)
    );
  }
}
