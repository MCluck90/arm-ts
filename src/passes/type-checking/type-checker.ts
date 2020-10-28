import {
  Add,
  ArrayLiteral,
  ArrayLookup,
  ArrayType,
  Assign,
  Block,
  Boolean,
  BooleanType,
  Call,
  Character,
  Divide,
  Equal,
  Function,
  FunctionType,
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
  Null,
  NumberType,
  Return,
  Subtract,
  Type,
  Undefined,
  Var,
  VoidType,
  While,
} from '../../ast';
import { Visitor } from '../../visitor';

function assertType(expected: Type, got: Type) {
  if (!expected.equals(got)) {
    throw new TypeError(`Expected ${expected}, but got ${got}`);
  }
}

export class TypeChecker implements Visitor<Type> {
  constructor(
    public locals: Map<string, Type> = new Map(),
    public functions: Map<string, FunctionType> = new Map(),
    public currentFunctionReturnType: Type | null = null
  ) {}

  visitArrayLiteral(node: ArrayLiteral): Type {
    if (node.elements.length === 0) {
      throw new TypeError("Can't infer type of an empty array");
    }
    const elementTypes = node.elements.map((elem) => elem.visit(this));
    const type = elementTypes.reduce((prev, next) => {
      assertType(prev, next);
      return prev;
    });
    return new ArrayType(type);
  }

  visitArrayLookup(node: ArrayLookup): Type {
    assertType(new NumberType(), node.index.visit(this));
    const type = node.array.visit(this);
    if (type instanceof ArrayType) {
      return type.element;
    } else {
      throw new TypeError(`Expected an array, but got ${type}`);
    }
  }

  visitAdd(node: Add): Type {
    assertType(new NumberType(), node.left.visit(this));
    assertType(new NumberType(), node.right.visit(this));
    return new NumberType();
  }

  visitAssign(node: Assign): Type {
    const variableType = this.locals.get(node.name);
    if (!variableType) {
      throw new Error(`Assignment to an undefined variable: ${node.name}`);
    }
    const valueType = node.value.visit(this);
    assertType(variableType, valueType);
    return variableType;
  }

  visitBlock(node: Block): Type {
    node.statements.forEach((statement) => statement.visit(this));
    return new VoidType();
  }

  visitBoolean(_node: Boolean): Type {
    return new BooleanType();
  }

  visitCall(node: Call): Type {
    const expected = this.functions.get(node.callee);
    if (!expected) {
      throw new TypeError(`Function ${node.callee} is not defined`);
    }

    const argTypes = new Map(
      node.args.map((arg, i) => [`x${i}`, arg.visit(this)])
    );
    const got = new FunctionType(argTypes, expected.returnType);
    try {
      assertType(expected, got);
    } catch (e) {
      throw new Error(`Error calling ${node.callee}:\n${e.message}`);
    }
    return expected.returnType;
  }

  visitCharacter(_node: Character): Type {
    return new NumberType();
  }

  visitDivide(node: Divide): Type {
    assertType(new NumberType(), node.left.visit(this));
    assertType(new NumberType(), node.right.visit(this));
    return new NumberType();
  }

  visitEqual(node: Equal): Type {
    const leftType = node.left.visit(this);
    const rightType = node.right.visit(this);
    assertType(leftType, rightType);
    return new BooleanType();
  }

  visitFunction(node: Function): Type {
    this.functions.set(node.name, node.signature);
    const visitor = new TypeChecker(
      new Map(node.signature.parameters),
      this.functions,
      node.signature.returnType
    );
    node.body.visit(visitor);
    return new VoidType();
  }

  visitGreaterThan(node: GreaterThan): Type {
    assertType(new NumberType(), node.left.visit(this));
    assertType(new NumberType(), node.right.visit(this));
    return new BooleanType();
  }

  visitGreaterThanOrEqual(node: GreaterThanOrEqual): Type {
    assertType(new NumberType(), node.left.visit(this));
    assertType(new NumberType(), node.right.visit(this));
    return new BooleanType();
  }

  visitId(node: Id): Type {
    const type = this.locals.get(node.value);
    if (!type) {
      throw new TypeError(`Undefined variable: ${node.value}`);
    }
    return type;
  }

  visitIf(node: If): Type {
    node.conditional.visit(this);
    node.consequence.visit(this);
    if (node.alternative) {
      node.alternative.visit(this);
    }
    return new VoidType();
  }

  visitInteger(_node: Integer): Type {
    return new NumberType();
  }

  visitLength(node: Length): Type {
    const type = node.array.visit(this);
    if (type instanceof ArrayType) {
      return new NumberType();
    } else {
      throw new TypeError(`Expected an array, but got ${type}`);
    }
  }

  visitLessThan(node: LessThan): Type {
    assertType(new NumberType(), node.left.visit(this));
    assertType(new NumberType(), node.right.visit(this));
    return new BooleanType();
  }

  visitLessThanOrEqual(node: LessThanOrEqual): Type {
    assertType(new NumberType(), node.left.visit(this));
    assertType(new NumberType(), node.right.visit(this));
    return new BooleanType();
  }

  visitMultiply(node: Multiply): Type {
    assertType(new NumberType(), node.left.visit(this));
    assertType(new NumberType(), node.right.visit(this));
    return new NumberType();
  }

  visitNot(node: Not): Type {
    assertType(new BooleanType(), node.term.visit(this));
    return new BooleanType();
  }

  visitNotEqual(node: NotEqual): Type {
    assertType(new NumberType(), node.left.visit(this));
    assertType(new NumberType(), node.right.visit(this));
    return new BooleanType();
  }

  visitNull(_node: Null): Type {
    return new VoidType();
  }

  visitReturn(node: Return): Type {
    const type = node.term.visit(this);
    if (this.currentFunctionReturnType) {
      assertType(this.currentFunctionReturnType, type);
      return new VoidType();
    } else {
      throw new TypeError('Encountered return statement outside any function');
    }
  }

  visitSubtract(node: Subtract): Type {
    assertType(new NumberType(), node.left.visit(this));
    assertType(new NumberType(), node.right.visit(this));
    return new NumberType();
  }

  visitUndefined(node: Undefined): Type {
    return new VoidType();
  }

  visitVar(node: Var): Type {
    const type = node.value.visit(this);
    this.locals.set(node.name, type);
    return new VoidType();
  }

  visitWhile(node: While): Type {
    node.conditional.visit(this);
    node.body.visit(this);
    return new VoidType();
  }
}
