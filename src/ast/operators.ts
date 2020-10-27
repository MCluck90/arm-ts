import { AST } from '../ast';
import { Visitor } from '../visitor';

export class Not implements AST {
  constructor(public term: AST) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitNot(this);
  }

  equals(other: AST): boolean {
    return other instanceof Not && other.term === this.term;
  }
}

export class Equal implements AST {
  constructor(public left: AST, public right: AST) {}

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitEqual(this);
  }

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

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitNotEqual(this);
  }

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

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitAdd(this);
  }

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

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitSubtract(this);
  }

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

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitMultiply(this);
  }

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

  visit<T>(visitor: Visitor<T>) {
    return visitor.visitDivide(this);
  }

  equals(other: AST): boolean {
    return (
      other instanceof Divide &&
      this.left.equals(other.left) &&
      this.right.equals(other.right)
    );
  }
}

export interface InfixOperatorConstructor {
  new (left: AST, right: AST):
    | Equal
    | NotEqual
    | Add
    | Subtract
    | Multiply
    | Divide;
}
