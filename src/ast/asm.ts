import { AST } from '../ast';
import { Visitor } from '../visitor';

export class Asm implements AST {
  constructor(public value: string) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitAsm(this);
  }

  equals(other: AST): boolean {
    return other instanceof Asm && other.value === this.value;
  }
}
