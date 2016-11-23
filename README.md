# FullScreenPokemon
[![Build Status](https://travis-ci.org/FullScreenShenanigans/FullScreenPokemon.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/FullScreenPokemon)
[![NPM version](https://badge.fury.io/js/fullscreenpokemon.svg)](http://badge.fury.io/js/fullscreenpokemon)

A free HTML5 remake of the original Pokemon, expanded for modern browsing.


## Build Process

FullScreenPokemon uses [Gulp](http://gulpjs.com/) to automate building, which requires [Node.js](http://node.js.org).

To build from scratch, install NodeJS and run the following commands:

```
npm install -g gulp
npm install
gulp
```

See [Build Details](https://github.com/FullScreenShenanigans/Documentation/blob/master/Build%20Details.md) for detailed Gulp usage.


## Adding Functionality

When making changes in only one folder, "gulp [folder name]" may complete faster than just "gulp"
For example, if the only changes are to src/Cutscenes.ts, use "gulp src"
