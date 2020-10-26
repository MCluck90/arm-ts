import fs from 'fs';
import path from 'path';
import { Environment } from './environment';
import { parser } from './parser';

if (process.argv.length !== 3) {
  console.error(`Usage: npm start -- fileName`);
  process.exit(1);
} else {
  const filename = process.argv[2];
  const filePath = path.join(process.cwd(), filename);
  const contents = fs.readFileSync(filePath).toString();
  parser.parseStringToCompletion(contents).emit(new Environment());
}
