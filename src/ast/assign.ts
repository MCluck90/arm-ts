import { AST } from '../ast';
import { Visitor } from '../visitor';

export class Assign implements AST {
  constructor(public name: string, public value: AST) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitAssign(this);
  }

  equals(other: AST): boolean {
    return (
      other instanceof Assign &&
      other.name === this.name &&
      this.value.equals(other.value)
    );
  }
}
