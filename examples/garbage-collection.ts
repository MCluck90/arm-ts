// @ts-nocheck
function generateGarbage() {
  `GARBAGE`;
}

function main() {
  for (var i = 0; i < 256; i = i + 1) {
    generateGarbage();
  }
  printStrLn(`Success!`);
}
