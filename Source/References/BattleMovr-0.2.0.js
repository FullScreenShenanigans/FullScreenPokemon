/// <reference path="EightBittr-0.2.0.ts" />
/// <reference path="GroupHoldr-0.2.1.ts" />
/// <reference path="MathDecidr-0.2.0.ts" />
/// <reference path="MapScreenr-0.2.1.ts" />
/// <reference path="MenuGraphr-0.2.0.ts" />
/// <reference path="ObjectMakr-0.2.2.ts" />
/// <reference path="ScenePlayr-0.2.0.ts" />
var BattleMovr;
(function (BattleMovr_1) {
    "use strict";
    var BattleMovr = (function () {
        /**
         * @param {IBattleMovrSettings} settings
         */
        function BattleMovr(settings) {
            if (typeof settings.GameStarter === "undefined") {
                throw new Error("No GameStarter given to BattleMovr.");
            }
            if (typeof settings.MenuGrapher === "undefined") {
                throw new Error("No MenuGrapher given to BattleMovr.");
            }
            if (typeof settings.battleMenuName === "undefined") {
                throw new Error("No battleMenuName given to BattleMovr.");
            }
            if (typeof settings.battleOptionNames === "undefined") {
                throw new Error("No battleOptionNames given to BattleMovr.");
            }
            if (typeof settings.menuNames === "undefined") {
                throw new Error("No menuNames given to BattleMovr.");
            }
            this.GameStarter = settings.GameStarter;
            this.MenuGrapher = settings.MenuGrapher;
            this.battleMenuName = settings.battleMenuName;
            this.battleOptionNames = settings.battleOptionNames;
            this.menuNames = settings.menuNames;
            this.openItemsMenuCallback = settings.openItemsMenuCallback;
            this.openActorsMenuCallback = settings.openActorsMenuCallback;
            this.defaults = settings.defaults || {};
            this.backgroundType = settings.backgroundType;
            this.positions = settings.positions;
            this.inBattle = false;
            this.things = {};
        }
        /* Simple gets
        */
        /**
         *
         */
        BattleMovr.prototype.getGameStarter = function () {
            return this.GameStarter;
        };
        /**
         *
         */
        BattleMovr.prototype.getThings = function () {
            return this.things;
        };
        /**
         *
         */
        BattleMovr.prototype.getThing = function (name) {
            return this.things[name];
        };
        /**
         *
         */
        BattleMovr.prototype.getBattleInfo = function () {
            return this.battleInfo;
        };
        /**
         *
         */
        BattleMovr.prototype.getBackgroundType = function () {
            return this.backgroundType;
        };
        /**
         *
         */
        BattleMovr.prototype.getBackgroundThing = function () {
            return this.backgroundThing;
        };
        /**
         *
         */
        BattleMovr.prototype.getInBattle = function () {
            return this.inBattle;
        };
        /* Actor manipulations
        */
        /**
         *
         */
        BattleMovr.prototype.startBattle = function (settings) {
            if (this.inBattle) {
                return;
            }
            var i;
            this.inBattle = true;
            this.battleInfo = this.GameStarter.proliferate({}, this.defaults);
            // A shallow copy is used here for performance, and so Things in .keptThings
            // don't cause an infinite loop proliferating
            for (i in settings) {
                if (settings.hasOwnProperty(i)) {
                    this.battleInfo[i] = settings[i];
                }
            }
            this.battleInfo.player.selectedActor = this.battleInfo.player.actors[0];
            this.battleInfo.opponent.selectedActor = this.battleInfo.opponent.actors[0];
            this.createBackground();
            this.MenuGrapher.createMenu("Battle", {
                "ignoreB": true
            });
            this.MenuGrapher.createMenu("BattleDisplayInitial");
            this.things.menu = this.MenuGrapher.getMenu("BattleDisplayInitial");
            this.setThing("opponent", this.battleInfo.opponent.sprite);
            this.setThing("player", this.battleInfo.player.sprite);
            this.GameStarter.ScenePlayer.startCutscene("Battle", {
                "things": this.things,
                "battleInfo": this.battleInfo,
                "nextCutscene": settings.nextCutscene,
                "nextCutsceneSettings": settings.nextCutsceneSettings
            });
        };
        /**
         *
         */
        BattleMovr.prototype.closeBattle = function (callback) {
            var i;
            if (!this.inBattle) {
                return;
            }
            this.inBattle = false;
            for (i in this.things) {
                if (this.things.hasOwnProperty(i)) {
                    this.GameStarter.killNormal(this.things[i]);
                }
            }
            this.deleteBackground();
            this.GameStarter.MapScreener.inMenu = false;
            this.MenuGrapher.deleteMenu("Battle");
            this.MenuGrapher.deleteMenu("GeneralText");
            this.MenuGrapher.deleteMenu("BattleOptions");
            if (callback) {
                callback();
            }
            this.GameStarter.ScenePlayer.playRoutine("Complete");
            if (this.battleInfo.nextCutscene) {
                this.GameStarter.ScenePlayer.startCutscene(this.battleInfo.nextCutscene, this.battleInfo.nextCutsceneSettings);
            }
            else if (this.battleInfo.nextRoutine) {
                this.GameStarter.ScenePlayer.playRoutine(this.battleInfo.nextRoutine, this.battleInfo.nextRoutineSettings);
            }
            else {
                this.GameStarter.ScenePlayer.stopCutscene();
            }
        };
        /**
         *
         */
        BattleMovr.prototype.showPlayerMenu = function () {
            this.MenuGrapher.createMenu("BattleOptions", {
                "ignoreB": true
            });
            this.MenuGrapher.addMenuList("BattleOptions", {
                "options": [
                    {
                        "text": this.battleOptionNames.moves,
                        "callback": this.openMovesMenu.bind(this)
                    }, {
                        "text": this.battleOptionNames.items,
                        "callback": this.openItemsMenu.bind(this)
                    }, {
                        "text": this.battleOptionNames.actors,
                        "callback": this.openActorsMenu.bind(this)
                    }, {
                        "text": this.battleOptionNames.exit,
                        "callback": this.startBattleExit.bind(this)
                    }]
            });
            this.MenuGrapher.setActiveMenu("BattleOptions");
        };
        /**
         *
         */
        BattleMovr.prototype.setThing = function (name, title, settings) {
            var position = this.positions[name] || {}, battleMenu = this.MenuGrapher.getMenu(this.battleMenuName), thing = this.things[name];
            if (thing) {
                this.GameStarter.killNormal(thing);
            }
            thing = this.things[name] = this.GameStarter.ObjectMaker.make(title, settings);
            this.GameStarter.addThing(thing, battleMenu.left + (position.left || 0) * this.GameStarter.unitsize, battleMenu.top + (position.top || 0) * this.GameStarter.unitsize);
            this.GameStarter.GroupHolder.switchMemberGroup(thing, thing.groupType, "Text");
            return thing;
        };
        /* In-battle menus
        */
        /**
         *
         */
        BattleMovr.prototype.openMovesMenu = function () {
            var actorMoves = this.battleInfo.player.selectedActor.moves, moveOptions = [], move, i;
            for (i = 0; i < actorMoves.length; i += 1) {
                move = actorMoves[i];
                moveOptions[i] = {
                    "text": move.title.toUpperCase(),
                    "remaining": move.remaining,
                    "callback": this.playMove.bind(this, move.title)
                };
            }
            for (i = actorMoves.length; i < 4; i += 1) {
                moveOptions[i] = {
                    "text": "-"
                };
            }
            this.MenuGrapher.createMenu(this.menuNames.moves);
            this.MenuGrapher.addMenuList(this.menuNames.moves, {
                "options": moveOptions
            });
            this.MenuGrapher.setActiveMenu(this.menuNames.moves);
        };
        /**
         *
         */
        BattleMovr.prototype.openItemsMenu = function () {
            this.openItemsMenuCallback({
                "items": this.battleInfo.items,
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
        BattleMovr.prototype.openActorsMenu = function (callback) {
            this.openActorsMenuCallback({
                "backMenu": "BattleOptions",
                "container": "Battle",
                "onSwitch": this.switchActor.bind(this)
            });
        };
        /* Battle shenanigans
        */
        /**
         *
         */
        BattleMovr.prototype.playMove = function (choicePlayer) {
            var choiceOpponent, playerMovesFirst;
            choiceOpponent = this.GameStarter.MathDecider.compute("opponentMove", this.battleInfo.player, this.battleInfo.opponent);
            playerMovesFirst = this.GameStarter.MathDecider.compute("playerMovesFirst", this.battleInfo.player, choicePlayer, this.battleInfo.opponent, choiceOpponent);
            if (playerMovesFirst) {
                this.GameStarter.ScenePlayer.playRoutine("MovePlayer", {
                    "nextRoutine": "MoveOpponent",
                    "choicePlayer": choicePlayer,
                    "choiceOpponent": choiceOpponent
                });
            }
            else {
                this.GameStarter.ScenePlayer.playRoutine("MoveOpponent", {
                    "nextRoutine": "MovePlayer",
                    "choicePlayer": choicePlayer,
                    "choiceOpponent": choiceOpponent
                });
            }
        };
        /**
         *
         */
        BattleMovr.prototype.switchActor = function (battlerName, i) {
            var battler = this.battleInfo[battlerName];
            if (battler.selectedIndex === i) {
                this.GameStarter.ScenePlayer.playRoutine("PlayerSwitchesSamePokemon");
                return;
            }
            battler.selectedIndex = i;
            battler.selectedActor = battler.actors[i];
            this.GameStarter.ScenePlayer.playRoutine((battlerName === "player" ? "Player" : "Opponent") + "SendOut");
        };
        /* Battle exits
        */
        /**
         *
         */
        BattleMovr.prototype.startBattleExit = function () {
            if (this.battleInfo.opponent.category === "Trainer") {
                this.GameStarter.ScenePlayer.playRoutine("BattleExitFail");
                return;
            }
            this.MenuGrapher.deleteMenu("BattleOptions");
            this.MenuGrapher.addMenuDialog("GeneralText", this.battleInfo.exitDialog || this.defaults.exitDialog || "", this.closeBattle.bind(this));
            this.MenuGrapher.setActiveMenu("GeneralText");
        };
        /* Utilities
        */
        /**
         *
         */
        BattleMovr.prototype.createBackground = function () {
            if (!this.backgroundType) {
                return;
            }
            this.backgroundThing = this.GameStarter.addThing(this.backgroundType);
            this.GameStarter.setWidth(this.backgroundThing, this.GameStarter.MapScreener.width / 4);
            this.GameStarter.setHeight(this.backgroundThing, this.GameStarter.MapScreener.height / 4);
            this.GameStarter.GroupHolder.switchMemberGroup(this.backgroundThing, this.backgroundThing.groupType, "Text");
        };
        /**
         *
         */
        BattleMovr.prototype.deleteBackground = function () {
            if (this.backgroundThing) {
                this.GameStarter.killNormal(this.backgroundThing);
            }
        };
        return BattleMovr;
    })();
    BattleMovr_1.BattleMovr = BattleMovr;
})(BattleMovr || (BattleMovr = {}));
