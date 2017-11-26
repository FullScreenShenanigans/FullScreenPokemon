<!-- {{Top}} -->
# FullScreenPokemon
[![Build Status](https://travis-ci.org/FullScreenShenanigans/FullScreenPokemon.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/FullScreenPokemon)
[![NPM version](https://badge.fury.io/js/fullscreenpokemon.svg)](http://badge.fury.io/js/fullscreenpokemon)

A free HTML5 remake of the original Pokemon, expanded for modern browsing.
<!-- {{/Top}} -->

## Usage

FSP uses the [UserWrappr](https://github.com/FullScreenShenanigans/UserWrappr) module to fill the available window size with a game screen, option menus, and piped input events.

```typescript
import { FullScreenPokemon } from "fullscreenpokemon";

const container = document.querySelector("#game");
const fsp = new FullScreenPokemon();

fsp.userWrapper.createDisplay(container);
```

You can make just the game canvas without any wrapping input pipes or menus by directly calling `FSP.reset(size)`.
The game will have a `.canvas` member displaying the game screen.
You'll need to set up your own event registrations manually.

```typescript
const fsp = new FullScreenPokemon();

fsp.reset(fsp.interface.sizes.GameBody);

document.body.appendChild(fsp.canvas);
```


<!-- {{Development}} -->
## Development

See [Documentation/Development](https://github.com/FullScreenShenanigans/Documentation).

After setting up and building locally, open `src/index.html` to launch.
<!-- {{/Development}} -->
