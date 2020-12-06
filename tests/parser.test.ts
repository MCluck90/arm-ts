import { ParseError } from 'parsnip-ts/error';
import {
  Add,
  ArrayLiteral,
  ArrayLookup,
  ArrayType,
  Asm,
  Assign,
  Block,
  Boolean,
  BooleanType,
  Call,
  Character,
  Equal,
  For,
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
  NumberType,
  Program,
  Return,
  String,
  Subtract,
  Undefined,
  Var,
  VoidType,
  While,
} from '../src/ast';
import { parser } from '../src/parser';

function assertSuccessfulParse<T>(result: T | ParseError): asserts result is T {
  if (result instanceof ParseError) {
    throw result;
  }
}

test('Can parse factorial function', () => {
  const source = `
    function factorial(n) {
      var result = 1;
      while (n != 1) {
        result = result * n;
        n = n - 1;
      }
      return result;
    }
  `;
  const expected = new Program([
    new Function(
      'factorial',
      new FunctionType(new Map([['n', new NumberType()]]), new NumberType()),
      new Block([
        new Var('result', new Integer(1)),
        new While(
          new NotEqual(new Id('n'), new Integer(1)),
          new Block([
            new Assign('result', new Multiply(new Id('result'), new Id('n'))),
            new Assign('n', new Subtract(new Id('n'), new Integer(1))),
          ])
        ),
        new Return(new Id('result')),
      ])
    ),
  ]);
  const result = parser.parseToEnd(source);
  assertSuccessfulParse(result);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can parse a character', () => {
  const source = `
    function outputChar() {
      'A';
      "A";
      '"';
      "'";
      ' ';
      " ";
    }
  `;
  const expected = new Program([
    new Function(
      'outputChar',
      new FunctionType(new Map(), new NumberType()),
      new Block([
        new Character('A'),
        new Character('A'),
        new Character('"'),
        new Character("'"),
        new Character(' '),
        new Character(' '),
      ])
    ),
  ]);
  const result = parser.parseToEnd(source);
  assertSuccessfulParse(result);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can chain assignments', () => {
  const source = `
    function main() {
      a = b = c = d;
    }
  `;
  const expected = new Program([
    new Function(
      'main',
      new FunctionType(new Map(), new NumberType()),
      new Block([
        new Assign('a', new Assign('b', new Assign('c', new Id('d')))),
      ])
    ),
  ]);
  const result = parser.parseToEnd(source);
  assertSuccessfulParse(result);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can parse booleans', () => {
  const source = `
    function main() {
      true;
      false;
    }
  `;
  const expected = new Program([
    new Function(
      'main',
      new FunctionType(new Map(), new NumberType()),
      new Block([new Boolean(true), new Boolean(false)])
    ),
  ]);
  const result = parser.parseToEnd(source);
  assertSuccessfulParse(result);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can parse undefined', () => {
  const source = `
    function main() {
      undefined;
    }
  `;
  const expected = new Program([
    new Function(
      'main',
      new FunctionType(new Map(), new NumberType()),
      new Block([new Undefined()])
    ),
  ]);
  const result = parser.parseToEnd(source);
  assertSuccessfulParse(result);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can parse arrays', () => {
  const source = `
    var a = [1, 2, '3'];
    a[1];
  `;
  const expected = new Program([
    new Var(
      'a',
      new ArrayLiteral([new Integer(1), new Integer(2), new Character('3')])
    ),
    new ArrayLookup(new Id('a'), new Integer(1)),
  ]);
  const result = parser.parseToEnd(source);
  assertSuccessfulParse(result);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can parse type annotations in function signatures', () => {
  const source = `
    function identity(x: number) {
      return x;
    }

    function pair(x: number, y: number): Array<number> {
      return [x, y];
    }

    function not(value: boolean): boolean {
      return !value;
    }

    function doNothing(): void { }
  `;
  const expected = new Program([
    new Function(
      'identity',
      new FunctionType(new Map([['x', new NumberType()]]), new NumberType()),
      new Block([new Return(new Id('x'))])
    ),

    new Function(
      'pair',
      new FunctionType(
        new Map([
          ['x', new NumberType()],
          ['y', new NumberType()],
        ]),
        new ArrayType(new NumberType())
      ),
      new Block([new Return(new ArrayLiteral([new Id('x'), new Id('y')]))])
    ),

    new Function(
      'not',
      new FunctionType(
        new Map([['value', new BooleanType()]]),
        new BooleanType()
      ),
      new Block([new Return(new Not(new Id('value')))])
    ),

    new Function(
      'doNothing',
      new FunctionType(new Map(), new VoidType()),
      new Block([])
    ),
  ]);
  const result = parser.parseToEnd(source);
  assertSuccessfulParse(result);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can parse comparison operators', () => {
  const source = `
    1 < 2;
    1 > 2;
    1 <= 2;
    1 >= 2;
    1 < 2 == true;
    1 <= 2 == true;
  `;
  const expected = new Program([
    new LessThan(new Integer(1), new Integer(2)),
    new GreaterThan(new Integer(1), new Integer(2)),
    new LessThanOrEqual(new Integer(1), new Integer(2)),
    new GreaterThanOrEqual(new Integer(1), new Integer(2)),
    new Equal(new LessThan(new Integer(1), new Integer(2)), new Boolean(true)),
    new Equal(
      new LessThanOrEqual(new Integer(1), new Integer(2)),
      new Boolean(true)
    ),
  ]);
  const result = parser.parseToEnd(source);
  assertSuccessfulParse(result);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can parse if statements', () => {
  const source = `
    if (condition) {
      true;
    } else {
      false;
    }

    if (condition) {
      true;
    }

    if (condition) {
      true;
    } else if (alternative) {
      true;
    } else {
      false;
    }
  `;
  const expected = new Program([
    new If(
      new Id('condition'),
      new Block([new Boolean(true)]),
      new Block([new Boolean(false)])
    ),

    new If(new Id('condition'), new Block([new Boolean(true)]), null),

    new If(
      new Id('condition'),
      new Block([new Boolean(true)]),
      new If(
        new Id('alternative'),
        new Block([new Boolean(true)]),
        new Block([new Boolean(false)])
      )
    ),
  ]);
  const result = parser.parseToEnd(source);
  assertSuccessfulParse(result);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can parse the built-in `length` function', () => {
  const source = `
    length(1);
  `;
  const expected = new Program([new Length(new Integer(1))]);

  const result = parser.parseToEnd(source);
  assertSuccessfulParse(result);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can parse `for` statements', () => {
  const source = `
    for (; true;) {}
    for (var i = 0; i < 10; i = i + 1) {
      putchar(i);
    }
  `;
  const expected = new Program([
    new For(null, new Boolean(true), null, new Block([])),
    new For(
      new Var('i', new Integer(0)),
      new LessThan(new Id('i'), new Integer(10)),
      new Assign('i', new Add(new Id('i'), new Integer(1))),
      new Block([new Call('putchar', [new Id('i')])])
    ),
  ]);
  const result = parser.parseToEnd(source);
  assertSuccessfulParse(result);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can parse strings', () => {
  const source = `
    \`a\`;
    \`Hello world\`;
    \`\`;
    \`
multiline
\`;
  `;
  const expected = new Program([
    new String('a'),
    new String('Hello world'),
    new String(''),
    new String('\nmultiline\n'),
  ]);
  const result = parser.parseToEnd(source);
  assertSuccessfulParse(result);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can parse assembly directives', () => {
  const source = `
    asm\`add r0, r0, #1\`;
  `;
  const expected = new Program([new Asm('add r0, r0, #1')]);
  const result = parser.parseToEnd(source);
  assertSuccessfulParse(result);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});
