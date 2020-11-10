// @ts-nocheck
function factorial(n) {
  if (n == 0) {
    return 1;
  }

  return n * factorial(n - 1);
}

function main() {
  assert(factorial(5) == 120);
}
