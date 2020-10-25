import { Equality } from '../types';

export class Call implements Equality {
  constructor(public callee: string, public args: Equality[]) {}

  equals(other: Equality): boolean {
    return (
      other instanceof Call &&
      this.callee === other.callee &&
      this.args.length === other.args.length &&
      this.args.every((arg, i) => arg.equals(other.args[i]))
    );
  }
}
