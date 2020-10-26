import {
  Add,
  Assign,
  Block,
  Call,
  Divide,
  Equal,
  Function,
  Id,
  If,
  InfixOperatorConstructor,
  Multiply,
  Not,
  NotEqual,
  Integer,
  Return,
  Subtract,
  Var,
  While,
} from './ast';
import { Character } from './ast/character';
import { AST } from './ast';

export class Source {
  constructor(public string: string, public index: number) {}

  match(regexp: RegExp): ParseResult<string> | null {
    console.assert(regexp.sticky);
    regexp.lastIndex = this.index;
    const match = this.string.match(regexp);
    if (match) {
      const value = match[0];
      const newIndex = this.index + value.length;
      const source = new Source(this.string, newIndex);
      return new ParseResult(value, source);
    }

    return null;
  }
}

new Source('', 0).match(/x/y);

export class ParseResult<T> {
  constructor(public value: T, public source: Source) {}
}

export interface Parser<T> {
  parse(source: Source): ParseResult<T> | null;
}

export class Parser<T> {
  constructor(public parse: (source: Source) => ParseResult<T> | null) {}

  static constant<U>(value: U): Parser<U> {
    return new Parser((source) => new ParseResult(value, source));
  }

  static error<U>(message: string): Parser<U> {
    return new Parser((_source) => {
      throw new Error(message);
    });
  }

  static maybe<U>(parser: Parser<U | null>): Parser<U | null> {
    return parser.or(constant(null));
  }

  static regexp(regexp: RegExp): Parser<string> {
    return new Parser((source) => source.match(regexp));
  }

  static zeroOrMore<U>(parser: Parser<U>): Parser<U[]> {
    return new Parser((source) => {
      const results = [];
      let item = null;
      while ((item = parser.parse(source))) {
        source = item.source;
        results.push(item.value);
      }
      return new ParseResult(results, source);
    });
  }

  and<U>(parser: Parser<U>): Parser<U> {
    return this.bind(() => parser);
  }

  bind<U>(callback: (value: T) => Parser<U>): Parser<U> {
    return new Parser((source) => {
      const result = this.parse(source);
      if (result) {
        const { value, source } = result;
        return callback(value).parse(source);
      }
      return null;
    });
  }

  map<U>(callback: (t: T) => U): Parser<U> {
    return this.bind((value) => constant(callback(value)));
  }

  or<U>(parser: Parser<T | U>): Parser<T | U> {
    return new Parser((source) => {
      const result = this.parse(source);
      if (result) {
        return result;
      }
      return parser.parse(source);
    });
  }

  parseStringToCompletion(string: string): T {
    const source = new Source(string, 0);
    const result = this.parse(source);
    if (!result) {
      throw new Error('Parse error at index 0');
    }

    const index = result.source.index;
    if (index !== result.source.string.length) {
      console.log(result);
      throw new Error(`Parse error at index ${index}`);
    }

    return result.value;
  }
}

const { constant, maybe, regexp, zeroOrMore } = Parser;

export const whitespace = regexp(/[ \n\r\t]+/y);
export const comments = regexp(/[/][/].*/y).or(regexp(/[/][*].*[*][/]/sy));
export const ignored = zeroOrMore(whitespace.or(comments));

const token = (pattern: RegExp) =>
  regexp(pattern).bind((value) => ignored.and(constant(value)));

export const FUNCTION = token(/function\b/y);
export const IF = token(/if\b/y);
export const ELSE = token(/else\b/y);
export const RETURN = token(/return\b/y);
export const VAR = token(/var\b/y);
export const WHILE = token(/while\b/y);
export const FOR = token(/for\b/y);

export const COMMA = token(/[,]/y);
export const SEMICOLON = token(/;/y);
export const LEFT_PAREN = token(/[(]/y);
export const RIGHT_PAREN = token(/[)]/y);
export const LEFT_BRACE = token(/[{]/y);
export const RIGHT_BRACE = token(/[}]/y);
export const SINGLE_QUOTE = token(/[']/y);

export const INTEGER = token(/[0-9]+/y).map(
  (digits) => new Integer(parseInt(digits))
);

const character = regexp(/[\x20-\x7F]/y);
export const CHARACTER = SINGLE_QUOTE.and(character).bind((char) =>
  SINGLE_QUOTE.and(constant(new Character(char)))
);

export const ID = token(/[a-zA-Z_][a-zA-Z0-9_]*/y);
export const id = ID.map((x) => new Id(x));

export const NOT = token(/!/y).map((_) => Not);
export const EQUAL = token(/==/y).map((_) => Equal);
export const NOT_EQUAL = token(/!=/y).map((_) => NotEqual);
export const PLUS = token(/[+]/y).map((_) => Add);
export const MINUS = token(/[-]/y).map((_) => Subtract);
export const STAR = token(/[*]/y).map((_) => Multiply);
export const SLASH = token(/[/]/y).map((_) => Divide);
export const ASSIGN = token(/=/y).map((_) => Assign);

export const expression: Parser<AST> = Parser.error(
  'expression parser used before definition'
);

export const args = expression
  .bind((arg) =>
    zeroOrMore(COMMA.and(expression)).bind((args) => constant([arg, ...args]))
  )
  .or(constant([] as AST[]));

export const call = ID.bind((callee) =>
  LEFT_PAREN.and(
    args.bind((args) => RIGHT_PAREN.and(constant(new Call(callee, args))))
  )
);

export const assignment = ID.bind((name) =>
  ASSIGN.and(expression).bind((value) => constant(new Assign(name, value)))
);

export const atom = call
  .or(assignment)
  .or(id)
  .or(INTEGER)
  .or(CHARACTER)
  .or(LEFT_PAREN.and(expression).bind((e) => RIGHT_PAREN.and(constant(e))));

export const unary = maybe(NOT).bind((not) =>
  atom.map((term) => (not ? new Not(term) : term))
);

const infix = (
  operatorParser: Parser<InfixOperatorConstructor>,
  termParser: Parser<AST>
) =>
  termParser.bind((term) =>
    zeroOrMore(
      operatorParser.bind((operator) =>
        termParser.bind((term) => constant({ operator, term }))
      )
    ).map((operatorTerms) =>
      operatorTerms.reduce(
        (left, { operator, term }) => new operator(left, term),
        term
      )
    )
  );

export const product = infix(STAR.or(SLASH), unary);
export const sum = infix(PLUS.or(MINUS), product);
export const comparision = infix(EQUAL.or(NOT_EQUAL), sum);

expression.parse = comparision.parse;

export const statement: Parser<AST> = Parser.error(
  'statement parser used before definition'
);

export const returnStatement = RETURN.and(expression).bind((term) =>
  SEMICOLON.and(constant(new Return(term)))
);

export const expressionStatement = expression.bind((term) =>
  SEMICOLON.and(constant(term))
);

export const ifStatement = IF.and(LEFT_PAREN)
  .and(expression)
  .bind((conditional) =>
    RIGHT_PAREN.and(statement).bind((consequence) =>
      ELSE.and(statement).bind((alternative) =>
        constant(new If(conditional, consequence, alternative))
      )
    )
  );

export const whileStatement = WHILE.and(LEFT_PAREN)
  .and(expression)
  .bind((conditional) =>
    RIGHT_PAREN.and(statement).bind((body) =>
      constant(new While(conditional, body))
    )
  );

export const varStatement = VAR.and(ID).bind((name) =>
  ASSIGN.and(expression).bind((value) =>
    SEMICOLON.and(constant(new Var(name, value)))
  )
);

export const assignmentStatement = assignment.bind((assign) =>
  SEMICOLON.and(constant(assign))
);

export const blockStatement = LEFT_BRACE.and(
  zeroOrMore(statement)
).bind((statements) => RIGHT_BRACE.and(constant(new Block(statements))));

export const parameters = ID.bind((param) =>
  zeroOrMore(COMMA.and(ID)).bind((params) => constant([param, ...params]))
).or(constant([] as string[]));

export const functionStatement = FUNCTION.and(ID).bind((name) =>
  LEFT_PAREN.and(parameters).bind((parameters) =>
    RIGHT_PAREN.and(blockStatement).bind((block) =>
      constant(new Function(name, parameters, block))
    )
  )
);

export const statementParser = returnStatement
  .or(functionStatement)
  .or(ifStatement)
  .or(whileStatement)
  .or(varStatement)
  .or(assignmentStatement)
  .or(blockStatement)
  .or(expressionStatement);

statement.parse = statementParser.parse;

export const parser = ignored
  .and(zeroOrMore(statement))
  .map((statements) => new Block(statements));
