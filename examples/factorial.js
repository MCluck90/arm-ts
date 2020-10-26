function assert(x) {
  if (x) {
    putchar('.');
  } else {
    putchar('F');
  }
}

function factorial(n) {
  if (n == 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

function main() {
  assert(factorial(5) == 120);
}
