import fs from 'fs';
import path from 'path';
import { parser } from './parser';
import { CodeGenerator } from './passes/codegen';

if (process.argv.length !== 3) {
  console.error(`Usage: npm start -- fileName`);
  process.exit(1);
} else {
  const filename = process.argv[2];
  const filePath = path.join(process.cwd(), filename);
  const contents = fs.readFileSync(filePath).toString();
  parser.parseStringToCompletion(contents).visit(new CodeGenerator());
}
