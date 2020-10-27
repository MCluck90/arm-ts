import { Visitor } from '../visitor';
import { AST } from './ast';

export class Boolean implements AST {
  constructor(public value: boolean) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitBoolean(this);
  }

  equals(other: AST): boolean {
    return other instanceof Boolean && other.value === this.value;
  }
}
