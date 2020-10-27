import { Visitor } from '../visitor';
import { AST } from './ast';

export class ArrayLookup implements AST {
  constructor(public array: AST, public index: AST) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitArrayLookup(this);
  }

  equals(other: AST): boolean {
    return (
      other instanceof ArrayLookup &&
      other.array.equals(this.array) &&
      other.index.equals(this.index)
    );
  }
}
