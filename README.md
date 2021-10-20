# source code for .hum

[open app](https://dothum.app/)

## Rubric
- 5 points: Record audio
- 5 pinots: Analyze notes and gives complimentary chords
- 5 points: Creates a tempo
- 15 points: Play, Stop, and chord buttons work
- 5 points: Chords can lengthened and deleted
- 5 points: Audio can be exported


## To install

### make sure you have the latest version of node installed

check verion:

`node -v`

I recommend using a package manager to install node:

- [chocolatey](https://chocolatey.org/) for window
- [homebrew](https://brew.sh/) for mac

### install yarn

globally install corepack:

`npm -g i corepack`

enable yarn:

`corepack enable yarn`

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

`cd packages/wasm`

`wasm-pack build -s dothum`

cd back to the root

install:

`yarn`

start the app in development mode:

`yarn start`

## Publish

### to build

`yarn build`

### to publish

`yarn gh-pages -d cs302-final-project/`

### to build and publish

`yarn publish`
