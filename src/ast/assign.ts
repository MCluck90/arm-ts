import { AST } from './ast';

export class Assign implements AST {
  constructor(public name: string, public value: AST) {}

  equals(other: AST): boolean {
    return (
      other instanceof Assign &&
      other.name === this.name &&
      this.value.equals(other.value)
    );
  }
}
