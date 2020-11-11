import fs from 'fs';
import path from 'path';
import { parser } from '../src/parser';
import { CodeGenerator } from '../src/passes/codegen';
import { preprocessor } from '../src/passes/preprocessor';
import { createLibCTypes, TypeChecker } from '../src/passes/type-checking';

const runtimePath = path.join(__dirname, '../src/runtime/index.ts');
const runtimeContents = preprocessor(
  fs.readFileSync(runtimePath).toString(),
  runtimePath
);

const filePath = path.join(__dirname, './integration/static.ts');
const fileContents = fs.readFileSync(filePath).toString();
const contents = `${runtimeContents}${preprocessor(fileContents, filePath)}`;
const ast = parser.parseStringToCompletion(contents);

ast.visit(new TypeChecker(new Map(), createLibCTypes()));
ast.visit(new CodeGenerator());
