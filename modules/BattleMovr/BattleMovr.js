/*
FSP.BattleMover.startBattle({
    "textStart": ["", " would like to battle!"],
    "player": {
        "sprite": "PlayerBack",
        "name": "%%%%%%%PLAYER%%%%%%%",
        "actors": [
            {
                "title": "Squirtle",
                "moves": [
                    {
                        "title": "Tackle"
                    }, {
                        "title": "Tail Whip"
                    }, {
                        "title": "Bubble"
                    }
                ]
            }
        ]
    },
    "opponent": {
        "sprite": "RivalPortrait",
        "name": "%%%%%%%RIVAL%%%%%%%",
        "hasActors": true,
        "actors": [
            {
                "title": "Bulbasaur",
                "moves": [
                    {
                        "title": "Tackle"
                    }
                ]
            }
        ]
    }
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
        battleInfo = EightBitter.proliferate({}, defaults);
        battleInfo = EightBitter.proliferate(battleInfo, settings);

        battleInfo.player.selectedActor = battleInfo.player.actors[0];
        battleInfo.opponent.selectedActor = battleInfo.opponent.actors[0];

        self.createBackground();

        EightBitter.MapScreener.inMenu = true;
        EightBitter.MenuGrapher.createMenu("Battle", {
            "ignoreB": true
        });
        EightBitter.MenuGrapher.createMenu("BattleDisplayInitial");

        actors.menu = EightBitter.MenuGrapher.getMenu("BattleDisplayInitial");
        self.setActor("opponent", battleInfo.opponent.sprite);
        self.setActor("player", battleInfo.player.sprite);

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

        return thing;
    };

    /* In-battle menus
    */

    /**
     * 
     */
    self.openMovesMenu = function () {
        var actorMoves = battleInfo.player.selectedActor.moves,
            moveOptions = [],
            move, i;

        for (i = 0; i < actorMoves.length; i += 1) {
            move = actorMoves[i];
            moveOptions[i] = {
                "text": move.title.toUpperCase(),
                "remaining": move.remaining,
                "callback": self.playMove.bind(self, move.title)
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

    /* Battle shenanigans
    */

    /**
     * 
     */
    self.playMove = function (choicePlayer) {
        var choiceOpponent = EightBitter.MathDecider.compute(
                "opponentMove", battleInfo.player, battleInfo.opponent
            ),
            playerMovesFirst = EightBitter.MathDecider.compute(
                "playerMovesFirst", battleInfo.player, choicePlayer, battleInfo.opponent, choiceOpponent
            );
        
        if (playerMovesFirst) {
            EightBitter.ScenePlayer.playRoutine("MovePlayer", {
                "nextRoutine": "MoveOpponent",
                "choicePlayer": choicePlayer,
                "choiceOpponent": choiceOpponent
            });
        } else {
            EightBitter.ScenePlayer.playRoutine("MoveOpponent", {
                "nextRoutine": "MovePlayer",
                "choicePlayer": choicePlayer,
                "choiceOpponent": choiceOpponent
            });
        }
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