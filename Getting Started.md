This is the general getting started guide for FullScreenPokemon. You'll want to read the [readme](README.md) first to learn how the general system works.

### Table of Contents

1. [General Usage](#general-usage)
2. [Things](#things)
    1. [ObjectMakr](#objectmakr)
    2. [GroupHoldr](#groupholdr)
    3. [Triggers](#triggers)
    4. [Movements](#movements)
3. [Maps](#Maps)
    1. [MapsCreatr](#mapscreatr)
    3. [MapScreenr](#mapscreenr)

## General Usage

FullScreenPokemon (FullScreenPokemon.js) is the governing class. The global `window.FSP` is an instance of FullScreenPokemon, and everything in the game is a member of FSP. The FullScreenPokemon class itself inherits from GameStartr (GameStartr/GameStartr.js), which inherits from EightBittr (GameStartr/EightBittr.js).

The base GameStartr engine includes a large number of modules, all of which are stored in /GameStartr (GameStartr/AudioPlayr, etc.). The naming schema is to have two words, the second of which is a verb ending with 'r'. The class will have the ending two characters abbreviated to 'r', and the instances aren't abbreviated. FSP.ObjectMaker, for example, is an ObjectMakr instance.

## Things

Everything you see in the game (trees, bushes, the player, etc.) is a Thing. The Thing class is subclassed by a new class for everything (Tree class, Bush class, Player class, etc.). When added to the game, a Thing has a number of properties filled out. These include velocities (xvel and yvel), positioning (top, right, bottom, left), and so on.

Coordinates are relative to the top-right part of the screen. If you have experience with CSS, this is the same as positioning HTML elements absolutely. To add a new Thing to the game, use `FSP.addThing("type", #left, #top)`:

```javascript
FSP.addThing("Bush") // Creates a new Bush and adds it at x=0, y=0
FSP.addThing("Computer", 32, 64) // Creates a new Computer and adds it at x=32, y=64
```

### ObjectMakr

All of FullScreenPokemon's non-GameStartr classes, including Thing and its subclasses, are defined in `settings/objects.js`. In short, the class hierarchy is stored under `FullScreenPokemon.prototype.settings.objects.inheritance` and the attributes for each class are stored under `FullScreenPokemon.prototype.settings.objects.properties`. You may read ObjectMakr's readme for a full explanation.

`FSP.ObjectMakr.make("type")` is how you create a new Thing. It takes in a string for the class name, and optionally an object containing additional properties for it. For example:

```javascript
FSP.ObjectMakr.make("Pokeball") // Creates a new Pokeball

// Creates a new Pokeball with a Potion inside
FSP.ObjectMakr.make("Pokeball", {
    "item": "Potion"
});
```

### GroupHoldr

Each Thing has a groupType string property that determines what group it's considered to be in. These are, in order from visible top to bottom:

* Text
* Character
* Solid
* Scenery
* Terrain

`FSP.GroupHoldr` contains an Array for each of the groups; each Array contains all the Things of that type currently in the game. Things are added to their respective group when added to the game, and removed when they die. The groups are accessible both by static name and via passing in a String:

```javascript
// These all return the Array of Solids
FSP.GroupHolder.getSolidGroup(); 
FSP.GroupHolder.getGroup("Solid");
FSP.GroupHolder.getGroups()["Solid"]; 
```

### Triggers

The objects and map systems provide hooks for Things to have certain member functions called on them. Currently, these are:

* onMake - When the Thing is created (generally FullScreenPokemon.prototype.thingProcess)
* onThingAdded - When the Thing is first added to the game state

### Movements

In order to progress game state and repaint the screen, the game calls `FullScreenPokemon.prototype.upkeep()` every 16 milliseconds (while running at 60fps). This is governed by FSP.GamesRunnr.

Inside upkeep, a maintenance function is called for each group. `FullScreenPokemon.prototype.maintainGeneric` is normally used, except `FullScreenPokemon.prototype.maintainCharacters` is for characters. During these maintenance calls, for each character and solid, if they have a .movement property, it's called as a Function on the Thing. Walking around is done during `maintainCharacters`, and much of the logic is in (or is called by) the character's `onWalkingStart` property (by default, `FullScreenPokemon.prototype.animateCharacterStartWalking`.

## Maps

FullScreenPokemon uses the GameStartr way of storing maps, areas, and locations:

* Maps store a collection of Areas and Locations
* Areas store a setting type (Overworld, Underworld, etc.) and a creation list of commands for creation (next session).
* Locations reference an Area and a x- and y- location in that Area.

`FSP.setMap("map", #location)` may be used to go to a specific map (and, optionally, location number). `FSP.setLocation(#location)` may be used to go to a location in the current map.

### MapsCreatr

Each Area's creation instructions are stored as an Array of Objects. You can see examples of maps in  settings/maps.js. You may read MapScreenr's readme for a full explanation. MapScreenr is the equivalent to ObjectMakr for maps in that it creates them when asked.

### MapScreenr

Information on the current visible screen are stored in `FSP.MapScreenr`. It's the closest thing to a global variable store in FullScreenPokemon; it stores the offsetX and offsetY of the current screen (from moving to the right). the current map's setting ("Land", "Cave", etc.) and many more, which you can see during gameplay.
