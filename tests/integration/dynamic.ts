// @ts-nocheck
function isBoolean(x) {
  if (x == true) {
    return true;
  } else if (x == false) {
    return true;
  } else {
    return false;
  }
}

function forStatement() {
  for (; undefined; ) {
    assert(false);
  }
  assert(true);
}

function main() {
  var a = [];
  assert(a[1] + 2 == undefined);
  assert(!isBoolean(undefined));
  forStatement();
}
