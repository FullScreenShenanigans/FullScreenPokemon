## FullScreenMario

#### A free HTML5 remake of Nintendo's original Super Mario Bros. It includes the original 32 levels, a random map generator, a level editor, and over a dozen custom mods.


## How to Play

Although you may no longer play on [fullscreenmario.com](http://www.fullscreenmario.com), it is easy to play your own copy.

#### Newcomers (non-coders)

[Download the .zip](https://github.com/Diogenesthecynic/FullScreenMario-JSON/archive/master.zip) of this project, extract that onto your computer, and open **index.html** in a browser (preferably Google Chrome). That's it!

#### In your own site

Build the project using the Developing instructions, and use the [index.html](dist/index.html) provided under /dist. It references all other files in /dist, so you'll want to copy the entire folder.



## Developing

#### Build Process

FullScreenMario uses [Grunt](http://gruntjs.com/) to automate building, which requires [Node.js](http://node.js.org). The process is straightforward; see [Grunt's help page](http://gruntjs.com/getting-started).

The root index.html file includes all the raw .js and .css files, and thus should only be used for development. The dist/index.html file uses the built and minified output so it should be used as production code.

#### Coding

FullScreenMario is built on a modular framework called GameStartr. The [src](src/) directory contains GameStartr, its parent class EightBittr, and the 22 modules used by the GameStartr framework. These all (theoretically) have their own README files, which you should skim before developing for FullScreenMario itself.

The main game code outside the framework is stored in FullScreenMario.js. The FullScreenMario class inherits from GameStartr and has a global 'FSM' instance set up by the UserWrappr module in index.js. GameStartr's constructor (its reset function) contains a reset function for each module that stores the modules within it as `FSM.AudioPlayer`, `FSM.ChangeLiner`, etc. 

The FullScreenMario.js class declaration contains class functions and some constants, while static settings to be added to the FullScreenMario prototype, such as map layouts and object attributes, are stored in files under [settings](settings), such as audio.js and collisions.js.


## Legal

This is released under the [Attribution Non-Commercial Share-Alike License](http://creativecommons.org/licenses/by-nc-sa/3.0/) (see [License.txt](License.txt)). FullScreenMario is meant to be both a proof of concept and an entertaining pasttime, not a source of income. 

The FullScreenMario project started October 21st, 2012. The initial beta release in October 2013 saw the [primary host website](http://www.fullscreenmario.com) receive approximately 2.68 million unique visitors within a month, after which Nintendo shut the site down with a DMCA complaint (no action was taken against GitHub or other hosting websites). The coding project then underwent an extensive rewrite and architecture change to become a modular project centered on the [EightBittr and GameStartr](src/) platform.
