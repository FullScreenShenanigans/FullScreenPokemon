# InputWritr

A general utility for automating interactions with user-called events linked
with callbacks. Pipe functions are available that take in user input, switch
on the event code, and call the appropriate callback. These Pipe functions 
can be made during runtime; further utilities allow for saving and playback 
of input histories in JSON format.


## Basic Architecture

#### Important APIs

* **addEvent(***`trigger`, `label`, `callback`***)** - Adds a triggerable event 
by marking a new callback under the trigger's triggers. Any aliases for the 
label are also given the callback.

* **addAliasValues(***`name`,`values`***)** - Adds a list of values by which an 
event may be triggered. Values should be the character key codes associated with
the event.

* **getHistory()** - Returns the history of events that have been fired.

* **playEvents(***`events`***) - Plays a series events, such as those returned 
by getHistory.

* **setCanTrigger(***`canTriggerNew`***)** - Sets whether it is currently 
accepting new inputs.

* **setIsRecording(***`isRecordingNew`***)** - Sets whether it is currently 
recording triggered inputs.

#### Important Member Variables

* **triggers** *`Object<String, Object>>`* - A mapping of events (string names)
to their key codes (typically numbers) to their callbacks. 

* **aliases** *`Object<String, String[]>`* - Known, allowed aliase names for 
triggers.

* **history** *`Object<String, Array>`* - A history of all the events that have
been fired.

#### Constructor Arguments

* **triggers** *`Object`*

* **[aliases]** *`Object<String, String[]>`*

* **[getTimestamp]** *`Function`* - A Function to return the current time as a 
Number. If  not provided, all variations of performance.now are tried; if they 
don't exist, Date.getTime is used.

* **[eventInformation]** *`Mixed`* - The first argument to be passed to event
callbacks (defaults to undefined).

* **[canTrigger]** *`Boolean`* - Whether inputs are currently allowed to trigger`
(defaults to true).

* **[isRecording]** *`Boolean`* - Whether triggered inputs are currently allowed
to be written to history (defaults to true).


## Sample Usage

1. Creating and using an InputWritr to log keystrokes on the 'a' key.

    ```javascript
    var InputWriter = new InputWritr({
        "triggers": {
            "onkeydown": {
                "65": function () {
                    console.log("Hello!");
                }
            }
        }
    });
    document.body.onkeydown = InputWriter.makePipe("onkeydown", "keyCode");
    ```
    
2. Creating and using an InputWritr to simulate WASD arrow controls.

    ```javascript
    var InputWriter = new InputWritr({
        "triggers": {
            "aliases": {
                "up": [87, 38],    // w, up
                "right": [68, 39], // d, right
                "down": [83, 40],  // s, down
                "left": [65, 37],  // a, left
            },
            "onkeydown": {
                "up": console.log.bind(console, "up"),
                "right": console.log.bind(console, "right"),
                "down": console.log.bind(console, "down"),
                "left": console.log.bind(console, "left"),
            }
        }
    });
    document.body.onkeydown = InputWriter.makePipe("onkeydown", "keyCode");
    ```