import { Visitor } from '../visitor';
import { AST } from './ast';

export class Null implements AST {
  constructor() {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitNull(this);
  }

  equals(other: AST): boolean {
    return other instanceof Null;
  }
}
