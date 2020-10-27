import fs from 'fs';
import path from 'path';
import { parser } from './parser';
import { CodeGenerator } from './passes/codegen';
import { createLibCTypes, TypeChecker } from './passes/type-checking';

if (process.argv.length !== 3) {
  console.error(`Usage: npm start -- fileName`);
  process.exit(1);
} else {
  const filename = process.argv[2];
  const filePath = path.join(process.cwd(), filename);
  const contents = fs.readFileSync(filePath).toString();
  const ast = parser.parseStringToCompletion(contents);
  ast.visit(new TypeChecker(new Map(), createLibCTypes()));
  ast.visit(new CodeGenerator());
}
