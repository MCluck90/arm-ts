import { Visitor } from '../visitor';
import { AST } from './ast';

export class Undefined implements AST {
  constructor() {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitUndefined(this);
  }

  equals(other: AST): boolean {
    return other instanceof Undefined;
  }
}
