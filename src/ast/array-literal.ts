import { Visitor } from '../visitor';
import { AST } from './ast';

export class ArrayLiteral implements AST {
  constructor(public elements: AST[]) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitArrayLiteral(this);
  }

  equals(other: AST): boolean {
    return (
      other instanceof ArrayLiteral &&
      other.elements.length === this.elements.length &&
      other.elements.every((arg, i) => arg.equals(this.elements[i]))
    );
  }
}
