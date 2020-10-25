import { Equality } from '../types';

export class Not implements Equality {
  constructor(public term: Equality) {}

  equals(other: Equality): boolean {
    return other instanceof Not && other.term === this.term;
  }
}

export class Equal implements Equality {
  constructor(public left: Equality, public right: Equality) {}

  equals(other: Equality): boolean {
    return (
      other instanceof Equal &&
      this.left.equals(other.left) &&
      this.right.equals(other.right)
    );
  }
}

export class NotEqual implements Equality {
  constructor(public left: Equality, public right: Equality) {}

  equals(other: Equality): boolean {
    return (
      other instanceof NotEqual &&
      this.left.equals(other.left) &&
      this.right.equals(other.right)
    );
  }
}

export class Add implements Equality {
  constructor(public left: Equality, public right: Equality) {}

  equals(other: Equality): boolean {
    return (
      other instanceof Add &&
      this.left.equals(other.left) &&
      this.right.equals(other.right)
    );
  }
}

export class Subtract implements Equality {
  constructor(public left: Equality, public right: Equality) {}

  equals(other: Equality): boolean {
    return (
      other instanceof Subtract &&
      this.left.equals(other.left) &&
      this.right.equals(other.right)
    );
  }
}

export class Multiply implements Equality {
  constructor(public left: Equality, public right: Equality) {}

  equals(other: Equality): boolean {
    return (
      other instanceof Multiply &&
      this.left.equals(other.left) &&
      this.right.equals(other.right)
    );
  }
}

export class Divide implements Equality {
  constructor(public left: Equality, public right: Equality) {}

  equals(other: Equality): boolean {
    return (
      other instanceof Divide &&
      this.left.equals(other.left) &&
      this.right.equals(other.right)
    );
  }
}

export interface InfixOperatorConstructor {
  new (left: Equality, right: Equality):
    | Equal
    | NotEqual
    | Add
    | Subtract
    | Multiply
    | Divide;
}
