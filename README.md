# .hum

## links

[website](https://dothum.app/)

[repository](https://github.com/seeker-3/dothum/)

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

## About The Project

We divided up our project into multiple node packages using the very popular monorepo system. The configuration can be seen in `pnpm-workspace.yaml`. This was very useful for a group project so we could each implement our own features without interfering with each other too much. All packages are in the packages folder. The packages are imported by the app in the app folder for the final product. We used [pnpm](https://pnpm.io/) as our package manager instead of npm because it manages node_modules more efficiently and has a lot more features for working with monorepos. We used [vite](https://vitejs.dev/) as our primary build tool for building both packages and the app. Vite is great because it is incredibly beginner friendly and extremely efficient, while still having a robust set of features. We used [prettier](https://prettier.io/) the code formatter and [eslint](https://eslint.org/) and [stylelint](https://stylelint.io/) the linters for better code quality. We used [TypeScript](https://www.typescriptlang.org/) cause it's awesome. It provides tons of quality of life advantages to the developer and makes working with bigger code bases not a headache as your project grows. Finally we used [react](https://reactjs.org/) for the frontend to build a reactive and responsive user interface for a better "app like" experience.

## Installation

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

build the wasm package:

`pnpm build:wasm`

install project dependencies:

`pnpm i`

build packages:

`pnpm build:packages`

link packages:

`pnpm i`

## The App

all of the following commands are run in the app directory: `cd app`

start the app in development mode:

`pnpm dev`

build the app:

`pnpm build`

## helpful resources

### building your package into a library

[https://vitejs.dev/guide/build.html#library-mode]
