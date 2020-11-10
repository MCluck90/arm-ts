import { FunctionType, NumberType, VoidType } from '../../ast';

export const createLibCTypes = () =>
  new Map([
    [
      'putchar',
      new FunctionType(new Map([['char', new NumberType()]]), new VoidType()),
    ],
    [
      'malloc',
      new FunctionType(new Map([['size', new NumberType()]]), new NumberType()),
    ],
    ['rand', new FunctionType(new Map(), new NumberType())],
  ]);
