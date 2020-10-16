import { AST } from './ast';

export class Id implements AST {
  constructor(public value: string) {}

  equals(other: AST): boolean {
    return other instanceof Id && other.value === this.value;
  }
}
