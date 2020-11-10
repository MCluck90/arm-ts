import fs from 'fs';
import path from 'path';

export const preprocessor = (contents: string, filePath: string): string => {
  let newContents = contents;
  const directory = path.dirname(filePath);
  const importRegex = /import\b\s*'([^']+)';/;
  let importStatement = importRegex.exec(contents);
  while (importStatement !== null) {
    newContents = newContents.replace(
      importStatement[0],
      fs.readFileSync(path.join(directory, importStatement[1])).toString()
    );
    importStatement = importRegex.exec(newContents);
  }
  return newContents;
};
