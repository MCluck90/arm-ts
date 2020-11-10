// @ts-nocheck
function printStr(str: string): void {
  for (var i = 0; i < length(str); i = i + 1) {
    putchar(str[i]);
  }
}

function printStrLn(str: string): void {
  printStr(str);
  putchar(10);
}
