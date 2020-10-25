import { Equality } from '../types';

export class Var implements Equality {
  constructor(public name: string, public value: Equality) {}

  equals(other: Equality): boolean {
    return (
      other instanceof Var &&
      other.name === this.name &&
      this.value.equals(other.value)
    );
  }
}
