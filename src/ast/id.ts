import { Equality } from '../types';

export class Id implements Equality {
  constructor(public value: string) {}

  equals(other: Equality): boolean {
    return other instanceof Id && other.value === this.value;
  }
}
