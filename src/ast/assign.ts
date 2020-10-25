import { Equality } from '../types';

export class Assign implements Equality {
  constructor(public name: string, public value: Equality) {}

  equals(other: Equality): boolean {
    return (
      other instanceof Assign &&
      other.name === this.name &&
      this.value.equals(other.value)
    );
  }
}
