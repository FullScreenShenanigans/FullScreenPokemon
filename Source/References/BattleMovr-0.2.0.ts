/// <reference path="EightBittr-0.2.0.ts" />
/// <reference path="GroupHoldr-0.2.1.ts" />
/// <reference path="MathDecidr-0.2.0.ts" />
/// <reference path="MapScreenr-0.2.1.ts" />
/// <reference path="MenuGraphr-0.2.0.ts" />
/// <reference path="ObjectMakr-0.2.2.ts" />
/// <reference path="ScenePlayr-0.2.0.ts" />

declare module BattleMovr {
    export interface IGameStartr extends EightBittr.IEightBittr {
        GroupHolder: GroupHoldr.IGroupHoldr;
        MapScreener: MapScreenr.IMapScreenr;
        MathDecider: MathDecidr.IMathDecidr;
        ObjectMaker: ObjectMakr.IObjectMakr;
        ScenePlayer: ScenePlayr.IScenePlayr;
        addThing(thing: string | IThing | any[], left?: number, top?: number): IThing;
        killNormal(thing: IThing): void;
        setHeight(thing: IThing, height: number);
        setWidth(thing: IThing, width: number);
    }

    export interface IPosition {
        left?: number;
        top?: number;
    }

    export interface IThingsContainer {
        [i: string]: IThing;
        menu?: IThing;
    }

    export interface IThing extends EightBittr.IThing {
        groupType: string;
    }

    export interface IMenu extends IThing { }

    export interface IBattleSettings {
        nextCutscene: string;
        nextCutsceneSettings: string;
    }

    export interface IBattleInfo {
        exitDialog?: string;
        items?: any;
        nextCutscene?: string;
        nextCutsceneSettings?: any;
        nextRoutine?: string;
        nextRoutineSettings?: any;
        opponent?: IBattleThingInfo;
        player?: IBattleThingInfo;
    }

    export interface IBattleInfoDefaults {
        exitDialog: string;
    }

    export interface IBattleThingInfo {
        actors: IActor[];
        category: string;
        hasActors?: boolean;
        name: string[];
        selectedActor?: IActor;
        selectedIndex?: number;
        sprite: string;
    }

    export interface IActor {
        Attack: number;
        AttackNormal: number;
        Defense: number;
        DefenseNormal: number;
        EV: {
            Attack: number;
            Defense: number;
            Special: number;
            Speed: number;
        };
        HP: number;
        HPNormal: number;
        IV: {
            Attack: number;
            Defense: number;
            HP: number;
            Special: number;
            Speed: number;
        };
        Special: number;
        SpecialNormal: number;
        Speed: number;
        SpeedNormal: number;
        experience: IActorExperience;
        level: number;
        moves: IMove[];
        nickname: string[];
        status: string;
        title: string[];
        types: string[];
    }

    export interface IActorExperience {
        current: number;
        next: number;
        remaining: number;
    }

    export interface IMove {
        title: string;
        remaining: number;
    }

    export interface IBattleMovrSettings {
        GameStarter: IGameStartr;
        MenuGrapher: MenuGraphr.IMenuGraphr;
        battleMenuName: string;
        battleOptionNames: string;
        menuNames: string;
        openItemsMenuCallback: (settings: any) => void;
        openActorsMenuCallback: (settings: any) => void;
        defaults?: any;
        backgroundType?: string;
        positions?: any;
    }

    export interface IBattleMovr {
        getGameStarter(): IGameStartr;
        getThings(): { [i: string]: IThing };
        getThing(name: string): IThing;
        getBattleInfo(): IBattleInfo;
        getBackgroundType(): string;
        getBackgroundThing(): IThing;
        getInBattle(): boolean;
        startBattle(settings: IBattleSettings): void;
        closeBattle(callback?: () => void): void;
        showPlayerMenu(): void;
        setThing(name: string, title: string, settings?: any): IThing;
        openMovesMenu(): void;
        openItemsMenu(): void;
        openActorsMenu(callback: (settings: any) => void): void;
        playMove(choicePlayer: string): void;
        switchActor(battlerName: string, i: number): void;
        startBattleExit(): void;
        createBackground(): void;
        deleteBackground(): void;
    }
}


module BattleMovr {
    "use strict";

    export class BattleMovr implements IBattleMovr {
        /**
         * 
         */
        private GameStarter: IGameStartr;

        /**
         * 
         */
        private MenuGrapher: MenuGraphr.IMenuGraphr;

        /**
         * 
         */
        private things: IThingsContainer;

        /**
         * 
         */
        private backgroundType: string;

        /**
         * 
         */
        private backgroundThing: IThing;

        /**
         * 
         */
        private battleMenuName: string;

        /**
         * 
         */
        private battleOptionNames: any;

        /**
         * 
         */
        private menuNames: any;

        /**
         * 
         */
        private battleInfo: IBattleInfo;

        /**
         * 
         */
        private inBattle: boolean;

        /**
         * 
         */
        private defaults: IBattleInfoDefaults;

        /**
         * 
         */
        private positions: {
            [i: string]: IPosition;
        };

        /**
         * 
         */
        private openItemsMenuCallback: (settings: any) => void;

        /**
         * 
         */
        private openActorsMenuCallback: (settings: any) => void;

        /**
         * @param {IBattleMovrSettings} settings
         */
        constructor(settings: IBattleMovrSettings) {
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
        getGameStarter(): IGameStartr {
            return this.GameStarter;
        }

        /**
         * 
         */
        getThings(): { [i: string]: IThing } {
            return this.things;
        }

        /**
         * 
         */
        getThing(name: string): IThing {
            return this.things[name];
        }

        /**
         * 
         */
        getBattleInfo(): IBattleInfo {
            return this.battleInfo;
        }

        /**
         * 
         */
        getBackgroundType(): string {
            return this.backgroundType;
        }

        /**
         * 
         */
        getBackgroundThing(): IThing {
            return this.backgroundThing;
        }

        /**
         * 
         */
        getInBattle(): boolean {
            return this.inBattle;
        }


        /* Actor manipulations
        */

        /**
         * 
         */
        startBattle(settings: IBattleSettings): void {
            if (this.inBattle) {
                return;
            }

            var i: string;

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
        }

        /**
         * 
         */
        closeBattle(callback?: () => void): void {
            var i: string;

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

            (<any>this.GameStarter.MapScreener).inMenu = false;
            this.MenuGrapher.deleteMenu("Battle");
            this.MenuGrapher.deleteMenu("GeneralText");
            this.MenuGrapher.deleteMenu("BattleOptions");

            if (callback) {
                callback();
            }

            this.GameStarter.ScenePlayer.playRoutine("Complete");

            if (this.battleInfo.nextCutscene) {
                this.GameStarter.ScenePlayer.startCutscene(
                    this.battleInfo.nextCutscene, this.battleInfo.nextCutsceneSettings);
            } else if (this.battleInfo.nextRoutine) {
                this.GameStarter.ScenePlayer.playRoutine(
                    this.battleInfo.nextRoutine, this.battleInfo.nextRoutineSettings);
            } else {
                this.GameStarter.ScenePlayer.stopCutscene();
            }
        }

        /**
         * 
         */
        showPlayerMenu(): void {
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
        }

        /**
         * 
         */
        setThing(name: string, title: string, settings?: any): IThing {
            var position: IPosition = this.positions[name] || {},
                battleMenu: IMenu = this.MenuGrapher.getMenu(this.battleMenuName),
                thing: IThing = this.things[name];

            if (thing) {
                this.GameStarter.killNormal(thing);
            }

            thing = this.things[name] = this.GameStarter.ObjectMaker.make(title, settings);

            this.GameStarter.addThing(
                thing,
                battleMenu.left + (position.left || 0) * this.GameStarter.unitsize,
                battleMenu.top + (position.top || 0) * this.GameStarter.unitsize);

            this.GameStarter.GroupHolder.switchMemberGroup(
                thing,
                thing.groupType,
                "Text");

            return thing;
        }


        /* In-battle menus
        */

        /**
         * 
         */
        openMovesMenu(): void {
            var actorMoves: IMove[] = this.battleInfo.player.selectedActor.moves,
                moveOptions: any[] = [],
                move: IMove,
                i: number;

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
        }

        /**
         * 
         */
        openItemsMenu(): void {
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
        }

        /**
         * 
         */
        openActorsMenu(callback: (settings: any) => void): void {
            this.openActorsMenuCallback({
                "backMenu": "BattleOptions",
                "container": "Battle",
                "onSwitch": this.switchActor.bind(this)
            });
        }


        /* Battle shenanigans
        */

        /**
         * 
         */
        playMove(choicePlayer: string): void {
            var choiceOpponent: string,
                playerMovesFirst: boolean;

            choiceOpponent = this.GameStarter.MathDecider.compute(
                "opponentMove",
                this.battleInfo.player,
                this.battleInfo.opponent);

            playerMovesFirst = this.GameStarter.MathDecider.compute(
                "playerMovesFirst",
                this.battleInfo.player,
                choicePlayer,
                this.battleInfo.opponent,
                choiceOpponent);

            if (playerMovesFirst) {
                this.GameStarter.ScenePlayer.playRoutine("MovePlayer", {
                    "nextRoutine": "MoveOpponent",
                    "choicePlayer": choicePlayer,
                    "choiceOpponent": choiceOpponent
                });
            } else {
                this.GameStarter.ScenePlayer.playRoutine("MoveOpponent", {
                    "nextRoutine": "MovePlayer",
                    "choicePlayer": choicePlayer,
                    "choiceOpponent": choiceOpponent
                });
            }
        }

        /**
         * 
         */
        switchActor(battlerName: string, i: number): void {
            var battler: IBattleThingInfo = this.battleInfo[battlerName];

            if (battler.selectedIndex === i) {
                this.GameStarter.ScenePlayer.playRoutine("PlayerSwitchesSamePokemon");
                return;
            }

            battler.selectedIndex = i;
            battler.selectedActor = battler.actors[i];

            this.GameStarter.ScenePlayer.playRoutine(
                (battlerName === "player" ? "Player" : "Opponent") + "SendOut");
        }


        /* Battle exits
        */

        /**
         * 
         */
        startBattleExit(): void {
            if (this.battleInfo.opponent.category === "Trainer") {
                this.GameStarter.ScenePlayer.playRoutine("BattleExitFail");
                return;
            }

            this.MenuGrapher.deleteMenu("BattleOptions");
            this.MenuGrapher.addMenuDialog(
                "GeneralText",
                this.battleInfo.exitDialog || this.defaults.exitDialog || "",
                this.closeBattle.bind(this));
            this.MenuGrapher.setActiveMenu("GeneralText");
        }


        /* Utilities
        */

        /**
         * 
         */
        createBackground(): void {
            if (!this.backgroundType) {
                return;
            }

            this.backgroundThing = this.GameStarter.addThing(this.backgroundType);

            this.GameStarter.setWidth(
                this.backgroundThing,
                this.GameStarter.MapScreener.width / 4);

            this.GameStarter.setHeight(
                this.backgroundThing,
                this.GameStarter.MapScreener.height / 4);

            this.GameStarter.GroupHolder.switchMemberGroup(
                this.backgroundThing,
                this.backgroundThing.groupType,
                "Text");
        }

        /**
         * 
         */
        deleteBackground(): void {
            if (this.backgroundThing) {
                this.GameStarter.killNormal(this.backgroundThing);
            }
        }
    }
}
