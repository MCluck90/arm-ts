import { AST } from './ast';

export class Not implements AST {
  constructor(public term: AST) {}

  equals(other: AST): boolean {
    return other instanceof Not && other.term === this.term;
  }
}

export class Equal implements AST {
  constructor(public left: AST, public right: AST) {}

  equals(other: AST): boolean {
    return (
      other instanceof Equal &&
      this.left.equals(other.left) &&
      this.right.equals(other.right)
    );
  }
}

export class NotEqual implements AST {
  constructor(public left: AST, public right: AST) {}

  equals(other: AST): boolean {
    return (
      other instanceof NotEqual &&
      this.left.equals(other.left) &&
      this.right.equals(other.right)
    );
  }
}

export class Add implements AST {
  constructor(public left: AST, public right: AST) {}

  equals(other: AST): boolean {
    return (
      other instanceof Add &&
      this.left.equals(other.left) &&
      this.right.equals(other.right)
    );
  }
}

export class Subtract implements AST {
  constructor(public left: AST, public right: AST) {}

  equals(other: AST): boolean {
    return (
      other instanceof Subtract &&
      this.left.equals(other.left) &&
      this.right.equals(other.right)
    );
  }
}

export class Multiply implements AST {
  constructor(public left: AST, public right: AST) {}

  equals(other: AST): boolean {
    return (
      other instanceof Multiply &&
      this.left.equals(other.left) &&
      this.right.equals(other.right)
    );
  }
}

export class Divide implements AST {
  constructor(public left: AST, public right: AST) {}

  equals(other: AST): boolean {
    return (
      other instanceof Divide &&
      this.left.equals(other.left) &&
      this.right.equals(other.right)
    );
  }
}
