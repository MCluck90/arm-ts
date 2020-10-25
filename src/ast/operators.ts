import { emit } from '../emit';
import { AST } from '../types';

export class Not implements AST {
  constructor(public term: AST) {}

  emit() {
    this.term.emit();
    emit(`  cmp r0, #0`);
    emit(`  moveq r0, #1`);
    emit(`  movne r0, #0`);
  }

  equals(other: AST): boolean {
    return other instanceof Not && other.term === this.term;
  }
}

export class Equal implements AST {
  constructor(public left: AST, public right: AST) {}

  emit() {
    this.left.emit();
    emit(`  push {r0, ip}`);
    this.right.emit();
    emit(`  pop {r1, ip}`);
    emit(`  cmp r0, r1`);
    emit(`  moveq r0, #1`);
    emit(`  movne r0, #0`);
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

  emit() {
    this.left.emit();
    emit(`  push {r0, ip}`);
    this.right.emit();
    emit(`  pop {r1, ip}`);
    emit(`  cmp r0, r1`);
    emit(`  moveq r0, #0`);
    emit(`  movne r0, #1`);
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

  emit() {
    this.left.emit();
    emit(`  push {r0, ip}`);
    this.right.emit();
    emit(`  pop {r1, ip}`);
    emit(`  add r0, r0, r1`);
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

  emit() {
    this.left.emit();
    emit(`  push {r0, ip}`);
    this.right.emit();
    emit(`  pop {r1, ip}`);
    emit(`  sub r0, r1, r0`);
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

  emit() {
    this.left.emit();
    emit(`  push {r0, ip}`);
    this.right.emit();
    emit(`  pop {r1, ip}`);
    emit(`  mul r0, r0, r1`);
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

  emit() {
    this.left.emit();
    emit(`  push {r0, ip}`);
    this.right.emit();
    emit(`  pop {r1, ip}`);
    emit(`  udiv r0, r0, r1`);
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
