import { FunctionType, NumberType, VoidType } from '../../ast';

export const createLibCTypes = () =>
  new Map([
    [
      'putchar',
      new FunctionType(new Map([['char', new NumberType()]]), new VoidType()),
    ],
    ['rand', new FunctionType(new Map(), new NumberType())],
  ]);
