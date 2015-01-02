# MapsHandlr.js

Map manipulator and spawner for GameStarter maps that is the front-end
counterpart to MapsCreatr.js. PreThing listings are loaded from Maps stored
in a MapsCreatr and added or removed from user input. Area properties are
given to a MapScreenr when a new Area is loaded.

Examples are not available for MapsHandlr, as the required code would be very
substantial. Instead see GameStartr.js and its map manipulation code.


## Basic Architecture

#### Important APIs

* **getMap(***[`name`]***) - Retrieves the current map if no name is given, or
a map of a given name if it is.

* **setMap(***`name`[, `location`]***) - Sets the currently manipulated Map in 
the handler to be the one under a given name. Note that this will do very little
unless a location is provided.

* **setLocation(***`name`***) - Goes to a particular location in the given map. 
Area attributes are copied to the MapScreener, PreThings are loaded, and 
stretches and afters are checked.

* **spawnMap(***`direction`, `top`, `right`, `bottom`, `left`***) - Calls 
onSpawn on every PreThing touched by the given bounding box, determined in order
of the given direction. 

* **unspawnMap(***`direction`, `top`, `right`, `bottom`, `left`***) - Calls 
onUnspawn on every PreThing touched by the given bounding box, determined in
order of the given direction. 

#### Important Member Variables

* **MapsCreator** *`MapsCreatr`* - A MapsCreatr container for Maps from which 
this obtains PreThing settings.

* **MapScreener** *`MapScreenr`* - A MapScreenr container for attributes copied
from Areas.

* **prethings** *`Object`* - The current area's listing of PreThings that are to
be added in order during spawnMap.

#### Constructor Arguments

* **MapsCreator** *`MapsCreatr`*

* **MapScreener** *`MapScreenr`*

* **[onSpawn]** *`Function`* - A callback for when a PreThing should be spawned.

* **[onUnspawn]** *`Function`* - A callback for when a PreThing should be 
unspawned.

* **[screenAttributes]** *`String[]`* - The property names to copy from Areas
to MapScreener (by default, none).

* **[afterAdd]** *`Function`* - A callback for when an Area provides an 
"afters" command to add PreThings to the end of an Area. 

* **[stretchAdd]** *`Function`* - A callback for when an Area provides a
"stretch" PreThing[], to add PreThings to stretch across an Area.