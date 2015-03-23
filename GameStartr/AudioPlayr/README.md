# AudioPlayr

An audio library to automate preloading and controlled playback of multiple audio 
tracks, with support for different sources and fileTypes. 

To address space concerns, AudioPlayr uses the video game music file 
emulation/playback library. For more information on the library, see:

https://code.google.com/p/game-music-emu/

The game music emu project was ported to javascript using emscripten. See

https://github.com/kripken/emscripten

To view the javascript port yourself, check out GameStartr/libgme.js

## Basic Architecture

#### Important APIs

* **play(***`name`***) - Plays a sound of the given name.

* **stop(**) - Stops all sound.

#### Important Member Variables

* **library** *`Object<String, Object>`* - The listing of audio sources, 
keyed by name. Each audio source has a "gbs" attribute containing the 
stringified base64 encoded gbs file, and a "tracks" object, which maps
trackName to trackNumber.

* **directory** *`Object<String, Object>`* - The listing of all available
tracks, keyed by name. Each track has a "gbs_source" attribute, representing 
where to find it in the library, and a "track_num" attribute. 

* **StatsHolder** *`StatsHoldr`* - A StatsHoldr used to store volume and muted
status, optionally in localStorage.

#### Constructor Arguments

* **library** *`Object`* - A mapping of strings to Arrays of files to be loaded 
from that directory name under the main directory.


* **statistics** *`Object`* - The arguments to be passed to the internal
StatsHoldr. This must contain values for "volume" and "muted".


## Sample Usage

1. Creating and using an AudioPlayr to load and play audio files. 

    ```javascript
        // TODO after design is complete
    ```