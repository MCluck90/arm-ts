import { AST } from '../ast';

export class Var implements AST {
  constructor(public name: string, public value: AST) {}

  emit() {
    throw new Error('Not yet implemented');
  }

  equals(other: AST): boolean {
    return (
      other instanceof Var &&
      other.name === this.name &&
      this.value.equals(other.value)
    );
  }
}
