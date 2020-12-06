import fs from 'fs';
import { ParseError } from 'parsnip-ts/error';
import path from 'path';
import { parser } from '../src/parser';
import { CodeGenerator } from '../src/passes/codegen';
import { preprocessor } from '../src/passes/preprocessor';
import { createLibCTypes, TypeChecker } from '../src/passes/type-checking';

const index = process.argv[2];
const runtimePath = path.join(__dirname, '../src/runtime/index.ts');
const runtimeContents = preprocessor(
  fs.readFileSync(runtimePath).toString(),
  runtimePath
);

const filePath = path.join(__dirname, `./integration/static.${index}.ts`);
const fileContents = fs.readFileSync(filePath).toString();
const contents = `${runtimeContents}${preprocessor(fileContents, filePath)}`;
const ast = parser.parseToEnd(contents);
if (ast instanceof ParseError) {
  throw ast;
}

ast.visit(new TypeChecker(new Map(), createLibCTypes()));
ast.visit(new CodeGenerator());
