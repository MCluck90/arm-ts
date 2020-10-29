# ARM-ts

A compiler for a subset of TypeScript. Based on [_Compiling to Assembly from Scratch_ by Vladimir Keleshev](https://keleshev.com/compiling-to-assembly-from-scratch/).

## Getting Started

I'm developing this on Windows with WSL. Here's how I set up WSL:

```sh
$ apt-get install build-essentials
$ apt-get install gcc-arm-linux-gnueabihf
$ apt-get install qemu-user
```

## Running Programs

The `run` script can be run from Git Bash or Cygwin:

```sh
$ ./run ./examples/hello-world.ts
```

If you want to run code in dynamic typing mode, use `run-dynamic`:

```sh
$ ./run-dynamic ./examples/dynamic.js
```

## Tests

Parser tests:

```sh
$ npm test
```

Integration tests:

```sh
./integration
```
