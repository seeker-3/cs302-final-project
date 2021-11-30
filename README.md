# .hum Website

## [dothum.app](https://dothum.app/)

## Usage

1. Open dothum website in another tab
   ![I1:](/images/Original1.0.png)
2. To begin either:

   - "Choose File" to upload an existing audio file (red)
   - "record" to record some audio (blue)
     ![I2](/images/Original2.0.png)

3. Name the audio file (red), select it the audio is a "tune" or a "beat" (blue), and push "save" (orange)
   ![I3](/images/Original3.0.png)
4. Tune:

   - To listen back to your audio file, click "process" then the play button
     ![I4](/images/Original4.0.png)
   - To create the midi piano version of your audio file, click "original", select "piano", then click "process"
     ![I5](/images/Original5.0.png)
   - The output should be a list of notes detected in your audio file, and a piano audio
     ![I6](/images/Original6.0.png)

5. Beat:

- Once you "record" and "save" a tapping beat, you can push "load beat" and your audio tapping turns into an editable percussion tool.
  ![I7](/images/Original7.0.png)
- You can also add an editable drum by clicking "add drum"
  ![I8](/images/Original8.0.png)
- You can add as many drums and beats as you want
- To play the beat you created click "play"

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

## helpful resources

### building your package into a library

[https://vitejs.dev/guide/build.html#library-mode]
