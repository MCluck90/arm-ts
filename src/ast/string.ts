import { AST } from '../ast';
import { Visitor } from '../visitor';

export class String implements AST {
  constructor(public value: string) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitString(this);
  }

  equals(other: AST): boolean {
    return other instanceof String && other.value === this.value;
  }
}
