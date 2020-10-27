import { Visitor } from '../visitor';
import { AST } from './ast';

export class Length implements AST {
  constructor(public array: AST) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitLength(this);
  }

  equals(other: AST): boolean {
    return other instanceof Length && other.array.equals(this.array);
  }
}
