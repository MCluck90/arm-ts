import { Equality } from '../types';

export class Return implements Equality {
  constructor(public term: Equality) {}

  equals(other: Equality): boolean {
    return other instanceof Return && other.term.equals(this.term);
  }
}
