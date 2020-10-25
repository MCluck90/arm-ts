import { AST } from '../types';

export class While implements AST {
  constructor(public conditional: AST, public body: AST) {}

  emit() {
    // TODO
  }

  equals(other: AST): boolean {
    return (
      other instanceof While &&
      this.conditional.equals(other.conditional) &&
      this.body.equals(other.body)
    );
  }
}
