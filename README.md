# FullScreenPokemon
[![Build Status](https://travis-ci.org/FullScreenShenanigans/FullScreenPokemon.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/FullScreenPokemon)
[![NPM version](https://badge.fury.io/js/fullscreenpokemon.svg)](http://badge.fury.io/js/fullscreenpokemon)

A free HTML5 remake of the original Pokemon, expanded for modern browsing.

## Usage

The `fullscreenpokemon` module exposes a `FullScreenPokemon` class.
You can create a new game object by passing it `width` and `height` for a screen size.
That game object will contain a `.container` HTML element which can be added to the page.

```javascript
import { FullScreenPokemon } from "fullscreenpokemon";

const fsp = new FullScreenPokemon({
    width: 700,
    height: 490
});

document.body.appendChild(fsp.container);
```



## Build Process

FullScreenPokemon uses [Gulp](http://gulpjs.com/) to automate building, which requires [Node.js](http://node.js.org).

To build from scratch, install NodeJS and run the following commands:

```
npm install -g gulp
npm install
gulp setup
gulp
```

The game will be ready to play in src/index.html.

See [gulp-shenanigans](https://github.com/FullScreenShenanigans/gulp-shenanigans) for detailed Gulp usage.
