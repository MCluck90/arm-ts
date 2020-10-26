export class Environment {
  constructor(
    public locals: Map<string, number> = new Map(),
    public nextLocalOffset: number = 0
  ) {}
}
