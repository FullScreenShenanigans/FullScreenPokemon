// @echo '/// <reference path="GameStartr-0.2.0.ts" />'

// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/GameStartr-0.2.0.ts" />
/// <reference path="FullScreenPokemon.d.ts" />
// @endif

// @include ../Source/FullScreenPokemon.d.ts

module FullScreenPokemon {
    "use strict";

    export class FullScreenPokemon extends GameStartr.GameStartr implements IFullScreenPokemon {
        // For the sake of reset functions, constants are stored as members of the 
        // FullScreenPokemon Function itself - this allows prototype setters to use 
        // them regardless of whether the prototype has been instantiated yet.

        /**
         * Static settings passed to individual reset Functions. Each of these
         * should be filled out separately, after the FullScreenPokemon class
         * has been declared but before an instance has been instantiated.
         */
        public static settings: GameStartr.IGameStartrStoredSettings = {
            "audio": undefined,
            "collisions": undefined,
            "editor": undefined,
            "generator": undefined,
            "groups": undefined,
            "events": undefined,
            "input": undefined,
            "math": undefined,
            "maps": undefined,
            "mods": undefined,
            "objects": undefined,
            "quadrants": undefined,
            "renderer": undefined,
            "runner": undefined,
            "scenes": undefined,
            "sprites": undefined,
            "statistics": undefined,
            "touch": undefined,
            "ui": undefined
        };

        /**
         * Static unitsize of 4, as that's how Super Pokemon Bros. is.
         */
        public static unitsize: number = 4;

        /**
         * Static scale of 2, to exand to two pixels per one game pixel.
         */
        public static scale: number = 2;

        /**
         * Overriden MapScreenr refers to the IMapScreenr defined in FullScreenPokemon.d.ts.
         */
        public MapScreener: IMapScreenr;

        /**
         * Internal reference to the static settings.
         */
        public settings: GameStartr.IGameStartrStoredSettings = FullScreenPokemon.settings;

        /**
         * Internal reference to the static unitsize.
         */
        public unitsize: number;

        /**
         * Timed result summaries of the constructor, if resetTimed was passed
         * as true. Otherwise, this is undefined.
         */
        public resetTimes: any[];

        /**
         * The game's player, which (when defined) will always be a Player Thing.
         */
        public player: IPlayer;

        /**
         * Constructor for a new FullScreenPokemon game object.
         * Static game settings are stored in the appropriate settings/*.js object
         * as members of the FullScreenPokemon.prototype object.
         * Dynamic game settings may be given as members of the "customs" argument.
         */
        constructor(customs: GameStartr.IGameStartrCustoms) {
            super({
                "customs": customs,
                "requirements": {
                    "settings": {
                        "audio": "settings/audio.js",
                        "collisions": "settings/collisions.js",
                        "editor": "settings/editor.js",
                        "events": "settings/events.js",
                        "generator": "settings/generator.js",
                        "input": "settings/inpug.js",
                        "maps": "settings/maps.js",
                        "math": "settings/math.js",
                        "mods": "settings/mods.js",
                        "numbers": "settings/number.js",
                        "objects": "settings/objetcs.js",
                        "quadrants": "settings/quadrants.js",
                        "renderer": "settings/renderer.js",
                        "runner": "settings/runner.js",
                        "scenes": "settings/scenes.js",
                        "sprites": "settings/sprites.js",
                        "statistics": "settings/statistics.js",
                        "touch": "settings/touch.js",
                        "ui": "settings/ui.js"
                    }
                },
                "constantsSource": FullScreenPokemon,
                "constants": [
                    "unitsize",
                    "scale"
                ],
                "extraResets": [
                    "resetMenuGrapher",
                    "resetBattleMover",
                    "resetStateHolder",
                    "resetGBSEmulator"
                ]
            });

            if (customs.resetTimed) {
                this.resetTimes = this.resetTimed(this, customs);
            } else {
                this.reset(this, customs);
            }
        }


        /* Resets
        */

        /**
         * Does not set this.AudioPlayer, as it's not used in FullScreenPokemon.
         * 
         * @param {FullScreenPokemon} FSP
         * @param {Object} customs
         */
        resetAudioPlayer(FSP: FullScreenPokemon, customs: GameStartr.IGameStartrCustoms): void {

        }



        /* Global manipulations
        */



        /* Miscellaneous utilities
        */

        /**
         * Ensures the current object is a GameStartr by throwing an error if it 
         * is not. This should be used for functions in any GameStartr descendants
         * that have to call 'this' to ensure their caller is what the programmer
         * expected it to be.
         * 
         * @param {Mixed} current   
         */
        ensureCorrectCaller(current: any): FullScreenPokemon {
            if (!(current instanceof FullScreenPokemon)) {
                throw new Error("A function requires the scope ('this') to be the "
                    + "manipulated FullScreenPokemon object. Unfortunately, 'this' is a "
                    + typeof (this) + ".");
            }
            return current;
        }
    }
}
