import { AST } from './ast';

export class Call implements AST {
  constructor(public callee: string, public args: AST[]) {}

  equals(other: AST): boolean {
    return (
      other instanceof Call &&
      this.callee === other.callee &&
      this.args.length === other.args.length &&
      this.args.every((arg, i) => arg.equals(other.args[i]))
    );
  }
}
