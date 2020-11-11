// @ts-nocheck
function assert(condition: boolean): void {
  if (!condition) {
    printStrLn(`Assertion failed.`);
    exit(1);
  }
}
