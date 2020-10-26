import { Environment } from '../environment';

export interface AST {
  emit(env: Environment): void;
  equals(other: AST): boolean;
}
