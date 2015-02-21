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

        animations,

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

        animations = settings.animations;
        if (typeof animations === "undefined") {
            throw new Error("No animations given to BattleMovr.");
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
        var textStart = settings.textStart || defaults.textStart || ["", ""];

        battleInfo = settings;

        self.createBackground();

        EightBitter.MapScreener.inMenu = true;
        EightBitter.MenuGrapher.createMenu("Battle", {
            "ignoreB": true
        });
        EightBitter.MenuGrapher.createMenu("BattleDisplayInitial");

        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            textStart[0] + battleInfo.opponent.title + textStart[1],
            startBattleIntro
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        self.setActor("player", "PlayerBack");

        self.setActor("opponent", battleInfo.opponent.title + "Front", {
            "displayTitle": battleInfo.opponent.title.toUpperCase()
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
    function startBattleIntro() {
        var textEntry = battleInfo.textEntry || defaults.textEntry || ["", ""];

        EightBitter.MenuGrapher.createMenu("BattleDisplayOpponent");

        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText", 
            textEntry[0] + "(pokemanz)" + textEntry[1]
        );
        
        EightBitter.TimeHandler.addEvent(
            animations.playerLeaveLeft, 14, actors.player, showPlayerStats
        );
    };

    /**
     * 
     */
    function showPlayerStats() {
        EightBitter.MenuGrapher.createMenu("BattleDisplayPlayer");
        animations.actorEntrance(
            EightBitter, -1, -1, enterPlayerActor
        );
    }

    /**
     * 
     */
    function enterPlayerActor() {
        self.setActor("player", battleInfo.playerActors[0].title + "Back");

        EightBitter.MenuGrapher.createMenu("GeneralText");

        EightBitter.TimeHandler.addEvent(showPlayerMenu, 21);
    }

    /**
     * 
     */
    function showPlayerMenu() {
        EightBitter.MenuGrapher.createMenu("BattleOptions");
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