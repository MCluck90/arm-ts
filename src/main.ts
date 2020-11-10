import fs from 'fs';
import path from 'path';
import { parser } from './parser';
import { CodeGenerator, DynamicCodeGenerator } from './passes/codegen';
import { preprocessor } from './passes/preprocessor';
import { createLibCTypes, TypeChecker } from './passes/type-checking';

if (process.argv.length < 3 || process.argv.length > 4) {
  console.error(`Usage: npm start -- [--dynamic] fileName`);
  process.exit(1);
} else {
  const isDynamic = process.argv.includes('--dynamic');
  const filename = process.argv[process.argv.length - 1];
  const filePath = path.join(process.cwd(), filename);
  const contents = preprocessor(fs.readFileSync(filePath).toString(), filePath);
  const ast = parser.parseStringToCompletion(contents);
  if (isDynamic) {
    ast.visit(new DynamicCodeGenerator());
  } else {
    ast.visit(new TypeChecker(new Map(), createLibCTypes()));
    ast.visit(new CodeGenerator());
  }
}
