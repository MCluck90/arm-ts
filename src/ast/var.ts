import { AST } from '../ast';
import { Visitor } from '../visitor';

export class Var implements AST {
  constructor(public name: string, public value: AST) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitVar(this);
  }

  equals(other: AST): boolean {
    return (
      other instanceof Var &&
      other.name === this.name &&
      this.value.equals(other.value)
    );
  }
}
