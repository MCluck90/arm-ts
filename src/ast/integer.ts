import { AST } from '../ast';
import { Visitor } from '../visitor';

export class Integer implements AST {
  constructor(public value: number) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitInteger(this);
  }

  equals(other: AST): boolean {
    return other instanceof Integer && other.value === this.value;
  }
}
