# ModAttachr

An addon for for extensible modding functionality. "Mods" register triggers such
as "onModEnable" or "onReset" that can be triggered. 


## Basic Architecture

#### Important APIs

* **addMod(***`mod[, scope]`***)** - Adds a mod and registers all its triggers.

* **enableMod(***`name`***)** - Enables a mod of the given name, if it exists.
The onModEnable event is called for the mod.

* **disableMod(***`name`***)** - Disables a mod of the given name, if it exists.
The onModDisable event is called for the mod.

* **toggleMod(***`name`***)** - Toggles whether a mod is enabled or disabled by
choosing the appropriate function between the previous two.

* **fireEvent(***`name[, ...]`***)** - Triggers the named event under every mod 
that is currently enabled. Any additional arguments are passed to the mod.

* **fireModEvent(***`eventName`, `modName`***)** - Triggers the named event 
under a specific mod.

#### Constructor Arguments

* **mods** *`Object[]`*

* **[storeLocally]** *`Boolean`* - Whether the ModAttachr should store which 
mods have been enabled in local storage via a StatsHoldr (by default, false).

* **[scopeDefault]** *`Mixed`* - An optional default scope to use for each mod, if
one isn't provided by the mod.


## Sample Usage

1. Creating and using a ModAttachr to log event activity.

    ```javascript
    var ModAttacher = new ModAttachr({
        "mods": [{
            "name": "Testing Mod",
            "description": "A mod used for testing a ModAttachr.",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    console.log("I am enabled!");
                },
                "onModDisable": function () {
                    console.log("I am disabled...");
                },
                "log": function () {
                    console.log("You have logged me.");
                }
            }
        }]
    });
    ModAttacher.enableMod("Testing Mod"); // log: "I am enabled!"
    ModAttacher.fireEvent("log"); // log: "You have logged me."
    ModAttacher.disableMod("Testing Mod"); // log: "I am disabled..."
    ```

2. Creating and using a ModAttachr to log event activity, with timestamps and 
numbered logs.

    ```javascript
    var ModAttacher = new ModAttachr({
        "mods": [{
            "name": "Testing Mod",
            "description": "A mod used for testing a ModAttachr.",
            "author": {
                "name": "Josh Goldberg",
                "email": "josh@fullscreenmario.com"
            },
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    console.log("I am enabled!");
                },
                "onModDisable": function () {
                    console.log("I am disabled...");
                },
                "log": function (mod) {
                    var numLog = (mod.settings.numLogs += 1);
                    console.log("Log " + numLog + ": " + Date());
                }
            },
            "settings": {
                "numLogs": 0
            }
        }]
    });
    ModAttacher.enableMod("Testing Mod"); // log: "I am enabled!"
    ModAttacher.fireEvent("log"); // log: "Log 1: Sat Dec 13 2014 21:00:14 ..."
    ModAttacher.fireEvent("log"); // log: "Log 2: Sat Dec 13 2014 21:00:14 ..."
    ModAttacher.disableMod("Testing Mod"); // log: "I am disabled..."
    ```