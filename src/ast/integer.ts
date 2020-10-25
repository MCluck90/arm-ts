import { AST } from './ast';

export class Integer implements AST {
  constructor(public value: number) {}

  equals(other: AST): boolean {
    return other instanceof Integer && other.value === this.value;
  }
}
