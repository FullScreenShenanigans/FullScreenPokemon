<!-- Top -->

# FullScreenPokemon

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-brightgreen.svg)
[![NPM version](https://badge.fury.io/js/fullscreenpokemon.svg)](http://badge.fury.io/js/fullscreenpokemon)

HTML5 remake of the original Pokemon, expanded for modern browsers.

<!-- /Top -->

## Usage

The built `lib/index.html` uses [UserWrappr](https://github.com/FullScreenShenanigans/UserWrappr) to fill the available window size with a game screen, option menus, and piped input events.
It stores its generated instance as `window.FSP`.

To do this in your own page, use the exported `createFspInterface` function.

```javascript
import { createFspInterface } from "fullscreenpokemon";

createFspInterface(document.getElementById("game")).then(() => {
    console.log("Ready to play! ✨");
    console.log(FSP);
});
```

You can also directly create a new `FullScreenPokemon` instance with a manual size.

```javascript
import { FullScreenPokemon } from "fullscreenpokemon";

// Creates a new game with a 320x480 screen size
const fsp = new FullScreenPokemon({
    height: 320,
    width: 480,
});

// Games contain a .canvas member for the screen
document.body.appendChild(fsp.canvas);

// Shows the initial in-game menu with start and load options
fsp.gameplay.gameStart();
```

> By default, the game doesn't set up input events.
> You'll need to set up your own event registrations manually.

### Documentation

FSP is built on top of [EightBittr](https://github.com/FullScreenShenanigans/EightBittr), a modular TypeScript game engine split across separate projects available on npm and hosted on GitHub in the [FullScreenShenanigans](https://github.com/FullScreenShenanigans) organization.
It consists of a couple dozen core modules under this organization.

See [./src/docs](https://github.com/FullScreenShenanigans/FullScreenPokemon/tree/main/docs) for documentation specific to FullScreenPokemon.

<!-- Development -->

## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo):

```
git clone https://github.com/<your-name-here>/FullScreenPokemon
cd FullScreenPokemon
yarn
yarn run hydrate
yarn run compile
```

-   `yarn run hydrate` creates a few auto-generated setup files locally.
-   `yarn run compile` builds source code with TypeScript

### Running Tests

```shell
yarn run test
```

Tests are written in [Mocha](https://github.com/mochajs/mocha) and [Chai](https://github.com/chaijs/chai).
Their files are written using alongside source files under `src/` and named `*.test.ts?`.
Whenever you add, remove, or rename a `*.test.t*` file under `src/`, `watch` will re-run `yarn run test:setup` to regenerate the list of static test files in `test/index.html`.
You can open that file in a browser to debug through the tests, or run `yarn test:run` to run them in headless Chrome.

<!-- Maps -->
<!-- /Maps -->

<!-- /Development -->
