# GameStartr

GameStartr is a JavaScript game engine used as a base for creating sprite-based
2D games, particularily retro remakes such as FullScreenMario. The GameStartr
class inherits from EightBittr and requries the use of 18 modules, all of which
are sub-directories here and follow the same naming scheme. 

GameStartr and EightBittr themselves contain game-independent functions for 
child implementations to make use of, particularily involving physics
manipulations, graphics rendering, and reset functions. EightBittr as a parent
class does not contain functions that reference the modules; GameStartr does.


## Basic Usage

GameStartr does nothing on its own - you must create a child class. That child 
class's prototype must have a settings member variable to contain settings for
the modules.

    ```javascript
    function MyOwnGame() {
        /* Constructor logic here */
    };
    
    MyOwnGame.prototype.settings = {
        "audio": { /* ... */ },
        "collisions": { /* ... */ },
        "editor": { /* ... */ },
        "events": { /* ... */ },
        "generator": { /* ... */ },
        "input": { /* ... */ },
        "maps": { /* ... */ },
        "mods": { /* ... */ },
        "objects": { /* ... */ },
        "quadrants": { /* ... */ },
        "renderer": { /* ... */ },
        "runner": { /* ... */ },
        "sprites": { /* ... */ },
        "statistics": { /* ... */ },
        "ui": { /* ... */ },
    };
    
    
    var MyOwnGameInstance = new MyOwnGame();
    MyOwnGameInstance.reset();
    ```

Actual requirements vary: research each module before attempting to use them.