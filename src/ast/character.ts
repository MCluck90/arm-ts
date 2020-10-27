import { AST } from '../ast';
import { Visitor } from '../visitor';

export class Character implements AST {
  constructor(public value: string) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitCharacter(this);
  }

  equals(other: AST): boolean {
    return other instanceof Character && other.value === this.value;
  }
}
