# .hum Website

## [dothum.app](https://dothum.app/)

## .hum Visualized

![Idea:](/.hum-visulaized.png)


## Usage:
1. Open dothum website in another tab
![Idea:](/images/.Orginal1.0.png)
3. To begin either: 
- "Choose File" to upload an existing file (red)
- "record" to record some audio (blue)
4. Name the audio file (red), select it the audio is a "tune" or a "beat" (blue), and push save (orange)
5. Tune:
- To listen back to your audio file, click "process"
- To create the midi piano version of your audio file, click "original", select "piano", then click "process"
- The output should be a list of notes detected in your audio file, and a piano representation





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

`pnpm build:wasm`

install:

`pnpm i`

build packages:

`pnpm build`

link packages:

`pnpm i`

start the app in development mode:

## The App

all of the following commands are run in the app directory: `cd app`

start the app in development mode:

`pnpm dev`

build the app:

`pnpm build`

to publish the app to GitHub pages:

`pnpm publish`

## helpful resources

### building your package into a library

[https://vitejs.dev/guide/build.html#library-mode]
