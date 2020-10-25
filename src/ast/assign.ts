import { AST } from '../types';

export class Assign implements AST {
  constructor(public name: string, public value: AST) {}

  emit() {
    // TODO
  }

  equals(other: AST): boolean {
    return (
      other instanceof Assign &&
      other.name === this.name &&
      this.value.equals(other.value)
    );
  }
}
