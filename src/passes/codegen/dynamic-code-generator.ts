import {
  Add,
  ArrayLiteral,
  ArrayLookup,
  Asm,
  Assign,
  Block,
  Boolean,
  Call,
  Character,
  Divide,
  Equal,
  For,
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
  Program,
  Return,
  String,
  Subtract,
  Undefined,
  Untag,
  Var,
  While,
} from '../../ast';
import { emit } from './emit';
import { Label } from './label';
import { Visitor } from '../../visitor';

const trueBitPattern = 0b111;
const falseBitPattern = 0b110;
const undefinedBitPattern = 0b010;

const tagBitMask = 0b11;
const falsyTag = 0b10;
const arrayTag = 0b01;

const toSmallInteger = (n: number) => n << 2;

export class DynamicCodeGenerator implements Visitor<void> {
  constructor(
    public locals: Map<string, number> = new Map(),
    public nextLocalOffset: number = 0
  ) {}

  private emitCompareFalsy() {
    emit(`  cmp r0, #0`);
    emit(`  andne r0, r0, #${tagBitMask}`);
    emit(`  cmpne r0, #${falsyTag}`);
  }

  visitArrayLiteral(node: ArrayLiteral) {
    const { length } = node.elements;
    emit(`  push {r4, ip}`);
    emit(`  ldr r0, =${4 * (length + 1)}`);
    emit(`  bl malloc`);
    emit(`  mov r4, r0`);
    emit(`  ldr r0, =${toSmallInteger(length)}`);
    emit(`  str r0, [r4]`);
    node.elements.forEach((element, i) => {
      element.visit(this);
      emit(`  str r0, [r4, #${4 * (i + 1)}]`);
    });
    emit(`  mov r0, r4`);
    emit(`  orr r0, r0, #${arrayTag}`);
    emit(`  pop {r4, ip}`);
  }

  visitArrayLookup(node: ArrayLookup) {
    node.array.visit(this);
    emit(`  bic r0, r0, #${arrayTag}`); // Remove tag
    emit(`  push {r0, ip}`);
    node.index.visit(this);
    emit(`  pop {r1, ip}`);
    // r0 = index, r1 = array, r2 = array length
    emit(`  ldr r2, [r1], #4`);
    emit(`  cmp r0, r2`);
    emit(`  movhs r0, #${undefinedBitPattern}`);
    emit(`  ldrlo r0, [r1, r0]`);
  }

  visitAdd(node: Add) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);

    // Are both small integers?
    emit(`  orr r2, r0, r1`);
    emit(`  and r2, r2, #${tagBitMask}`);
    emit(`  cmp r2, #0`);

    emit(`  addeq r0, r1, r0`);
    emit(`  movne r0, #${undefinedBitPattern}`);
  }

  visitAsm(node: Asm) {
    emit(node.value);
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
    if (node.value) {
      emit(`  mov r0, #${trueBitPattern}`);
    } else {
      emit(`  mov r0, #${falseBitPattern}`);
    }
  }

  visitCall(node: Call) {
    // TODO: Make this smarter
    const isCFunction = ['putchar'].includes(node.callee);
    switch (node.args.length) {
      case 0:
        emit(`  bl ${node.callee}`);
        break;

      case 1:
        if (isCFunction) {
          new Untag(node.args[0]).visit(this);
        } else {
          node.args[0].visit(this);
        }
        emit(`  bl ${node.callee}`);
        break;

      case 2:
      case 3:
      case 4:
        emit(`  sub sp, sp, #16`);
        node.args.forEach((arg, i) => {
          if (isCFunction) {
            new Untag(node.args[0]).visit(this);
          }
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
    emit(`  ldr r0, =${toSmallInteger(node.value.charCodeAt(0))}`);
  }

  visitDivide(node: Divide) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);

    // Are both small integers?
    emit(`  orr r2, r0, r1`);
    emit(`  and r2, r2, #${tagBitMask}`);
    emit(`  cmp r2, #0`);

    emit(`  udiveq r0, r1, r0`);
    emit(`  movne r0, #${undefinedBitPattern}`);
  }

  visitEqual(node: Equal) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);
    emit(`  cmp r0, r1`);
    emit(`  moveq r0, #${trueBitPattern}`);
    emit(`  movne r0, #${falseBitPattern}`);
  }

  visitFor(node: For) {
    node.initializer?.visit(this);

    const startLoop = new Label();
    const endLoop = new Label();

    emit(`${startLoop}:`);

    node.conditional.visit(this);
    this.emitCompareFalsy();
    emit(`  beq ${endLoop}`);
    node.body.visit(this);
    node.postBodyStatement?.visit(this);
    emit(`  b ${startLoop}`);

    emit(`${endLoop}:`);
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
    emit(`  mov r0, #${undefinedBitPattern}`);
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
    return new DynamicCodeGenerator(locals, -maxOffset - 4);
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
    this.emitCompareFalsy();
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
    emit(`  ldr r0, =${toSmallInteger(node.value)}`);
  }

  visitLength(node: Length) {
    node.array.visit(this);
    emit(`  ldr r0, [r0, #-1]`);
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

    // Are both small integers?
    emit(`  orr r2, r0, r1`);
    emit(`  and r2, r2, #${tagBitMask}`);
    emit(`  cmp r2, #0`);

    emit(`  muleq r0, r1, r0`);
    emit(`  lsr r0, r0, #2`);
    emit(`  movne r0, #${undefinedBitPattern}`);
  }

  visitNot(node: Not) {
    node.term.visit(this);
    this.emitCompareFalsy();
    emit(`  moveq r0, #${trueBitPattern}`);
    emit(`  movne r0, #${falseBitPattern}`);
  }

  visitNotEqual(node: NotEqual) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);
    emit(`  cmp r0, r1`);
    emit(`  moveq r0, #${trueBitPattern}`);
    emit(`  movne r0, #${falseBitPattern}`);
  }

  visitProgram(node: Program) {
    node.statements.forEach((statement) => statement.visit(this));
  }

  visitReturn(node: Return) {
    node.term.visit(this);
    emit(`  mov sp, fp`);
    emit(`  pop {fp, pc}`);
  }

  visitString(node: String) {
    this.visitArrayLiteral(
      new ArrayLiteral(node.value.split('').map((c) => new Character(c)))
    );
  }

  visitSubtract(node: Subtract) {
    node.left.visit(this);
    emit(`  push {r0, ip}`);
    node.right.visit(this);
    emit(`  pop {r1, ip}`);

    // Are both small integers?
    emit(`  orr r2, r0, r1`);
    emit(`  and r2, r2, #${tagBitMask}`);
    emit(`  cmp r2, #0`);

    emit(`  subeq r0, r1, r0`);
    emit(`  movne r0, #${undefinedBitPattern}`);
  }

  visitUndefined(_node: Undefined) {
    emit(`  mov r0, #${undefinedBitPattern}`);
  }

  visitUntag(node: Untag) {
    node.value.visit(this);
    emit(`  lsr r0, r0, #2`);
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
    this.emitCompareFalsy();
    emit(`  beq ${loopEnd}`);
    node.body.visit(this);
    emit(`  b ${loopStart}`);
    emit(`${loopEnd}:`);
  }
}
