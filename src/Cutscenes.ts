/// <reference path="../typings/EightBittr.d.ts" />

import { Direction, DirectionAliases, DirectionOpposites, PokedexListingStatus } from "./Constants";
import { FullScreenPokemon } from "./FullScreenPokemon";
import {
    IBattleActionRoutineSettings, IBattleAttackRoutineSettings,
    IBattleCutsceneSettings, IBattleInfo, IBattleLevelRoutineSettings, IBattleMoveRoutineSettings,
    IBattleRoutineSettings, IBattleStatisticRoutineSettings,
    IBattleThingInfo, IBattleThingsById, IBattleTransitionSettings,
    ICharacter, IEnemy, IKeyboardResultsMenu, IMenu, IPlayer, IPokeball, IPokemonMoveListing,
    IThing, ITransitionFlashSettings, ITransitionLineSpiralSettings, ITransportSchema
} from "./IFullScreenPokemon";

/**
 * Cutscene functions used by FullScreenPokemon instances.
 */
export class Cutscenes<TEightBittr extends FullScreenPokemon> extends EightBittr.Component<TEightBittr> {
    /**
     * Cutscene for starting a battle with a spiral.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleTransitionLineSpiral(settings: ITransitionLineSpiralSettings): void {
        const unitsize: number = this.EightBitter.unitsize;
        const divisor: number = settings.divisor || 15;
        const screenWidth: number = this.EightBitter.MapScreener.width;
        const screenHeight: number = this.EightBitter.MapScreener.height;
        const width: number = Math.ceil(screenWidth / divisor);
        const height: number = Math.ceil(screenHeight / divisor);
        const things: IThing[] = [];
        let numTimes: number = 0;
        let direction: number = 2;
        let thing: IThing;
        let difference: number;
        let destination: number;

        const addLineSpiralThing: () => void = (): void => {
            if (numTimes >= ((divisor / 2) | 0)) {
                if (settings.callback) {
                    settings.callback();

                    for (const other of things) {
                        this.EightBitter.physics.killNormal(other);
                    }
                }
                return;
            }

            switch (thing.direction) {
                case 0:
                    thing = this.EightBitter.ObjectMaker.make("BlackSquare", {
                        width: width / unitsize,
                        height: screenHeight / unitsize
                    });
                    this.EightBitter.things.add(
                        thing,
                        screenWidth - ((numTimes + 1) * width),
                        screenHeight - ((numTimes + 1) * divisor)
                    );
                    difference = -height;
                    destination = numTimes * height;
                    break;

                case 1:
                    thing = this.EightBitter.ObjectMaker.make("BlackSquare", {
                        width: screenWidth / unitsize,
                        height: height / unitsize
                    });
                    this.EightBitter.things.add(
                        thing,
                        numTimes * divisor - screenWidth,
                        screenHeight - (numTimes + 1) * height
                    );
                    difference = width;
                    destination = screenWidth - numTimes * width;
                    break;

                case 2:
                    thing = this.EightBitter.ObjectMaker.make("BlackSquare", {
                        width: width / unitsize,
                        height: screenHeight / unitsize
                    });
                    this.EightBitter.things.add(
                        thing,
                        numTimes * width,
                        numTimes * height - screenHeight
                    );
                    difference = height;
                    destination = screenHeight - numTimes * height;
                    break;

                case 3:
                    thing = this.EightBitter.ObjectMaker.make("BlackSquare", {
                        width: screenWidth / unitsize,
                        height: height / unitsize
                    });
                    this.EightBitter.things.add(
                        thing,
                        screenWidth - numTimes * divisor,
                        numTimes * height
                    );
                    difference = -width;
                    destination = numTimes * width;
                    break;

                default:
                    throw new Error("Unknown direction: " + direction + ".");
            }

            things.push(thing);

            this.EightBitter.graphics.moveBattleKeptThingsToText(settings.battleInfo);

            this.EightBitter.TimeHandler.addEventInterval(
                (): boolean => {
                    if (direction % 2 === 1) {
                        this.EightBitter.physics.shiftHoriz(thing, difference);
                    } else {
                        this.EightBitter.physics.shiftVert(thing, difference);
                    }

                    if (direction === 1 || direction === 2) {
                        if (thing[DirectionAliases[direction]] < destination) {
                            return false;
                        }
                    } else {
                        if (thing[DirectionAliases[direction]] > destination) {
                            return false;
                        }
                    }

                    direction = (direction + 3) % 4;
                    if (direction === 2) {
                        numTimes += 1;
                    }

                    addLineSpiralThing();
                    this.EightBitter.graphics.moveBattleKeptThingsToText(settings);

                    return true;
                },
                1,
                Infinity);
        };

        addLineSpiralThing();
    }

    /**
     * Cutscene for starting a battle with a series of flashes.
     * 
     * @param settings   Settings used for the cutscene.
     * @remarks Three [black, white] flashes, then the spiral.
     */
    public cutsceneBattleTransitionFlash(settings: ITransitionFlashSettings): void {
        const flashes: number = settings.flashes || 6;
        const flashColors: string[] = settings.flashColors || ["Black", "White"];
        const callback: Function = settings.callback;
        let change: number = settings.change || .33;
        let speed: number = settings.speed || 1;
        let completed: number = 0;
        let color: string;
        let repeater: () => void = (): void => {
            if (completed >= flashes) {
                if (callback) {
                    callback();
                }
                return;
            }

            color = flashColors[completed % flashColors.length];
            completed += 1;

            this.EightBitter.animations.animateFadeToColor({
                color: color,
                change: change,
                speed: speed,
                callback: (): void => {
                    this.EightBitter.animations.animateFadeFromColor({
                        color: color,
                        change: change,
                        speed: speed,
                        callback: repeater
                    });
                }
            });

            this.EightBitter.graphics.moveBattleKeptThingsToText(settings.battleInfo);
        };

        repeater();
    }

    /**
     * Cutscene for starting a battle with a twist.
     * 
     * @param settings   Settings used for the cutscene.
     * 
     * I think the way to do this would be to treat each quarter of the screen
     * as one section. Divide each section into 10 parts. On each interval
     * increase the maximum the parts can be, while each part is a fraction of
     * the maximum, rounded to a large amount to appear pixellated (perhaps,
     * unitsize * 32?).
     */
    public cutsceneBattleTransitionTwist(settings: IBattleTransitionSettings): void {
        throw new Error("Not yet implemented.");
    }

    /**
     * Cutscene for starting a battle with a flash, then a twist..
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleTransitionFlashTwist(settings: IBattleTransitionSettings): void {
        this.cutsceneBattleTransitionFlash(
            {
                callback: (): void => this.cutsceneBattleTransitionTwist(settings)
            });
    }

    /**
     * Cutscene for starting a battle. Players slide in, then the openingText
     * cutscene is called.
     * 
     * @param settings   Settings used for the cutscene
     */
    public cutsceneBattleEntrance(settings: IBattleCutsceneSettings): void {
        const things: IBattleThingsById = settings.things;
        const battleInfo: IBattleInfo = settings.battleInfo;
        const player: IPlayer = things.player;
        const opponent: IEnemy = things.opponent;
        const menu: IMenu = this.EightBitter.MenuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        let playerX: number;
        let opponentX: number;
        let playerGoal: number;
        let opponentGoal: number;
        let timeout: number = 70;

        battleInfo.player.selectedIndex = 0;
        battleInfo.player.selectedActor = battleInfo.player.actors[0];
        battleInfo.opponent.selectedIndex = 0;
        battleInfo.opponent.selectedActor = battleInfo.opponent.actors[0];

        player.opacity = 0;
        opponent.opacity = 0;

        this.EightBitter.physics.setLeft(player, menu.right + player.width * this.EightBitter.unitsize);
        this.EightBitter.physics.setRight(opponent, menu.left);
        this.EightBitter.physics.setTop(opponent, menu.top);

        // They should be visible halfway through (2 * (1 / timeout))
        this.EightBitter.animations.animateFadeAttribute(player, "opacity", 2 / timeout, 1, 1);
        this.EightBitter.animations.animateFadeAttribute(opponent, "opacity", 2 / timeout, 1, 1);

        playerX = this.EightBitter.physics.getMidX(player);
        opponentX = this.EightBitter.physics.getMidX(opponent);
        playerGoal = menu.left + player.width * this.EightBitter.unitsize / 2;
        opponentGoal = menu.right - opponent.width * this.EightBitter.unitsize / 2;

        this.EightBitter.animations.animateSlideHorizontal(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        this.EightBitter.animations.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        this.EightBitter.storage.addPokemonToPokedex(battleInfo.opponent.actors[0].title, PokedexListingStatus.Seen);

        this.EightBitter.TimeHandler.addEvent(this.EightBitter.ScenePlayer.bindRoutine("OpeningText"), timeout);

        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the opening text and base menus in a battle. Afer this,
     * the OpponentIntro or PlayerIntro cutscene is triggered.
     * 
     * @param settings   Settings used for the cutscene
     */
    public cutsceneBattleOpeningText(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const textStart: [string, string] = battleInfo.textStart;
        let nextRoutine: string;
        let callback: (...args: any[]) => void;

        if (settings.battleInfo.opponent.hasActors) {
            nextRoutine = "OpponentIntro";
        } else {
            nextRoutine = "PlayerIntro";
        }

        if (battleInfo.automaticMenus) {
            callback = (): void => {
                this.EightBitter.TimeHandler.addEvent(
                    (): void => this.EightBitter.ScenePlayer.playRoutine(nextRoutine),
                    70);
            };
        } else {
            callback = this.EightBitter.ScenePlayer.bindRoutine(nextRoutine);
        }

        this.EightBitter.MenuGrapher.createMenu("BattlePlayerHealth");
        this.EightBitter.battles.addBattleDisplayPokeballs(
            this.EightBitter.MenuGrapher.getMenu("BattlePlayerHealth") as IMenu,
            battleInfo.player);

        if (battleInfo.opponent.hasActors) {
            this.EightBitter.MenuGrapher.createMenu("BattleOpponentHealth");
            this.EightBitter.battles.addBattleDisplayPokeballs(
                this.EightBitter.MenuGrapher.getMenu("BattleOpponentHealth") as IMenu,
                battleInfo.player,
                true);
        } else {
            this.EightBitter.battles.addBattleDisplayPokemonHealth("opponent");
        }

        this.EightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: battleInfo.automaticMenus
        });
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    textStart[0], battleInfo.opponent.name, textStart[1]
                ]
            ],
            callback
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for an enemy's intro in a battle. They enter, and either send
     * out a Pokemon or let the player intro.
     * 
     * @param settings   Settings used for the cutscene
     */
    public cutsceneBattleOpponentIntro(settings: IBattleCutsceneSettings): void {
        const things: any = settings.things;
        const opponent: ICharacter = things.opponent;
        const menu: IMenu = this.EightBitter.MenuGrapher.getMenu("GeneralText") as IMenu;
        const opponentX: number = this.EightBitter.physics.getMidX(opponent);
        const opponentGoal: number = menu.right + opponent.width * this.EightBitter.unitsize / 2;
        const battleInfo: IBattleInfo = settings.battleInfo;
        const callback: string = battleInfo.opponent.hasActors
            ? "OpponentSendOut"
            : "PlayerIntro";
        const timeout: number = 49;

        this.EightBitter.animations.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.animations.animateFadeAttribute(
                    opponent,
                    "opacity",
                    -2 / timeout,
                    0,
                    1);
            },
            (timeout / 2) | 0);

        this.EightBitter.MenuGrapher.deleteMenu("BattleOpponentHealth");
        this.EightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    battleInfo.textOpponentSendOut[0],
                    battleInfo.opponent.name,
                    battleInfo.textOpponentSendOut[1],
                    battleInfo.opponent.actors[0].nickname,
                    battleInfo.textOpponentSendOut[2]
                ]
            ]
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        this.EightBitter.TimeHandler.addEvent(
            this.EightBitter.ScenePlayer.bindRoutine(
                callback,
                {
                    nextRoutine: "PlayerIntro"
                }),
            timeout);
    }

    /**
     * Cutscene for a player's intro into battle. Afterwards, the ShowPlayerMenu
     * cutscene is triggered.
     * 
     * @param settings   Settings used for the cutscene
     */
    public cutsceneBattlePlayerIntro(settings: IBattleCutsceneSettings): void {
        const things: any = settings.things;
        const player: IPlayer = things.player;
        const menu: IMenu = this.EightBitter.MenuGrapher.getMenu("GeneralText") as IMenu;
        const playerX: number = this.EightBitter.physics.getMidX(player);
        const playerGoal: number = menu.left - player.width * this.EightBitter.unitsize / 2;
        const battleInfo: IBattleInfo = settings.battleInfo;
        const timeout: number = 24;

        this.EightBitter.MenuGrapher.deleteMenu("BattlePlayerHealth");

        if (!battleInfo.player.hasActors) {
            this.EightBitter.ScenePlayer.playRoutine("ShowPlayerMenu");
            return;
        }

        this.EightBitter.animations.animateSlideHorizontal(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.animations.animateFadeAttribute(
                    player,
                    "opacity",
                    -2 / timeout,
                    0,
                    1);
            },
            (timeout / 2) | 0);

        this.EightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    battleInfo.textPlayerSendOut[0],
                    battleInfo.player.actors[0].nickname,
                    battleInfo.textPlayerSendOut[1]
                ]
            ]
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        this.EightBitter.TimeHandler.addEvent(
            this.EightBitter.ScenePlayer.bindRoutine(
                "PlayerSendOut",
                {
                    nextRoutine: "ShowPlayerMenu"
                }),
            timeout);
    }

    /**
     * Cutscene for showing the player menu. The user may now interact with
     * the menu for controlling their side of the battle.
     * 
     * @param settings   Settings used for the cutscene
     */
    public cutsceneBattleShowPlayerMenu(settings: IBattleCutsceneSettings): void {
        this.EightBitter.MenuGrapher.deleteMenu("Yes/No");

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.BattleMover.showPlayerMenu();

        if (settings.battleInfo.onShowPlayerMenu) {
            settings.battleInfo.onShowPlayerMenu();
        }
    }

    /**
     * Cutscene for the opponent starting to send out a Pokemon. A smoke effect
     * plays, then the OpponentSendOutAppear cutscene triggers.
     * 
     * @param settings   Settings used for the cutscene
     * @param args   Settings to pass to the OpponentSendOut cutscene.
     */
    public cutsceneBattleOpponentSendOut(settings: IBattleCutsceneSettings, args: IBattleRoutineSettings): void {
        const menu: IMenu = settings.things.menu;
        const left: number = menu.right - this.EightBitter.unitsize * 8;
        const top: number = menu.top + this.EightBitter.unitsize * 32;

        console.warn("Should reset *Normal statistics for opponent Pokemon.");

        settings.opponentLeft = left;
        settings.opponentTop = top;

        this.EightBitter.MenuGrapher.setActiveMenu(undefined);

        this.EightBitter.animations.animateSmokeSmall(
            left,
            top,
            this.EightBitter.ScenePlayer.bindRoutine("OpponentSendOutAppear", args)
        );
    }

    /**
     * Cutscene for the opponent's Pokemon appearing. The .nextRoutine from args
     * is played.
     * 
     * @param settings   Settings used for the cutscene
     * @param args   Settings to pass to the next routine.
     */
    public cutsceneBattleOpponentSendOutAppear(settings: IBattleCutsceneSettings, args: IBattleRoutineSettings): void {
        const opponentInfo: IBattleThingInfo = settings.battleInfo.opponent;
        const pokemonInfo: BattleMovr.IActor = opponentInfo.actors[opponentInfo.selectedIndex];
        const pokemon: BattleMovr.IThing = this.EightBitter.BattleMover.setThing(
            "opponent",
            pokemonInfo.title.join("") + "Front");

        console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);

        this.EightBitter.battles.addBattleDisplayPokemonHealth("opponent");
        this.EightBitter.storage.addPokemonToPokedex(pokemonInfo.title, PokedexListingStatus.Seen);

        if (args) {
            this.EightBitter.ScenePlayer.playRoutine(args.nextRoutine);
        }
    }

    /**
     * Cutscene for the player starting to send out a Pokemon. A smoke effect
     * plays, then the PlayerSendOutAppear cutscene triggers.
     * 
     * @param settings   Settings used for the cutscene
     * @param args   Settings to pass to the PlayerSendOut cutscene.
     */
    public cutsceneBattlePlayerSendOut(settings: any, args: IBattleRoutineSettings): void {
        const menu: IMenu = settings.things.menu;
        const left: number = menu.left + this.EightBitter.unitsize * 8;
        const top: number = menu.bottom - this.EightBitter.unitsize * 8;

        console.warn("Should reset *Normal statistics for player Pokemon.");

        settings.playerLeft = left;
        settings.playerTop = top;

        this.EightBitter.MenuGrapher.setActiveMenu(undefined);

        this.EightBitter.animations.animateSmokeSmall(
            left,
            top,
            this.EightBitter.ScenePlayer.bindRoutine("PlayerSendOutAppear", args));
    }

    /**
     * Cutscene for the player's Pokemon appearing. The .nextRoutine from args
     * is played.
     * 
     * @param settings   Settings used for the cutscene
     * @param args   Settings to pass to the next routine.
     */
    public cutsceneBattlePlayerSendOutAppear(settings: IBattleCutsceneSettings, args: IBattleRoutineSettings): void {
        const playerInfo: BattleMovr.IBattleThingInfo = settings.battleInfo.player;
        const pokemonInfo: BattleMovr.IActor = playerInfo.selectedActor;
        const pokemon: BattleMovr.IThing = this.EightBitter.BattleMover.setThing(
            "player",
            pokemonInfo.title.join("") + "Back");

        console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);

        this.EightBitter.battles.addBattleDisplayPokemonHealth("player");

        this.EightBitter.MenuGrapher.createMenu("BattlePlayerHealthNumbers");
        this.EightBitter.battles.setBattleDisplayPokemonHealthBar("Player", pokemonInfo.HP, pokemonInfo.HPNormal);
        this.EightBitter.ScenePlayer.playRoutine(args.nextRoutine);
    }

    /**
     * Cutscene for the player attempting to switch a Pokemon with itself.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattlePlayerSwitchesSamePokemon(settings: IBattleCutsceneSettings): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText", {
            backMenu: "PokemonMenuContext"
        });
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                settings.battleInfo.player.selectedActor.nickname, " is already out!"
            ]);
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player to start a Pokemon move. After the announcement text,
     * the MovePlayerAnimate cutscene is played.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleMovePlayer(settings: IBattleCutsceneSettings, args: IBattleMoveRoutineSettings): void {
        const player: BattleMovr.IBattleThingInfo = settings.battleInfo.player;
        const playerActor: BattleMovr.IActor = player.selectedActor;
        const opponent: BattleMovr.IBattleThingInfo = settings.battleInfo.opponent;
        const opponentActor: BattleMovr.IActor = opponent.selectedActor;
        const choice: string = args.choicePlayer;

        args.damage = this.EightBitter.MathDecider.compute("damage", choice, playerActor, opponentActor);

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    playerActor.nickname, " used ", choice + "!"
                ]
            ],
            this.EightBitter.ScenePlayer.bindRoutine("MovePlayerAnimate", args)
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for animating the player's chosen move.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleMovePlayerAnimate(settings: any, args: IBattleMoveRoutineSettings): void {
        const choice: string = args.choicePlayer;
        const move: IPokemonMoveListing = this.EightBitter.MathDecider.getConstant("moves")[choice];

        console.log("Should do something with", move);

        args.attackerName = "player";
        args.defenderName = "opponent";

        args.callback = (): void => {
            let callback: Function;

            args.movePlayerDone = true;

            if (args.moveOpponentDone) {
                callback = (): void => {
                    args.movePlayerDone = false;
                    args.moveOpponentDone = false;
                    this.EightBitter.MenuGrapher.createMenu("GeneralText");
                    this.EightBitter.BattleMover.showPlayerMenu();
                };
            } else {
                callback = (): void => {
                    this.EightBitter.TimeHandler.addEvent(
                        (): void => this.EightBitter.ScenePlayer.playRoutine("MoveOpponent", args),
                        7);
                };
            }

            this.EightBitter.ScenePlayer.playRoutine("Damage", {
                battlerName: "opponent",
                damage: args.damage,
                callback: callback
            });
        };

        // @todo: When all moves have been implemented, this will be simplified.
        if (!this.EightBitter.ScenePlayer.getOtherRoutine("Attack" + choice.replace(" ", ""))) {
            console.warn(choice + " attack animation not implemented...");
            args.callback();
        } else {
            this.EightBitter.ScenePlayer.playRoutine("Attack" + choice.replace(" ", ""), args);
        }
    }

    /**
     * Cutscene for the opponent to start a Pokemon move. After the announcement text,
     * the MoveOpponentAnimate cutscene is played.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleMoveOpponent(settings: IBattleCutsceneSettings, args: IBattleMoveRoutineSettings): void {
        const opponent: BattleMovr.IBattleThingInfo = settings.battleInfo.opponent;
        const opponentActor: BattleMovr.IActor = opponent.selectedActor;
        const player: BattleMovr.IBattleThingInfo = settings.battleInfo.player;
        const playerActor: BattleMovr.IActor = player.selectedActor;
        const choice: string = args.choiceOpponent;

        args.damage = this.EightBitter.MathDecider.compute("damage", choice, opponentActor, playerActor);

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    opponent.selectedActor.nickname, " used ", choice + "!"
                ]
            ],
            this.EightBitter.ScenePlayer.bindRoutine("MoveOpponentAnimate", args));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for animating an opponent's chosen move.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleMoveOpponentAnimate(settings: IBattleCutsceneSettings, args: IBattleMoveRoutineSettings): void {
        const choice: string = args.choiceOpponent;
        const move: string = this.EightBitter.MathDecider.getConstant("moves")[choice];

        console.log("Should do something with", move);

        args.attackerName = "opponent";
        args.defenderName = "player";

        args.callback = (): void => {
            let callback: Function;

            args.moveOpponentDone = true;

            if (args.movePlayerDone) {
                callback = (): void => {
                    args.movePlayerDone = false;
                    args.moveOpponentDone = false;
                    this.EightBitter.MenuGrapher.createMenu("GeneralText");
                    this.EightBitter.BattleMover.showPlayerMenu();
                };
            } else {
                callback = (): void => {
                    this.EightBitter.TimeHandler.addEvent(
                        (): void => this.EightBitter.ScenePlayer.playRoutine("MovePlayer", args),
                        7);
                };
            }

            this.EightBitter.ScenePlayer.playRoutine("Damage", {
                battlerName: "player",
                damage: args.damage,
                callback: callback
            });
        };

        // @todo: When all moves have been implemented, this will be simplified.
        if (!this.EightBitter.ScenePlayer.getOtherRoutine("Attack" + choice.replace(" ", ""))) {
            console.warn(choice + " attack animation not implemented...");
            args.callback();
        } else {
            this.EightBitter.ScenePlayer.playRoutine("Attack" + choice.replace(" ", ""), args);
        }
    }

    /**
     * Cutscene for applying and animating damage in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleDamage(settings: IBattleCutsceneSettings, args: IBattleActionRoutineSettings): void {
        const battlerName: string = args.battlerName;
        const damage: number = args.damage;
        const battleInfo: IBattleInfo = this.EightBitter.BattleMover.getBattleInfo() as IBattleInfo;
        const battler: BattleMovr.IBattleThingInfo = (battleInfo as any)[battlerName];
        const actor: BattleMovr.IActor = battler.selectedActor;
        const hpStart: number = actor.HP;
        const hpEnd: number = Math.max(hpStart - damage, 0);
        const callback: (...args: any[]) => void = hpEnd === 0
            ? (): void => {
                this.EightBitter.TimeHandler.addEvent(
                    (): void => {
                        this.EightBitter.ScenePlayer.playRoutine(
                            "PokemonFaints",
                            {
                                battlerName: battlerName
                            });
                    },
                    49);
            }
            : args.callback;

        if (damage !== 0) {
            this.EightBitter.battles.animateBattleDisplayPokemonHealthBar(
                battlerName,
                hpStart,
                hpEnd,
                actor.HPNormal,
                callback);

            actor.HP = hpEnd;
        } else {
            callback(this.EightBitter);
        }
    }

    /**
     * Cutscene for a Pokemon fainting in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattlePokemonFaints(settings: IBattleCutsceneSettings, args: IBattleActionRoutineSettings): void {
        const battlerName: string = args.battlerName;
        const battleInfo: IBattleInfo = this.EightBitter.BattleMover.getBattleInfo() as IBattleInfo;
        const actor: BattleMovr.IActor = (battleInfo as any)[battlerName].selectedActor;
        const thing: IThing = settings.things[battlerName];
        const blank: IThing = this.EightBitter.ObjectMaker.make(
            "WhiteSquare",
            {
                width: thing.width * thing.scale,
                height: thing.height * thing.scale
            });
        const texts: IThing[] = this.EightBitter.GroupHolder.getGroup("Text") as IThing[];
        const background: IThing = this.EightBitter.BattleMover.getBackgroundThing() as IThing;
        const backgroundIndex: number = texts.indexOf(background);
        const nextRoutine: string = battlerName === "player"
                ? "AfterPlayerPokemonFaints" : "AfterOpponentPokemonFaints";

        this.EightBitter.things.add(
            blank,
            thing.left,
            thing.top + thing.height * thing.scale * this.EightBitter.unitsize);

        this.EightBitter.utilities.arrayToIndex(blank, texts, backgroundIndex + 1);
        this.EightBitter.utilities.arrayToIndex(thing, texts, backgroundIndex + 1);

        this.EightBitter.animations.animateSlideVertical(
            thing,
            this.EightBitter.unitsize * 2,
            this.EightBitter.physics.getMidY(thing) + thing.height * thing.scale * this.EightBitter.unitsize,
            1,
            (): void => {
                this.EightBitter.physics.killNormal(thing);
                this.EightBitter.physics.killNormal(blank);
                this.EightBitter.MenuGrapher.createMenu("GeneralText");
                this.EightBitter.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        [
                            actor.nickname, " fainted!"
                        ]
                    ],
                    this.EightBitter.ScenePlayer.bindRoutine(nextRoutine, args)
                );
                this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
            });

        this.EightBitter.ModAttacher.fireEvent("onFaint", actor, battleInfo.player.actors);
    }

    /**
     * Cutscene for choosing what to do after a Pokemon faints in battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleAfterPlayerPokemonFaints(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = this.EightBitter.BattleMover.getBattleInfo() as IBattleInfo;
        const actorAvailable: boolean = this.EightBitter.utilities.checkArrayMembersIndex(battleInfo.player.actors, "HP");

        if (actorAvailable) {
            this.EightBitter.ScenePlayer.playRoutine("PlayerChoosesPokemon");
        } else {
            this.EightBitter.ScenePlayer.playRoutine("Defeat");
        }
    }

    /**
     * Cutscene for after an opponent's Pokemon faints in battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleAfterOpponentPokemonFaints(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const opponent: BattleMovr.IBattleThingInfo = battleInfo.opponent;
        const actorAvailable: boolean = this.EightBitter.utilities.checkArrayMembersIndex(opponent.actors, "HP");
        const experienceGained: number = this.EightBitter.MathDecider.compute(
            "experienceGained", battleInfo.player, battleInfo.opponent);
        let callback: Function;

        if (actorAvailable) {
            callback = this.EightBitter.ScenePlayer.bindRoutine("OpponentSwitchesPokemon");
        } else {
            callback = this.EightBitter.ScenePlayer.bindRoutine("Victory");
        }

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    battleInfo.player.selectedActor.nickname,
                    " gained ",
                    experienceGained.toString(),
                    " EXP. points!"
                ]
            ],
            this.EightBitter.ScenePlayer.bindRoutine(
                "ExperienceGain",
                {
                    experienceGained: experienceGained,
                    callback: callback
                }
            ));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for an opponent switching Pokemon in battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleOpponentSwitchesPokemon(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const opponent: BattleMovr.IBattleThingInfo = battleInfo.opponent;
        const nicknameExclaim: string[] = opponent.selectedActor.nickname.slice();

        nicknameExclaim.push("!");

        this.EightBitter.BattleMover.switchActor("opponent", opponent.selectedIndex + 1);

        this.EightBitter.MenuGrapher.createMenu("GeneralText", {
            deleteOnFinish: false
        });
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                opponent.name,
                "is about to use",
                nicknameExclaim,
                "Will %%%%%%%PLAYER%%%%%%% change %%%%%%%POKEMON%%%%%%%?"
            ],
            (): void => {
                this.EightBitter.MenuGrapher.createMenu("Yes/No");
                this.EightBitter.MenuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "Yes",
                            callback: this.EightBitter.ScenePlayer.bindRoutine(
                                "PlayerSwitchesPokemon",
                                {
                                    nextRoutine: "OpponentSendOut"
                                })
                        }, {
                            text: "No",
                            callback: this.EightBitter.ScenePlayer.bindRoutine(
                                "OpponentSendOut",
                                {
                                    nextRoutine: "ShowPlayerMenu"
                                })
                        }]
                });
                this.EightBitter.MenuGrapher.setActiveMenu("Yes/No");
            }
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

    }

    /**
     * Cutscene for a player's Pokemon gaining experience in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleExperienceGain(settings: IBattleCutsceneSettings, args: IBattleLevelRoutineSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const actor: BattleMovr.IActor = battleInfo.player.selectedActor;
        const experience: BattleMovr.IActorExperience = actor.experience;
        let gains: number = args.experienceGained;

        console.warn("Experience gain is hardcoded to the current actor...");

        experience.current += gains;
        experience.remaining -= gains;

        if (experience.remaining < 0) {
            gains -= experience.remaining;
            this.EightBitter.ScenePlayer.playRoutine("LevelUp", {
                experienceGained: gains,
                callback: args.callback
            });
        } else {
            args.callback();
        }
    }

    /**
     * Cutscene for a player's Pokemon leveling up in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleLevelUp(settings: IBattleCutsceneSettings, args: IBattleLevelRoutineSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        // const gains: number = args.experienceGained;
        const actor: BattleMovr.IActor = battleInfo.player.selectedActor;

        actor.level += 1;
        actor.experience = this.EightBitter.MathDecider.compute(
            "newPokemonExperience", actor.title, actor.level);

        console.warn("Leveling up does not yet increase stats...");

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    actor.nickname,
                    " grew to level ",
                    actor.level.toString(),
                    "!"
                ]
            ],
            this.EightBitter.ScenePlayer.bindRoutine("LevelUpStats", args)
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for displaying a Pokemon's statistics in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleLevelUpStats(settings: IBattleCutsceneSettings, args: IBattleLevelRoutineSettings): void {
        this.EightBitter.menus.openPokemonLevelUpStats({
            container: "BattleDisplayInitial",
            position: {
                horizontal: "right",
                vertical: "bottom",
                offset: {
                    left: 4
                }
            },
            pokemon: settings.battleInfo.player.selectedActor,
            onMenuDelete: args.callback
        });
        this.EightBitter.MenuGrapher.setActiveMenu("LevelUpStats");

        console.warn("For stones, LevelUpStats should be taken out of battles.");
    }

    /**
     * Cutscene for a player choosing a Pokemon (creating the menu for it).
     */
    public cutsceneBattlePlayerChoosesPokemon(): void {
        this.EightBitter.MenuGrapher.createMenu("Pokemon", {
            position: {
                vertical: "center",
                offset: {
                    left: 0
                }
            }
        });
    }

    /**
     * Cutscene for failing to run from a trainer battle.
     */
    public cutsceneBattleExitFail(): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            "No! There's no running from a trainer battle!",
            this.EightBitter.ScenePlayer.bindRoutine("BattleExitFailReturn"));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for returning to a battle after failing to exit.
     * 
     */
    public cutsceneBattleExitFailReturn(): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.BattleMover.showPlayerMenu();
    }

    /**
     * Cutscene for becoming victorious in battle.
     */
    public cutsceneBattleVictory(): void {
        const battleInfo: IBattleInfo = this.EightBitter.BattleMover.getBattleInfo() as IBattleInfo;
        const opponent: BattleMovr.IBattleThingInfo = battleInfo.opponent;

        if (!opponent.hasActors) {
            this.EightBitter.BattleMover.closeBattle((): void => {
                this.EightBitter.animations.animateFadeFromColor({
                    color: "White"
                });
            });
            return;
        }

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "%%%%%%%PLAYER%%%%%%% defeated ",
                    opponent.name,
                    "!"
                ]
            ],
            this.EightBitter.ScenePlayer.bindRoutine("VictorySpeech")
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the opponent responding to the player's victory.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleVictorySpeech(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const menu: IMenu = this.EightBitter.MenuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const opponent: IThing = this.EightBitter.BattleMover.setThing("opponent", battleInfo.opponent.sprite) as IThing;
        const timeout: number = 35;
        let opponentX: number;
        let opponentGoal: number;

        opponent.opacity = 0;

        this.EightBitter.physics.setTop(opponent, menu.top);
        this.EightBitter.physics.setLeft(opponent, menu.right);
        opponentX = this.EightBitter.physics.getMidX(opponent);
        opponentGoal = menu.right - opponent.width * this.EightBitter.unitsize / 2;

        this.EightBitter.animations.animateFadeAttribute(opponent, "opacity", 4 / timeout, 1, 1);
        this.EightBitter.animations.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1,
            (): void => {
                this.EightBitter.MenuGrapher.createMenu("GeneralText");
                this.EightBitter.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    battleInfo.textVictory,
                    this.EightBitter.ScenePlayer.bindRoutine("VictoryWinnings"));
                this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
            });
    }

    /**
     * Cutscene for receiving cash for defeating an opponent.
     * 
     * @param settings   Settings used for the cutscene
     */
    public cutsceneBattleVictoryWinnings(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const reward: number = battleInfo.opponent.reward;
        const animationSettings: any = {
            color: "White"
        };
        const callback: () => void = (): void => {
            this.EightBitter.BattleMover.closeBattle((): void => {
                this.EightBitter.animations.animateFadeFromColor(animationSettings);
            });
        };

        if (battleInfo.giftAfterBattle) {
            this.EightBitter.storage.addItemToBag(battleInfo.giftAfterBattle, battleInfo.giftAfterBattleAmount || 1);
        }

        if (battleInfo.badge) {
            this.EightBitter.ItemsHolder.getItem("badges")[battleInfo.badge] = true;
        }

        if (battleInfo.textAfterBattle) {
            animationSettings.callback = (): void => {
                this.EightBitter.MenuGrapher.createMenu("GeneralText");
                this.EightBitter.MenuGrapher.addMenuDialog("GeneralText", battleInfo.textAfterBattle);
                this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
            };
        }

        if (!reward) {
            callback();
            return;
        }

        this.EightBitter.ItemsHolder.increase("money", reward);

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% got $" + reward + " for winning!"
            ],
            callback);
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player being defeated in battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleDefeat(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const message: string[] = ["%%%%%%%PLAYER%%%%%%% is out of useable %%%%%%%POKEMON%%%%%%%!"];
        let callback: () => void;

        if (!battleInfo.noBlackout) {
            message.push("%%%%%%%PLAYER%%%%%%% blacked out!");
            callback = (): void => {
                let transport: ITransportSchema = this.EightBitter.ItemsHolder.getItem("lastPokecenter");

                this.EightBitter.BattleMover.closeBattle();
                this.EightBitter.maps.setMap(transport.map, transport.location);

                for (const pokemon of this.EightBitter.ItemsHolder.getItem("PokemonInParty")) {
                    this.EightBitter.battles.healPokemon(pokemon);
                }

                this.EightBitter.storage.autoSave();
            };
        } else {
            callback = (): void => this.EightBitter.BattleMover.closeBattle();
        }

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            message,
            (): void => {
                this.EightBitter.animations.animateFadeToColor({
                    color: "Black",
                    callback: callback
                });
            });
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for a battle completely finishing.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleComplete(settings: IBattleCutsceneSettings): void {
        this.EightBitter.MapScreener.blockInputs = false;
        this.EightBitter.graphics.moveBattleKeptThingsBack(settings.battleInfo);
        this.EightBitter.ItemsHolder.setItem("PokemonInParty", settings.battleInfo.player.actors);
        this.EightBitter.ModAttacher.fireEvent("onBattleComplete", settings.battleInfo);
        if (this.EightBitter.MapScreener.theme) {
            this.EightBitter.AudioPlayer.playTheme(this.EightBitter.MapScreener.theme);
        }
    }

    /**
     * Cutscene for changing a statistic in battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleChangeStatistic(settings: any, args: IBattleStatisticRoutineSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const defenderName: string = args.defenderName;
        const defender: BattleMovr.IActor = (battleInfo as any)[defenderName].selectedActor;
        const defenderLabel: string = defenderName === "opponent"
            ? "Enemy " : "";
        const statistic: string = args.statistic;
        const amount: number = args.amount;
        let amountLabel: string;

        (defender as any)[statistic] -= amount;

        switch (amount) {
            case 2:
                amountLabel = "sharply rose";
                break;
            case 1:
                amountLabel = "rose";
                break;
            case -1:
                amountLabel = "fell";
                break;
            case -2:
                amountLabel = "sharply fell";
                break;
            default:
                break;
        }

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    defenderLabel,
                    defender.nickname,
                    "'s ",
                    statistic.toUpperCase(),
                    " " + amountLabel + "!"
                ]
            ],
            args.callback
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for a Growl attack in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleAttackGrowl(settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName;
        const defenderName: string = args.defenderName;
        const attacker: IThing = this.EightBitter.BattleMover.getThing(attackerName) as IThing;
        const defender: IThing = this.EightBitter.BattleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const notes: IThing[] = [
            this.EightBitter.ObjectMaker.make("Note"),
            this.EightBitter.ObjectMaker.make("Note")
        ];
        const menu: IMenu = this.EightBitter.MenuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const dt: number = 10;
        let startX: number;
        let startY: number;
        let movement: (note: IThing, dx: number) => void = (note: IThing, dx: number): void => {
            let flip: number = 1;
            let differenceX: number;
            let differenceY: number;

            if (direction === 1) {
                differenceX = menu.right - startX;
                differenceY = (menu.top + defender.height / 2 * this.EightBitter.unitsize) - startY;
            } else {
                differenceX = menu.left - startX;
                differenceY = (menu.bottom - defender.height * this.EightBitter.unitsize) - startY;
            }

            for (let i: number = 1; i <= 4; i += 1) {
                this.EightBitter.TimeHandler.addEvent(
                    (): void => {
                        this.EightBitter.physics.shiftHoriz(note, differenceX / 4);
                        if (flip === 1) {
                            this.EightBitter.physics.shiftVert(note, differenceY / 10 * 6);
                        } else {
                            this.EightBitter.physics.shiftVert(note, -1 * differenceY / 8);
                        }
                        flip *= -1;
                    },
                    dx * i);
            }
        };

        if (direction === 1) {
            startX = menu.left + attacker.width / 2 * this.EightBitter.unitsize;
            startY = menu.bottom - attacker.height * this.EightBitter.unitsize;
        } else {
            startX = menu.right - attacker.width / 2 * this.EightBitter.unitsize;
            startY = menu.top + attacker.height * this.EightBitter.unitsize;
        }

        this.EightBitter.things.add(notes[0], startX, startY);
        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.things.add(
                    notes[1],
                    startX + notes[1].width / 2 * this.EightBitter.unitsize,
                    startY + this.EightBitter.unitsize * 3);
            },
            2);

        movement(notes[0], dt);
        movement(notes[1], dt + 2);

        this.EightBitter.TimeHandler.addEvent(
            (): void => this.EightBitter.physics.killNormal(notes[0]),
            5 * dt);
        this.EightBitter.TimeHandler.addEvent(
            (): void => this.EightBitter.physics.killNormal(notes[1]),
            5 * dt + 2);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.animations.animateScreenShake(
                    3,
                    0,
                    6,
                    undefined,
                    this.EightBitter.ScenePlayer.bindRoutine(
                        "ChangeStatistic",
                        this.EightBitter.utilities.proliferate(
                            {
                                callback: args.callback,
                                defenderName: defenderName,
                                statistic: "Attack",
                                amount: -1
                            },
                            args)));
            },
            5 * dt);

    }

    /**
     * Cutscene for a Tackle attack in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleAttackTackle(settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName;
        const defenderName: string = args.defenderName;
        const attacker: IThing = this.EightBitter.BattleMover.getThing(attackerName) as IThing;
        const defender: IThing = this.EightBitter.BattleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        let xvel: number = 7 * direction;
        let dt: number = 7;
        const movement: TimeHandlr.ITimeEvent = this.EightBitter.TimeHandler.addEventInterval(
            (): void => {
                this.EightBitter.physics.shiftHoriz(attacker, xvel);
            },
            1,
            Infinity);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                xvel *= -1;
            },
            dt);

        this.EightBitter.TimeHandler.addEvent(this.EightBitter.TimeHandler.cancelEvent, dt * 2 - 1, movement);

        if (attackerName === "player") {
            this.EightBitter.TimeHandler.addEvent(
                this.EightBitter.animations.animateFlicker,
                dt * 2,
                defender,
                14,
                5,
                args.callback);
        } else {
            this.EightBitter.TimeHandler.addEvent(
                (): void => {
                    this.EightBitter.animations.animateScreenShake(
                        0,
                        undefined,
                        undefined,
                        undefined,
                        (): void => {
                            this.EightBitter.animations.animateFlicker(
                                defender,
                                14,
                                5,
                                args.callback);
                        });
                },
                dt * 2);
        }
    }

    /**
     * Cutscene for a Tail Whip attack in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleAttackTailWhip(settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName;
        const defenderName: string = args.defenderName;
        const attacker: IThing = this.EightBitter.BattleMover.getThing(attackerName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const dt: number = 11;
        const dx: number = this.EightBitter.unitsize * 4;

        this.EightBitter.physics.shiftHoriz(attacker, dx * direction);

        this.EightBitter.TimeHandler.addEvent(
            (): void => this.EightBitter.physics.shiftHoriz(attacker, -dx * direction),
            dt);
        this.EightBitter.TimeHandler.addEvent(
            (): void => this.EightBitter.physics.shiftHoriz(attacker, dx * direction),
            dt * 2);
        this.EightBitter.TimeHandler.addEvent(
            (): void => this.EightBitter.physics.shiftHoriz(attacker, -dx * direction),
            dt * 3);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.animations.animateScreenShake(
                    3,
                    0,
                    6,
                    undefined,
                    this.EightBitter.ScenePlayer.bindRoutine(
                        "ChangeStatistic",
                        {
                            callback: args.callback,
                            defenderName: defenderName,
                            statistic: "Defense",
                            amount: -1
                        }));
            },
            (dt * 3.5) | 0);
    }

    /**
     * Cutscene for a Scratch attack in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleAttackScratch(settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const defenderName: string = args.defenderName;
        const defender: IThing = this.EightBitter.BattleMover.getThing(defenderName) as IThing;
        const dt: number = 1;
        const direction: number = defenderName === "opponent" ? -1 : 1;
        const differenceX: number = defender.width / 2 * this.EightBitter.unitsize;
        const lineArray: IThing[] = [];
        const menu: IMenu = this.EightBitter.MenuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const scratches: IThing[] = [
            this.EightBitter.ObjectMaker.make("ExplosionSmall"),
            this.EightBitter.ObjectMaker.make("ExplosionSmall"),
            this.EightBitter.ObjectMaker.make("ExplosionSmall")
        ];
        let startX: number;
        let startY: number;

        if (direction === -1) {
            startX = menu.right - defender.width / 2 * this.EightBitter.unitsize;
            startY = menu.top;
        } else {
            startX = menu.left + defender.width * this.EightBitter.unitsize;
            startY = menu.bottom - (defender.height + 8) * this.EightBitter.unitsize;
        }

        this.EightBitter.things.add(scratches[0], startX, startY);
        const offset: number = scratches[0].width * this.EightBitter.unitsize / 2;
        this.EightBitter.things.add(scratches[1], startX + offset * direction * -1, startY + offset);
        this.EightBitter.things.add(scratches[2], startX + offset * direction * -2, startY + offset * 2);

        this.EightBitter.TimeHandler.addEventInterval(
            (): void => {
                for (const scratch of scratches) {
                    const left: number = direction === -1 ? scratch.left : scratch.right - 3 * this.EightBitter.unitsize;
                    const top: number =  scratch.bottom - 3 * this.EightBitter.unitsize;

                    this.EightBitter.TimeHandler.addEvent(
                        (): void => this.EightBitter.physics.shiftHoriz(scratch, differenceX * direction / 16),
                        dt);
                    this.EightBitter.TimeHandler.addEvent(
                        (): void => this.EightBitter.physics.shiftVert(scratch, differenceX * direction / 16),
                        dt);

                    const line: IThing = this.EightBitter.things.add("ScratchLine", left, top);
                    if (direction === 1) {
                        this.EightBitter.graphics.flipHoriz(line);
                    }
                    lineArray.push(line);
                }
            },
            dt,
            16);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                for (const scratch of scratches) {
                    this.EightBitter.physics.killNormal(scratch);
                }

                for (const line of lineArray) {
                    this.EightBitter.physics.killNormal(line);
                }

                this.EightBitter.animations.animateFlicker(defender, 14, 5, args.callback);
            },
            17 * dt);
    }

    /**
     * Cutscene for when a trainer is encountered for battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneTrainerSpottedExclamation(settings: any): void {
        this.EightBitter.animations.animateCharacterPreventWalking(this.EightBitter.player);
        this.EightBitter.animations.animateExclamation(
            settings.triggerer,
            70,
            this.EightBitter.ScenePlayer.bindRoutine("Approach"));
    }

    /**
     * Cutscene for when a trainer approaches the player after being encountered. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneTrainerSpottedApproach(settings: any): void {
        const player: IPlayer = settings.player;
        const triggerer: ICharacter = settings.triggerer;
        const direction: Direction = triggerer.direction;
        const directionName: string = Direction[direction].toLowerCase();
        const locationTriggerer: number = (triggerer as any)[directionName];
        const locationPlayer: number = (player as any)[DirectionOpposites[directionName]];
        const distance: number = Math.abs(locationTriggerer - locationPlayer);
        const blocks: number = Math.max(0, distance / this.EightBitter.unitsize / 8);

        if (blocks) {
            this.EightBitter.animations.animateCharacterStartWalking(
                triggerer,
                direction,
                [
                    blocks,
                    this.EightBitter.ScenePlayer.bindRoutine("Dialog")
                ]
            );
        } else {
            this.EightBitter.ScenePlayer.playRoutine("Dialog");
        }
    }

    /**
     * Cutscene for a trainer introduction after the player is approached.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneTrainerSpottedDialog(settings: any): void {
        this.EightBitter.collisions.collideCharacterDialog(settings.player, settings.triggerer);
        this.EightBitter.MapScreener.blockInputs = false;
    }

    /**
     * Cutscene for a nurse's welcome at the Pokemon Center.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutscenePokeCenterWelcome(settings: any): void {
        settings.nurse = this.EightBitter.utilities.getThingById(settings.nurseId || "Nurse");
        settings.machine = this.EightBitter.utilities.getThingById(settings.machineId || "HealingMachine");

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Welcome to our %%%%%%%POKEMON%%%%%%% CENTER!",
                "We heal your %%%%%%%POKEMON%%%%%%% back to perfect health!",
                "Shall we heal your %%%%%%%POKEMON%%%%%%%?"
            ],
            this.EightBitter.ScenePlayer.bindRoutine("Choose")
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for choosing whether or not to heal Pokemon.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutscenePokeCenterChoose(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("Heal/Cancel");
        this.EightBitter.MenuGrapher.addMenuList(
            "Heal/Cancel",
            {
                options: [
                    {
                        text: "HEAL",
                        callback: this.EightBitter.ScenePlayer.bindRoutine("ChooseHeal")
                    },
                    {
                        text: "CANCEL",
                        callback: this.EightBitter.ScenePlayer.bindRoutine("ChooseCancel")
                    }
                ]
            }
        );
        this.EightBitter.MenuGrapher.setActiveMenu("Heal/Cancel");
    }

    /**
     * Cutscene for choosing to heal Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutscenePokeCenterChooseHeal(settings: any): void {
        this.EightBitter.MenuGrapher.deleteMenu("Heal/Cancel");

        this.EightBitter.MenuGrapher.createMenu("GeneralText", {
            ignoreA: true,
            finishAutomatically: true
        });
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Ok. We'll need your %%%%%%%POKEMON%%%%%%%."
            ],
            this.EightBitter.ScenePlayer.bindRoutine("Healing")
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for placing Pokeballs into the healing machine.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutscenePokeCenterHealing(settings: any): void {
        const party: BattleMovr.IActor[] = this.EightBitter.ItemsHolder.getItem("PokemonInParty");
        const balls: IThing[] = [];
        const dt: number = 35;
        const left: number = settings.machine.left + 5 * this.EightBitter.unitsize;
        const top: number = settings.machine.top + 7 * this.EightBitter.unitsize;
        let i: number = 0;

        settings.balls = balls;
        this.EightBitter.animations.animateCharacterSetDirection(settings.nurse, 3);

        this.EightBitter.TimeHandler.addEventInterval(
            (): void => {
                balls.push(
                    this.EightBitter.things.add(
                        "HealingMachineBall",
                        left + (i % 2) * 3 * this.EightBitter.unitsize,
                        top + Math.floor(i / 2) * 2.5 * this.EightBitter.unitsize
                    )
                );
                i += 1;
            },
            dt,
            party.length);

        this.EightBitter.TimeHandler.addEvent(
            (): void => this.EightBitter.ScenePlayer.playRoutine(
                "HealingAction",
                {
                    balls: balls
                }),
            dt * (party.length + 1));
    }

    /**
     * Cutscene for Pokemon being healed in the healing machine.
     *
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutscenePokeCenterHealingAction(settings: any, args: any): void {
        const balls: IThing[] = args.balls;
        const numFlashes: number = 8;
        let i: number = 0;
        let changer: Function;

        this.EightBitter.TimeHandler.addEventInterval(
            (): void => {
                changer = i % 2 === 0
                    ? (thing: IThing, className: string): void => this.EightBitter.graphics.addClass(thing, className)
                    : (thing: IThing, className: string): void => this.EightBitter.graphics.removeClass(thing, className);

                for (const ball of balls) {
                    changer(ball, "lit");
                }

                changer(settings.machine, "lit");

                i += 1;
            },
            21,
            numFlashes);

        this.EightBitter.TimeHandler.addEvent(
            (): void => this.EightBitter.ScenePlayer.playRoutine(
                "HealingComplete",
                {
                    balls: balls
                }),
            (numFlashes + 2) * 21);
    }

    /**
     * Cutscene for when the Pokemon have finished healing.
     *
     * @param settings   Settings used for the cutscene.
     * @param args Settings for the routine.
     */
    public cutscenePokeCenterHealingComplete(settings: any, args: any): void {
        const balls: IThing[] = args.balls;
        const party: BattleMovr.IActor[] = this.EightBitter.ItemsHolder.getItem("PokemonInParty");

        for (const ball of balls) {
            this.EightBitter.physics.killNormal(ball);
        }

        for (const pokemon of party) {
            this.EightBitter.battles.healPokemon(pokemon);
        }

        this.EightBitter.animations.animateCharacterSetDirection(settings.nurse, 2);

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you! \n Your %%%%%%%POKEMON%%%%%%% are fighting fit!",
                "We hope to see you again!"
            ],
            (): void => {
                this.EightBitter.MenuGrapher.deleteMenu("GeneralText");
                this.EightBitter.ScenePlayer.stopCutscene();
            });
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for choosing not to heal Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutscenePokeCenterChooseCancel(settings: any): void {
        this.EightBitter.MenuGrapher.deleteMenu("Heal/Cancel");

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "We hope to see you again!"
            ],
            (): void => {
                this.EightBitter.MenuGrapher.deleteMenu("GeneralText");
                this.EightBitter.ScenePlayer.stopCutscene();
            });
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for speaking to a PokeMart cashier.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutscenePokeMartGreeting(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
            ignoreA: true,
            ignoreB: true
        });
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hi there! \n May I help you?"
            ],
            this.EightBitter.ScenePlayer.bindRoutine("Options"));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the PokeMart action options.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutscenePokeMartOptions(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("Money");

        this.EightBitter.MenuGrapher.createMenu("Buy/Sell", {
            killOnB: ["Money", "GeneralText"],
            onMenuDelete: this.EightBitter.ScenePlayer.bindRoutine("Exit")
        });
        this.EightBitter.MenuGrapher.addMenuList("Buy/Sell", {
            options: [{
                text: "BUY",
                callback: this.EightBitter.ScenePlayer.bindRoutine("BuyMenu")
            }, {
                    text: "SELL",
                    callback: undefined
                }, {
                    text: "QUIT",
                    callback: this.EightBitter.MenuGrapher.registerB
                }]
        });
        this.EightBitter.MenuGrapher.setActiveMenu("Buy/Sell");
    }

    /**
     * Cutscene for the PokeMart item menu.
     *
     * @param settings   Settings used for the cutscene.
     * 
     * @todo Add constants for all items, for display names
     */
    public cutscenePokeMartBuyMenu(settings: any): void {
        const options: any[] = settings.triggerer.items.map(
            (reference: any): any => {
                const text: string = reference.item.toUpperCase();
                const cost: number = reference.cost;

                return {
                    text: text,
                    textsFloating: [{
                        text: "$" + cost,
                        x: 42 - String(cost).length * 3.5,
                        y: 4
                    }],
                    callback: this.EightBitter.ScenePlayer.bindRoutine(
                        "SelectAmount",
                        {
                            reference: reference,
                            amount: 1,
                            cost: cost
                        }),
                    reference: reference
                };
            });

        options.push({
            text: "CANCEL",
            callback: this.EightBitter.MenuGrapher.registerB
        });

        this.EightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Take your time."
            ],
            (): void => {
                this.EightBitter.MenuGrapher.createMenu("ShopItems", {
                    backMenu: "Buy/Sell"
                });
                this.EightBitter.MenuGrapher.addMenuList("ShopItems", {
                    options: options
                });
                this.EightBitter.MenuGrapher.setActiveMenu("ShopItems");
            }
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for selecting the amount of an item the player wishes to buy.
     *
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutscenePokeMartSelectAmount(settings: any, args: any): void {
        const reference: any = args.reference;
        const amount: number = args.amount;
        const cost: number = args.cost;
        const costTotal: number = cost * amount;
        const text: string = this.EightBitter.utilities.makeDigit(amount, 2)
            + this.EightBitter.utilities.makeDigit("$" + costTotal, 8, " ");

        this.EightBitter.MenuGrapher.createMenu("ShopItemsAmount", {
            childrenSchemas: [
                {
                    type: "text",
                    words: ["Times"],
                    position: {
                        offset: {
                            left: 4,
                            top: 4.25
                        }
                    }
                } as MenuGraphr.IMenuWordSchema,
                {
                    type: "text",
                    words: [text],
                    position: {
                        offset: {
                            left: 8,
                            top: 3.75
                        }
                    }
                } as MenuGraphr.IMenuWordSchema],
            onUp: this.EightBitter.ScenePlayer.bindRoutine(
                "SelectAmount",
                {
                    amount: (amount === 99) ? 1 : amount + 1,
                    cost: cost,
                    reference: reference
                }),
            onDown: this.EightBitter.ScenePlayer.bindRoutine(
                "SelectAmount",
                {
                    amount: (amount === 1) ? 99 : amount - 1,
                    cost: cost,
                    reference: reference
                }),
            callback: this.EightBitter.ScenePlayer.bindRoutine("ConfirmPurchase", args)
        });
        this.EightBitter.MenuGrapher.setActiveMenu("ShopItemsAmount");
    }

    /**
     * Cutscene for confirming a PokeMart purchase.
     *
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutscenePokeMartConfirmPurchase(settings: any, args: any): void {
        const reference: any = args.reference;
        const cost: number = args.cost;
        const amount: number = args.amount;
        const costTotal: number = args.costTotal = cost * amount;

        this.EightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                reference.item.toUpperCase() + "? \n That will be $" + costTotal + ". OK?"
            ],
            (): void => {
                this.EightBitter.MenuGrapher.createMenu("Yes/No", {
                    position: {
                        horizontal: "right",
                        vertical: "bottom",
                        offset: {
                            top: 0,
                            left: 0
                        }
                    },
                    onMenuDelete: this.EightBitter.ScenePlayer.bindRoutine(
                        "CancelPurchase"
                    ),
                    container: "ShopItemsAmount"
                });
                this.EightBitter.MenuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: this.EightBitter.ScenePlayer.bindRoutine(
                                "TryPurchase", args)
                        }, {
                            text: "NO",
                            callback: this.EightBitter.ScenePlayer.bindRoutine(
                                "CancelPurchase")
                        }]
                });
                this.EightBitter.MenuGrapher.setActiveMenu("Yes/No");
            });
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for canceling a PokeMart purchase.
     *
     * @param settings   Settings used for the cutscene.
     * 
     * @todo Why is the BuyMenu text appearing twice?
     */
    public cutscenePokeMartCancelPurchase(settings: any): void {
        this.EightBitter.ScenePlayer.playRoutine("BuyMenu");
    }

    /**
     * Cutscene for carrying out a PokeMart transaction. Can either confirm or deny
     * the purchase based on the player's total money. 
     *
     * @param settings   Settings used for the cutscene.
     * @param args  Settings for the routine.
     */
    public cutscenePokeMartTryPurchase(settings: any, args: any): void {
        const costTotal: number = args.costTotal;

        if (this.EightBitter.ItemsHolder.getItem("money") < costTotal) {
            this.EightBitter.ScenePlayer.playRoutine("FailPurchase", args);
            return;
        }

        this.EightBitter.ItemsHolder.decrease("money", args.costTotal);
        this.EightBitter.MenuGrapher.createMenu("Money");
        this.EightBitter.ItemsHolder.getItem("items").push({
            item: args.reference.item,
            amount: args.amount
        });

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Here you are! \n Thank you!"
            ],
            this.EightBitter.ScenePlayer.bindRoutine("ContinueShopping"));

        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for when the player does not have enough money for the 
     * PokeMart purchase.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutscenePokeMartFailPurchase(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You don't have enough money."
            ],
            this.EightBitter.ScenePlayer.bindRoutine("ContinueShopping")
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for asking if the player wants to continue shopping.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutscenePokeMartContinueShopping(settings: any): void {
        if (this.EightBitter.MenuGrapher.getMenu("Yes/No")) {
            delete this.EightBitter.MenuGrapher.getMenu("Yes/No").onMenuDelete;
        }

        this.EightBitter.MenuGrapher.deleteMenu("ShopItems");
        this.EightBitter.MenuGrapher.deleteMenu("ShopItemsAmount");
        this.EightBitter.MenuGrapher.deleteMenu("Yes/No");

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Is there anything else I can do?"
            ]);

        this.EightBitter.MenuGrapher.setActiveMenu("Buy/Sell");

        this.EightBitter.storage.autoSave();
    }

    /**
     * Cutscene for the player choosing to stop shopping.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutscenePokeMartExit(settings: any): void {
        this.EightBitter.ScenePlayer.stopCutscene();

        this.EightBitter.MenuGrapher.deleteMenu("Buy/Sell");
        this.EightBitter.MenuGrapher.deleteMenu("Money");

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you!"
            ],
            this.EightBitter.MenuGrapher.deleteActiveMenu
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the beginning of the game introduction.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroFadeIn(settings: any): void {
        const oak: IThing = this.EightBitter.ObjectMaker.make("OakPortrait", {
            opacity: 0
        });

        settings.oak = oak;

        console.warn("Cannot find Introduction audio theme!");
        // this.EightBitter.AudioPlayer.playTheme("Introduction");
        this.EightBitter.ModAttacher.fireEvent("onIntroFadeIn", oak);

        this.EightBitter.maps.setMap("Blank", "White");
        this.EightBitter.MenuGrapher.deleteActiveMenu();

        this.EightBitter.things.add(oak);
        this.EightBitter.physics.setMidX(oak, this.EightBitter.MapScreener.middleX | 0);
        this.EightBitter.physics.setMidY(oak, this.EightBitter.MapScreener.middleY | 0);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.animations.animateFadeAttribute(
                    oak,
                    "opacity",
                    .15,
                    1,
                    14,
                    this.EightBitter.ScenePlayer.bindRoutine("FirstDialog"));
            },
            70);
    }

    /**
     * Cutscene for Oak's introduction.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroFirstDialog(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hello there! \n Welcome to the world of %%%%%%%POKEMON%%%%%%%!",
                "My name is OAK! People call me the %%%%%%%POKEMON%%%%%%% PROF!"
            ],
            this.EightBitter.ScenePlayer.bindRoutine("FirstDialogFade")
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak's introduction exit.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroFirstDialogFade(settings: any): void {
        let blank: IThing = this.EightBitter.ObjectMaker.make("WhiteSquare", {
            width: this.EightBitter.MapScreener.width,
            height: this.EightBitter.MapScreener.height,
            opacity: 0
        });

        this.EightBitter.things.add(blank, 0, 0);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.animations.animateFadeAttribute(
                blank,
                "opacity",
                .15,
                1,
                7,
                this.EightBitter.ScenePlayer.bindRoutine("PokemonExpo"));
            },
            35);
    }

    /**
     * Cutscene for transitioning Nidorino onto the screen.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPokemonExpo(settings: any): void {
        let pokemon: IThing = this.EightBitter.ObjectMaker.make("NIDORINOFront", {
            flipHoriz: true,
            opacity: .01
        });

        this.EightBitter.GroupHolder.applyOnAll(this.EightBitter.physics, this.EightBitter.physics.killNormal);

        this.EightBitter.things.add(
            pokemon,
            (this.EightBitter.MapScreener.middleX + 24 * this.EightBitter.unitsize) | 0,
            0);

        this.EightBitter.physics.setMidY(pokemon, this.EightBitter.MapScreener.middleY);

        this.EightBitter.animations.animateFadeAttribute(
            pokemon,
            "opacity",
            .15,
            1,
            3);

        this.EightBitter.animations.animateSlideHorizontal(
            pokemon,
            -this.EightBitter.unitsize * 2,
            this.EightBitter.MapScreener.middleX | 0,
            1,
            this.EightBitter.ScenePlayer.bindRoutine("PokemonExplanation"));
    }

    /**
     * Cutscene for showing an explanation of the Pokemon world.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPokemonExplanation(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This world is inhabited by creatures called %%%%%%%POKEMON%%%%%%%!",
                "For some people, %%%%%%%POKEMON%%%%%%% are pets. Others use them for fights.",
                "Myself...",
                "I study %%%%%%%POKEMON%%%%%%% as a profession."
            ],
            this.EightBitter.ScenePlayer.bindRoutine("PlayerAppear")
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerAppear(settings: any): void {
        const middleX: number = this.EightBitter.MapScreener.middleX | 0;
        const player: IPlayer = this.EightBitter.ObjectMaker.make("PlayerPortrait", {
            flipHoriz: true,
            opacity: .01
        });

        settings.player = player;

        this.EightBitter.GroupHolder.applyOnAll(this.EightBitter.physics, this.EightBitter.physics.killNormal);

        this.EightBitter.things.add(player, this.EightBitter.MapScreener.middleX + 24 * this.EightBitter.unitsize, 0);

        this.EightBitter.physics.setMidY(player, this.EightBitter.MapScreener.middleY);

        this.EightBitter.animations.animateFadeAttribute(player, "opacity", .15, 1, 3);

        this.EightBitter.animations.animateSlideHorizontal(
            player,
            -this.EightBitter.unitsize * 2,
            middleX - player.width * this.EightBitter.unitsize / 2,
            1,
            this.EightBitter.ScenePlayer.bindRoutine("PlayerName"));
    }

    /**
     * Cutscene asking the player to enter his/her name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerName(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "First, what is your name?"
            ],
            this.EightBitter.ScenePlayer.bindRoutine("PlayerSlide"));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the player over to show the naming options.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerSlide(settings: any): void {
        this.EightBitter.animations.animateSlideHorizontal(
            settings.player,
            this.EightBitter.unitsize,
            (this.EightBitter.MapScreener.middleX + 16 * this.EightBitter.unitsize) | 0,
            1,
            this.EightBitter.ScenePlayer.bindRoutine("PlayerNameOptions"));
    }

    /**
     * Cutscene for showing the player naming option menu.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerNameOptions(settings: any): void {
        const fromMenu: () => void = this.EightBitter.ScenePlayer.bindRoutine("PlayerNameFromMenu");
        const fromKeyboard: () => void = this.EightBitter.ScenePlayer.bindRoutine("PlayerNameFromKeyboard");

        this.EightBitter.MenuGrapher.createMenu("NameOptions");
        this.EightBitter.MenuGrapher.addMenuList("NameOptions", {
            options: [
                {
                    text: "NEW NAME".split(""),
                    callback: () => this.EightBitter.menus.openKeyboardMenu({
                        title: "YOUR NAME?",
                        callback: fromKeyboard
                    })
                }, {
                    text: "BLUE".split(""),
                    callback: fromMenu
                }, {
                    text: "GARY".split(""),
                    callback: fromMenu
                }, {
                    text: "JOHN".split(""),
                    callback: fromMenu
                }]
        });
        this.EightBitter.MenuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for the player selecting Blue, Gary, or John.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerNameFromMenu(settings: any): void {
        settings.name = this.EightBitter.MenuGrapher.getMenuSelectedOption("NameOptions").text;

        this.EightBitter.MenuGrapher.deleteMenu("NameOptions");

        this.EightBitter.animations.animateSlideHorizontal(
            settings.player,
            -this.EightBitter.unitsize,
            this.EightBitter.MapScreener.middleX | 0,
            1,
            this.EightBitter.ScenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene for the player choosing to customize a new name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerNameFromKeyboard(settings: any): void {
        settings.name = (this.EightBitter.MenuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;

        this.EightBitter.MenuGrapher.deleteMenu("Keyboard");
        this.EightBitter.MenuGrapher.deleteMenu("NameOptions");

        this.EightBitter.animations.animateSlideHorizontal(
            settings.player,
            -this.EightBitter.unitsize,
            this.EightBitter.MapScreener.middleX | 0,
            1,
            this.EightBitter.ScenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene confirming the player's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerNameConfirm(settings: any): void {
        this.EightBitter.ItemsHolder.setItem("name", settings.name);

        this.EightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "Right! So your name is ".split(""),
                    settings.name,
                    "!".split("")
                ]
            ],
            this.EightBitter.ScenePlayer.bindRoutine("PlayerNameComplete"));
    }

    /**
     * Cutscene fading the player out.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerNameComplete(settings: any): void {
        const blank: IThing = this.EightBitter.ObjectMaker.make("WhiteSquare", {
            width: this.EightBitter.MapScreener.width,
            height: this.EightBitter.MapScreener.height,
            opacity: 0
        });

        this.EightBitter.things.add(blank, 0, 0);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.animations.animateFadeAttribute(
                    blank,
                    "opacity",
                    .2,
                    1,
                    7,
                    this.EightBitter.ScenePlayer.bindRoutine("RivalAppear"));
            },
            35);
    }

    /**
     * Cutscene for showing the rival.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalAppear(settings: any): void {
        const rival: IThing = this.EightBitter.ObjectMaker.make("RivalPortrait", {
            opacity: 0
        });

        settings.rival = rival;

        this.EightBitter.GroupHolder.applyOnAll(this.EightBitter.physics, this.EightBitter.physics.killNormal);

        this.EightBitter.things.add(rival, 0, 0);
        this.EightBitter.physics.setMidX(rival, this.EightBitter.MapScreener.middleX | 0);
        this.EightBitter.physics.setMidY(rival, this.EightBitter.MapScreener.middleY | 0);
        this.EightBitter.animations.animateFadeAttribute(
            rival,
            "opacity",
            .1,
            1,
            1,
            this.EightBitter.ScenePlayer.bindRoutine("RivalName"));
    }

    /**
     * Cutscene introducing the rival.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutsceneIntroRivalName(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This is my grand-son. He's been your rival since you were a baby.",
                "...Erm, what is his name again?"
            ],
            this.EightBitter.ScenePlayer.bindRoutine("RivalSlide")
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the rival over to show the rival naming options.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalSlide(settings: any): void {
        this.EightBitter.animations.animateSlideHorizontal(
            settings.rival,
            this.EightBitter.unitsize,
            (this.EightBitter.MapScreener.middleX + 16 * this.EightBitter.unitsize) | 0,
            1,
            this.EightBitter.ScenePlayer.bindRoutine("RivalNameOptions"));
    }

    /**
     * Cutscene for showing the rival naming option menu.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalNameOptions(settings: any): void {
        const fromMenu: () => void = this.EightBitter.ScenePlayer.bindRoutine("RivalNameFromMenu");
        const fromKeyboard: () => void = this.EightBitter.ScenePlayer.bindRoutine("RivalNameFromKeyboard");

        this.EightBitter.MenuGrapher.createMenu("NameOptions");
        this.EightBitter.MenuGrapher.addMenuList("NameOptions", {
            options: [
                {
                    text: "NEW NAME",
                    callback: (): void => this.EightBitter.menus.openKeyboardMenu({
                        title: "RIVAL's NAME?",
                        callback: fromKeyboard
                    })
                }, {
                    text: "RED".split(""),
                    callback: fromMenu
                }, {
                    text: "ASH".split(""),
                    callback: fromMenu
                }, {
                    text: "JACK".split(""),
                    callback: fromMenu
                }]
        });
        this.EightBitter.MenuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for choosing to name the rival Red, Ash, or Jack.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalNameFromMenu(settings: any): void {
        settings.name = this.EightBitter.MenuGrapher.getMenuSelectedOption("NameOptions").text;

        this.EightBitter.MenuGrapher.deleteMenu("NameOptions");

        this.EightBitter.animations.animateSlideHorizontal(
            settings.rival,
            -this.EightBitter.unitsize,
            this.EightBitter.MapScreener.middleX | 0,
            1,
            this.EightBitter.ScenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for choosing to customize the rival's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalNameFromKeyboard(settings: any): void {
        settings.name = (this.EightBitter.MenuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;

        this.EightBitter.MenuGrapher.deleteMenu("Keyboard");
        this.EightBitter.MenuGrapher.deleteMenu("NameOptions");

        this.EightBitter.animations.animateSlideHorizontal(
            settings.rival,
            -this.EightBitter.unitsize,
            this.EightBitter.MapScreener.middleX | 0,
            1,
            this.EightBitter.ScenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for confirming the rival's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalNameConfirm(settings: any): void {
        this.EightBitter.ItemsHolder.setItem("nameRival", settings.name);

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "That's right! I remember now! His name is ", settings.name, "!"
                ]
            ],
            this.EightBitter.ScenePlayer.bindRoutine("RivalNameComplete"));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene fading the rival out.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalNameComplete(settings: any): void {
        let blank: IThing = this.EightBitter.ObjectMaker.make("WhiteSquare", {
            width: this.EightBitter.MapScreener.width,
            height: this.EightBitter.MapScreener.height,
            opacity: 0
        });

        this.EightBitter.things.add(blank, 0, 0);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.animations.animateFadeAttribute(
                    blank,
                    "opacity",
                    .2,
                    1,
                    7,
                    this.EightBitter.ScenePlayer.bindRoutine("LastDialogAppear"));
            },
            35);
    }

    /**
     * Cutscene for fading the player in.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroLastDialogAppear(settings: any): void {
        const portrait: IThing = this.EightBitter.ObjectMaker.make("PlayerPortrait", {
            flipHoriz: true,
            opacity: 0
        });

        settings.portrait = portrait;

        this.EightBitter.GroupHolder.applyOnAll(this.EightBitter.physics, this.EightBitter.physics.killNormal);

        this.EightBitter.things.add(portrait, 0, 0);
        this.EightBitter.physics.setMidX(portrait, this.EightBitter.MapScreener.middleX | 0);
        this.EightBitter.physics.setMidY(portrait, this.EightBitter.MapScreener.middleY | 0);

        this.EightBitter.animations.animateFadeAttribute(
            portrait,
            "opacity",
            .1,
            1,
            1,
            this.EightBitter.ScenePlayer.bindRoutine("LastDialog"));
    }

    /**
     * Cutscene for the last part of the introduction.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutsceneIntroLastDialog(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%!",
                "Your very own %%%%%%%POKEMON%%%%%%% legend is about to unfold!",
                "A world of dreams and adventures with %%%%%%%POKEMON%%%%%%% awaits! Let's go!"
            ],
            this.EightBitter.ScenePlayer.bindRoutine("ShrinkPlayer"));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for shrinking the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroShrinkPlayer(settings: any): void {
        const silhouetteLarge: IThing = this.EightBitter.ObjectMaker.make("PlayerSilhouetteLarge");
        const silhouetteSmall: IThing = this.EightBitter.ObjectMaker.make("PlayerSilhouetteSmall");
        const player: IPlayer = this.EightBitter.ObjectMaker.make("Player");
        const timeDelay: number = 49;

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.things.add(silhouetteLarge);
                this.EightBitter.physics.setMidObj(silhouetteLarge, settings.portrait);
                this.EightBitter.physics.killNormal(settings.portrait);
            },
            timeDelay);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.things.add(silhouetteSmall);
                this.EightBitter.physics.setMidObj(silhouetteSmall, silhouetteLarge);
                this.EightBitter.physics.killNormal(silhouetteLarge);
            },
            timeDelay * 2);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.things.add(player);
                this.EightBitter.physics.setMidObj(player, silhouetteSmall);
                this.EightBitter.physics.killNormal(silhouetteSmall);
            },
            timeDelay * 3);

        this.EightBitter.TimeHandler.addEvent(
            this.EightBitter.ScenePlayer.bindRoutine("FadeOut"),
            timeDelay * 4);
    }

    /**
     * Cutscene for completing the introduction and fading it out.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroFadeOut(settings: any): void {
        const blank: IThing = this.EightBitter.ObjectMaker.make("WhiteSquare", {
            width: this.EightBitter.MapScreener.width,
            height: this.EightBitter.MapScreener.height,
            opacity: 0
        });

        this.EightBitter.things.add(blank, 0, 0);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.animations.animateFadeAttribute(
                    blank,
                    "opacity",
                    .2,
                    1,
                    7,
                    this.EightBitter.ScenePlayer.bindRoutine("Finish"));
            },
            35);
    }

    /**
     * Cutscene showing the player in his bedroom.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroFinish(settings: any): void {
        delete this.EightBitter.MapScreener.cutscene;

        this.EightBitter.MenuGrapher.deleteActiveMenu();
        this.EightBitter.ScenePlayer.stopCutscene();
        this.EightBitter.ItemsHolder.setItem("gameStarted", true);

        this.EightBitter.maps.setMap("Pallet Town", "Start Game");
    }

    /**
     * Cutscene for walking into the grass before receiving a Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroFirstDialog(settings: any): void {
        let triggered: boolean = false;

        settings.triggerer.alive = false;
        this.EightBitter.StateHolder.addChange(settings.triggerer.id, "alive", false);

        if (this.EightBitter.ItemsHolder.getItem("starter")) {
            this.EightBitter.MapScreener.blockInputs = false;
            return;
        }

        this.EightBitter.animations.animatePlayerDialogFreeze(settings.player);
        this.EightBitter.animations.animateCharacterSetDirection(settings.player, 2);

        this.EightBitter.AudioPlayer.playTheme("Professor Oak");
        this.EightBitter.MapScreener.blockInputs = true;

        this.EightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
            finishAutomaticSpeed: 28
        });
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            "OAK: Hey! Wait! Don't go out!",
            (): void => {
                if (!triggered) {
                    triggered = true;
                    this.EightBitter.ScenePlayer.playRoutine("Exclamation");
                }
            });
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the exclamation point over the player's head.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroExclamation(settings: any): void {
        const timeout: number = 49;

        this.EightBitter.animations.animateExclamation(settings.player, timeout);

        this.EightBitter.TimeHandler.addEvent(
            (): void => this.EightBitter.MenuGrapher.hideMenu("GeneralText"),
            timeout);

        this.EightBitter.TimeHandler.addEvent(
            this.EightBitter.ScenePlayer.bindRoutine("Catchup"),
            timeout);
    }

    /**
     * Cutscene for animating Oak to walk to the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroCatchup(settings: any): void {
        const door: IThing = this.EightBitter.utilities.getThingById("Oak's Lab Door");
        const oak: ICharacter = this.EightBitter.ObjectMaker.make("Oak", {
            outerOk: true,
            nocollide: true
        });
        const isToLeft: boolean = this.EightBitter.player.bordering[Direction.Left] !== undefined;
        const walkingSteps: any[] = [
            1, "left", 4, "top", 8, "right", 1, "top", 1, "right", 1, "top", 1
        ];

        if (!isToLeft) {
            walkingSteps.push("right", 1, "top", 0);
        }

        walkingSteps.push(this.EightBitter.ScenePlayer.bindRoutine("GrassWarning"));

        settings.oak = oak;
        settings.isToLeft = isToLeft;

        this.EightBitter.things.add(oak, door.left, door.top);
        this.EightBitter.animations.animateCharacterStartWalkingCycle(oak, 2, walkingSteps);
    }

    /**
     * Cutscene for Oak telling the player to keep out of the grass.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroGrassWarning(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "It's unsafe! Wild %%%%%%%POKEMON%%%%%%% live in tall grass!",
                "You need your own %%%%%%%POKEMON%%%%%%% for your protection. \n I know!",
                "Here, come with me."
            ],
            this.EightBitter.ScenePlayer.bindRoutine("FollowToLab"));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player following Oak to the Professor's lab.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroFollowToLab(settings: any): void {
        let startingDirection: number;
        let walkingSteps: any[];

        if (settings.isToLeft) {
            startingDirection = Direction.Bottom;
            walkingSteps = [5, "left", 1, "bottom", 5, "right", 3, "top", 1];
        } else {
            startingDirection = Direction.Left;
            walkingSteps = [1, "bottom", 5, "left", 1, "bottom", 5, "right", 3, "top", 1];
        }

        walkingSteps.push(this.EightBitter.ScenePlayer.bindRoutine("EnterLab"));

        this.EightBitter.MenuGrapher.deleteMenu("GeneralText");
        this.EightBitter.animations.animateCharacterFollow(settings.player, settings.oak);
        this.EightBitter.animations.animateCharacterStartWalkingCycle(
            settings.oak,
            startingDirection,
            walkingSteps);
    }

    /**
     * Cutscene for entering Oak's lab.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroEnterLab(settings: any): void {
        this.EightBitter.StateHolder.addChange("Pallet Town::Oak's Lab::Oak", "alive", true);
        settings.oak.hidden = true;

        this.EightBitter.TimeHandler.addEvent(
            this.EightBitter.animations.animateCharacterStartWalkingCycle,
            this.EightBitter.MathDecider.compute("speedWalking", this.EightBitter.player),
            this.EightBitter.player,
            0,
            [
                0,
                (): void => {
                    this.EightBitter.maps.setMap("Pallet Town", "Oak's Lab Floor 1 Door", false);
                    this.EightBitter.player.hidden = true;

                    this.EightBitter.ScenePlayer.playRoutine("WalkToTable");
                }
            ]);
    }

    /**
     * Cutscene for Oak offering a Pokemon to the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroWalkToTable(settings: any): void {
        const oak: ICharacter = this.EightBitter.utilities.getThingById("Oak") as ICharacter;
        const rival: ICharacter = this.EightBitter.utilities.getThingById("Rival") as ICharacter;

        settings.oak = oak;
        settings.player = this.EightBitter.player;

        oak.dialog = "OAK: Now, %%%%%%%PLAYER%%%%%%%, which %%%%%%%POKEMON%%%%%%% do you want?";
        oak.hidden = false;
        oak.nocollide = true;
        this.EightBitter.physics.setMidXObj(oak, settings.player);
        this.EightBitter.physics.setBottom(oak, settings.player.top);

        this.EightBitter.StateHolder.addChange(oak.id, "hidden", false);
        this.EightBitter.StateHolder.addChange(oak.id, "nocollide", false);
        this.EightBitter.StateHolder.addChange(oak.id, "dialog", oak.dialog);

        rival.dialog = [
            "%%%%%%%RIVAL%%%%%%%: Heh, I don't need to be greedy like you!",
            "Go ahead and choose, %%%%%%%PLAYER%%%%%%%!"
        ];
        this.EightBitter.StateHolder.addChange(rival.id, "dialog", rival.dialog);

        this.EightBitter.animations.animateCharacterStartWalking(oak, 0, [
            8, "bottom", 0
        ]);

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.player.hidden = false;
            },
            112 - this.EightBitter.MathDecider.compute("speedWalking", settings.player));

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.animations.animateCharacterStartWalking(
                    settings.player,
                    0,
                    [8, this.EightBitter.ScenePlayer.bindRoutine("RivalComplain")]);
            },
            112);
    }

    /**
     * Cutscene for the rival complaining to Oak.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroRivalComplain(settings: any): void {
        settings.oak.nocollide = false;
        settings.player.nocollide = false;
        this.EightBitter.StateHolder.addChange(settings.oak.id, "nocollide", false);

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            "%%%%%%%RIVAL%%%%%%%: Gramps! I'm fed up with waiting!",
            this.EightBitter.ScenePlayer.bindRoutine("OakThinksToRival"));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak telling the player to pick a Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroOakThinksToRival(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: %%%%%%%RIVAL%%%%%%%? Let me think...",
                "Oh, that's right, I told you to come! Just wait!",
                "Here, %%%%%%%PLAYER%%%%%%%!",
                "There are 3 %%%%%%%POKEMON%%%%%%% here!",
                "Haha!",
                "They are inside the %%%%%%%POKE%%%%%%% BALLs.",
                "When I was young, I was a serious %%%%%%%POKEMON%%%%%%% trainer!",
                "In my old age, I have only 3 left, but you can have one! Choose!"
            ],
            this.EightBitter.ScenePlayer.bindRoutine("RivalProtests"));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival protesting to Oak.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroRivalProtests(settings: any): void {
        let timeout: number = 21;

        this.EightBitter.MenuGrapher.deleteMenu("GeneralText");

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.MenuGrapher.createMenu("GeneralText");
            },
            timeout);

        this.EightBitter.TimeHandler.addEvent(
            (): void => this.EightBitter.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%RIVAL%%%%%%%: Hey! Gramps! What about me?"
                ],
                this.EightBitter.ScenePlayer.bindRoutine("OakRespondsToProtest")),
            timeout);

        this.EightBitter.TimeHandler.addEvent(
            (): void => this.EightBitter.MenuGrapher.setActiveMenu("GeneralText"),
            timeout);
    }

    /**
     * Cutscene for Oak responding to the rival's protest.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroOakRespondsToProtest(settings: any): void {
        const blocker: IThing = this.EightBitter.utilities.getThingById("OakBlocker");
        const timeout: number = 21;

        settings.player.nocollide = false;
        settings.oak.nocollide = false;

        blocker.nocollide = false;
        this.EightBitter.StateHolder.addChange(blocker.id, "nocollide", false);

        this.EightBitter.MapScreener.blockInputs = false;

        this.EightBitter.MenuGrapher.deleteMenu("GeneralText");

        this.EightBitter.TimeHandler.addEvent(
            (): void => {
                this.EightBitter.MenuGrapher.createMenu(
                    "GeneralText",
                    {
                        deleteOnFinish: true
                    });
            },
            timeout);

        this.EightBitter.TimeHandler.addEvent(
            (): void => this.EightBitter.MenuGrapher.addMenuDialog(
                "GeneralText",
                "Oak: Be patient! %%%%%%%RIVAL%%%%%%%, you can have one too!"),
            timeout);

        this.EightBitter.TimeHandler.addEvent(
            (): void => this.EightBitter.MenuGrapher.setActiveMenu("GeneralText"),
            timeout);
    }

    /**
     * Cutscene for the player checking a Pokeball.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoicePlayerChecksPokeball(settings: any): void {
        // If Oak is hidden, this cutscene shouldn't be starting (too early)
        if (this.EightBitter.utilities.getThingById("Oak").hidden) {
            this.EightBitter.ScenePlayer.stopCutscene();

            this.EightBitter.MenuGrapher.createMenu("GeneralText");
            this.EightBitter.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Those are %%%%%%%POKE%%%%%%% Balls. They contain %%%%%%%POKEMON%%%%%%%!"
                ]);
            this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

            return;
        }

        // If there's already a starter, ignore this sad last ball...
        if (this.EightBitter.ItemsHolder.getItem("starter")) {
            return;
        }

        let pokeball: IPokeball = settings.triggerer;
        settings.chosen = pokeball.pokemon;

        this.EightBitter.menus.openPokedexListing(
            pokeball.pokemon,
            this.EightBitter.ScenePlayer.bindRoutine("PlayerDecidesPokemon"),
            {
                position: {
                    vertical: "center",
                    offset: {
                        left: 0
                    }
                }
            });
    }

    /**
     * Cutscene for confirming the player wants to keep the chosen Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoicePlayerDecidesPokemon(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "So! You want the " + settings.triggerer.description + " %%%%%%%POKEMON%%%%%%%, ", settings.chosen, "?"
                ]
            ],
            (): void => {
                this.EightBitter.MenuGrapher.createMenu("Yes/No", {
                    killOnB: ["GeneralText"]
                });
                this.EightBitter.MenuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: this.EightBitter.ScenePlayer.bindRoutine("PlayerTakesPokemon")
                        }, {
                            text: "NO",
                            callback: this.EightBitter.MenuGrapher.registerB
                        }]
                });
                this.EightBitter.MenuGrapher.setActiveMenu("Yes/No");
            });
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player receiving his Pokemon.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutsceneOakIntroPokemonChoicePlayerTakesPokemon(settings: any): void {
        const oak: ICharacter = this.EightBitter.utilities.getThingById("Oak") as ICharacter;
        const rival: ICharacter = this.EightBitter.utilities.getThingById("Rival") as ICharacter;
        const dialogOak: string = "Oak: If a wild %%%%%%%POKEMON%%%%%%% appears, your %%%%%%%POKEMON%%%%%%% can fight against it!";
        const dialogRival: string = "%%%%%%%RIVAL%%%%%%%: My %%%%%%%POKEMON%%%%%%% looks a lot stronger.";

        settings.oak = oak;
        oak.dialog = dialogOak;
        this.EightBitter.StateHolder.addChange(oak.id, "dialog", dialogOak);

        settings.rival = rival;
        rival.dialog = dialogRival;
        this.EightBitter.StateHolder.addChange(rival.id, "dialog", dialogRival);

        this.EightBitter.ItemsHolder.setItem("starter", settings.chosen.join(""));
        settings.triggerer.hidden = true;
        this.EightBitter.StateHolder.addChange(settings.triggerer.id, "hidden", true);
        this.EightBitter.StateHolder.addChange(settings.triggerer.id, "nocollide", true);

        this.EightBitter.MenuGrapher.deleteMenu("Yes/No");
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "%%%%%%%PLAYER%%%%%%% received a ", settings.chosen, "!"
                ],
                "This %%%%%%%POKEMON%%%%%%% is really energetic!",
                [
                    "Do you want to give a nickname to ", settings.chosen, "?"
                ]
            ],
            this.EightBitter.ScenePlayer.bindRoutine("PlayerChoosesNickname"));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        this.EightBitter.ItemsHolder.setItem("starter", settings.chosen);
        this.EightBitter.ItemsHolder.setItem("PokemonInParty", [
            this.EightBitter.MathDecider.compute("newPokemon", settings.chosen, 5)
        ]);
        this.EightBitter.storage.addPokemonToPokedex(settings.chosen, PokedexListingStatus.Caught);
    }

    /**
     * Cutscene for allowing the player to choose his Pokemon's nickname. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoicePlayerChoosesNickname(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("Yes/No", {
            ignoreB: true,
            killOnB: ["GeneralText"]
        });
        this.EightBitter.MenuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: (): void => this.EightBitter.menus.openKeyboardMenu({
                        title: settings.chosen,
                        callback: this.EightBitter.ScenePlayer.bindRoutine("PlayerSetsNickname")
                    })
                }, {
                    text: "NO",
                    callback: this.EightBitter.ScenePlayer.bindRoutine("RivalWalksToPokemon")
                }]
        });
        this.EightBitter.MenuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * Cutscene for the player finishing the naming process.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoicePlayerSetsNickname(settings: any): void {
        const party: BattleMovr.IActor[] = this.EightBitter.ItemsHolder.getItem("PokemonInParty");
        const menu: IKeyboardResultsMenu = this.EightBitter.MenuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu;
        const result: string[] = menu.completeValue;

        party[0].nickname = result;

        this.EightBitter.ScenePlayer.playRoutine("RivalWalksToPokemon");
    }

    /**
     * Cutscene for the rival selecting his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoiceRivalWalksToPokemon(settings: any): void {
        const rival: ICharacter = this.EightBitter.utilities.getThingById("Rival") as ICharacter;
        let starterRival: string[];
        let steps: number;

        this.EightBitter.MenuGrapher.deleteMenu("Keyboard");
        this.EightBitter.MenuGrapher.deleteMenu("GeneralText");
        this.EightBitter.MenuGrapher.deleteMenu("Yes/No");
        this.EightBitter.MapScreener.blockInputs = true;

        switch (settings.chosen.join("")) {
            case "SQUIRTLE":
                starterRival = "BULBASAUR".split("");
                steps = 4;
                break;
            case "CHARMANDER":
                starterRival = "SQUIRTLE".split("");
                steps = 3;
                break;
            case "BULBASAUR":
                starterRival = "CHARMANDER".split("");
                steps = 2;
                break;
            default:
                throw new Error("Unknown first Pokemon.");
        }

        settings.rivalPokemon = starterRival;
        settings.rivalSteps = steps;
        this.EightBitter.ItemsHolder.setItem("starterRival", starterRival);
        this.EightBitter.storage.addPokemonToPokedex(starterRival, PokedexListingStatus.Caught);

        let pokeball: IPokeball = this.EightBitter.utilities.getThingById("Pokeball" + starterRival.join("")) as IPokeball;
        settings.rivalPokeball = pokeball;

        this.EightBitter.animations.animateCharacterStartWalkingCycle(
            rival,
            2,
            [
                2, "right", steps, "top", 1,
                (): void => this.EightBitter.ScenePlayer.playRoutine("RivalTakesPokemon")
            ]);
    }

    /**
     * Cutscene for the rival receiving his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoiceRivalTakesPokemon(settings: any): void {
        const oakblocker: IThing = this.EightBitter.utilities.getThingById("OakBlocker");
        const rivalblocker: IThing = this.EightBitter.utilities.getThingById("RivalBlocker");

        this.EightBitter.MenuGrapher.deleteMenu("Yes/No");

        oakblocker.nocollide = true;
        this.EightBitter.StateHolder.addChange(oakblocker.id, "nocollide", true);

        rivalblocker.nocollide = false;
        this.EightBitter.StateHolder.addChange(rivalblocker.id, "nocollide", false);

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: I'll take this one, then!",
                [
                    "%%%%%%%RIVAL%%%%%%% received a ", settings.rivalPokemon, "!"
                ]
            ],
            (): void => {
                settings.rivalPokeball.hidden = true;
                this.EightBitter.StateHolder.addChange(settings.rivalPokeball.id, "hidden", true);
                this.EightBitter.MenuGrapher.deleteActiveMenu();
                this.EightBitter.MapScreener.blockInputs = false;
            });
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

    }

    /**
     * Cutscene for the rival challenging the player to a Pokemon battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroRivalBattleApproach(settings: any): void {
        const rival: ICharacter = this.EightBitter.utilities.getThingById("Rival") as ICharacter;
        const dx: number = Math.abs(settings.triggerer.left - settings.player.left);
        const further: boolean = dx < this.EightBitter.unitsize;

        this.EightBitter.AudioPlayer.playTheme("Rival Appears");

        settings.rival = rival;
        this.EightBitter.animations.animateCharacterSetDirection(rival, Direction.Bottom);
        this.EightBitter.animations.animateCharacterSetDirection(settings.player, Direction.Top);

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Wait, %%%%%%%PLAYER%%%%%%%! Let's check out our %%%%%%%POKEMON%%%%%%%!",
                "Come on, I'll take you on!"
            ],
            this.EightBitter.ScenePlayer.bindRoutine(
                "Challenge",
                {
                    further: further
                }
            ));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for showing the lab after the battle ends.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroRivalLeavesAfterBattle(settings: any): void {
        this.EightBitter.MapScreener.blockInputs = true;

        for (const pokemon of this.EightBitter.ItemsHolder.getItem("PokemonInParty")) {
            this.EightBitter.battles.healPokemon(pokemon);
        }

        this.EightBitter.TimeHandler.addEvent(this.EightBitter.ScenePlayer.bindRoutine("Complaint"), 49);
    }

    /**
     * Cutscene for the rival's comment after losing the battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroRivalLeavesComplaint(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Okay! I'll make my %%%%%%%POKEMON%%%%%%% fight to toughen it up!"
            ],
            (): void => {
                this.EightBitter.MenuGrapher.deleteActiveMenu();
                this.EightBitter.TimeHandler.addEvent(this.EightBitter.ScenePlayer.bindRoutine("Goodbye"), 21);
            }
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival telling Oak he is leaving.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroRivalLeavesGoodbye(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%! Gramps! Smell ya later!"
            ],
            this.EightBitter.ScenePlayer.bindRoutine("Walking"));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival leaving the lab and Oak giving the player advice.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroRivalLeavesWalking(settings: any): void {
        const oak: ICharacter = this.EightBitter.utilities.getThingById("Oak") as ICharacter;
        const rival: ICharacter = this.EightBitter.utilities.getThingById("Rival") as ICharacter;
        const isRight: boolean = Math.abs(oak.left - rival.left) < this.EightBitter.unitsize;
        const steps: any[] = [
            1,
            "bottom",
            6,
            (): void => {
                this.EightBitter.physics.killNormal(rival);
                this.EightBitter.StateHolder.addChange(rival.id, "alive", false);
                this.EightBitter.MapScreener.blockInputs = false;
            }
        ];
        const dialog: string[] = [
            "OAK: %%%%%%%PLAYER%%%%%%%, raise your young %%%%%%%POKEMON%%%%%%% by making it fight!"
        ];

        console.log("Shouldn't this say the dialog?", dialog);

        this.EightBitter.ScenePlayer.stopCutscene();
        this.EightBitter.MenuGrapher.deleteMenu("GeneralText");

        rival.nocollide = true;
        this.EightBitter.animations.animateCharacterStartWalkingCycle(rival, isRight ? Direction.Left : Direction.Right, steps);
    }

    /**
     * Cutscene for the battle between the player and the rival.
     *
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneOakIntroRivalBattleChallenge(settings: any, args: any): void {
        const starterRival: string[] = this.EightBitter.ItemsHolder.getItem("starterRival");
        const battleInfo: IBattleInfo = {
            opponent: {
                sprite: "RivalPortrait",
                name: this.EightBitter.ItemsHolder.getItem("nameRival"),
                category: "Trainer",
                hasActors: true,
                reward: 175,
                actors: [
                    this.EightBitter.MathDecider.compute("newPokemon", starterRival, 5)
                ]
            },
            textStart: ["", " wants to fight!"],
            textDefeat: ["%%%%%%%RIVAL%%%%%%% Yeah! Am I great or what?"],
            textVictory: [
                [
                    "%%%%%%%RIVAL%%%%%%%: WHAT?",
                    "Unbelievable!",
                    "I picked the wrong %%%%%%%POKEMON%%%%%%%!"
                ].join(" ")
            ],
            // "animation": "LineSpiral",
            noBlackout: true,
            keptThings: this.EightBitter.graphics.collectBattleKeptThings(["player", "Rival"]),
            nextCutscene: "OakIntroRivalLeaves"
        };
        let steps: number;

        switch (this.EightBitter.ItemsHolder.getItem("starterRival").join("")) {
            case "SQUIRTLE":
                steps = 2;
                break;
            case "BULBASAUR":
                steps = 3;
                break;
            case "CHARMANDER":
                steps = 1;
                break;
            default:
                throw new Error("Unknown starterRival.");
        }

        if (args.further) {
            steps += 1;
        }

        this.EightBitter.animations.animateCharacterStartWalkingCycle(
            settings.rival,
            3,
            [
                steps,
                "bottom",
                1,
                (): void => this.EightBitter.battles.startBattle(battleInfo)
            ]);
    }

    /**
     * Cutscene for the PokeMart clerk calling the player to pick up Oak's parcel.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelPickupGreeting(settings: any): void {
        settings.triggerer.alive = false;
        this.EightBitter.StateHolder.addChange(settings.triggerer.id, "alive", false);

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hey! You came from PALLET TOWN?"
            ],
            this.EightBitter.ScenePlayer.bindRoutine("WalkToCounter"));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player walking to the counter when picking up the parcel.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelPickupWalkToCounter(settings: any): void {
        this.EightBitter.animations.animateCharacterStartWalkingCycle(
            settings.player,
            0,
            [
                2,
                "left",
                1,
                this.EightBitter.ScenePlayer.bindRoutine("CounterDialog")
            ]);
    }

    /**
     * Cutscene for the player receiving the parcel from the PokeMart clerk.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelPickupCounterDialog(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You know PROF. Oak, right?",
                "His order came in. Will you take it to him?",
                "%%%%%%%PLAYER%%%%%%% got OAK's PARCEL!"
            ],
            (): void => {
                this.EightBitter.MenuGrapher.deleteMenu("GeneralText");
                this.EightBitter.ScenePlayer.stopCutscene();
                this.EightBitter.MapScreener.blockInputs = false;
            });
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        this.EightBitter.StateHolder.addCollectionChange(
            "Pallet Town::Oak's Lab", "Oak", "cutscene", "OakParcelDelivery"
        );
    }

    /**
     * Cutscene for when the player delivers the parcel to Oak.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryGreeting(settings: any): void {
        settings.rival = this.EightBitter.utilities.getThingById("Rival");
        settings.oak = settings.triggerer;
        delete settings.oak.cutscene;
        delete settings.oak.dialog;

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: Oh, %%%%%%%PLAYER%%%%%%%!",
                "How is my old %%%%%%%POKEMON%%%%%%%?",
                "Well, it seems to like you a lot.",
                "You must be talented as a %%%%%%%POKEMON%%%%%%% trainer!",
                "What? You have something for me?",
                "%%%%%%%PLAYER%%%%%%% delivered OAK's PARCEL.",
                "Ah! This is the custom %%%%%%%POKE%%%%%%% BALL I ordered! Thank you!"
            ],
            (): void => {
                this.EightBitter.TimeHandler.addEvent(
                    this.EightBitter.ScenePlayer.bindRoutine("RivalInterrupts"),
                    14);
            }
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        this.EightBitter.StateHolder.addCollectionChange(
            "Viridian City::PokeMart", "CashierDetector", "dialog", false);

        this.EightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGrandpa", "alive", false);
        this.EightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGrandpaBlocker", "alive", false);
        this.EightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGranddaughter", "alive", false);

        this.EightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "HappyGrandpa", "alive", true);
        this.EightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "HappyGranddaughter", "alive", true);
    }

    /**
     * Cutscene for when the rival interrupts Oak and the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryRivalInterrupts(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Gramps!"
            ],
            this.EightBitter.ScenePlayer.bindRoutine("RivalWalksUp")
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival walking up to Oak and the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryRivalWalksUp(settings: any): void {
        const doormat: IThing = this.EightBitter.utilities.getThingById("DoormatLeft");
        const rival: ICharacter = this.EightBitter.things.add("Rival", doormat.left, doormat.top) as ICharacter;

        rival.alive = true;
        settings.rival = rival;

        this.EightBitter.MenuGrapher.deleteMenu("GeneralText");

        this.EightBitter.animations.animateCharacterStartWalkingCycle(
            rival,
            0,
            [
                8,
                (): void => this.EightBitter.ScenePlayer.playRoutine("RivalInquires")
            ]);
    }

    /**
     * Cutscene for the rival asking Oak why he was called.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryRivalInquires(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: What did you call me for?"
            ],
            (): void => {
                this.EightBitter.TimeHandler.addEvent(
                    this.EightBitter.ScenePlayer.bindRoutine("OakRequests"),
                    14);
            }
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak requesting something of the player and rival.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryOakRequests(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Oak: Oh right! I have a request of you two."
            ],
            (): void => {
                this.EightBitter.TimeHandler.addEvent(
                    this.EightBitter.ScenePlayer.bindRoutine("OakDescribesPokedex"),
                    14);
            });
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing the Pokedex. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryOakDescribesPokedex(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "On the desk there is my invention, %%%%%%%POKEDEX%%%%%%%!",
                "It automatically records data on %%%%%%%POKEMON%%%%%%% you've seen or caught!",
                "It's a hi-tech encyclopedia!"
            ],
            (): void => {
                this.EightBitter.TimeHandler.addEvent(
                    this.EightBitter.ScenePlayer.bindRoutine("OakGivesPokedex"),
                    14);
            });
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak giving the player and rival Pokedexes.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryOakGivesPokedex(settings: any): void {
        const bookLeft: IThing = this.EightBitter.utilities.getThingById("BookLeft");
        const bookRight: IThing = this.EightBitter.utilities.getThingById("BookRight");

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: %%%%%%%PLAYER%%%%%%% and %%%%%%%RIVAL%%%%%%%! Take these with you!",
                "%%%%%%%PLAYER%%%%%%% got %%%%%%%POKEDEX%%%%%%% from OAK!"
            ],
            (): void => {
                this.EightBitter.TimeHandler.addEvent(
                    this.EightBitter.ScenePlayer.bindRoutine("OakDescribesGoal"),
                    14);

                this.EightBitter.physics.killNormal(bookLeft);
                this.EightBitter.physics.killNormal(bookRight);

                this.EightBitter.StateHolder.addChange(bookLeft.id, "alive", false);
                this.EightBitter.StateHolder.addChange(bookRight.id, "alive", false);

                this.EightBitter.ItemsHolder.setItem("hasPokedex", true);
            }
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing his life goal.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryOakDescribesGoal(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "To make a complete guide on all the %%%%%%%POKEMON%%%%%%% in the world...",
                "That was my dream!",
                "But, I'm too old! I can't do it!",
                "So, I want you two to fulfill my dream for me!",
                "Get moving, you two!",
                "This is a great undertaking in %%%%%%%POKEMON%%%%%%% history!"
            ],
            (): void => {
                this.EightBitter.TimeHandler.addEvent(
                    this.EightBitter.ScenePlayer.bindRoutine("RivalAccepts"),
                    14);
            }
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival accepting the Pokedex and challenge to complete Oak's goal. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryRivalAccepts(settings: any): void {
        this.EightBitter.animations.animateCharacterSetDirection(settings.rival, 1);

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Alright Gramps! Leave it all to me!",
                "%%%%%%%PLAYER%%%%%%%, I hate to say it, but I don't need you!",
                "I know! I'll borrow a TOWN MAP from my sis!",
                "I'll tell her not to lend you one, %%%%%%%PLAYER%%%%%%%! Hahaha!"
            ],
            (): void => {
                this.EightBitter.ScenePlayer.stopCutscene();
                this.EightBitter.MenuGrapher.deleteMenu("GeneralText");

                delete settings.oak.activate;
                settings.rival.nocollide = true;
                this.EightBitter.animations.animateCharacterStartWalkingCycle(
                    settings.rival,
                    2,
                    [
                        8,
                        (): void => {
                            this.EightBitter.physics.killNormal(settings.rival);
                            this.EightBitter.player.canKeyWalking = true;
                        }
                    ]);

                delete settings.oak.cutscene;
                settings.oak.dialog = [
                    "%%%%%%%POKEMON%%%%%%% around the world wait for you, %%%%%%%PLAYER%%%%%%%!"
                ];

                this.EightBitter.StateHolder.addChange(
                    settings.oak.id, "dialog", settings.oak.dialog
                );
                this.EightBitter.StateHolder.addChange(
                    settings.oak.id, "cutscene", undefined
                );
            }
        );
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Daisy giving the player a Town Map.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneDaisyTownMapGreeting(settings: any): void {
        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Grandpa asked you to run an errand? Here, this will help you!"
            ],
            this.EightBitter.ScenePlayer.bindRoutine("ReceiveMap"));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player receiving the Town Map. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneDaisyTownMapReceiveMap(settings: any): void {
        const book: IThing = this.EightBitter.utilities.getThingById("Book");
        const daisy: ICharacter = settings.triggerer;

        this.EightBitter.physics.killNormal(book);
        this.EightBitter.StateHolder.addChange(book.id, "alive", false);

        delete daisy.cutscene;
        this.EightBitter.StateHolder.addChange(daisy.id, "cutscene", undefined);

        daisy.dialog = [
            "Use the TOWN MAP to find out where you are."
        ];
        this.EightBitter.StateHolder.addChange(daisy.id, "dialog", daisy.dialog);

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% got a TOWN MAP!"
            ],
            (): void => {
                this.EightBitter.ScenePlayer.stopCutscene();
                this.EightBitter.MenuGrapher.deleteMenu("GeneralText");
            });
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        console.warn("Player does not actually get a Town Map...");
    }

    /**
     * Cutscene for the old man battling a Weedle.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutsceneElderTrainingStartBattle(settings: any): void {
        this.EightBitter.MapScreener.blockInputs = true;
        this.EightBitter.battles.startBattle({
            keptThings: this.EightBitter.graphics.collectBattleKeptThings([settings.player, settings.triggerer]),
            player: {
                name: "OLD MAN".split(""),
                sprite: "ElderBack",
                category: "Wild",
                actors: []
            },
            opponent: {
                name: "WEEDLE".split(""),
                sprite: "WeedleFront",
                category: "Wild",
                actors: [
                    this.EightBitter.MathDecider.compute("newPokemon", "WEEDLE".split(""), 5)
                ]
            },
            items: [{
                item: "Pokeball",
                amount: 50
            }],
            automaticMenus: true,
            onShowPlayerMenu: (): void => {
                const timeout: number = 70;

                this.EightBitter.TimeHandler.addEvent(
                    (): void => this.EightBitter.MenuGrapher.registerDown(),
                    timeout);
                this.EightBitter.TimeHandler.addEvent(
                    (): void => this.EightBitter.MenuGrapher.registerA(),
                    timeout * 2);
                this.EightBitter.TimeHandler.addEvent(
                    (): void => this.EightBitter.MenuGrapher.registerA(),
                    timeout * 3);
            }
        } as IBattleInfo);
    }

    /**
     * Cutscene for encountering the rival on Route 22.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneRivalRoute22RivalEmerges(settings: any): void {
        const player: IPlayer = settings.player;
        const triggerer: ICharacter = settings.triggerer;
        const playerUpper: number = Number(Math.abs(player.top - triggerer.top) < this.EightBitter.unitsize);
        const steps: any[] = [
            2,
            "right",
            3 + playerUpper,
        ];
        const rival: ICharacter = this.EightBitter.ObjectMaker.make("Rival", {
            direction: 0,
            nocollide: true,
            opacity: 0
        });

        if (playerUpper) {
            steps.push("top");
            steps.push(0);
        }

        settings.rival = rival;

        steps.push(this.EightBitter.ScenePlayer.bindRoutine("RivalTalks"));

        // thing, attribute, change, goal, speed, onCompletion
        this.EightBitter.animations.animateFadeAttribute(rival, "opacity", .2, 1, 3);

        this.EightBitter.things.add(
            rival,
            triggerer.left - this.EightBitter.unitsize * 28,
            triggerer.top + this.EightBitter.unitsize * 24);

        this.EightBitter.animations.animateCharacterStartWalkingCycle(rival, 0, steps);
    }

    /**
     * Cutscene for the rival talking to the player before the battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneRivalRoute22RivalTalks(settings: any): void {
        const rivalTitle: string[] = this.EightBitter.ItemsHolder.getItem("starterRival");

        this.EightBitter.animations.animateCharacterSetDirection(
            settings.player,
            this.EightBitter.physics.getDirectionBordering(settings.player, settings.rival));

        this.EightBitter.MenuGrapher.createMenu("GeneralText");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Hey! %%%%%%%PLAYER%%%%%%%!",
                "You're going to %%%%%%%POKEMON%%%%%%% LEAGUE?",
                "Forget it! You probably don't have any BADGES!",
                "The guard won't let you through!",
                "By the way did your %%%%%%%POKEMON%%%%%%% get any stronger?"
            ],
            (): void => this.EightBitter.battles.startBattle({
                opponent: {
                    sprite: "RivalPortrait",
                    name: this.EightBitter.ItemsHolder.getItem("nameRival"),
                    category: "Trainer",
                    hasActors: true,
                    reward: 280,
                    actors: [
                        this.EightBitter.MathDecider.compute("newPokemon", rivalTitle, 8),
                        this.EightBitter.MathDecider.compute("newPokemon", "PIDGEY".split(""), 9)
                    ]
                },
                textStart: [
                    "",
                    " wants to fight!"
                ],
                textDefeat: [
                    "Yeah! Am I great or what?".split("")
                ],
                textVictory: [
                    "Awww! You just lucked out!".split("")
                ],
                keptThings: this.EightBitter.graphics.collectBattleKeptThings(["player", "Rival"])
            }));
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }
}
