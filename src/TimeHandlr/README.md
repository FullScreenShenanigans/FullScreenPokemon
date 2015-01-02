# TimeHandlr.js

A timed events library intended to provide a flexible alternative to setTimeout
and setInterval that respects pauses and resumes. Events (which are really
Functions with arguments pre-set) are assigned integer timestamps, and can be
set to repeat a number of times determined by a number or callback Function.
Functionality to automatically "cycle" between certain classes of an Object is
also provided, similar to jQuery's class toggling.


## Basic Architecture

#### Important APIs

* **handleEvents()** - Steps time forward one step. This is the equivalent of a
millisecond passing in real life, so any events that are scheduled for that 
millisecond will be called. 

* **addEvent(***`callback`***, ***`timeDelay`***, [...])** - Adds an event in
a manner similar to setTimeout, though any arguments past the timeDelay will be 
passed to the event callback.

* **addEventInterval(***`callback`***, ***`timeDelay`***, ***`numRepeats`***, 
[...])** - Adds an event in a manner similar to setInterval, though any 
arguments past the numRepeats will be passed to the event callback. The added 
event is inserted into the events container and is set to repeat a numRepeat 
amount of times, though if the callback returns true, it will stop.

* **addEventIntervalSynched(***`callback`***, ***`timeDelay`***, 
***`numRepeats`***, [...])** - Wrapper for addEventInterval that waits to start
callback until the timeDelay is modular with the internal time. This causes all
synched calls to be in unison.

* **addClassCycle(***`thing`***, ***`settings`***, ***`name`***, ***`timing`***)
- Adds a sprite cycle (settings) for a thing, to be referenced by the given name 
in the thing's cycles Object. The sprite cycle switches the thing's class using 
addClass and removeClass (which can be given by the user in reset, but default 
to internally defined Functions).

* **addClassCycleSynched(***`thing`***, ***`settings`***, ***`name`***, 
***`timing`***) - Wrapper for addClassCycle that waits to start callback until 
the timing is modular with the internal time. This causes all synched calls to 
be in unison.

#### Constructor Arguments

* **[timingDefault]** - How many time steps should elapse between class cycles 
(by default, 7).

* **[keyCycles]** - Attribute key in things under which they should store cycles
(defaults to "cycles").

* **[keyClassName]** - Attribute key in things under which they store their 
class name (defaults to "className").

* **[keyOnSpriteCycleStart]** - Attribute key in things under which they should
store a callback for when their class cycles start, if needed (defaults to
"onSpriteCycleStart").

* **[keyDoSpriteCycleStart]** - Attribute key in things under which they should
store their event callback functions for starting the class cycle (defaults to
"doSpriteCycleStart").

* **[keyCycleCheckValidity]** - Attribute key in things under which they should
store whether they can start a class cycle (defaults to undefined, which means
it won't be checked).

* **[copyCycleSettings]** - Whether a copy of settings should be made in 
setSpriteCycle (by default, true).

* **[classAdd]** - A function to add a class to a thing (by default, an internal
one that just appends to the className is used).

* **[classRemove]** - A function to remove a class from a thing (by default, an
internal one that just replaces the string with '' is used). 


## Sample usage


1. Using a TimeHandler to simulate setTimeout (albeit slowly).
    
    ```javascript
    var TimeHandler = new TimeHandlr();
    TimeHandler.addEvent(console.log.bind(console), 500, "Hello world!");
    setInterval(TimeHandler.handleEvents);
    ```
    
2. Using a TimeHandler to simulate setInterval (albeit slowly) seven times.

    ```javascript
    var TimeHandler = new TimeHandlr();
    TimeHandler.addEventInterval(
        console.log.bind(console), 500, 7, "Hello world!"
    );
    setInterval(TimeHandler.handleEvents);
    ```

3. Using a TimeHandler to continuously toggle an element's class between
   "active" and "hidden" every second.

    ```javascript
    var TimeHandler = new TimeHandlr();
    TimeHandler.addClassCycle(
        document.getElementById("test"),
        [ "active", "hidden" ],
        "toggling",
        1
    );
    setInterval(TimeHandler.handleEvents, 1000);
    ```