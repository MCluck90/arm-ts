import { AST } from '../types';

export class Id implements AST {
  constructor(public value: string) {}

  emit() {
    throw new Error('Not yet implemented');
  }

  equals(other: AST): boolean {
    return other instanceof Id && other.value === this.value;
  }
}
