# FullScreenPokemon
[![Build Status](https://travis-ci.org/FullScreenShenanigans/FullScreenPokemon.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/FullScreenPokemon)
[![NPM version](https://badge.fury.io/js/fullscreenpokemon.svg)](http://badge.fury.io/js/fullscreenpokemon)

A free HTML5 remake of the original Pokemon, expanded for modern browsing.

## Usage

> *Note*: The output process for FullScreenPokemon is in flux.
> The following represents what *will* be true, but may be slightly inaccurate now.

The `fullscreenpokemon` module exposes a `FullScreenPokemon` class.
You can create a new `FSP` game object with the default constructor or by passing it a custom size.
That game object will contain a `.canvas` HTML Canvas element which can be added to the page.

```javascript
import { FullScreenPokemon } from "fullscreenpokemon";

const FSP = new FullScreenPokemon({
    width: 700,
    height: 490
});

document.body.appendChild(FSP.canvas);
```



## Build Process

FullScreenPokemon uses [Gulp](http://gulpjs.com/) to automate building, which requires [Node.js](http://node.js.org).

To build from scratch, install NodeJS and run the following commands:

```
npm install -g gulp
npm install
gulp
```

See [Build Details](https://github.com/FullScreenShenanigans/Documentation/blob/master/Build%20Details.md) for detailed Gulp usage.
