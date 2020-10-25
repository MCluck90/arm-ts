import { AST } from '../types';

export class Function implements AST {
  constructor(
    public name: string,
    public parameters: string[],
    public body: AST
  ) {}

  emit() {
    throw new Error('Not yet implemented');
  }

  equals(other: AST): boolean {
    return (
      other instanceof Function &&
      other.name === this.name &&
      other.parameters.length === this.parameters.length &&
      this.parameters.every((param, i) => param === other.parameters[i]) &&
      this.body.equals(other.body)
    );
  }
}
