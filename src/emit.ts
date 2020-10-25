let innerEmit = console.log.bind(console);
export const setEmit = (fn: (instruction: string) => void) => {
  innerEmit = fn;
};
export const emit = (instruction: string) => innerEmit(instruction);
