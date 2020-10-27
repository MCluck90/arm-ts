import {
  ArrayLiteral,
  ArrayLookup,
  ArrayType,
  Assign,
  Block,
  Boolean,
  BooleanType,
  Call,
  Character,
  Function,
  FunctionType,
  Id,
  Integer,
  Multiply,
  Not,
  NotEqual,
  Null,
  NumberType,
  Return,
  Subtract,
  Undefined,
  Var,
  VoidType,
  While,
} from '../src/ast';
import { comments, ignored, Parser, parser, whitespace } from '../src/parser';

const { constant, regexp } = Parser;

test('Parsing alternatives with `or`', () => {
  const parser = regexp(/bye/y).or(regexp(/hai/y));
  const result = parser.parseStringToCompletion('hai');
  expect(result).toBe('hai');
});

test('Parsing with bindings', () => {
  const parser = regexp(/[a-z]+/y).bind((word) =>
    regexp(/[0-9]+/y).bind((digits) =>
      constant(`first ${word}, then ${digits}`)
    )
  );
  const result = parser.parseStringToCompletion('hai123');
  expect(result).toBe('first hai, then 123');
});

test('whitespace', () => {
  const acceptableCharacters = [' ', '\r', '\n', '\t'];
  for (const char of acceptableCharacters) {
    const result = whitespace.parseStringToCompletion(char);
    expect(result).toBe(char);
  }

  const charactersInSequence = '\r\n\t \t\n\r';
  let result = whitespace.parseStringToCompletion(charactersInSequence);
  expect(result).toBe(charactersInSequence);

  expect(() => whitespace.parseStringToCompletion('abc')).toThrowError();
});

test('comments', () => {
  const singleLineComment = '// comment';
  let result = comments.parseStringToCompletion(singleLineComment);
  expect(result).toBe(singleLineComment);

  const multilineComment = `/*
    comment
    goes
    here
  */`;
  result = comments.parseStringToCompletion(multilineComment);
  expect(result).toBe(multilineComment);
  expect(() =>
    comments.parseStringToCompletion('not a comment')
  ).toThrowError();
});

test('ignored', () => {
  const input = `
  // a combination of random whitespace
  \t/* and comments */
  \t\r// another comment
  `;
  const result = ignored.parseStringToCompletion(input);
  expect(result.join('')).toBe(input);
});

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
  const expected = new Block([
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
  const result = parser.parseStringToCompletion(source);
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
    }
  `;
  const expected = new Block([
    new Function(
      'outputChar',
      new FunctionType(new Map(), new NumberType()),
      new Block([
        new Character('A'),
        new Character('A'),
        new Character('"'),
        new Character("'"),
      ])
    ),
  ]);
  const result = parser.parseStringToCompletion(source);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can chain assignments', () => {
  const source = `
    function main() {
      a = b = c = d;
    }
  `;
  const expected = new Block([
    new Function(
      'main',
      new FunctionType(new Map(), new NumberType()),
      new Block([
        new Assign('a', new Assign('b', new Assign('c', new Id('d')))),
      ])
    ),
  ]);
  const result = parser.parseStringToCompletion(source);
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
  const expected = new Block([
    new Function(
      'main',
      new FunctionType(new Map(), new NumberType()),
      new Block([new Boolean(true), new Boolean(false)])
    ),
  ]);
  const result = parser.parseStringToCompletion(source);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can parse null and undefined', () => {
  const source = `
    function main() {
      null;
      undefined;
    }
  `;
  const expected = new Block([
    new Function(
      'main',
      new FunctionType(new Map(), new NumberType()),
      new Block([new Null(), new Undefined()])
    ),
  ]);
  const result = parser.parseStringToCompletion(source);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});

test('Can parse arrays', () => {
  const source = `
    var a = [1, 2, '3'];
    a[1];
  `;
  const expected = new Block([
    new Var(
      'a',
      new ArrayLiteral([new Integer(1), new Integer(2), new Character('3')])
    ),
    new ArrayLookup(new Id('a'), new Integer(1)),
  ]);
  const result = parser.parseStringToCompletion(source);
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
  const expected = new Block([
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
  const result = parser.parseStringToCompletion(source);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});
