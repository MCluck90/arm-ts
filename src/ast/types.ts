export interface Type {
  equals(other: Type): boolean;
  toString(): string;
}

export class BooleanType implements Type {
  equals(other: Type) {
    return other instanceof BooleanType;
  }

  toString() {
    return 'boolean';
  }
}

export class NumberType implements Type {
  equals(other: Type) {
    return other instanceof NumberType;
  }

  toString() {
    return 'number';
  }
}

export class VoidType implements Type {
  equals(other: Type) {
    return other instanceof VoidType;
  }

  toString() {
    return 'void';
  }
}

export class ArrayType implements Type {
  constructor(public element: Type) {}

  equals(other: Type): boolean {
    return other instanceof ArrayType && other.element.equals(this.element);
  }

  toString() {
    return `Array<${this.element.toString()}>`;
  }
}

export class FunctionType implements Type {
  constructor(public parameters: Map<string, Type>, public returnType: Type) {}

  equals(other: Type): boolean {
    if (
      !(other instanceof FunctionType) ||
      other.parameters.size !== this.parameters.size
    ) {
      return false;
    }

    const parameterTypes = Array.from(this.parameters.values());
    const otherParameterTypes = Array.from(other.parameters.values());
    return (
      parameterTypes.every((type, i) => type.equals(otherParameterTypes[i])) &&
      other.returnType.equals(this.returnType)
    );
  }

  toString() {
    const params = Array.from(this.parameters.entries())
      .map(([name, type]) => `${name}: ${type.toString()}`)
      .join(', ');
    return `(${params}) => ${this.returnType.toString()}`;
  }
}

export class StringType implements Type {
  equals(other: Type) {
    return other instanceof StringType;
  }

  toString() {
    return 'string';
  }
}
