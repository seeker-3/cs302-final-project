# source code for .hum

[open app](https://dothum.app/)

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

### set up the project

install:

`yarn`

build the rust packages:

`yarn build:wasm`

start the app in development mode:

`yarn start`

## Publish

### to build

`yarn build`

### to publish

`yarn gh-pages -d cs302-final-project/`

### to build and publish

`yarn publish`
