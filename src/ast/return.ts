import { AST } from '../ast';
import { emit } from '../emit';
import { Environment } from '../environment';

export class Return implements AST {
  constructor(public term: AST) {}

  emit(env: Environment) {
    this.term.emit(env);
    emit(`  mov sp, fp`);
    emit(`  pop {fp, pc}`);
  }

  equals(other: AST): boolean {
    return other instanceof Return && other.term.equals(this.term);
  }
}
