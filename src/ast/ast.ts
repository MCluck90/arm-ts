import { Visitor } from '../visitor';

export interface AST {
  visit<T>(v: Visitor<T>): T;
  equals(other: AST): boolean;
}
