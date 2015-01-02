/**
 * GameStartr.js
 * 
 * An abstract class used as a base for creating sprite-based 2D games. Utility
 * functions and an expansive skeleton are available for a child class to make
 * us of, particular with physics manipulations, graphics rendering, and reset
 * functions based around the 19 required modules.
 * 
 * Descendent classes of GameStartr must put their settings in their prototype
 * under settings. Reset Functions below list their required file names.
 * 
 * The following member attributes of child classes are required:
 * gameStart {Function}
 * onGamePlay {Function}
 * onGamePause {Function}
 * canInputsTrigger {Function}
 * setMap {Function} 
 * setLocation {Function}
 */
var GameStartr = (function (EightBittr) {
    "use strict";

    // Use an EightBittr as the class parent, with EightBittr's constructor
    var EightBitterProto = new EightBittr(),

        // Used for combining arrays from the prototype to this
        proliferate = EightBitterProto.proliferate,
        proliferateHard = EightBitterProto.proliferateHard;

    /**
     * 
     */
    function GameStartr(customs) {
        if (typeof (customs) === "undefined") {
            customs = {};
        }

        EightBittr.call(this, {
            "constants": customs.constants,
            "constructor": customs.constructor || GameStartr,
            "customs": customs,
            "requirements": {
                "global": {
                    "AudioPlayr": "src/AudioPlayr/AudioPlayr.js",
                    "ChangeLinr": "src/ChangeLinr/ChangeLinr.js",
                    "FPSAnalyzr": "src/FPSAnalyzr/FPSAnalyzr.js",
                    "GamesRunnr": "src/GamesRunnr/GamesRunnr.js",
                    "GroupHoldr": "src/GroupHoldr/GroupHoldr.js",
                    "InputWritr": "src/InputWritr/InputWritr.js",
                    "LevelEditr": "src/LevelEditr/LevelEditr.js",
                    "NumberMakr": "src/NumberMakr/NumberMakr.js",
                    "MapScreenr": "src/MapScreenr/MapScreenr.js",
                    "MapsHandlr": "src/MapsHandlr/MapsHandlr.js",
                    "ModAttachr": "src/ModAttachr/ModAttachr.js",
                    "ObjectMakr": "src/ObjectMakr/ObjectMakr.js",
                    "PixelDrawr": "src/PixelDrawr/PixelDrawr.js",
                    "PixelRendr": "src/PixelRendr/PixelRendr.js",
                    "QuadsKeepr": "src/QuadsKeepr/QuadsKeepr.js",
                    "StatsHoldr": "src/StatsHoldr/StatsHoldr.js",
                    "StringFilr": "src/StringFilr/StringFilr.js",
                    "ThingHittr": "src/ThingHittr/ThingHittr.js",
                    "TimeHandlr": "src/TimeHandlr/TimeHandlr.js"
                }
            }
        });
    }

    GameStartr.prototype = EightBitterProto;

    // Subsequent settings will be stored in GameStartr.prototype.settings
    EightBitterProto.settings = {};
    EightBitterProto.resets = [
        "resetObjectMaker",
        "resetPixelRender",
        "resetTimeHandler",
        "resetAudioPlayer",
        "resetQuadsKeeper",
        "resetGamesRunner",
        "resetStatsHolder",
        "resetGroupHolder",
        "resetThingHitter",
        "resetMapScreener",
        "resetPixelDrawer",
        "resetNumberMaker",
        "resetMapsCreator",
        "resetMapsHandler",
        "resetInputWriter",
        "resetLevelEditor",
        "resetWorldSeeder",
        "resetModAttacher",
        "startModAttacher",
        "resetContainer"
    ];


    /* Resets
    */

    /**
     * Resets the EightBittr by calling the parent EightBittr.prototype.reset.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     */
    function reset(EightBitter, customs) {
        EightBittr.prototype.reset(EightBitter, EightBitter.resets, customs);
    };

    /**
     * Resets the EightBittr and records the time by calling the parent 
     * EightBittr.prototype.resetTimed.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @return {Array} How long each reset Function took followed by the entire
     * operation, in milliseconds.
     */
    function resetTimed(EightBitter, customs) {
        return EightBittr.prototype.resetTimed(
            EightBitter, EightBitter.resets, customs
        );
    };

    /**
     * Sets self.ObjectMaker.
     * 
     * Because many Thing functions require access to other FSM modules, each is
     * given a reference to this container FSM via properties.Thing.EightBitter. 
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): ObjectMakr (src/ObjectMakr/ObjectMakr.js)
     *                          objects.js (settings/objects.js)
     */
    function resetObjectMaker(EightBitter, customs) {
        EightBitter.ObjectMaker = new ObjectMakr(proliferate({
            "properties": {
                "Quadrant": {
                    "EightBitter": EightBitter
                },
                "Thing": {
                    "EightBitter": EightBitter
                }
            }
        }, EightBitter.settings.objects));
    }

    /**
     * Sets self.QuadsKeeper.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): QuadsKeepr (src/QuadsKeepr/QuadsKeepr.js)
     *                          quadrants.js (settings/quadrants.js)
     */
    function resetQuadsKeeper(EightBitter, customs) {
        var quadrantWidth = customs.width / (EightBitter.settings.quadrants.numCols - 3),
            quadrantHeight = customs.height / (EightBitter.settings.quadrants.numRows - 2);

        EightBitter.QuadsKeeper = new QuadsKeepr(proliferate({
            "ObjectMaker": EightBitter.ObjectMaker,
            "createCanvas": EightBitter.createCanvas,
            "quadrantWidth": quadrantWidth,
            "quadrantHeight": quadrantHeight,
            "startLeft": -quadrantWidth,
            "startHeight": -quadrantHeight,
            "onAdd": EightBitter.onAreaSpawn.bind(EightBitter, EightBitter),
            "onRemove": EightBitter.onAreaUnspawn.bind(EightBitter, EightBitter),
        }, EightBitter.settings.quadrants));
    }

    /**
     * Sets self.PixelRender.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): PixelRendr (src/PixelRendr/PixelRendr.js)
     *                          sprites.js (settings/sprites.js)
     */
    function resetPixelRender(EightBitter, customs) {
        EightBitter.PixelRender = new PixelRendr(proliferate({
            "QuadsKeeper": EightBitter.QuadsKeeper,
            "unitsize": EightBitter.unitsize,
            "scale": EightBitter.scale
        }, EightBitter.settings.sprites));
    }

    /**
     * Sets self.PixelDrawer.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): PixelDrawr (src/PixelDrawr/PixelDrawr.js)
     *                          renderer.js (settings/renderer.js)
     */
    function resetPixelDrawer(EightBitter, customs) {
        EightBitter.PixelDrawer = new PixelDrawr(proliferate({
            "PixelRender": EightBitter.PixelRender,
            "MapScreener": EightBitter.MapScreener,
            "createCanvas": EightBitter.createCanvas,
            "unitsize": EightBitter.unitsize,
            "innerWidth": customs.width,
            "generateObjectKey": EightBitter.generateObjectKey
        }, EightBitter.settings.renderer));
    }

    /**
     * Sets EightBitter.TimeHandler.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): TimeHandlr (src/TimeHandlr/TimeHandlr.js)
     *                          events.js (settings/events.js)
     */
    function resetTimeHandler(EightBitter, customs) {
        EightBitter.TimeHandler = new TimeHandlr(proliferate({
            "classAdd": EightBitter.addClass,
            "classRemove": EightBitter.removeClass
        }, EightBitter.settings.events));
    }

    /**
     * Sets self.AudioPlayer.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): AudioPlayr (src/AudioPlayr/AudioPlayr.js)
     *                          audio.js (settings/audio.js)
     */
    function resetAudioPlayer(EightBitter, customs) {
        EightBitter.AudioPlayer = new AudioPlayr(proliferate({
            "statistics": {
                "proliferate": EightBitter.proliferate
            }
        }, EightBitter.settings.audio));
    }

    /**
     * Sets self.GamesRunner.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): GamesRunnr (src/GamesRunnr/GamesRunnr.js)
     *                          runner.js (settings/runner.js)
     */
    function resetGamesRunner(EightBitter, customs) {
        EightBitter.GamesRunner = new GamesRunnr(proliferate({
            "scope": EightBitter,
            "onPlay": EightBitter.onGamePlay.bind(EightBitter, EightBitter),
            "onPause": EightBitter.onGamePause.bind(EightBitter, EightBitter)
        }, EightBitter.settings.runner));
    }

    /**
     * Sets self.StatsHolder.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): StatsHoldr (src/StatsHoldr/StatsHoldr.js)
     *                          statistics.js (settings/statistics.js)
     */
    function resetStatsHolder(EightBitter, customs) {
        EightBitter.StatsHolder = new StatsHoldr(proliferate({
            "callbackArgs": [EightBitter],
            "proliferate": EightBitter.proliferate,
            "createElement": EightBitter.createElement
        }, EightBitter.settings.statistics));
    }

    /**
     * Sets self.GroupHolder.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): GroupHoldr (src/ThingHittr/GroupHoldr.js)
     *                          groups.js (settings/groups.js)
     */
    function resetGroupHolder(EightBitter, customs) {
        EightBitter.GroupHolder = new GroupHoldr(EightBitter.settings.groups);
    }

    /**
     * Sets self.ThingHitter.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): ThingHittr (src/ThingHittr/ThingHittr.js)
     *                          collisions.js (settings/collisions.js)
     */
    function resetThingHitter(EightBitter, customs) {
        EightBitter.ThingHitter = new ThingHittr(proliferate({
            "scope": EightBitter
        }, EightBitter.settings.collisions));
    }

    /**
     * Sets self.MapScreener.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): MapScreenr (src/MapScreenr/MapScreenr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapScreener(EightBitter, customs) {
        EightBitter.MapScreener = new MapScreenr({
            "EightBitter": EightBitter,
            "unitsize": EightBitter.unitsize,
            "width": customs.width,
            "height": customs.height,
            "variableArgs": [EightBitter],
            "variables": EightBitter.settings.maps.screenVariables
        });
    }

    /**
     * Sets self.NumberMaker.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): NumberMaker (src/NumberMakr/NumberMakr.js)
     */
    function resetNumberMaker(EightBitter, customs) {
        EightBitter.NumberMaker = new NumberMakr();
    }

    /**
     * Sets self.MapCreator.
     * 
     * @param {EightBittr} EightBitter
     * @remarks Requirement(s): MapCreatr (src/MapCreatr/MapCreatr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapsCreator(EightBitter, customs) {
        EightBitter.MapsCreator = new MapsCreatr({
            "ObjectMaker": EightBitter.ObjectMaker,
            "groupTypes": EightBitter.settings.maps.groupTypes,
            "macros": EightBitter.settings.maps.macros,
            "entrances": EightBitter.settings.maps.entrances,
            "maps": EightBitter.settings.maps.library,
            "scope": EightBitter
        });
    }

    /**
     * Sets self.MapsHandler.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): MapsHandlr (src/MapsHandlr/MapsHandlr.js)
     *                          maps.js (settings/maps.js)
     */
    function resetMapsHandler(EightBitter, customs) {
        EightBitter.MapsHandler = new MapsHandlr({
            "MapsCreator": EightBitter.MapsCreator,
            "MapScreener": EightBitter.MapScreener,
            "screenAttributes": EightBitter.settings.maps.screenAttributes,
            "onSpawn": EightBitter.settings.maps.onSpawn
        });
    }

    /**
     * Sets self.InputWriter.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): InputWritr (src/InputWritr/InputWritr.js)
     *                          input.js (settings/input.js)
     */
    function resetInputWriter(EightBitter, customs) {
        EightBitter.InputWriter = new InputWritr(proliferate({
            "canTrigger": EightBitter.canInputsTrigger.bind(EightBitter, EightBitter)
        }, EightBitter.settings.input.InputWritrArgs));
    }

    /**
     * Sets self.LevelEditor.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): LevelEditr (src/LevelEditr/LevelEditr.js)
     *                          editor.js (settings/editor.js)
     */
    function resetLevelEditor(EightBitter, customs) {
        EightBitter.LevelEditor = new LevelEditr(proliferate({
            "GameStarter": EightBitter,
            "beautifier": js_beautify // Eventually there will be a custom beautifier... maybe
        }, EightBitter.settings.editor));
    }

    /**
     * Sets self.WorldSeeder.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): WorldSeedr (src/WorldSeedr/WorldSeedr.js)
     *                          generator.js (settings/generator.js)
     */
    function resetWorldSeeder(EightBitter, customs) {
        EightBitter.WorldSeeder = new WorldSeedr(proliferate({
            "random": EightBitter.NumberMaker.random,
            "onPlacement": EightBitter.mapPlaceRandomCommands.bind(EightBitter, EightBitter)
        }, EightBitter.settings.generator));
    }

    /**
     * Sets self.ModAttacher.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     * @remarks Requirement(s): ModAttachr (src/ModAttachr/ModAttachr.js)
     *                          mods.js (settings/mods.js)
     */
    function resetModAttacher(EightBitter, customs) {
        EightBitter.ModAttacher = new ModAttachr(proliferate({
            "scopeDefault": EightBitter,
            "StatsHoldr": StatsHoldr,
            "proliferate": EightBitter.proliferate,
            "createElement": EightBitter.createElement
        }, EightBitter.settings.mods));
    }

    /** 
     * Starts self.ModAttacher. All mods are enabled, and the "onReady" trigger
     * is fired.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     */
    function startModAttacher(EightBitter, customs) {
        var mods = customs.mods,
            i;

        if (mods) {
            for (i in mods) {
                if (mods[i]) {
                    EightBitter.ModAttacher.enableMod(i);
                }
            }
        }

        EightBitter.ModAttacher.fireEvent("onReady", EightBitter, EightBitter);
    }

    /**
     * Resets the parent HTML container. Width and height are set by customs, 
     * and canvas and StatsHolder container elements are added.
     * 
     * @param {EightBittr} EightBitter
     * @param {Object} [customs]
     */
    function resetContainer(EightBitter, customs) {
        EightBitter.container = EightBitter.createElement("div", {
            "className": "EightBitter",
            "style": EightBitter.proliferate({
                "position": "relative",
                "width": customs.width + "px",
                "height": customs.height + "px"
            }, customs.style)
        });

        EightBitter.canvas = EightBitter.createCanvas(customs.width, customs.height);
        EightBitter.PixelDrawer.setCanvas(EightBitter.canvas);

        EightBitter.container.appendChild(EightBitter.canvas);
    }


    /* Global manipulations
    */

    /**
     * Scrolls the game window by shifting all Things and checking for quadrant
     * refreshes.
     * 
     * @this {EightBittr}
     * @param {Number} dx   How far to scroll horizontally.
     * @param {Number} [dy]   How far to scroll vertically.
     */
    function scrollWindow(dx, dy) {
        var EightBitter = EightBittr.ensureCorrectCaller(this);

        dx = dx | 0;
        dy = dy | 0;

        if (!dx && !dy) {
            return;
        }

        EightBitter.MapScreener.shift(dx, dy);
        EightBitter.shiftAll(-dx, -dy);

        EightBitter.QuadsKeeper.shiftQuadrants(-dx, -dy);
    }

    /**
     * Scrolls everything but a single Thing.
     * 
     * 
     * @this {EightBittr}
     * @param {Thing} thing
     * @param {Number} dx   How far to scroll horizontally.
     * @param {Number} [dy]   How far to scroll vertically.
     */
    function scrollThing(thing, dx, dy) {
        var saveleft = thing.left,
            savetop = thing.top;

        thing.EightBitter.scrollWindow(dx, dy);
        thing.EightBitter.setLeft(thing, saveleft);
        thing.EightBitter.setTop(thing, savetop);
    }

    /**
     * Spawns all Things within a given area that should be there. 
     * 
     * @param {EightBittr} EightBitter
     * @param {String} direction
     * @param {Number} top
     * @param {Number} right
     * @param {Number} bottom
     * @param {Number} left
     * @remarks This is generally called by a QuadsKeepr during a screen update.
     */
    function onAreaSpawn(EightBitter, direction, top, right, bottom, left) {
        EightBitter.MapsHandler.spawnMap(
            direction,
            (top + EightBitter.MapScreener.top) / EightBitter.unitsize,
            (right + EightBitter.MapScreener.left) / EightBitter.unitsize,
            (bottom + EightBitter.MapScreener.top) / EightBitter.unitsize,
            (left + EightBitter.MapScreener.left) / EightBitter.unitsize
        );
    }

    /**
     * "Unspawns" all Things within a given area that should be gone by marking
     * their PreThings as not in game.
     * 
     * @param {EightBittr} EightBitter
     * @param {String} direction
     * @param {Number} top
     * @param {Number} right
     * @param {Number} bottom
     * @param {Number} left
     * @remarks This is generally called by a QuadsKeepr during a screen update.
     */
    function onAreaUnspawn(EightBitter, direction, top, right, bottom, left) {
        EightBitter.MapsHandler.unspawnMap(
            direction,
            (top + EightBitter.MapScreener.top) / EightBitter.unitsize,
            (right + EightBitter.MapScreener.left) / EightBitter.unitsize,
            (bottom + EightBitter.MapScreener.top) / EightBitter.unitsize,
            (left + EightBitter.MapScreener.left) / EightBitter.unitsize
        );
    }

    /**
     * Adds a new Thing to the game at a given position, relative to the top
     * left corner of the screen. 
     * 
     * @param {Mixed} thing   What type of Thing to add. This may be a String of
     *                        the class title, an Array containing the String
     *                        and an Object of settings, or an actual Thing.
     * @param {Number} [left]   Defaults to 0.
     * @param {Number} [top]   Defaults to 0.
     */
    function addThing(thing, left, top) {
        if (typeof (thing) === "string" || thing instanceof String) {
            thing = this.ObjectMaker.make(thing);
        } else if (thing.constructor === Array) {
            thing = this.ObjectMaker.make.apply(this.ObjectMaker, thing);
        }

        if (arguments.length > 2) {
            thing.EightBitter.setLeft(thing, left);
            thing.EightBitter.setTop(thing, top);
        } else if (arguments.length > 1) {
            thing.EightBitter.setLeft(thing, left);
        }

        thing.EightBitter.updateSize(thing);

        thing.EightBitter.GroupHolder.getFunctions().add[thing.groupType](thing);
        thing.placed = true;

        // This will typically be a TimeHandler.cycleClass call
        if (thing.onThingAdd) {
            thing.onThingAdd(thing);
        }

        thing.EightBitter.PixelDrawer.setThingSprite(thing);

        // This will typically be a spawn* call
        if (thing.onThingAdded) {
            thing.onThingAdded(thing);
        }

        thing.EightBitter.ModAttacher.fireEvent("onAddThing", thing, left, top);

        return thing;
    }

    /**
     * Processes a Thing so that it is ready to be placed in gameplay. There are
     * a lot of steps here: width and height must be set with defaults and given
     * to spritewidth and spriteheight, a quadrants Array must be given, the 
     * sprite must be set, attributes and onThingMake called upon, and initial
     * class cycles and flipping set.
     * 
     * @param {Thing} thing
     * @param {String} type   What type Thing this is (the name of the class).
     * @param {Object} [settings]   Additional settings to be given to the 
     *                              Thing.
     * @param {Object} defaults   The default settings for the Thing's class.
     * @remarks This is generally called as the onMake call in an ObjectMakr.
     */
    function thingProcess(thing, type, settings, defaults) {
        // If the Thing doesn't specify its own title, use the type by default
        thing.title = thing.title || type;

        // If a width/height is provided but no spritewidth/height,
        // use the default spritewidth/height
        if (thing.width && !thing.spritewidth) {
            thing.spritewidth = defaults.spritewidth || defaults.width;
        }
        if (thing.height && !thing.spriteheight) {
            thing.spriteheight = defaults.spriteheight || defaults.height;
        }

        // "Infinity" height refers to objects that reach exactly to the bottom
        if (thing.height === "Infinity") {
            thing.height = thing.EightBitter.getAbsoluteHeight(thing.y) / thing.EightBitter.unitsize;
        }

        // Each thing has at least 4 maximum quadrants (for the QuadsKeepr)
        var maxquads = 4,
            num;
        num = Math.floor(
            thing.width * (
                thing.EightBitter.unitsize / thing.EightBitter.QuadsKeeper.getQuadrantWidth()
            )
        );
        if (num > 0) {
            maxquads += ((num + 1) * maxquads / 2);
        }
        num = Math.floor(
            thing.height * (
                thing.EightBitter.unitsize / thing.EightBitter.QuadsKeeper.getQuadrantHeight()
            )
        );
        if (num > 0) {
            maxquads += ((num + 1) * maxquads / 2);
        }
        thing.maxquads = maxquads;
        thing.quadrants = new Array(maxquads);

        // Basic sprite information
        thing.spritewidth = thing.spritewidth || thing.width;
        thing.spriteheight = thing.spriteheight || thing.height;

        // Sprite sizing
        thing.spritewidthpixels = thing.spritewidth * thing.EightBitter.unitsize;
        thing.spriteheightpixels = thing.spriteheight * thing.EightBitter.unitsize;

        // Canvas, context, imageData
        thing.canvas = thing.EightBitter.createCanvas(
            thing.spritewidthpixels, thing.spriteheightpixels
        );
        thing.context = thing.canvas.getContext("2d");
        thing.imageData = thing.context.getImageData(
            0, 0, thing.spritewidthpixels, thing.spriteheightpixels
        );

        if (thing.opacity !== 1) {
            thing.EightBitter.setOpacity(thing, thing.opacity);
        }

        // Attributes, such as Koopa.smart
        if (thing.attributes) {
            thingProcessAttributes(thing, thing.attributes, settings);
        }

        // Important custom functions
        if (thing.onThingMake) {
            thing.onThingMake(thing, settings);
        }

        // Initial class / sprite setting
        thing.EightBitter.setSize(thing, thing.width, thing.height);
        thing.EightBitter.setClassInitial(thing, thing.name || thing.title);

        // Sprite cycles
        var cycle;
        if (cycle = thing.spriteCycle) {
            thing.EightBitter.TimeHandler.addClassCycle(
                thing, cycle[0], cycle[1] || null, cycle[2] || null
            );
        }
        if (cycle = thing.spriteCycleSynched) {
            thing.EightBitter.TimeHandler.addClassCycleSynched(
                thing, cycle[0], cycle[1] || null, cycle[2] || null
            );
        }

        // flipHoriz and flipVert initially 
        if (thing.flipHoriz) {
            thing.EightBitter.flipHoriz(thing);
        }
        if (thing.flipVert) {
            thing.EightBitter.flipVert(thing);
        }

        // Mods!
        thing.EightBitter.ModAttacher.fireEvent(
            "onThingMake", thing.EightBitter, thing, type, settings, defaults
        );
    }

    /**
     * Processes additional Thing attributes. For each attribute the Thing's
     * class says it may have, if it has it, the attribute's key is appeneded to
     * the Thing's name and the attribute value proliferated onto the Thing.
     * 
     * @param {Thing} thing
     * @param {Object} attributes
     */
    function thingProcessAttributes(thing, attributes) {
        var attribute;

        // For each listing in the attributes...
        for (attribute in attributes) {
            // If the thing has that attribute as true:
            if (thing[attribute]) {
                // Add the extra options
                proliferate(thing, attributes[attribute]);
                // Also add a marking to the name, which will go into the className
                if (thing.name) {
                    thing.name += ' ' + attribute;
                } else {
                    thing.name = thing.title + ' ' + attribute;
                }
            }
        }
    }

    /**
     * Runs through commands generated by a WorldSeedr and evaluates all of 
     * to create PreThings via MapsCreator.analyzePreSwitch. 
     * 
     * @param {EightBittr} EightBitter
     * @param {Object[]} generatedCommands   The commands generated by a
     *                                       WorldSeedr.generateFull call.
     */
    function mapPlaceRandomCommands(EightBitter, generatedCommands) {
        var MapsCreator = EightBitter.MapsCreator,
            MapsHandler = EightBitter.MapsHandler,
            prethings = MapsHandler.getPreThings(),
            area = MapsHandler.getArea(),
            map = MapsHandler.getMap(),
            command, output, i;

        for (i = 0; i < generatedCommands.length; i += 1) {
            command = generatedCommands[i];

            output = {
                "thing": command.title,
                "x": command.left,
                "y": command.top
            };

            if (command.arguments) {
                EightBitter.proliferateHard(output, command.arguments, true);
            }

            MapsCreator.analyzePreSwitch(output, prethings, area, map);
        }
    }


    /* Physics & similar
    */

    /** 
     * Sets a Thing's "changed" flag to true, which indicates to the PixelDrawr
     * to redraw the Thing and its quadrant.
     * 
     * @param {Thing} thing
     */
    function markChanged(thing) {
        thing.changed = true;
    }

    /**
     * Shifts a Thing vertically using the EightBittr utility, and marks the
     * Thing as having a changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} dy
     * @param {Boolean} [notChanged]   Whether to skip marking the Thing as
     *                                 changed (by default, false).
     */
    function shiftVert(thing, dy, notChanged) {
        EightBittr.prototype.shiftVert(thing, dy);

        if (!notChanged) {
            thing.EightBitter.markChanged(thing);
        }
    }

    /**
     * Shifts a Thing horizontally using the EightBittr utility, and marks the
     * Thing as having a changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} dx
     * @param {Boolean} [notChanged]   Whether to skip marking the Thing as
     *                                 changed (by default, false).
     */
    function shiftHoriz(thing, dx, notChanged) {
        EightBittr.prototype.shiftHoriz(thing, dx);

        if (!notChanged) {
            thing.EightBitter.markChanged(thing);
        }
    }

    /**
     * Sets a Thing's top using the EightBittr utility, and marks the Thing as
     * having a changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} top
     */
    function setTop(thing, top) {
        EightBittr.prototype.setTop(thing, top);
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Sets a Thing's right using the EightBittr utility, and marks the Thing as
     * having a changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} right
     */
    function setRight(thing, right) {
        EightBittr.prototype.setRight(thing, right);
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Sets a Thing's bottom using the EightBittr utility, and marks the Thing
     * as having a changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} bottom
     */
    function setBottom(thing, bottom) {
        EightBittr.prototype.setBottom(thing, bottom);
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Sets a Thing's left using the EightBittr utility, and marks the Thing
     * as having a changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} left
     */
    function setLeft(thing, left) {
        EightBittr.prototype.setLeft(thing, left);
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Shifts a thing both horizontally and vertically. If the Thing marks 
     * itself as having a parallax effect (parallaxHoriz or parallaxVert), that
     * proportion of movement is respected (.5 = half, etc.).
     * 
     * @param {Thing} thing
     * @param {Number} dx
     * @param {Number} dy
     * @param {Boolean} [notChanged]   Whether to skip marking the Thing as
     *                                 changed (by default, false).
     */
    function shiftBoth(thing, dx, dy, notChanged) {
        dx = dx || 0;
        dy = dy || 0;

        if (!thing.noshiftx) {
            if (thing.parallaxHoriz) {
                thing.EightBitter.shiftHoriz(
                    thing, thing.parallaxHoriz * dx, notChanged
                );
            } else {
                thing.EightBitter.shiftHoriz(thing, dx, notChanged);
            }
        }

        if (!thing.noshifty) {
            if (thing.parallaxVert) {
                thing.EightBitter.shiftVert(
                    thing, thing.parallaxVert * dy, notChanged
                );
            } else {
                thing.EightBitter.shiftVert(thing, dy, notChanged);
            }
        }
    }

    /**
     * Calls shiftBoth on all members of an Array.
     * 
     * @param {Number} dx
     * @param {Number} dy
     * @param {Boolean} [notChanged]   Whether to skip marking the Thing as
     *                                 changed (by default, false).
     */
    function shiftThings(things, dx, dy, notChanged) {
        for (var i = things.length - 1; i >= 0; i -= 1) {
            things[i].EightBitter.shiftBoth(things[i], dx, dy, notChanged);
        }
    }

    /**
     * Calls shiftBoth on all groups in the calling EightBittr's GroupHoldr.
     * 
     * @this {EightBittr}
     * @param {Number} dx
     * @param {Number} dy
     */
    function shiftAll(dx, dy) {
        var EightBitter = EightBittr.ensureCorrectCaller(this);
        EightBitter.GroupHolder.callAll(
            EightBitter, EightBitter.shiftThings, dx, dy, true
        );
    }

    /**
     * Sets the width and unitwidth of a Thing, and optionally updates the
     * Thing's spritewidth and spritewidth pixels, and/or calls updateSize.
     * The thing is marked as having changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} width
     * @param {Boolean} [updateSprite]   Whether to update the Thing's
     *                                   spritewidth and spritewidthpixels (by
     *                                   default, false).
     * @param {Boolean} [updateSize]   Whether to call updateSize on the Thing
     *                                 (by default, false).
     */
    function setWidth(thing, width, updateSprite, updateSize) {
        thing.width = width;
        thing.unitwidth = width * thing.EightBitter.unitsize;

        if (updateSprite) {
            thing.spritewidth = width;
            thing.spritewidthpixels = width * thing.EightBitter.unitsize;
        }

        if (updateSize) {
            thing.EightBitter.updateSize(thing);
        }

        thing.EightBitter.markChanged(thing);
    }

    /**
     * Sets the height and unitheight of a Thing, and optionally updates the
     * Thing's spriteheight and spriteheight pixels, and/or calls updateSize.
     * The thing is marked as having changed appearance.
     * 
     * @param {Thing} thing
     * @param {Number} height
     * @param {Boolean} [updateSprite]   Whether to update the Thing's
     *                                   spriteheight and spriteheightpixels (by
     *                                   default, false).
     * @param {Boolean} [updateSize]   Whether to call updateSize on the Thing
     *                                 (by default, false).
     */
    function setHeight(thing, height, updateSprite, updateSize) {
        thing.height = height;
        thing.unitheight = height * thing.EightBitter.unitsize;

        if (updateSprite) {
            thing.spriteheight = height;
            thing.spriteheightpixels = height * thing.EightBitter.unitsize;
        }

        if (updateSize) {
            thing.EightBitter.updateSize(thing);
        }

        thing.EightBitter.markChanged(thing);
    }

    /**
     * Utility to call both setWidth and setHeight on a Thing.
     * 
     * @param {Thing} thing
     * @param {Number} width
     * @param {Number} height
     * @param {Boolean} [updateSprite]   Whether to update the Thing's
     *                                   spritewidth, spriteheight, 
     *                                   spritewidthpixels, and
     *                                   spritspriteheightpixels (by default,
     *                                   false).
     * @param {Boolean} [updateSize]   Whether to call updateSize on the Thing
     *                                 (by default, false).
     */
    function setSize(thing, width, height, updateSprite, updateSize) {
        thing.EightBitter.setWidth(thing, width, updateSprite, updateSize);
        thing.EightBitter.setHeight(thing, height, updateSprite, updateSize);
    }

    /**
     * Shifts a Thing horizontally by its xvel and vertically by its yvel, using
     * shiftHoriz and shiftVert.
     * 
     * @param {Thing} thing
     */
    function updatePosition(thing) {
        thing.EightBitter.shiftHoriz(thing, thing.xvel);
        thing.EightBitter.shiftVert(thing, thing.yvel);
    }

    /**
     * Completely updates the size measurements of a Thing. That means the
     * unitwidth, unitheight, spritewidthpixels, spriteheightpixels, and
     * spriteheightpixels attributes. The Thing's sprite is then updated by the
     * PixelDrawer, and its appearance is marked as changed.
     * 
     * @param {Thing} thing
     */
    function updateSize(thing) {
        thing.unitwidth = thing.width * thing.EightBitter.unitsize;
        thing.unitheight = thing.height * thing.EightBitter.unitsize;
        thing.spritewidthpixels = thing.spritewidth * thing.EightBitter.unitsize;
        thing.spriteheightpixels = thing.spriteheight * thing.EightBitter.unitsize;

        thing.canvas.width = thing.spritewidthpixels;
        thing.canvas.height = thing.spriteheightpixels;
        thing.EightBitter.PixelDrawer.setThingSprite(thing);

        thing.EightBitter.markChanged(thing);
    }

    /**
     * Reduces a Thing's width by pushing back its right and decreasing its 
     * width. It is marked as changed in appearance.
     * 
     * @param {Thing} thing
     * @param {Number} dx
     * @param {Boolean} [updateSize]   Whether to also call updateSize on the 
     *                                 Thing (by default, false).
     */
    function reduceWidth(thing, dx, see) {
        thing.right -= dx;
        thing.width -= dx / thing.EightBitter.unitsize;

        if (see) {
            thing.EightBitter.updateSize(thing);
        } else {
            thing.EightBitter.markChanged(thing);
        }
    }

    /**
     * Reduces a Thing's height by pushing down its top and decreasing its 
     * height. It is marked as changed in appearance.
     * 
     * @param {Thing} thing
     * @param {Number} dy
     * @param {Boolean} [updateSize]   Whether to also call updateSize on the 
     *                                 Thing (by default, false).
     */
    function reduceHeight(thing, dy, updateSize) {
        thing.top += dy;
        thing.height -= dy / thing.EightBitter.unitsize;

        if (updateSize) {
            thing.EightBitter.updateSize(thing);
        } else {
            thing.EightBitter.markChanged(thing);
        }
    }

    /**
     * Reduces a Thing's height by pushing down its top and decreasing its 
     * height. It is marked as changed in appearance.
     * 
     * @param {Thing} thing
     * @param {Number} dy
     * @param {Boolean} [updateSize]   Whether to also call updateSize on the 
     *                                 Thing (by default, false).
     */
    function increaseHeight(thing, dy) {
        thing.top -= dy;
        thing.height += dy / thing.EightBitter.unitsize;
        thing.unitheight = thing.height * thing.EightBitter.unitsize;
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Increases a Thing's width by pushing forward its right and decreasing its 
     * width. It is marked as changed in appearance.
     * 
     * @param {Thing} thing
     * @param {Number} dx
     * @param {Boolean} [updateSize]   Whether to also call updateSize on the 
     *                                 Thing (by default, false).
     */
    function increaseWidth(thing, dx) {
        thing.right += dx;
        thing.width += dx / thing.EightBitter.unitsize;
        thing.unitwidth = thing.width * thing.EightBitter.unitsize;
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Completely pauses a Thing by setting its velocities to zero and disabling
     * it from falling, colliding, or moving. Its old attributes for those are
     * saved so thingResumeVelocity may restore them.
     * 
     * @param {Thing} thing
     * @param {Boolean} [keepMovement]   Whether to keep movement instead of
     *                                   wiping it (by default, false).
     */
    function thingPauseVelocity(thing, keepMovement) {
        thing.xvelOld = thing.xvel || 0;
        thing.yvelOld = thing.yvel || 0;

        thing.nofallOld = thing.nofall || false;
        thing.nocollideOld = thing.nocollide || false;
        thing.movementOld = thing.movement || thing.movementOld;

        thing.nofall = thing.nocollide = true;
        thing.xvel = thing.yvel = false;

        if (!keepMovement) {
            thing.movement = undefined;
        }
    }

    /**
     * Resumes a Thing's velocity and movements after they were paused by
     * thingPauseVelocity.
     * 
     * @param {Thing} thing
     * @param {Boolean} [noVelocity]   Whether to skip restoring the Thing's
     *                                 velocity (by default, false).
     */
    function thingResumeVelocity(thing, noVelocity) {
        if (!noVelocity) {
            thing.xvel = thing.xvelOld || 0;
            thing.yvel = thing.yvelOld || 0;
        }

        thing.movement = thing.movementOld || thing.movement;
        thing.nofall = thing.nofallOld || false;
        thing.nocollide = thing.nocollideOld || false;
    }


    /* Appearance utilities
    */

    /**
     * Generates a key for a Thing based off the current area and the Thing's
     * basic attributes. This key should be used for PixelRender.get calls, to
     * cache the Thing's sprite.
     * 
     * @param {Thing} thing
     * @return {String} A key that to identify the Thing's sprite.
     */
    function generateObjectKey(thing) {
        return thing.EightBitter.MapsHandler.getArea().setting
                + ' ' + thing.groupType + ' '
                + thing.title + ' ' + thing.className;
    }

    /**
     * Sets the class of a Thing, sets the new sprite for it, and marks it as 
     * having changed appearance. The class is stored in the Thing's internal
     * .className attribute.
     * 
     * @param {Thing} thing
     * @param {String} string   The new internal .className for the Thing.
     */
    function setClass(thing, string) {
        thing.className = string;
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
        thing.EightBitter.markChanged(thing);
    }

    /**
     * A version of setClass to be used before the Thing's sprite attributes
     * have been set. This just sets the internal .className.
     * 
     * @param {Thing} thing
     * @param {String} string
     */
    function setClassInitial(thing, string) {
        thing.className = string;
    }

    /**
     * Adds a string to a Thing's class after a ' ', updates the Thing's 
     * sprite, and marks it as having changed appearance.
     * 
     * @param {Thing} thing
     * @param {String} string
     */
    function addClass(thing, string) {
        thing.className += " " + string;
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
        thing.EightBitter.markChanged(thing);
    }

    /**
     * Adds multiple strings to a Thing's class after a ' ', updates the Thing's 
     * sprite, and marks it as having changed appearance. Strings may be given 
     * as Arrays or Strings; Strings will be split on ' '. Any number of 
     * additional arguments may be given.
     * 
     * @param {Thing} thing
     * @param {Mixed} string
     */
    function addClasses(thing) {
        var strings, arr, i, j;
        for (i = 1; i < arguments.length; i += 1) {
            arr = arguments[i];

            if (!(arr instanceof Array)) {
                arr = arr.split(' ');
            }

            for (j = arr.length - 1; j >= 0; j -= 1) {
                thing.EightBitter.addClass(thing, arr[j]);
            }
        }
    }

    /**
     * Removes a string from a Thing's class, updates the Thing's sprite, and
     * marks it as having changed appearance.
     * 
     * @param {Thing} thing
     * @param {String} string
     */
    function removeClass(thing, string) {
        if (!string) {
            return;
        }
        if (string.indexOf(" ") !== -1) {
            thing.EightBitter.removeClasses(thing, string);
        }
        thing.className = thing.className.replace(new RegExp(" " + string, "gm"), "");
        thing.EightBitter.PixelDrawer.setThingSprite(thing);
    }

    /**
     * Removes multiple strings from a Thing's class, updates the Thing's 
     * sprite, and marks it as having changed appearance. Strings may be given 
     * as Arrays or Strings; Strings will be split on ' '. Any number of 
     * additional arguments may be given.
     * 
     * @param {Thing} thing
     * @param {Mixed} string
     */
    function removeClasses(thing) {
        var strings, arr, i, j;
        for (i = 1; i < arguments.length; ++i) {
            arr = arguments[i];
            if (!(arr instanceof Array)) {
                arr = arr.split(" ");
            }

            for (j = arr.length - 1; j >= 0; --j) {
                thing.EightBitter.removeClass(thing, arr[j]);
            }
        }
    }

    /**
     * @param {Thing} thing
     * @param {String} string
     * @return {Boolean} Whether the Thing's class contains the String.
     */
    function hasClass(thing, string) {
        return thing.className.indexOf(string) !== -1;
    }

    /**
     * Removes the first class from a Thing and adds the second. All typical
     * sprite updates are called.
     * 
     * @param {Thing} thing
     * @param {String} stringOut
     * @param {String} stringIn
     */
    function switchClass(thing, stringOut, stringIn) {
        thing.EightBitter.removeClass(thing, stringOut);
        thing.EightBitter.addClass(thing, stringIn);
    }

    /**
     * Marks a Thing as being flipped horizontally by setting its .flipHoriz
     * attribute to true and giving it a "flipped" class.
     * 
     * @param {Thing}
     */
    function flipHoriz(thing) {
        thing.flipHoriz = true;
        thing.EightBitter.addClass(thing, "flipped");
    }

    /**
     * Marks a Thing as being flipped vertically by setting its .flipVert
     * attribute to true and giving it a "flipped" class.
     * 
     * @param {Thing}
     */
    function flipVert(thing) {
        thing.flipVert = true;
        thing.EightBitter.addClass(thing, "flip-vert");
    }

    /**
     * Marks a Thing as not being flipped horizontally by setting its .flipHoriz
     * attribute to false and giving it a "flipped" class.
     * 
     * @param {Thing}
     */
    function unflipHoriz(thing) {
        thing.flipHoriz = false;
        thing.EightBitter.removeClass(thing, "flipped");
    }

    /**
     * Marks a Thing as not being flipped vertically by setting its .flipVert
     * attribute to true and giving it a "flipped" class.
     * 
     * @param {Thing}
     */
    function unflipVert(thing) {
        thing.flipVert = false;
        thing.EightBitter.removeClass(thing, "flip-vert");
    }

    /**
     * Sets the opacity of the Thing and marks its appearance as changed.
     * 
     * @param {Thing} thing
     * @param {Number} opacity   A number in [0,1].
     */
    function setOpacity(thing, opacity) {
        thing.opacity = opacity;
        thing.EightBitter.markChanged(thing);
    }


    /* Miscellaneous utilities
    */

    /**
     * Removes a Thing from an Array using Array.splice. If the thing has an 
     * onDelete, that is called.
     * 
     * @param {Thing} thing
     * @param {Array} array
     * @param {Number} [location]   The index of the Thing in the Array, for
     *                              speed's sake (by default, it is found
     *                              using Array.indexOf).
     */
    function arrayDeleteThing(thing, array, location) {
        if (typeof location === "undefined") {
            location = array.indexOf(thing);
            if (location === -1) {
                return;
            }
        }

        array.splice(location, 1);

        if (typeof (thing.onDelete) === "function") {
            thing.onDelete(thing);
        }
    }

    /**
     * Takes a snapshot of the current screen canvas by simulating a click event
     * on a dummy link.
     * 
     * @param {String} [name]   A name for the image to be saved as (by default,
     *                          "FullScreenMario Screenshot").
     * @param {String} [format]   A format for the image to be saved as (by
     *                            default, "png").
     * @remarks For security concerns, browsers won't allow this unless it's
     *          called within a callback of a genuine user-triggered event.
     */
    function takeScreenshot(name, format) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            format = "image/png",
            link = EightBitter.createElement("a", {
                "download": (
                        name || (EightBitter.settings.ui.globalName + " Screenshot")
                    ) + "." + format.split("/")[1],
                "href": EightBitter.canvas.toDataURL(format)
                    .replace(format, "image/octet-stream")
            });

        link.click();
    }

    /**
     * 
     */
    function addPageStyles(styles) {
        var EightBitter = EightBittr.ensureCorrectCaller(this),
            sheet = EightBitter.createElement("style", {
                "type": "text/css"
            }),
            compiled = "", i, j;

        for (i in styles) {
            compiled += i + " { \r\n";
            for (j in styles[i]) {
                compiled += "  " + j + ": " + styles[i][j] + ";\r\n"
            }
            compiled += "}\r\n";
        }

        if (sheet.styleSheet) {
            sheet.styleSheet.cssText = compiled;
        } else {
            sheet.appendChild(document.createTextNode(compiled));
        }

        document.querySelector("head").appendChild(sheet);
    }


    proliferateHard(EightBitterProto, {
        // Resets
        "reset": reset,
        "resetTimed": resetTimed,
        "resetObjectMaker": resetObjectMaker,
        "resetQuadsKeeper": resetQuadsKeeper,
        "resetPixelRender": resetPixelRender,
        "resetTimeHandler": resetTimeHandler,
        "resetAudioPlayer": resetAudioPlayer,
        "resetGamesRunner": resetGamesRunner,
        "resetStatsHolder": resetStatsHolder,
        "resetGroupHolder": resetGroupHolder,
        "resetThingHitter": resetThingHitter,
        "resetMapScreener": resetMapScreener,
        "resetPixelDrawer": resetPixelDrawer,
        "resetNumberMaker": resetNumberMaker,
        "resetMapsCreator": resetMapsCreator,
        "resetMapsHandler": resetMapsHandler,
        "resetInputWriter": resetInputWriter,
        "resetLevelEditor": resetLevelEditor,
        "resetWorldSeeder": resetWorldSeeder,
        "resetModAttacher": resetModAttacher,
        "startModAttacher": startModAttacher,
        "resetContainer": resetContainer,
        // Global manipulations
        "scrollWindow": scrollWindow,
        "scrollThing": scrollThing,
        "onAreaSpawn": onAreaSpawn,
        "onAreaUnspawn": onAreaUnspawn,
        "addThing": addThing,
        "thingProcess": thingProcess,
        "thingProcessAttributes": thingProcessAttributes,
        "mapPlaceRandomCommands": mapPlaceRandomCommands,
        // Physics & similar
        "markChanged": markChanged,
        "shiftVert": shiftVert,
        "shiftHoriz": shiftHoriz,
        "setTop": setTop,
        "setRight": setRight,
        "setBottom": setBottom,
        "setLeft": setLeft,
        "shiftBoth": shiftBoth,
        "shiftThings": shiftThings,
        "shiftAll": shiftAll,
        "setWidth": setWidth,
        "setHeight": setHeight,
        "setSize": setSize,
        "updatePosition": updatePosition,
        "updateSize": updateSize,
        "reduceWidth": reduceWidth,
        "reduceHeight": reduceHeight,
        "increaseWidth": increaseWidth,
        "increaseHeight": increaseHeight,
        "thingPauseVelocity": thingPauseVelocity,
        "thingResumeVelocity": thingResumeVelocity,
        // Appearance utilities
        "generateObjectKey": generateObjectKey,
        "setClass": setClass,
        "setClassInitial": setClassInitial,
        "addClass": addClass,
        "addClasses": addClasses,
        "removeClass": removeClass,
        "removeClasses": removeClasses,
        "hasClass": hasClass,
        "switchClass": switchClass,
        "flipHoriz": flipHoriz,
        "flipVert": flipVert,
        "unflipHoriz": unflipHoriz,
        "unflipVert": unflipVert,
        "setOpacity": setOpacity,
        // Miscellaneous utilities
        "arrayDeleteThing": arrayDeleteThing,
        "takeScreenshot": takeScreenshot,
        "addPageStyles": addPageStyles
    });

    return GameStartr;
})(EightBittr);