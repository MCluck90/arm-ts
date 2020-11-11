import fs from 'fs';
import path from 'path';
import { parser } from '../src/parser';
import { DynamicCodeGenerator } from '../src/passes/codegen';
import { preprocessor } from '../src/passes/preprocessor';

const runtimePath = path.join(__dirname, '../src/runtime/index.ts');
const runtimeContents = preprocessor(
  fs.readFileSync(runtimePath).toString(),
  runtimePath
);

const filePath = path.join(__dirname, './integration/dynamic.ts');
const fileContents = fs.readFileSync(filePath).toString();
const contents = `${runtimeContents}${preprocessor(fileContents, filePath)}`;
const ast = parser.parseStringToCompletion(contents);

ast.visit(new DynamicCodeGenerator());
