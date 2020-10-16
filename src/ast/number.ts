import { AST } from './ast';

export class Number implements AST {
  constructor(public value: number) {}

  equals(other: AST): boolean {
    return other instanceof Number && other.value === this.value;
  }
}
