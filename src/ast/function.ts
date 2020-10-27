import { AST } from '../ast';
import { Visitor } from '../visitor';

export class Function implements AST {
  constructor(
    public name: string,
    public parameters: string[],
    public body: AST
  ) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitFunction(this);
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
