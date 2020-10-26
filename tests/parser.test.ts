import {
  Assign,
  Block,
  Function,
  Id,
  Multiply,
  NotEqual,
  Integer,
  Return,
  Subtract,
  Var,
  While,
  Call,
} from '../src/ast';
import { Character } from '../src/ast/character';
import {
  atom,
  comments,
  ignored,
  LEFT_PAREN,
  Parser,
  parser,
  whitespace,
} from '../src/parser';

const { constant, maybe, regexp, zeroOrMore } = Parser;

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
      ['n'],
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
      putchar('A');
    }
  `;
  const expected = new Block([
    new Function(
      'outputChar',
      [],
      new Block([new Call('putchar', [new Character('A')])])
    ),
  ]);
  const result = parser.parseStringToCompletion(source);
  expect(result).toEqual(expected);
  expect(result.equals(expected)).toBe(true);
});
