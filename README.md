# .hum Website

## [dothum.app](https://dothum.app/)

## .him Visualized

![Idea:](/.hum-visulaized.png)

## Installation for Beginners

### make sure you have the latest version of node installed

check version:

`node -v`

I recommend using a package manager to install node:

- [chocolatey](https://chocolatey.org/) for window
- [homebrew](https://brew.sh/) for mac

### install pnpm

globally install corepack:

`npm -g i corepack`

enable pnpm:

`corepack enable pnpm`

### install rust

install rustup:

`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

install rust stable:

`rustup toolchain add stable`

add the wasm target:

`rustup target add wasm32-unknown-unknown`

install wasm-pack:

`curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh`

### set up the project

build the rust packages:

`wasm-pack build packages/wasm --target web`

install:

`pnpm i`

start the app in development mode:

in the app directory

`pnpm dev`

## Publish

### to build

`pnpm build`

### to publish

`pnpm gh-pages -d build/`

### to build and publish

`pnpm publish`

## helpful resources

### building your package into a library

[https://vitejs.dev/guide/build.html#library-mode]
