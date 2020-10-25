import { Equality } from '../types';

export class Function implements Equality {
  constructor(
    public name: string,
    public parameters: string[],
    public body: Equality
  ) {}

  equals(other: Equality): boolean {
    return (
      other instanceof Function &&
      other.name === this.name &&
      other.parameters.length === this.parameters.length &&
      this.parameters.every((param, i) => param === other.parameters[i]) &&
      this.body.equals(other.body)
    );
  }
}
