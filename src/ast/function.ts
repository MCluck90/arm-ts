import { AST, FunctionType } from '../ast';
import { Visitor } from '../visitor';

export class Function implements AST {
  constructor(
    public name: string,
    public signature: FunctionType,
    public body: AST
  ) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitFunction(this);
  }

  equals(other: AST): boolean {
    return (
      other instanceof Function &&
      other.name === this.name &&
      other.signature.equals(this.signature) &&
      this.body.equals(other.body)
    );
  }
}
