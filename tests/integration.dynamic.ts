import { parser } from '../src/parser';
import { DynamicCodeGenerator } from '../src/passes/codegen';

const ast = parser.parseStringToCompletion(`
  function assert(condition) {
    if (condition) {
      putchar('.');
    } else {
      putchar('F');
    }
  }

  function isBoolean(x) {
    if (x == true) {
      return true;
    } else if (x == false) {
      return true;
    } else {
      return false;
    }
  }

  function main() {
    var a = [];
    assert(a[1] + 2 == undefined);
    assert(!isBoolean(undefined));
  }
  `);

ast.visit(new DynamicCodeGenerator());