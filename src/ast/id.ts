import { AST } from '../ast';
import { Visitor } from '../visitor';

export class Id implements AST {
  constructor(public value: string) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitId(this);
  }

  equals(other: AST): boolean {
    return other instanceof Id && other.value === this.value;
  }
}
