function main() {
  var x = 5;
  if (x == 5) {
    putchar(untag('T'));
  } else if (x == undefined) {
    putchar(untag('F'));
  } else {
    putchar(untag('F'));
  }
}
