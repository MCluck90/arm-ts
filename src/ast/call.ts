import { emit } from '../emit';
import { AST } from '../types';

export class Call implements AST {
  constructor(public callee: string, public args: AST[]) {}

  emit() {
    switch (this.args.length) {
      case 0:
        emit(`  bl ${this.callee}`);
        break;

      case 1:
        this.args[0].emit();
        emit(`  bl ${this.callee}`);
        break;

      case 2:
      case 3:
      case 4:
        emit(`  sub sp, sp, #16`);
        this.args.forEach((arg, i) => {
          arg.emit();
          emit(`  str r0, [sp, #${4 * i}]`);
        });
        emit(`  pop {r0, r1, r2, r3}`);
        emit(`  bl ${this.callee}`);
        break;

      default:
        throw new Error('More than 4 arguments is not supported');
    }
  }

  equals(other: AST): boolean {
    return (
      other instanceof Call &&
      this.callee === other.callee &&
      this.args.length === other.args.length &&
      this.args.every((arg, i) => arg.equals(other.args[i]))
    );
  }
}
