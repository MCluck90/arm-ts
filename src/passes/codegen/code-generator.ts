import {
  Add,
  ArrayLiteral,
  ArrayLookup,
  Assign,
  Block,
  Boolean,
  Call,
  Character,
  Divide,
  Equal,
  Function,
  GreaterThan,
  GreaterThanOrEqual,
  Id,
  If,
  Integer,
  Length,
  LessThan,
  LessThanOrEqual,
  Multiply,
  Not,
  NotEqual,
  Return,
  Subtract,
  Undefined,
  Var,
  While,
} from '../../ast';
import { emit } from './emit';
import { Label } from './label';
import { Visitor } from '../../visitor';

export class CodeGenerator implements Visitor<void> {
  constructor(
    public locals: Map<string, number> = new Map(),
    public nextLocalOffset: number = 0
  ) {}

  visitArrayLiteral(node: ArrayLiteral) {
    const { length } = node.elements;
    emit(`  ldr r0, =${4 * (length + 1)}`);
    emit(`  bl malloc`);
    emit(`  push {r4, ip}`);
    emit(`  mov r4, r0`);
    emit(`  ldr r0, =${length}`);
    emit(`  str r0, [r4]`);
    node.elements.forEach((element, i) => {
      element.visit(this);
      emit(`  str r0, [r4, #${4 * (i + 1)}]`);
    });
    emit(`  mov r0, r4`);
    emit(`  pop {r4, ip}`);
  }

  visitArrayLookup(node: ArrayLookup) {
    node.array.visit(this);
    emit(`  push {r0, ip}`);
    node.index.visit(this);
    emit(`  pop {r1, ip}`);
    emit(`  ldr r2, [r1]`);
    emit(`  cmp r0, r2`);
    emit(`  movhs r0, #0`);
    emit(`  addlo r1, r1, #4`);
    emit(`  lsllo r0, r0, #2`);
    emit(`  ldrlo r0, [r1, r0]`);
  }

  visitAdd(node: Add) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);
    emit(`  add r0, r0, r1`);
  }

  visitAssign(node: Assign) {
    node.value.visit(this);
    const offset = this.locals.get(node.name);
    if (offset) {
      emit(`  str r0, [fp, #${offset}]`);
    } else {
      throw new Error(`Undefined variable: ${node.name}`);
    }
  }

  visitBlock(node: Block) {
    node.statements.forEach((statement) => statement.visit(this));
  }

  visitBoolean(node: Boolean) {
    emit(`  mov r0, #${+node.value}`);
  }

  visitCall(node: Call) {
    switch (node.args.length) {
      case 0:
        emit(`  bl ${node.callee}`);
        break;

      case 1:
        node.args[0].visit(this);
        emit(`  bl ${node.callee}`);
        break;

      case 2:
      case 3:
      case 4:
        emit(`  sub sp, sp, #16`);
        node.args.forEach((arg, i) => {
          arg.visit(this);
          emit(`  str r0, [sp, #${4 * i}]`);
        });
        emit(`  pop {r0, r1, r2, r3}`);
        emit(`  bl ${node.callee}`);
        break;

      default:
        throw new Error('More than 4 arguments is not supported');
    }
  }

  visitCharacter(node: Character) {
    emit(`  ldr r0, =${node.value.charCodeAt(0)}`);
  }

  visitDivide(node: Divide) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);
    emit(`  udiv r0, r0, r1`);
  }

  visitEqual(node: Equal) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);
    emit(`  cmp r0, r1`);
    emit(`  moveq r0, #1`);
    emit(`  movne r0, #0`);
  }

  visitFunction(node: Function) {
    if (node.signature.parameters.size > 4) {
      throw new Error('More than 4 parameters is not supported');
    }

    emit(``);
    emit(`.global ${node.name}`);
    emit(`${node.name}:`);
    this.functionPrologue(node);
    const visitor = this.setupFunctionEnvironment(node);
    node.body.visit(visitor);
    this.functionEpilogue();
  }

  private functionPrologue(node: Function) {
    emit(`  push {fp, lr}`);
    emit(`  mov fp, sp`);

    const registers = new Array(node.signature.parameters.size)
      .fill(0)
      .map((_, i) => `r${i}`);
    if (registers.length % 2 === 1) {
      registers.push('ip');
    }
    if (registers.length > 0) {
      emit(`  push {${registers.join(', ')}}`);
    }
  }

  private functionEpilogue() {
    emit(`  mov sp, fp`);
    emit(`  mov r0, #0`);
    emit(`  pop {fp, pc}`);
  }

  private setupFunctionEnvironment(node: Function) {
    const locals = new Map();
    const params = Array.from(node.signature.parameters.keys());
    const numOfParams = params.length;
    const maxOffset = (numOfParams + (numOfParams % 2)) * 4;
    params.forEach((parameter, i) => {
      locals.set(parameter, 4 * i - maxOffset);
    });
    return new CodeGenerator(locals, -maxOffset - 4);
  }

  visitGreaterThan(node: GreaterThan) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);
    emit(`  cmp r1, r0`);
    emit(`  movgt r0, #1`);
    emit(`  movle r0, #0`);
  }

  visitGreaterThanOrEqual(node: GreaterThanOrEqual) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);
    emit(`  cmp r1, r0`);
    emit(`  movge r0, #1`);
    emit(`  movlt r0, #0`);
  }

  visitId(node: Id) {
    const offset = this.locals.get(node.value);
    if (offset) {
      emit(`  ldr r0, [fp, #${offset}]`);
    } else {
      throw new Error(`Undefined variable: ${node.value}`);
    }
  }

  visitIf(node: If) {
    const ifFalseLabel = new Label();
    const endIfLabel = new Label();
    node.conditional.visit(this);
    emit(`  cmp r0, #0`);
    if (node.alternative) {
      emit(`  beq ${ifFalseLabel}`);
    } else {
      emit(`  beq ${endIfLabel}`);
    }
    node.consequence.visit(this);
    emit(`  b ${endIfLabel}`);
    if (node.alternative) {
      emit(`${ifFalseLabel}:`);
      node.alternative.visit(this);
    }
    emit(`${endIfLabel}:`);
  }

  visitInteger(node: Integer) {
    emit(`  ldr r0, =${node.value}`);
  }

  visitLength(node: Length) {
    node.array.visit(this);
    emit(`  ldr r0, [r0, #0]`);
  }

  visitLessThan(node: LessThan) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);
    emit(`  cmp r1, r0`);
    emit(`  movlt r0, #1`);
    emit(`  movge r0, #0`);
  }

  visitLessThanOrEqual(node: LessThanOrEqual) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);
    emit(`  cmp r1, r0`);
    emit(`  movle r0, #1`);
    emit(`  movgt r0, #0`);
  }

  visitMultiply(node: Multiply) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);
    emit(`  mul r0, r0, r1`);
  }

  visitNot(node: Not) {
    node.term.visit(this);
    emit(`  cmp r0, #0`);
    emit(`  moveq r0, #1`);
    emit(`  movne r0, #0`);
  }

  visitNotEqual(node: NotEqual) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);
    emit(`  cmp r0, r1`);
    emit(`  moveq r0, #0`);
    emit(`  movne r0, #1`);
  }

  visitReturn(node: Return) {
    node.term.visit(this);
    emit(`  mov sp, fp`);
    emit(`  pop {fp, pc}`);
  }

  visitSubtract(node: Subtract) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);
    emit(`  sub r0, r1, r0`);
  }

  visitUndefined(_node: Undefined) {
    emit(`  mov r0, #0`);
  }

  visitVar(node: Var) {
    // OPTIMIZE: Avoid wasting stack space
    node.value.visit(this);
    emit(`  push {r0, ip}`);
    this.locals.set(node.name, this.nextLocalOffset - 4);
    this.nextLocalOffset -= 8;
  }

  visitWhile(node: While) {
    const loopStart = new Label();
    const loopEnd = new Label();

    emit(`${loopStart}:`);
    node.conditional.visit(this);
    emit(`  cmp r0, #0`);
    emit(`  beq ${loopEnd}`);
    node.body.visit(this);
    emit(`  b ${loopStart}`);
    emit(`${loopEnd}:`);
  }
}
