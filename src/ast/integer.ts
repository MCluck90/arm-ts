import { Equality } from '../types';

export class Integer implements Equality {
  constructor(public value: number) {}

  equals(other: Equality): boolean {
    return other instanceof Integer && other.value === this.value;
  }
}
