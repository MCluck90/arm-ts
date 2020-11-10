// @ts-nocheck
function GC__getSemiSpaceStart(): number {
  var semiSpaceStart = 0;
  asm`
  ldr r0, =semiSpaceStart
  str r0, [fp, #-8]
  `;
  return semiSpaceStart;
}

function GC__setSemiSpaceStart(value: number): void {
  value;
  asm`
  ldr r1, =semiSpaceStart
  str r0, [r1]
  `;
}

function GC__getAllocationPointer(): number {
  var allocationPointer = 0;
  asm`
  ldr r0, =allocationPointer
  str r0, [fp, #-8]
  `;
  return allocationPointer;
}

function GC__setAllocationPointer(value: number): void {
  value;
  asm`
  ldr r1, =allocationPointer
  str r0, [r1]
  `;
}

function GC__getSemiSpaceEnd(): number {
  var semiSpaceEnd = 0;
  asm`
  ldr r0, =semiSpaceEnd
  str r0, [fp, #-8]
  `;
  return semiSpaceEnd;
}

function GC__setSemiSpaceEnd(value: number): void {
  value;
  asm`
  ldr r1, =semiSpaceEnd
  str r0, [r1]
  `;
}

function GC__init() {
  var semiSpaceSize = 256;
  var semiSpaceStart = malloc(semiSpaceSize);
  GC__setSemiSpaceStart(semiSpaceStart);
  GC__setAllocationPointer(semiSpaceStart);
  GC__setSemiSpaceEnd(semiSpaceStart + semiSpaceSize);
}

function GC__allocate(size: number): number {
  var nextAvailableAddress = GC__getAllocationPointer();
  if (nextAvailableAddress + size > GC__getSemiSpaceEnd()) {
    // TODO: Actually collect unused memory
    GC__init();
    return GC__allocate(size);
  }
  GC__setAllocationPointer(nextAvailableAddress + size);
  return nextAvailableAddress;
}
