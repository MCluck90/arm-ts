export interface AST {
  emit(): void;
  equals(other: AST): boolean;
}
