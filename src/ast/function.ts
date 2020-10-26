import { emit } from '../emit';
import { AST } from '../ast';
import { Environment } from '../environment';

export class Function implements AST {
  constructor(
    public name: string,
    public parameters: string[],
    public body: AST
  ) {}

  emit(_: Environment) {
    if (this.parameters.length > 4) {
      throw new Error('More than 4 parameters is not supported');
    }

    emit(``);
    emit(`.global ${this.name}`);
    emit(`${this.name}:`);
    this.emitPrologue();
    const env = this.setupEnvironment();
    this.body.emit(env);
    this.emitEpilogue();
  }

  emitPrologue() {
    emit(`  push {fp, lr}`);
    emit(`  mov fp, sp`);

    const registers = new Array(this.parameters.length)
      .fill(0)
      .map((_, i) => `r${i}`);
    if (registers.length % 2 === 1) {
      registers.push('ip');
    }
    if (registers.length > 0) {
      emit(`  push {${registers.join(', ')}}`);
    }
  }

  emitEpilogue() {
    emit(`  mov sp, fp`);
    emit(`  mov r0, #0`);
    emit(`  pop {fp, pc}`);
  }

  setupEnvironment() {
    const locals = new Map();
    this.parameters.forEach((parameter, i) => {
      locals.set(parameter, 4 * i - 16);
    });
    return new Environment(locals);
  }

  equals(other: AST): boolean {
    return (
      other instanceof Function &&
      other.name === this.name &&
      other.parameters.length === this.parameters.length &&
      this.parameters.every((param, i) => param === other.parameters[i]) &&
      this.body.equals(other.body)
    );
  }
}
