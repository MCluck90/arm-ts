import { Visitor } from '../visitor';
import { AST } from './ast';

export class Untag implements AST {
  constructor(public value: AST) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitUntag(this);
  }

  equals(other: AST): boolean {
    return other instanceof Untag && other.value.equals(this.value);
  }
}
