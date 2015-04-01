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

        things,

        backgroundType,

        backgroundThing,

        battleMenuName,

        battleOptionNames,

        menuNames,

        battleInfo,

        inBattle,

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

        inBattle = false;

        things = {};
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
    self.getThings = function () {
        return things;
    };

    /**
     * 
     */
    self.getThing = function (name) {
        return things[name];
    };

    /**
     * 
     */
    self.getBattleInfo = function () {
        return battleInfo;
    };

    /**
     * 
     */
    self.getBackgroundThing = function () {
        return backgroundType;
    };

    /**
     * 
     */
    self.getBackgroundThing = function () {
        return backgroundThing;
    };

    /**
     * 
     */
    self.getInBattle = function () {
        return inBattle;
    }


    /* Actor manipulations
    */

    /**
     * 
     */
    self.startBattle = function (settings) {
        if (inBattle) {
            return;
        }

        inBattle = true;

        battleInfo = EightBitter.proliferate({}, defaults);
        battleInfo = EightBitter.proliferate(battleInfo, settings);

        battleInfo.player.selectedActor = battleInfo.player.actors[0];
        battleInfo.opponent.selectedActor = battleInfo.opponent.actors[0];

        self.createBackground();

        EightBitter.MenuGrapher.createMenu("Battle", {
            "ignoreB": true
        });
        EightBitter.MenuGrapher.createMenu("BattleDisplayInitial");

        things.menu = EightBitter.MenuGrapher.getMenu("BattleDisplayInitial");
        self.setThing("opponent", battleInfo.opponent.sprite);
        self.setThing("player", battleInfo.player.sprite);

        EightBitter.ScenePlayer.startCutscene("Battle", {
            "things": things,
            "battleInfo": battleInfo,
            "nextCutscene": settings.nextCutscene,
            "nextCutsceneSettings": settings.nextCutsceneSettings
        });
    };

    /**
     * 
     */
    self.closeBattle = function (callback) {
        var i;

        if (!inBattle) {
            return;
        }

        inBattle = false;

        for (i in things) {
            EightBitter.killNormal(things[i]);
        }

        self.deleteBackground();

        EightBitter.MapScreener.inMenu = false;
        EightBitter.MenuGrapher.deleteMenu("Battle");
        EightBitter.MenuGrapher.deleteMenu("GeneralText");
        EightBitter.MenuGrapher.deleteMenu("BattleOptions");

        if (callback) {
            callback();
        }

        EightBitter.ScenePlayer.playRoutine("Complete");

        if (battleInfo.nextCutscene) {
            EightBitter.ScenePlayer.startCutscene(
                battleInfo.nextCutscene, battleInfo.nextCutsceneSettings
            );
        } else if (battleInfo.nextRoutine) {
            EightBitter.ScenePlayer.playRoutine(
                battleInfo.nextRoutine, battleInfo.nextRoutineSettings
            );
        } else {
            EightBitter.ScenePlayer.stopCutscene();
        }
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
    self.setThing = function (name, type, settings) {
        var position = positions[name] || {},
            battleMenu = EightBitter.MenuGrapher.getMenu(battleMenuName),
            thing = things[name];

        if (thing) {
            EightBitter.killNormal(thing);
        }

        thing = things[name] = EightBitter.ObjectMaker.make(type, settings);

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
        EightBitter.openItemsMenu({
            "items": battleInfo.items,
            "position": {
                "horizontal": "right",
                "vertical": "bottom",
                "offset": {
                    "left": 0
                }
            },
            "size": {
                "height": 44
            },
            "container": "Battle",
            "backMenu": "BattleOptions",
            "scrollingItems": 4
        });
    };

    /**
     * 
     */
    self.openActorsMenu = function (callback) {
        EightBitter.openPokemonMenu({
            "backMenu": "BattleOptions",
            "container": "Battle",
        });
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
        if (battleInfo.opponent.category === "Trainer") {
            EightBitter.ScenePlayer.playRoutine("BattleExitFail");
            return;
        }

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