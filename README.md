<!-- {{Top}} -->
# FullScreenPokemon
[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/FullScreenPokemon.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/FullScreenPokemon.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/FullScreenPokemon)
[![NPM version](https://badge.fury.io/js/fullscreenpokemon.svg)](http://badge.fury.io/js/fullscreenpokemon)

A free HTML5 remake of the original Pokemon, expanded for modern browsing.
<!-- {{/Top}} -->

## Usage

```typescript
import { FullScreenPokemon } from "fullscreenpokemon";

// Creates a new game with a 320x480 screen size
const fsp = new FullScreenPokemon({
    height: 320,
    width: 480,
});

// Games contain a .canvas member for the screen
document.body.appendChild(fsp.canvas);

// Creates the initial menu with game start and load options
fsp.gameplay.gameStart();
```

By default, the game doesn't set up input events.
You'll need to set up your own event registrations manually.

The built `src/index.html` uses [UserWrappr](https://github.com/FullScreenShenanigans/UserWrappr) to fill the available window size with a game screen, option menus, and piped input events.

<!-- {{Development}} -->
## Development

```
git clone https://github.com/FullScreenShenanigans/FullScreenPokemon
cd FullScreenPokemon
npm run setup
npm run verify
```

* `npm run setup` creates a few auto-generated setup files locally.
* `npm run verify` builds, lints, and runs tests.

### Building

```shell
npm run watch
```

Source files are written under `src/` in TypeScript and compile in-place to JavaScript files.
`npm run watch` will directly run the TypeScript compiler on source files in watch mode.
Use it in the background while developing to keep the compiled files up-to-date.

### Running Tests

```shell
npm run test
```

Test files are alongside source files under `src/` and named `*.test.ts?`.
Whenever you add, remove, or rename a `*.test.ts?` file under `src/`, re-run `npm run test:setup` to regenerate the list of static test files in `test/index.html`.
You can open that file in a browser to debug through the tests.
`npm run test` will run that setup and execute tests using [Puppeteer](https://github.com/GoogleChrome/puppeteer).
<!-- {{/Development}} -->
