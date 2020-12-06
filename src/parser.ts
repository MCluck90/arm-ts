import {
  Add,
  ArrayLiteral,
  ArrayLookup,
  ArrayType,
  Asm,
  Assign,
  Block,
  BooleanType,
  Call,
  Divide,
  Equal,
  For,
  Function,
  FunctionType,
  GreaterThan,
  GreaterThanOrEqual,
  Id,
  If,
  InfixOperatorConstructor,
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
  StringType,
  Subtract,
  Type,
  Undefined,
  Untag,
  Var,
  VoidType,
  While,
} from './ast';
import { Character } from './ast/character';
import { AST } from './ast';
import { Boolean } from './ast/boolean';

import { constant, error, maybe, Parser, regexp, zeroOrMore } from 'parsnip-ts';
import { cStyleComment } from 'parsnip-ts/comments';
import { createToken } from 'parsnip-ts/token';
import { whitespace } from 'parsnip-ts/whitespace';

const ignored = cStyleComment.or(whitespace);
const token = createToken(ignored);

// Keywords
export const ARRAY = token(/Array\b/y);
export const BOOLEAN = token(/boolean\b/y);
export const ELSE = token(/else\b/y);
export const FALSE = token(/false\b/y).map(() => new Boolean(false));
export const FOR = token(/for\b/y);
export const FUNCTION = token(/function\b/y);
export const IF = token(/if\b/y);
export const NUMBER = token(/number\b/y);
export const RETURN = token(/return\b/y);
export const STRING_TYPE = token(/string\b/y);
export const TRUE = token(/true\b/y).map(() => new Boolean(true));
export const UNDEFINED = token(/undefined\b/y).map(() => new Undefined());
export const VAR = token(/var\b/y);
export const VOID = token(/void\b/y);
export const WHILE = token(/while\b/y);

export const COLON = token(/[:]/y);
export const COMMA = token(/[,]/y);
export const SEMICOLON = token(/;/y);
export const LEFT_BRACE = token(/[{]/y);
export const RIGHT_BRACE = token(/[}]/y);
export const LEFT_BRACKET = token(/[[]/y);
export const RIGHT_BRACKET = token(/[\]]/y);
export const LEFT_PAREN = token(/[(]/y);
export const RIGHT_PAREN = token(/[)]/y);
export const OPEN_TYPE_BRACKET = token(/[<]/y);
export const CLOSE_TYPE_BRACKET = token(/[>]/y);
export const SINGLE_QUOTE = regexp(/[']/y);
export const DOUBLE_QUOTE = regexp(/["]/y);
export const BACKTICK = regexp(/[`]/y);

export const INTEGER = token(/[0-9]+/y).map(
  (digits) => new Integer(parseInt(digits))
);

export const arrayType: Parser<Type> = error(
  'arrayType parser used before definition'
);

export const type = VOID.map((_) => new VoidType())
  .or(BOOLEAN.map((_) => new BooleanType()))
  .or(NUMBER.map((_) => new NumberType()))
  .or(STRING_TYPE.map((_) => new StringType()))
  .or(arrayType);

arrayType.parse = ARRAY.and(OPEN_TYPE_BRACKET)
  .and(type)
  .bind((type) => CLOSE_TYPE_BRACKET.and(constant(new ArrayType(type)))).parse;

const characterWithoutSingleQuote = regexp(/[\x20-\x26\x28-\x7F]/y);
const characterWithoutDoubleQuote = regexp(/[\x20-\x21\x23-\x7F]/y);
export const CHARACTER = SINGLE_QUOTE.and(characterWithoutSingleQuote)
  .bind((char) => SINGLE_QUOTE.and(constant(new Character(char))))
  .or(
    DOUBLE_QUOTE.and(characterWithoutDoubleQuote).bind((char) =>
      DOUBLE_QUOTE.and(constant(new Character(char)))
    )
  );

export const STRING = BACKTICK.and(regexp(/[^`]*/sy)).bind((value) =>
  BACKTICK.and(constant(new String(value)))
);

export const ID = token(/[a-zA-Z_][a-zA-Z0-9_]*/y);
export const id = ID.map((x) => new Id(x));

export const NOT = token(/!/y).map(() => Not);
export const EQUAL = token(/==/y).map(() => Equal);
export const NOT_EQUAL = token(/!=/y).map(() => NotEqual);
export const LESS_THAN = token(/</y).map(() => LessThan);
export const LESS_THAN_OR_EQUAL = token(/<=/y).map(() => LessThanOrEqual);
export const GREATER_THAN = token(/>/y).map(() => GreaterThan);
export const GREATER_THAN_OR_EQUAL = token(/>=/y).map(() => GreaterThanOrEqual);
export const PLUS = token(/[+]/y).map(() => Add);
export const MINUS = token(/[-]/y).map(() => Subtract);
export const STAR = token(/[*]/y).map(() => Multiply);
export const SLASH = token(/[/]/y).map(() => Divide);
export const ASSIGN = token(/=/y).map(() => Assign);

export const expression: Parser<AST> = error(
  'expression parser used before definition'
);

export const args = expression
  .bind((arg) =>
    zeroOrMore(COMMA.and(expression)).bind((args) =>
      maybe(COMMA).and(constant([arg, ...args]))
    )
  )
  .or(constant([] as AST[]));

export const call = token(/length|untag/y)
  .bind((name) =>
    LEFT_PAREN.and(expression).bind((expression) =>
      RIGHT_PAREN.and(
        constant(
          name === 'length' ? new Length(expression) : new Untag(expression)
        )
      )
    )
  )
  .or(
    ID.bind((callee) =>
      LEFT_PAREN.and(
        args.bind((args) => RIGHT_PAREN.and(constant(new Call(callee, args))))
      )
    )
  );

export const arrayLiteral = LEFT_BRACKET.and(args).bind((args) =>
  RIGHT_BRACKET.and(constant(new ArrayLiteral(args)))
);

export const arrayLookup = id.bind((array) =>
  LEFT_BRACKET.and(expression).bind((index) =>
    RIGHT_BRACKET.and(constant(new ArrayLookup(array, index)))
  )
);

export const assignment = ID.bind((name) =>
  ASSIGN.and(expression).bind((value) => constant(new Assign(name, value)))
);

export const boolean = TRUE.or(FALSE);

export const scalar = boolean.or(UNDEFINED).or(id).or(INTEGER);

export const assembly = regexp(/asm/y)
  .and(STRING)
  .bind((str) => constant(new Asm(str.value)));

export const atom = call
  .or(arrayLiteral)
  .or(arrayLookup)
  .or(assignment)
  .or(assembly)
  .or(scalar)
  .or(CHARACTER)
  .or(STRING)
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
export const comparision = infix(
  EQUAL.or(NOT_EQUAL),
  infix(
    LESS_THAN_OR_EQUAL.or(GREATER_THAN_OR_EQUAL),
    infix(LESS_THAN.or(GREATER_THAN), sum)
  )
);

expression.parse = comparision.parse;

export const statement: Parser<AST> = error(
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
      maybe(ELSE.and(statement)).bind((alternative) =>
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

export const forStatement = FOR.and(LEFT_PAREN)
  .and(varStatement.or(assignmentStatement).or(SEMICOLON.and(constant(null))))
  .bind((initializer) =>
    expression.bind((conditional) =>
      SEMICOLON.and(
        expression
          .or(assignment)
          .or(constant(null))
          .bind((postBody) =>
            RIGHT_PAREN.and(statement).bind((body) =>
              constant(new For(initializer, conditional, postBody, body))
            )
          )
      )
    )
  );

export const blockStatement = LEFT_BRACE.and(
  zeroOrMore(statement)
).bind((statements) => RIGHT_BRACE.and(constant(new Block(statements))));

export const optionalTypeAnnotation = maybe(COLON.and(type));

export const parameter: Parser<[string, Type]> = ID.bind((name) =>
  optionalTypeAnnotation.bind((type) =>
    constant([name, type ?? new NumberType()])
  )
);

export const parameters: Parser<[string, Type][]> = parameter
  .bind((param) =>
    zeroOrMore(COMMA.and(parameter)).bind((params) =>
      constant([param, ...params])
    )
  )
  .or(constant([]));

export const functionStatement = FUNCTION.and(ID).bind((name) =>
  LEFT_PAREN.and(parameters).bind((params) =>
    RIGHT_PAREN.and(optionalTypeAnnotation).bind((returnType) =>
      blockStatement.bind((body) =>
        constant(
          new Function(
            name,
            new FunctionType(new Map(params), returnType || new NumberType()),
            body
          )
        )
      )
    )
  )
);

export const statementParser = returnStatement
  .or(functionStatement)
  .or(ifStatement)
  .or(whileStatement)
  .or(forStatement)
  .or(varStatement)
  .or(assignmentStatement)
  .or(blockStatement)
  .or(expressionStatement);

statement.parse = statementParser.parse;

export const parser = zeroOrMore(ignored)
  .and(zeroOrMore(statement))
  .map((statements) => new Program(statements));
