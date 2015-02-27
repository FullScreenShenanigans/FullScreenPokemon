/*
FSP.BattleMover.startBattle({
    "opponent": {
        "title": "Rattata"
    },
    "playerActors": [
        {
            "title": "Squirtle",
            "moves": [{
                "title": "TACKLE"
            }, {
                "title": "TAIL WHIP"
            }, {
                "title": "BUBBLE"
            }]
        }
    ]
});
*/

/**
 * BattleMovr.js
 * 
 * 
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function BattleMovr(settings) {
    "use strict";
    if (this === window) {
        return new BattleMovr(settings);
    }
    var self = this,

        EightBitter,

        actors,

        backgroundType,

        backgroundThing,

        battleMenuName,

        battleOptionNames,

        menuNames,

        battleInfo,

        defaults,

        positions;

    /**
     * 
     */
    self.reset = function (settings) {
        var i;

        EightBitter = settings.EightBitter;
        if (typeof EightBitter === "undefined") {
            throw new Error("No EightBitter given to BattleMovr.");
        }

        battleMenuName = settings.battleMenuName;
        if (typeof battleMenuName === "undefined") {
            throw new Error("No battleMenuName given to BattleMovr.");
        }

        battleOptionNames = settings.battleOptionNames;
        if (typeof battleOptionNames === "undefined") {
            throw new Error("No battleOptionNames given to BattleMovr.");
        }

        menuNames = settings.menuNames;
        if (typeof menuNames === "undefined") {
            throw new Error("No menuNames given to BattleMovr.");
        }

        defaults = settings.defaults || {};

        backgroundType = settings.backgroundType;
        positions = settings.positions;

        actors = {};
    };


    /* Simple gets
    */

    /**
     * 
     */
    self.getEightBitter = function () {
        return EightBitter;
    };

    /**
     * 
     */
    self.getActors = function () {
        return actors;
    };

    /**
     * 
     */
    self.getActor = function (name) {
        return actors[name];
    };


    /* Actor manipulations
    */

    /**
     * 
     */
    self.startBattle = function (settings) {
        var opponentType = settings.opponent.type || (settings.opponent.title + "Front"),
            displayTitle = settings.opponent.displayTitle;

        self.createBackground();

        battleInfo = EightBitter.proliferate({}, defaults);
        battleInfo = EightBitter.proliferate(battleInfo, settings);

        EightBitter.MapScreener.inMenu = true;
        EightBitter.MenuGrapher.createMenu("Battle", {
            "ignoreB": true
        });
        EightBitter.MenuGrapher.createMenu("BattleDisplayInitial");

        self.setActor("player", "PlayerBack");

        self.setActor(
            "opponent",
            opponentType,
            {
                "displayTitle": displayTitle || battleInfo.opponent.title.toUpperCase()
            }
        );

        EightBitter.ScenePlayer.startCutscene("Battle", {
            "actors": actors,
            "battleInfo": battleInfo    
        });
    };

    /**
     * 
     */
    self.closeBattle = function () {
        var i;

        for (i in actors) {
            EightBitter.killNormal(actors[i]);
        }

        self.deleteBackground();

        EightBitter.MapScreener.inMenu = false;
        EightBitter.MenuGrapher.deleteMenu("Battle");
        EightBitter.MenuGrapher.deleteMenu("GeneralText");
        EightBitter.MenuGrapher.deleteMenu("BattleOptions");
    };

    /**
     * 
     */
    self.showPlayerMenu = function () {
        EightBitter.MenuGrapher.createMenu("BattleOptions", {
            "ignoreB": true
        });
        EightBitter.MenuGrapher.addMenuList("BattleOptions", {
            "options": [{
                "text": battleOptionNames["moves"],
                "callback": self.openMovesMenu
            }, {
                "text": battleOptionNames["items"],
                "callback": self.openItemsMenu
            }, {
                "text": battleOptionNames["actors"],
                "callback": self.openActorsMenu
            }, {
                "text": battleOptionNames["exit"],
                "callback": self.startBattleExit
            }]
        });
        EightBitter.MenuGrapher.setActiveMenu("BattleOptions");
    }

    /**
     * 
     */
    self.setActor = function (name, type, settings) {
        var position = positions[name] || {},
            battleMenu = EightBitter.MenuGrapher.getMenu(battleMenuName),
            thing = actors[name];

        if (thing) {
            EightBitter.killNormal(thing);
        }

        thing = actors[name] = EightBitter.ObjectMaker.make(type, settings);

        EightBitter.addThing(
            thing,
            battleMenu.left + (position.left || 0) * EightBitter.unitsize,
            battleMenu.top + (position.top || 0) * EightBitter.unitsize
        );

        EightBitter.GroupHolder.switchObjectGroup(
            thing,
            thing.groupType,
            "Text"
        );
    };

    /* In-battle menus
    */

    /**
     * 
     */
    self.openMovesMenu = function () {
        var actorMoves = battleInfo.playerActors[0].moves,
            moveOptions = [],
            move, i;

        for (i = 0; i < actorMoves.length; i += 1) {
            move = actorMoves[i];
            moveOptions[i] = {
                "text": move.title,
                "remaining": move.remaining,
                "callback": console.log.bind(console, "Hi!")
            };
        }

        for (i = actorMoves.length; i < 4; i += 1) {
            moveOptions[i] = {
                "text": "-"
            };
        }

        EightBitter.MenuGrapher.createMenu(menuNames.moves);
        EightBitter.MenuGrapher.addMenuList(menuNames.moves, {
            "options": moveOptions
        });
        EightBitter.MenuGrapher.setActiveMenu(menuNames.moves);
    };

    /**
     * 
     */
    self.openItemsMenu = function () {
        var items = EightBitter.StatsHolder.get("items");

        EightBitter.MenuGrapher.createMenu(menuNames.items, {
            "container": "Battle",
            "backMenu": "BattleOptions",
            "size": {
                "height": 44
            },
            "position": {
                "horizontal": "right",
                "vertical": "bottom",
                "offset": {
                    "top": 4
                }
            }
        });

        EightBitter.MenuGrapher.setActiveMenu(menuNames.items);
        EightBitter.MenuGrapher.addMenuList(menuNames.items, {
            "options": items.map(function (item) {
                return {
                    "text": item.title
                };
            })
        });
    };

    /**
     * 
     */
    self.openActorsMenu = function () {
        EightBitter.openPokemonMenu("BattleOptions");
    };


    /* Battle exits
    */

    /**
     * 
     */
    self.startBattleExit = function () {
        EightBitter.MenuGrapher.deleteMenu("BattleOptions");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.exitDialog || defaults.exitDialog || "",
            self.closeBattle
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    };


    /* Utilities
    */

    /**
     * 
     */
    self.createBackground = function () {
        if (!backgroundType) {
            return;
        }

        backgroundThing = EightBitter.addThing(backgroundType);

        EightBitter.setWidth(backgroundThing, EightBitter.MapScreener.width / 4);
        EightBitter.setHeight(backgroundThing, EightBitter.MapScreener.height / 4);

        EightBitter.GroupHolder.switchObjectGroup(
            backgroundThing,
            backgroundThing.groupType,
            "Text"
        );
    }

    /**
     * 
     */
    self.deleteBackground = function () {
        if (backgroundThing) {
            EightBitter.killNormal(backgroundThing);
        }
    }

    self.reset(settings || {});
}