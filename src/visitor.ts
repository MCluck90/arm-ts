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
} from './ast';

export interface Visitor<T> {
  visitArrayLiteral(node: ArrayLiteral): T;
  visitArrayLookup(node: ArrayLookup): T;
  visitAdd(node: Add): T;
  visitAsm(node: Asm): T;
  visitAssign(node: Assign): T;
  visitBlock(node: Block): T;
  visitBoolean(node: Boolean): T;
  visitCall(node: Call): T;
  visitCharacter(node: Character): T;
  visitDivide(node: Divide): T;
  visitEqual(node: Equal): T;
  visitFor(node: For): T;
  visitFunction(node: Function): T;
  visitGreaterThan(node: GreaterThan): T;
  visitGreaterThanOrEqual(node: GreaterThanOrEqual): T;
  visitId(node: Id): T;
  visitIf(node: If): T;
  visitInteger(node: Integer): T;
  visitLength(node: Length): T;
  visitLessThan(node: LessThan): T;
  visitLessThanOrEqual(node: LessThanOrEqual): T;
  visitMultiply(node: Multiply): T;
  visitNot(node: Not): T;
  visitNotEqual(node: NotEqual): T;
  visitProgram(node: Program): T;
  visitReturn(node: Return): T;
  visitString(node: String): T;
  visitSubtract(node: Subtract): T;
  visitUndefined(node: Undefined): T;
  visitUntag(node: Untag): T;
  visitVar(node: Var): T;
  visitWhile(node: While): T;
}
