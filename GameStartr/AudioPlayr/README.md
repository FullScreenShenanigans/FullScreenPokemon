# AudioPlayr

An audio library to automate preloading and controlled playback of multiple
audio tracks, with support for different browsers' preferred fileTypes. Volume
and mute status are stored locally using a StatsHoldr, which in turn requires
proliferate and createElement functions (such as those given by the EightBittr
prototype).


## Basic Architecture

#### Important APIs

* **play(***`name`***) - Plays a sound of the given name and returns the newly
created <audio> Element.

* **playTheme(***`name`[, `loop`]***) - Plays a sound (looping unless loop is
false), which can later be accessed by pauseTheme and similar APIs.

* **setVolume(***`volume`***) - Sets the volume for all sounds, in [0,1].

* **setMuted(***`muted`***) - Sets whether all sounds are muted or not.

#### Important Member Variables

* **library** *`Object<String, HTMLAudioElement>`* - The listing of <audio> 
elements, keyed by their name (each has at least one <source> element, so their 
names ignore extensions).

* **sounds** *`Object<String, HTMLAudioElement>`* - The currently playing 
<audio> elements, keyed by name.

* **StatsHolder** *`StatsHoldr`* - A StatsHoldr used to store volume and muted
status, optionally in localStorage.

#### Constructor Arguments

* **library** *`Object`* - A mapping of strings to Arrays of files to be loaded 
from that directory name under the main directory.

* **directory** *`String`* - The directory in which all directories of audio
audio files are stored.

* **filetypes** *`String[]`* - Each of these should have a directory of their
name under the main directory, which should contain each file of the filetype.

* **statistics** *`Object`* - The arguments to be passed to the internal
StatsHoldr. This must contain values for "volume" and "muted".

* **[getVolumeLocal]** *`Mixed`* - A Function or Number to get the "local"
volume for playLocal calls. Functions are called for a return value, and Numbers 
are constant (defaults to 1).
 
* **[getThemeDefault]** *`Mixed`* - A Function or String to get the default 
theme for playTheme calls. Functions are called for a return value, and Strings 
are constant (defaults to "Theme").


## Sample Usage

1. Creating and using an AudioPlayr to load and play audio files. The  
'Sounds/Samples/mp3' directory should have Coin.mp3 and Bump.mp3 in it

    ```javascript
    var AudioPlayer = new AudioPlayr({
        "directory": "Sounds",
        "fileTypes": ["mp3"],
        "statistics": {
            "prefix": "MyAudioPlayr",
            "proliferate": EightBittr.prototype.proliferate,
            "createElement": EightBittr.prototype.createElement,
            "values": {
                "volume": {
                    "value_default": 0.5,
                    "storeLocally": true
                },
                "muted": {
                    "value_default": 0,
                    "storeLocally": false
                }
            }
        },
        "library": {
            "Sounds": [
                "Coin",
                "Bump"
            ]
        }
    });
    AudioPlayer.play("Coin"); // Returns an <audio> playing Coin.mp3
    ```

2. Creating and using an AudioPlayr to load and play audio files. A theme track
track is kept looping in the background, and the Coin sound is played every
seven seconds.
    
    ```javascript
    var AudioPlayer = new AudioPlayr({
        "directory": "Sounds",
        "fileTypes": ["mp3"],
        "statistics": {
            "prefix": "MyAudioPlayr",
            "proliferate": EightBittr.prototype.proliferate,
            "createElement": EightBittr.prototype.createElement,
            "values": {
                "volume": {
                    "value_default": 0.5,
                    "storeLocally": true
                },
                "muted": {
                    "value_default": 0,
                    "storeLocally": false
                }
            }
        },
        "library": {
            "Sounds": [
                "Coin"
            ],
            "Themes": [
                "Overworld"
            ]
        }
    });
    AudioPlayer.playTheme("Overworld");
    setInterval(function () {
        AudioPlayer.play("Coin");
    }, 7000);
    ```