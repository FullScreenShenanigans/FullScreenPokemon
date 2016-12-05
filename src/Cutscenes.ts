import { IActorExperience } from "battlemovr/lib/IBattleMovr";
import { Component } from "eightbittr/lib/Component";
import { IMenuWordSchema } from "menugraphr/lib/IMenuGraphr";
import { ITimeEvent } from "timehandlr/lib/ITimeHandlr";

import { Direction, DirectionAliases, DirectionOpposites, PokedexListingStatus } from "./Constants";
import { FullScreenPokemon } from "./FullScreenPokemon";
import {
    IBattleActionRoutineSettings, IBattleAttackRoutineSettings,
    IBattleCutsceneSettings, IBattleInfo, IBattleLevelRoutineSettings, IBattleMoveRoutineSettings,
    IBattler, IBattleRoutineSettings, IBattleStatisticRoutineSettings,
    IBattleThingsById, IBattleTransitionSettings,
    ICharacter, IEnemy, IKeyboardResultsMenu, IMenu, IPlayer, IPokeball, IPokemon,
    IPokemonMoveListing, IThing, ITransitionFlashSettings, ITransitionLineSpiralSettings,
    ITransportSchema
} from "./IFullScreenPokemon";

/**
 * Cutscene functions used by FullScreenPokemon instances.
 */
export class Cutscenes<TEightBittr extends FullScreenPokemon> extends Component<TEightBittr> {
    /**
     * Cutscene for starting a battle with a spiral.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleTransitionLineSpiral(settings: ITransitionLineSpiralSettings): void {
        const unitsize: number = this.eightBitter.unitsize;
        const divisor: number = settings.divisor || 15;
        const screenWidth: number = this.eightBitter.MapScreener.width;
        const screenHeight: number = this.eightBitter.MapScreener.height;
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
                        this.eightBitter.physics.killNormal(other);
                    }
                }

                return;
            }

            switch (thing.direction) {
                case Direction.Top:
                    thing = this.eightBitter.objectMaker.make("BlackSquare", {
                        width: width / unitsize,
                        height: screenHeight / unitsize
                    });
                    this.eightBitter.things.add(
                        thing,
                        screenWidth - ((numTimes + 1) * width),
                        screenHeight - ((numTimes + 1) * divisor));
                    difference = -height;
                    destination = numTimes * height;
                    break;

                case Direction.Right:
                    thing = this.eightBitter.objectMaker.make("BlackSquare", {
                        width: screenWidth / unitsize,
                        height: height / unitsize
                    });
                    this.eightBitter.things.add(
                        thing,
                        numTimes * divisor - screenWidth,
                        screenHeight - (numTimes + 1) * height);
                    difference = width;
                    destination = screenWidth - numTimes * width;
                    break;

                case Direction.Bottom:
                    thing = this.eightBitter.objectMaker.make("BlackSquare", {
                        width: width / unitsize,
                        height: screenHeight / unitsize
                    });
                    this.eightBitter.things.add(
                        thing,
                        numTimes * width,
                        numTimes * height - screenHeight);
                    difference = height;
                    destination = screenHeight - numTimes * height;
                    break;

                case Direction.Left:
                    thing = this.eightBitter.objectMaker.make("BlackSquare", {
                        width: screenWidth / unitsize,
                        height: height / unitsize
                    });
                    this.eightBitter.things.add(
                        thing,
                        screenWidth - numTimes * divisor,
                        numTimes * height);
                    difference = -width;
                    destination = numTimes * width;
                    break;

                default:
                    throw new Error(`Unknown direction: '${direction}'.`);
            }

            things.push(thing);

            this.eightBitter.graphics.moveBattleKeptThingsToText(settings.battleInfo!);

            this.eightBitter.timeHandler.addEventInterval(
                (): boolean => {
                    if (direction % 2 === 1) {
                        this.eightBitter.physics.shiftHoriz(thing, difference);
                    } else {
                        this.eightBitter.physics.shiftVert(thing, difference);
                    }

                    if (direction === Direction.Right || direction === Direction.Bottom) {
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
                    this.eightBitter.graphics.moveBattleKeptThingsToText(settings.battleInfo!);

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
        const callback: Function | undefined = settings.callback;
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

            this.eightBitter.animations.animateFadeToColor({
                color: color,
                change: change,
                speed: speed,
                callback: (): void => {
                    this.eightBitter.animations.animateFadeFromColor({
                        color: color,
                        change: change,
                        speed: speed,
                        callback: repeater
                    });
                }
            });

            this.eightBitter.graphics.moveBattleKeptThingsToText(settings.battleInfo!);
        };

        repeater();
    }

    /**
     * Cutscene for starting a battle with a twist.
     * 
     * @param _settings   Settings used for the cutscene.
     * 
     * I think the way to do this would be to treat each quarter of the screen
     * as one section. Divide each section into 10 parts. On each interval
     * increase the maximum the parts can be, while each part is a fraction of
     * the maximum, rounded to a large amount to appear pixellated (perhaps,
     * unitsize * 32?).
     */
    public cutsceneBattleTransitionTwist(_settings: IBattleTransitionSettings): void {
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
        const menu: IMenu = this.eightBitter.MenuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        let playerX: number;
        let opponentX: number;
        let playerGoal: number;
        let opponentGoal: number;
        let timeout: number = 70;

        battleInfo.battlers.player!.selectedIndex = 0;
        battleInfo.battlers.player!.selectedActor = battleInfo.battlers.player!.actors[0];
        battleInfo.battlers.opponent.selectedIndex = 0;
        battleInfo.battlers.opponent.selectedActor = battleInfo.battlers.opponent.actors[0];

        player.opacity = 0;
        opponent.opacity = 0;

        this.eightBitter.physics.setLeft(player, menu.right + player.width * this.eightBitter.unitsize);
        this.eightBitter.physics.setRight(opponent, menu.left);
        this.eightBitter.physics.setTop(opponent, menu.top);

        // They should be visible halfway through (2 * (1 / timeout))
        this.eightBitter.animations.animateFadeAttribute(player, "opacity", 2 / timeout, 1, 1);
        this.eightBitter.animations.animateFadeAttribute(opponent, "opacity", 2 / timeout, 1, 1);

        playerX = this.eightBitter.physics.getMidX(player);
        opponentX = this.eightBitter.physics.getMidX(opponent);
        playerGoal = menu.left + player.width * this.eightBitter.unitsize / 2;
        opponentGoal = menu.right - opponent.width * this.eightBitter.unitsize / 2;

        this.eightBitter.animations.animateSlideHorizontal(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        this.eightBitter.animations.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        this.eightBitter.storage.addPokemonToPokedex(battleInfo.battlers.opponent.actors[0].title, PokedexListingStatus.Seen);

        this.eightBitter.timeHandler.addEvent(this.eightBitter.scenePlayer.bindRoutine("OpeningText"), timeout);

        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the opening text and base menus in a battle. Afer this,
     * the OpponentIntro or PlayerIntro cutscene is triggered.
     * 
     * @param settings   Settings used for the cutscene
     */
    public cutsceneBattleOpeningText(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const textStart: [string, string] = battleInfo.textStart || ["", ""];
        let nextRoutine: string;
        let callback: (...args: any[]) => void;

        if (settings.battleInfo.battlers.opponent.hasActors) {
            nextRoutine = "OpponentIntro";
        } else {
            nextRoutine = "PlayerIntro";
        }

        if (battleInfo.automaticMenus) {
            callback = (): void => {
                this.eightBitter.timeHandler.addEvent(
                    (): void => this.eightBitter.scenePlayer.playRoutine(nextRoutine),
                    70);
            };
        } else {
            callback = this.eightBitter.scenePlayer.bindRoutine(nextRoutine);
        }

        this.eightBitter.MenuGrapher.createMenu("BattlePlayerHealth");
        this.eightBitter.battles.addBattleDisplayPokeballs(
            this.eightBitter.MenuGrapher.getMenu("BattlePlayerHealth") as IMenu,
            battleInfo.battlers.player!);

        if (battleInfo.battlers.opponent.hasActors) {
            this.eightBitter.MenuGrapher.createMenu("BattleOpponentHealth");
            this.eightBitter.battles.addBattleDisplayPokeballs(
                this.eightBitter.MenuGrapher.getMenu("BattleOpponentHealth") as IMenu,
                battleInfo.battlers.player!,
                true);
        } else {
            this.eightBitter.battles.addBattleDisplayPokemonHealth("opponent");
        }

        this.eightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: battleInfo.automaticMenus
        });
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    textStart[0], battleInfo.battlers.opponent.name, textStart[1]
                ]
            ],
            callback
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
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
        const menu: IMenu = this.eightBitter.MenuGrapher.getMenu("GeneralText") as IMenu;
        const opponentX: number = this.eightBitter.physics.getMidX(opponent);
        const opponentGoal: number = menu.right + opponent.width * this.eightBitter.unitsize / 2;
        const battleInfo: IBattleInfo = settings.battleInfo;
        const callback: string = battleInfo.battlers.opponent.hasActors
            ? "OpponentSendOut"
            : "PlayerIntro";
        const timeout: number = 49;
        const textOpponentSendOut: [string, string, string] = battleInfo.textOpponentSendOut || ["", "", ""];

        this.eightBitter.animations.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.animateFadeAttribute(
                    opponent,
                    "opacity",
                    -2 / timeout,
                    0,
                    1);
            },
            (timeout / 2) | 0);

        this.eightBitter.MenuGrapher.deleteMenu("BattleOpponentHealth");
        this.eightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    textOpponentSendOut[0],
                    battleInfo.battlers.opponent.name,
                    textOpponentSendOut[1],
                    battleInfo.battlers.opponent.actors[0].nickname,
                    textOpponentSendOut[2]
                ]
            ]
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");

        this.eightBitter.timeHandler.addEvent(
            this.eightBitter.scenePlayer.bindRoutine(
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
        const menu: IMenu = this.eightBitter.MenuGrapher.getMenu("GeneralText") as IMenu;
        const playerX: number = this.eightBitter.physics.getMidX(player);
        const playerGoal: number = menu.left - player.width * this.eightBitter.unitsize / 2;
        const battleInfo: IBattleInfo = settings.battleInfo;
        const textPlayerSendOut: [string, string] = battleInfo.textPlayerSendOut || ["", ""];
        const timeout: number = 24;

        this.eightBitter.MenuGrapher.deleteMenu("BattlePlayerHealth");

        if (!battleInfo.battlers.player!.hasActors) {
            this.eightBitter.scenePlayer.playRoutine("ShowPlayerMenu");
            return;
        }

        this.eightBitter.animations.animateSlideHorizontal(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.animateFadeAttribute(
                    player,
                    "opacity",
                    -2 / timeout,
                    0,
                    1);
            },
            (timeout / 2) | 0);

        this.eightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    textPlayerSendOut[0],
                    battleInfo.battlers.player!.actors[0].nickname,
                    textPlayerSendOut[1]
                ]
            ]
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");

        this.eightBitter.timeHandler.addEvent(
            this.eightBitter.scenePlayer.bindRoutine(
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
        this.eightBitter.MenuGrapher.deleteMenu("Yes/No");

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.BattleMover.showPlayerMenu();

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
        const left: number = menu.right - this.eightBitter.unitsize * 8;
        const top: number = menu.top + this.eightBitter.unitsize * 32;

        console.warn("Should reset *Normal statistics for opponent Pokemon.");

        settings.opponentLeft = left;
        settings.opponentTop = top;

        this.eightBitter.MenuGrapher.setActiveMenu(undefined);

        this.eightBitter.animations.animateSmokeSmall(
            left,
            top,
            this.eightBitter.scenePlayer.bindRoutine("OpponentSendOutAppear", args)
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
        const opponentInfo: IBattler = settings.battleInfo.battlers.opponent;
        const pokemonInfo: IPokemon = opponentInfo.actors[opponentInfo.selectedIndex!];
        const pokemon: IThing = this.eightBitter.BattleMover.setThing(
            "opponent",
            pokemonInfo.title.join("") + "Front") as IThing;

        console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);

        this.eightBitter.battles.addBattleDisplayPokemonHealth("opponent");
        this.eightBitter.storage.addPokemonToPokedex(pokemonInfo.title, PokedexListingStatus.Seen);

        if (args) {
            this.eightBitter.scenePlayer.playRoutine(args.nextRoutine!);
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
        const left: number = menu.left + this.eightBitter.unitsize * 8;
        const top: number = menu.bottom - this.eightBitter.unitsize * 8;

        console.warn("Should reset *Normal statistics for player Pokemon.");

        settings.playerLeft = left;
        settings.playerTop = top;

        this.eightBitter.MenuGrapher.setActiveMenu(undefined);

        this.eightBitter.animations.animateSmokeSmall(
            left,
            top,
            this.eightBitter.scenePlayer.bindRoutine("PlayerSendOutAppear", args));
    }

    /**
     * Cutscene for the player's Pokemon appearing. The .nextRoutine from args
     * is played.
     * 
     * @param settings   Settings used for the cutscene
     * @param args   Settings to pass to the next routine.
     */
    public cutsceneBattlePlayerSendOutAppear(settings: IBattleCutsceneSettings, args: IBattleRoutineSettings): void {
        const playerInfo: IBattler = settings.battleInfo.battlers.player!;
        const pokemonInfo: IPokemon = playerInfo.selectedActor as IPokemon;
        const pokemon: IThing = this.eightBitter.BattleMover.setThing(
            "player",
            pokemonInfo.title.join("") + "Back") as IThing;

        console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);

        this.eightBitter.battles.addBattleDisplayPokemonHealth("player");

        this.eightBitter.MenuGrapher.createMenu("BattlePlayerHealthNumbers");
        this.eightBitter.battles.setBattleDisplayPokemonHealthBar("Player", pokemonInfo.HP, pokemonInfo.HPNormal);
        this.eightBitter.scenePlayer.playRoutine(args.nextRoutine!);
    }

    /**
     * Cutscene for the player attempting to switch a Pokemon with itself.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattlePlayerSwitchesSamePokemon(settings: IBattleCutsceneSettings): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText", {
            backMenu: "PokemonMenuContext"
        });
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                settings.battleInfo.battlers.player!.selectedActor!.nickname, " is already out!"
            ]);
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player to start a Pokemon move. After the announcement text,
     * the MovePlayerAnimate cutscene is played.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleMovePlayer(settings: IBattleCutsceneSettings, args: IBattleMoveRoutineSettings): void {
        const player: IBattler = settings.battleInfo.battlers.player!;
        const playerActor: IPokemon = player.selectedActor as IPokemon;
        const opponent: IBattler = settings.battleInfo.battlers.opponent;
        const opponentActor: IPokemon = opponent.selectedActor as IPokemon;
        const choice: string = args.choicePlayer!;

        args.damage = this.eightBitter.mathDecider.compute("damage", choice, playerActor, opponentActor);

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    playerActor.nickname, " used ", choice + "!"
                ]
            ],
            this.eightBitter.scenePlayer.bindRoutine("MovePlayerAnimate", args)
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for animating the player's chosen move.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleMovePlayerAnimate(_settings: any, args: IBattleMoveRoutineSettings): void {
        const choice: string = args.choicePlayer!;
        const move: IPokemonMoveListing = this.eightBitter.mathDecider.getConstant("moves")[choice];

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
                    this.eightBitter.MenuGrapher.createMenu("GeneralText");
                    this.eightBitter.BattleMover.showPlayerMenu();
                };
            } else {
                callback = (): void => {
                    this.eightBitter.timeHandler.addEvent(
                        (): void => this.eightBitter.scenePlayer.playRoutine("MoveOpponent", args),
                        7);
                };
            }

            this.eightBitter.scenePlayer.playRoutine("Damage", {
                battlerName: "opponent",
                damage: args.damage,
                callback: callback
            });
        };

        // @todo: When all moves have been implemented, this will be simplified.
        if (!this.eightBitter.scenePlayer.getOtherRoutine("Attack" + choice.replace(" ", ""))) {
            console.warn(choice + " attack animation not implemented...");
            args.callback();
        } else {
            this.eightBitter.scenePlayer.playRoutine("Attack" + choice.replace(" ", ""), args);
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
        const opponent: IBattler = settings.battleInfo.battlers.opponent;
        const opponentActor: IPokemon = opponent.selectedActor as IPokemon;
        const player: IBattler = settings.battleInfo.battlers.player!;
        const playerActor: IPokemon = player.selectedActor as IPokemon;
        const choice: string = args.choiceOpponent!;

        args.damage = this.eightBitter.mathDecider.compute("damage", choice, opponentActor, playerActor);

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    opponentActor.nickname, " used ", choice + "!"
                ]
            ],
            this.eightBitter.scenePlayer.bindRoutine("MoveOpponentAnimate", args));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for animating an opponent's chosen move.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleMoveOpponentAnimate(_settings: IBattleCutsceneSettings, args: IBattleMoveRoutineSettings): void {
        const choice: string = args.choiceOpponent!;
        const move: string = this.eightBitter.mathDecider.getConstant("moves")[choice];

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
                    this.eightBitter.MenuGrapher.createMenu("GeneralText");
                    this.eightBitter.BattleMover.showPlayerMenu();
                };
            } else {
                callback = (): void => {
                    this.eightBitter.timeHandler.addEvent(
                        (): void => this.eightBitter.scenePlayer.playRoutine("MovePlayer", args),
                        7);
                };
            }

            this.eightBitter.scenePlayer.playRoutine("Damage", {
                battlerName: "player",
                damage: args.damage,
                callback: callback
            });
        };

        // @todo: When all moves have been implemented, this will be simplified.
        if (!this.eightBitter.scenePlayer.getOtherRoutine("Attack" + choice.replace(" ", ""))) {
            console.warn(choice + " attack animation not implemented...");
            args.callback();
        } else {
            this.eightBitter.scenePlayer.playRoutine("Attack" + choice.replace(" ", ""), args);
        }
    }

    /**
     * Cutscene for applying and animating damage in battle.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleDamage(_settings: IBattleCutsceneSettings, args: IBattleActionRoutineSettings): void {
        const battlerName: "player" | "opponent" = args.battlerName!;
        const damage: number = args.damage!;
        const battleInfo: IBattleInfo = this.eightBitter.BattleMover.getBattleInfo() as IBattleInfo;
        const battler: IBattler = battleInfo.battlers[battlerName]!;
        const actor: IPokemon = battler.selectedActor as IPokemon;
        const hpStart: number = actor.HP;
        const hpEnd: number = Math.max(hpStart - damage, 0);
        const callback: (() => void) | undefined = hpEnd === 0
            ? (): void => {
                this.eightBitter.timeHandler.addEvent(
                    (): void => {
                        this.eightBitter.scenePlayer.playRoutine(
                            "PokemonFaints",
                            {
                                battlerName: battlerName
                            });
                    },
                    49);
            }
            : args.callback;

        if (damage !== 0) {
            this.eightBitter.battles.animateBattleDisplayPokemonHealthBar(
                battlerName,
                hpStart,
                hpEnd,
                actor.HPNormal,
                callback);

            actor.HP = hpEnd;
        } else if (callback) {
            callback();
        }
    }

    /**
     * Cutscene for a Pokemon fainting in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattlePokemonFaints(settings: IBattleCutsceneSettings, args: IBattleActionRoutineSettings): void {
        const battlerName: "player" | "opponent" = args.battlerName!;
        const battleInfo: IBattleInfo = this.eightBitter.BattleMover.getBattleInfo() as IBattleInfo;
        const actor: IPokemon = battleInfo.battlers[battlerName]!.selectedActor!;
        const thing: IThing = settings.things[battlerName];
        const blank: IThing = this.eightBitter.objectMaker.make(
            "WhiteSquare",
            {
                width: thing.width * thing.scale,
                height: thing.height * thing.scale
            });
        const texts: IThing[] = this.eightBitter.groupHolder.getGroup("Text") as IThing[];
        const background: IThing = this.eightBitter.BattleMover.getBackgroundThing() as IThing;
        const backgroundIndex: number = texts.indexOf(background);
        const nextRoutine: string = battlerName === "player"
            ? "AfterPlayerPokemonFaints" : "AfterOpponentPokemonFaints";

        this.eightBitter.things.add(
            blank,
            thing.left,
            thing.top + thing.height * thing.scale * this.eightBitter.unitsize);

        this.eightBitter.utilities.arrayToIndex(blank, texts, backgroundIndex + 1);
        this.eightBitter.utilities.arrayToIndex(thing, texts, backgroundIndex + 1);

        this.eightBitter.animations.animateSlideVertical(
            thing,
            this.eightBitter.unitsize * 2,
            this.eightBitter.physics.getMidY(thing) + thing.height * thing.scale * this.eightBitter.unitsize,
            1,
            (): void => {
                this.eightBitter.physics.killNormal(thing);
                this.eightBitter.physics.killNormal(blank);
                this.eightBitter.MenuGrapher.createMenu("GeneralText");
                this.eightBitter.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        [
                            actor.nickname, " fainted!"
                        ]
                    ],
                    this.eightBitter.scenePlayer.bindRoutine(nextRoutine, args)
                );
                this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
            });

        this.eightBitter.modAttacher.fireEvent("onFaint", actor, battleInfo.battlers.player!.actors);
    }

    /**
     * Cutscene for choosing what to do after a Pokemon faints in battle.
     */
    public cutsceneBattleAfterPlayerPokemonFaints(): void {
        const battleInfo: IBattleInfo = this.eightBitter.BattleMover.getBattleInfo() as IBattleInfo;
        const actorAvailable: boolean = this.eightBitter.utilities.checkArrayMembersIndex(battleInfo.battlers.player!.actors, "HP");

        if (actorAvailable) {
            this.eightBitter.scenePlayer.playRoutine("PlayerChoosesPokemon");
        } else {
            this.eightBitter.scenePlayer.playRoutine("Defeat");
        }
    }

    /**
     * Cutscene for after an opponent's Pokemon faints in battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleAfterOpponentPokemonFaints(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const opponent: IBattler = battleInfo.battlers.opponent;
        const actorAvailable: boolean = this.eightBitter.utilities.checkArrayMembersIndex(opponent.actors, "HP");
        const experienceGained: number = this.eightBitter.mathDecider.compute(
            "experienceGained", battleInfo.battlers.player!, battleInfo.battlers.opponent);
        let callback: Function;

        if (actorAvailable) {
            callback = this.eightBitter.scenePlayer.bindRoutine("OpponentSwitchesPokemon");
        } else {
            callback = this.eightBitter.scenePlayer.bindRoutine("Victory");
        }

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    battleInfo.battlers.player!.selectedActor!.nickname,
                    " gained ",
                    experienceGained.toString(),
                    " EXP. points!"
                ]
            ],
            this.eightBitter.scenePlayer.bindRoutine(
                "ExperienceGain",
                {
                    experienceGained: experienceGained,
                    callback: callback
                }
            ));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for an opponent switching Pokemon in battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleOpponentSwitchesPokemon(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const opponent: IBattler = battleInfo.battlers.opponent;
        const opponentActor: IPokemon = opponent.selectedActor as IPokemon;
        const nicknameExclaim: string[] = opponentActor.nickname.slice();

        nicknameExclaim.push("!");

        this.eightBitter.BattleMover.switchActor("opponent", opponent.selectedIndex + 1);

        this.eightBitter.MenuGrapher.createMenu("GeneralText", {
            deleteOnFinish: false
        });
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                opponent.name,
                "is about to use",
                nicknameExclaim,
                "Will %%%%%%%PLAYER%%%%%%% change %%%%%%%POKEMON%%%%%%%?"
            ],
            (): void => {
                this.eightBitter.MenuGrapher.createMenu("Yes/No");
                this.eightBitter.MenuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "Yes",
                            callback: this.eightBitter.scenePlayer.bindRoutine(
                                "PlayerSwitchesPokemon",
                                {
                                    nextRoutine: "OpponentSendOut"
                                })
                        }, {
                            text: "No",
                            callback: this.eightBitter.scenePlayer.bindRoutine(
                                "OpponentSendOut",
                                {
                                    nextRoutine: "ShowPlayerMenu"
                                })
                        }]
                });
                this.eightBitter.MenuGrapher.setActiveMenu("Yes/No");
            }
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");

    }

    /**
     * Cutscene for a player's Pokemon gaining experience in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleExperienceGain(settings: IBattleCutsceneSettings, args: IBattleLevelRoutineSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const actor: IPokemon = battleInfo.battlers.player!.selectedActor!;
        const experience: IActorExperience = actor.experience;
        let gains: number = args.experienceGained!;

        console.warn("Experience gain is hardcoded to the current actor...");

        experience.current += gains;

        if (experience.next - experience.current < 0) {
            gains -= (experience.next - experience.current);
            this.eightBitter.scenePlayer.playRoutine("LevelUp", {
                experienceGained: gains,
                callback: args.callback
            });
        } else if (args.callback) {
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
        const actor: IPokemon = battleInfo.battlers.player!.selectedActor!;

        actor.level += 1;
        actor.experience = this.eightBitter.mathDecider.compute(
            "newPokemonExperience", actor.title, actor.level);

        console.warn("Leveling up does not yet increase stats...");

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    actor.nickname,
                    " grew to level ",
                    actor.level.toString(),
                    "!"
                ]
            ],
            this.eightBitter.scenePlayer.bindRoutine("LevelUpStats", args)
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for displaying a Pokemon's statistics in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleLevelUpStats(settings: IBattleCutsceneSettings, args: IBattleLevelRoutineSettings): void {
        this.eightBitter.menus.openPokemonLevelUpStats({
            container: "BattleDisplayInitial",
            position: {
                horizontal: "right",
                vertical: "bottom",
                offset: {
                    left: 4
                }
            },
            pokemon: settings.battleInfo.battlers.player!.selectedActor!,
            onMenuDelete: args.callback
        });
        this.eightBitter.MenuGrapher.setActiveMenu("LevelUpStats");

        console.warn("For stones, LevelUpStats should be taken out of battles.");
    }

    /**
     * Cutscene for a player choosing a Pokemon (creating the menu for it).
     */
    public cutsceneBattlePlayerChoosesPokemon(): void {
        this.eightBitter.MenuGrapher.createMenu("Pokemon", {
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
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            "No! There's no running from a trainer battle!",
            this.eightBitter.scenePlayer.bindRoutine("BattleExitFailReturn"));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for returning to a battle after failing to exit.
     * 
     */
    public cutsceneBattleExitFailReturn(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.BattleMover.showPlayerMenu();
    }

    /**
     * Cutscene for becoming victorious in battle.
     */
    public cutsceneBattleVictory(): void {
        const battleInfo: IBattleInfo = this.eightBitter.BattleMover.getBattleInfo() as IBattleInfo;
        const opponent: IBattler = battleInfo.battlers.opponent;

        if (!opponent.hasActors) {
            this.eightBitter.BattleMover.closeBattle((): void => {
                this.eightBitter.animations.animateFadeFromColor({
                    color: "White"
                });
            });
            return;
        }

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "%%%%%%%PLAYER%%%%%%% defeated ",
                    opponent.name,
                    "!"
                ]
            ],
            this.eightBitter.scenePlayer.bindRoutine("VictorySpeech")
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the opponent responding to the player's victory.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleVictorySpeech(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const menu: IMenu = this.eightBitter.MenuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const opponent: IThing = this.eightBitter.BattleMover.setThing("opponent", battleInfo.battlers.opponent.sprite) as IThing;
        const timeout: number = 35;
        let opponentX: number;
        let opponentGoal: number;

        opponent.opacity = 0;

        this.eightBitter.physics.setTop(opponent, menu.top);
        this.eightBitter.physics.setLeft(opponent, menu.right);
        opponentX = this.eightBitter.physics.getMidX(opponent);
        opponentGoal = menu.right - opponent.width * this.eightBitter.unitsize / 2;

        this.eightBitter.animations.animateFadeAttribute(opponent, "opacity", 4 / timeout, 1, 1);
        this.eightBitter.animations.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1,
            (): void => {
                this.eightBitter.MenuGrapher.createMenu("GeneralText");
                this.eightBitter.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    battleInfo.textVictory!,
                    this.eightBitter.scenePlayer.bindRoutine("VictoryWinnings"));
                this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
            });
    }

    /**
     * Cutscene for receiving cash for defeating an opponent.
     * 
     * @param settings   Settings used for the cutscene
     */
    public cutsceneBattleVictoryWinnings(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const reward: number = battleInfo.battlers.opponent.reward!;
        const animationSettings: any = {
            color: "White"
        };
        const callback: () => void = (): void => {
            this.eightBitter.BattleMover.closeBattle((): void => {
                this.eightBitter.animations.animateFadeFromColor(animationSettings);
            });
        };

        if (battleInfo.giftAfterBattle) {
            this.eightBitter.storage.addItemToBag(battleInfo.giftAfterBattle, battleInfo.giftAfterBattleAmount || 1);
        }

        if (battleInfo.badge) {
            this.eightBitter.itemsHolder.getItem("badges")[battleInfo.badge] = true;
        }

        if (battleInfo.textAfterBattle) {
            animationSettings.callback = (): void => {
                this.eightBitter.MenuGrapher.createMenu("GeneralText");
                this.eightBitter.MenuGrapher.addMenuDialog("GeneralText", battleInfo.textAfterBattle!);
                this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
            };
        }

        if (!reward) {
            callback();
            return;
        }

        this.eightBitter.itemsHolder.increase("money", reward);

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% got $" + reward + " for winning!"
            ],
            callback);
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
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
                let transport: ITransportSchema = this.eightBitter.itemsHolder.getItem("lastPokecenter");

                this.eightBitter.BattleMover.closeBattle();
                this.eightBitter.maps.setMap(transport.map, transport.location);

                for (const pokemon of this.eightBitter.itemsHolder.getItem("PokemonInParty")) {
                    this.eightBitter.battles.healPokemon(pokemon);
                }

                this.eightBitter.storage.autoSave();
            };
        } else {
            callback = (): void => this.eightBitter.BattleMover.closeBattle();
        }

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            message,
            (): void => {
                this.eightBitter.animations.animateFadeToColor({
                    color: "Black",
                    callback: callback
                });
            });
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for a battle completely finishing.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleComplete(settings: IBattleCutsceneSettings): void {
        this.eightBitter.MapScreener.blockInputs = false;
        this.eightBitter.graphics.moveBattleKeptThingsBack(settings.battleInfo);
        this.eightBitter.itemsHolder.setItem("PokemonInParty", settings.battleInfo.battlers.player!.actors);
        this.eightBitter.modAttacher.fireEvent("onBattleComplete", settings.battleInfo);
        if (this.eightBitter.MapScreener.theme) {
            this.eightBitter.audioPlayer.playTheme(this.eightBitter.MapScreener.theme);
        }
    }

    /**
     * Cutscene for changing a statistic in battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleChangeStatistic(settings: any, args: IBattleStatisticRoutineSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const defenderName: "player" | "opponent" = args.defenderName!;
        const defender: IPokemon = battleInfo.battlers[defenderName]!.selectedActor!;
        const defenderLabel: string = defenderName === "opponent"
            ? "Enemy " : "";
        const statistic: string = args.statistic!;
        const amount: number = args.amount!;
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
                throw new Error("Unknown amount for statistic change.");
        }

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
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
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for a Growl attack in battle.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleAttackGrowl(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const defenderName: string = args.defenderName!;
        const attacker: IThing = this.eightBitter.BattleMover.getThing(attackerName) as IThing;
        const defender: IThing = this.eightBitter.BattleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const notes: IThing[] = [
            this.eightBitter.objectMaker.make("Note"),
            this.eightBitter.objectMaker.make("Note")
        ];
        const menu: IMenu = this.eightBitter.MenuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        let startX: number;
        let startY: number;
        let animateNote: (note: IThing, dt: number) => void = (note: IThing, dt: number): void => {
            let flip: number = 1;
            let differenceX: number;
            let differenceY: number;

            if (direction === 1) {
                differenceX = menu.right - startX;
                differenceY = (menu.top + defender.height / 2 * this.eightBitter.unitsize) - startY;
            } else {
                differenceX = menu.left - startX;
                differenceY = (menu.bottom - defender.height * this.eightBitter.unitsize) - startY;
            }

            for (let i: number = 1; i <= 4; i += 1) {
                this.eightBitter.timeHandler.addEvent(
                    (): void => {
                        this.eightBitter.physics.shiftHoriz(note, differenceX / 4);
                        if (flip === 1) {
                            this.eightBitter.physics.shiftVert(note, differenceY / 10 * 6);
                        } else {
                            this.eightBitter.physics.shiftVert(note, -1 * differenceY / 8);
                        }
                        flip *= -1;
                    },
                    dt * i);
            }
        };

        if (direction === 1) {
            startX = menu.left + attacker.width / 2 * this.eightBitter.unitsize;
            startY = menu.bottom - attacker.height * this.eightBitter.unitsize;
        } else {
            startX = menu.right - attacker.width / 2 * this.eightBitter.unitsize;
            startY = menu.top + attacker.height * this.eightBitter.unitsize;
        }

        this.eightBitter.things.add(notes[0], startX, startY);
        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.things.add(
                    notes[1],
                    startX + notes[1].width / 2 * this.eightBitter.unitsize,
                    startY + this.eightBitter.unitsize * 3);
            },
            2);

        animateNote(notes[0], 10);
        animateNote(notes[1], 12);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.physics.killNormal(notes[0]),
            50);
        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.physics.killNormal(notes[1]),
            52);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.animateScreenShake(
                    3,
                    0,
                    6,
                    undefined,
                    this.eightBitter.scenePlayer.bindRoutine(
                        "ChangeStatistic",
                        this.eightBitter.utilities.proliferate(
                            {
                                callback: args.callback,
                                defenderName: defenderName,
                                statistic: "Attack",
                                amount: -1
                            },
                            args)));
            },
            50);

    }

    /**
     * Cutscene for a Tackle attack in battle.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleAttackTackle(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const defenderName: string = args.defenderName!;
        const attacker: IThing = this.eightBitter.BattleMover.getThing(attackerName) as IThing;
        const defender: IThing = this.eightBitter.BattleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        let xvel: number = 7 * direction;
        let dt: number = 7;
        const movement: ITimeEvent = this.eightBitter.timeHandler.addEventInterval(
            (): void => {
                this.eightBitter.physics.shiftHoriz(attacker, xvel);
            },
            1,
            Infinity);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                xvel *= -1;
            },
            dt);

        this.eightBitter.timeHandler.addEvent(this.eightBitter.timeHandler.cancelEvent, dt * 2 - 1, movement);

        if (attackerName === "player") {
            this.eightBitter.timeHandler.addEvent(
                (): void => {
                    this.eightBitter.animations.animateFlicker(
                        defender,
                        14,
                        5,
                        args.callback);
                },
                dt * 2);
        } else {
            this.eightBitter.timeHandler.addEvent(
                (): void => {
                    this.eightBitter.animations.animateScreenShake(
                        0,
                        undefined,
                        undefined,
                        undefined,
                        (): void => {
                            this.eightBitter.animations.animateFlicker(
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
     * @param _settings   Settings used for the cutscene.
     * @param _args   Settings for the routine.
     */
    public cutsceneBattleAttackTailWhip(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const defenderName: string = args.defenderName!;
        const attacker: IThing = this.eightBitter.BattleMover.getThing(attackerName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const dt: number = 11;
        const dx: number = this.eightBitter.unitsize * 4;

        this.eightBitter.physics.shiftHoriz(attacker, dx * direction);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.physics.shiftHoriz(attacker, -dx * direction),
            dt);
        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.physics.shiftHoriz(attacker, dx * direction),
            dt * 2);
        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.physics.shiftHoriz(attacker, -dx * direction),
            dt * 3);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.animateScreenShake(
                    3,
                    0,
                    6,
                    undefined,
                    this.eightBitter.scenePlayer.bindRoutine(
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
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleAttackScratch(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const defenderName: string = args.defenderName!;
        const defender: IThing = this.eightBitter.BattleMover.getThing(defenderName) as IThing;
        const dt: number = 1;
        const direction: number = defenderName === "opponent" ? -1 : 1;
        const differenceX: number = defender.width / 2 * this.eightBitter.unitsize;
        const lineArray: IThing[] = [];
        const menu: IMenu = this.eightBitter.MenuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const scratches: IThing[] = [
            this.eightBitter.objectMaker.make("ExplosionSmall"),
            this.eightBitter.objectMaker.make("ExplosionSmall"),
            this.eightBitter.objectMaker.make("ExplosionSmall")
        ];
        let startX: number;
        let startY: number;

        if (direction === -1) {
            startX = menu.right - defender.width / 2 * this.eightBitter.unitsize;
            startY = menu.top;
        } else {
            startX = menu.left + defender.width * this.eightBitter.unitsize;
            startY = menu.bottom - (defender.height + 8) * this.eightBitter.unitsize;
        }

        this.eightBitter.things.add(scratches[0], startX, startY);
        const offset: number = scratches[0].width * this.eightBitter.unitsize / 2;
        this.eightBitter.things.add(scratches[1], startX + offset * direction * -1, startY + offset);
        this.eightBitter.things.add(scratches[2], startX + offset * direction * -2, startY + offset * 2);

        this.eightBitter.timeHandler.addEventInterval(
            (): void => {
                for (const scratch of scratches) {
                    const left: number = direction === -1 ? scratch.left : scratch.right - 3 * this.eightBitter.unitsize;
                    const top: number =  scratch.bottom - 3 * this.eightBitter.unitsize;

                    this.eightBitter.timeHandler.addEvent(
                        (): void => this.eightBitter.physics.shiftHoriz(scratch, differenceX * direction / 16),
                        dt);
                    this.eightBitter.timeHandler.addEvent(
                        (): void => this.eightBitter.physics.shiftVert(scratch, differenceX * direction / 16),
                        dt);

                    const line: IThing = this.eightBitter.things.add("ScratchLine", left, top);
                    if (direction === 1) {
                        this.eightBitter.graphics.flipHoriz(line);
                    }
                    lineArray.push(line);
                }
            },
            dt,
            16);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                for (const scratch of scratches) {
                    this.eightBitter.physics.killNormal(scratch);
                }

                for (const line of lineArray) {
                    this.eightBitter.physics.killNormal(line);
                }

                this.eightBitter.animations.animateFlicker(defender, 14, 5, args.callback);
            },
            17 * dt);
    }

    /**
     * Cutscene for an Ember attack in battle.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleAttackEmber(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const attacker: IThing = this.eightBitter.BattleMover.getThing(attackerName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.eightBitter.MenuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const xPositions: number[] = new Array(3);
        let yPosition: number;
        const animateEmber: (x: number, y: number) => void = (x: number, y: number): void => {
            const emberSmall: IThing = this.eightBitter.objectMaker.make("EmberSmall");
            this.eightBitter.things.add(emberSmall, x + 4, y + 12);
            this.eightBitter.animations.animateFlicker(emberSmall, 3, 6);

            this.eightBitter.timeHandler.addEvent(
                    (): void => {
                            const emberLarge: IThing = this.eightBitter.objectMaker.make("EmberLarge");
                            this.eightBitter.things.add(emberLarge, x, y);
                            this.eightBitter.animations.animateFlicker(
                                emberLarge,
                                3,
                                6,
                                (): void => {
                                    this.eightBitter.physics.killNormal(emberSmall);
                                    this.eightBitter.physics.killNormal(emberLarge);
                                });
                    },
                    6);
        };

        if (direction === 1) {
            xPositions[0] = menu.left + (attacker.width * 3 + 4) * this.eightBitter.unitsize;
            xPositions[1] = xPositions[0] + (menu.left + xPositions[0]) / 30;
            xPositions[2] = xPositions[0] + (menu.left + xPositions[0]) / 60;
            yPosition = menu.bottom - (attacker.height * 2 - 4) * this.eightBitter.unitsize;
        } else {
            // These positions are incorrect and need to be updated. See issue #327
            xPositions[0] = menu.right - attacker.width / 2 * this.eightBitter.unitsize;
            yPosition = menu.top + attacker.height * this.eightBitter.unitsize;
        }

        for (let i: number = 0; i < 3; i += 1) {
            this.eightBitter.timeHandler.addEvent(
                (): void => {
                    animateEmber(xPositions[i], yPosition);
                },
                24 * i);
        }

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.animateScreenShake(
                    3,
                    0,
                    4,
                    undefined,
                    args.callback);
            },
            84);
    }

    /**
     * Cutscene for a Quick Attack attack in battle.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleAttackQuickAttack(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const defenderName: string = args.defenderName!;
        const attacker: IThing = this.eightBitter.BattleMover.getThing(attackerName) as IThing;
        const defender: IThing = this.eightBitter.BattleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.eightBitter.MenuGrapher.getMenu("BattleDisplayInitial") as IMenu;

        let xvel: number = -7 * direction;

        this.eightBitter.timeHandler.addEventInterval(
            (): void => this.eightBitter.physics.shiftHoriz(attacker, xvel),
            1,
            38);
        this.eightBitter.timeHandler.addEvent(
            (): void => {
                xvel *= -1;
            },
            20);
        this.eightBitter.timeHandler.addEvent(
            (): void => {
                attacker.hidden = !attacker.hidden;
            },
            15);
        this.eightBitter.timeHandler.addEvent(
            (): void => {
                attacker.hidden = !attacker.hidden;
                this.eightBitter.animations.animateFlicker(defender, 12, 6, args.callback);
            },
            40);

        const explosions: IThing[] = [
            this.eightBitter.objectMaker.make("ExplosionLarge"),
            this.eightBitter.objectMaker.make("ExplosionLarge"),
            this.eightBitter.objectMaker.make("ExplosionLarge")
        ];
        let startX: number[] = [];
        let startY: number[] = [];
        if (direction === -1) {
            startX[0] = menu.right - defender.width / 2 * this.eightBitter.unitsize;
            startY[0] = menu.top;
        } else {
            startX[0] = menu.left + (defender.width + 32) * this.eightBitter.unitsize;
            startY[0] = menu.bottom - (defender.height + 16) * this.eightBitter.unitsize;
            startX[1] = startX[0] + 6 * this.eightBitter.unitsize;
            startY[1] = startY[0] - 6 * this.eightBitter.unitsize;
            startX[2] = startX[1] + 6 * this.eightBitter.unitsize;
            startY[2] = startY[1] - 8 * this.eightBitter.unitsize;
        }

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.things.add(explosions[0], startX[0], startY[0]);
                this.eightBitter.timeHandler.addEvent(
                    (): void => {
                        this.eightBitter.physics.killNormal(explosions[0]);
                        this.eightBitter.things.add(explosions[1], startX[1], startY[1]);
                    },
                    4);
                this.eightBitter.timeHandler.addEvent(
                    (): void => {
                        this.eightBitter.physics.killNormal(explosions[1]);
                        this.eightBitter.things.add(explosions[2], startX[2], startY[2]);
                    },
                    8);
                this.eightBitter.timeHandler.addEvent(
                    (): void => this.eightBitter.physics.killNormal(explosions[2]),
                    12);
            },
            20);
    }

    /**
     * Cutscene for an Bubble attack in battle.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleAttackBubble(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const unitsize: number = this.eightBitter.unitsize;
        const attackerName: string = args.attackerName!;
        const attacker: IThing = this.eightBitter.BattleMover.getThing(attackerName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.eightBitter.MenuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const xPositions: number[] = [];
        const yPositions: number[] = [];
        const animateBubble: (x: number, y: number, i: number) => void = (x: number, y: number, i: number): void => {
            if (i === 0) {
                const bubbleLarge: IThing = this.eightBitter.things.add("BubbleLarge", x, y);

                this.eightBitter.timeHandler.addEvent(
                    (): void => {
                        this.eightBitter.physics.killNormal(bubbleLarge);
                    },
                    4 * 24);
            } else if (i === 1) {
                const bubbleLarge: IThing = this.eightBitter.things.add("BubbleLarge", x, y);
                const bubblesSmall: IThing[] = [];

                for (let j: number = 0; j < 4; j += 1) {
                    bubblesSmall[j] = this.eightBitter.objectMaker.make("BubbleSmall");
                }

                this.eightBitter.things.add(bubblesSmall[0], x, y - 4 * unitsize);
                this.eightBitter.things.add(bubblesSmall[1], x + 4 * unitsize, y - 3 * unitsize);
                this.eightBitter.things.add(bubblesSmall[2], x + 8 * unitsize, y + 4 * unitsize);
                this.eightBitter.things.add(bubblesSmall[3], x, y + 8 * unitsize);

                this.eightBitter.timeHandler.addEvent(
                    (): void => {
                        this.eightBitter.physics.killNormal(bubbleLarge);
                        for (let j: number = 0; j < 4; j += 1) {
                            this.eightBitter.physics.killNormal(bubblesSmall[j]);
                        }
                    },
                    3 * 24);
            } else if (i === 2) {
                const bubblesLarge: IThing[] = [];
                const bubblesSmall: IThing[] = [];

                for (let j: number = 0; j < 3; j += 1) {
                    bubblesLarge[j] = this.eightBitter.objectMaker.make("BubbleLarge");
                    bubblesSmall[j] = this.eightBitter.objectMaker.make("BubbleSmall");
                }

                this.eightBitter.things.add(bubblesLarge[0], x, y - 4 * unitsize);
                this.eightBitter.things.add(bubblesLarge[1], x, y);
                this.eightBitter.things.add(bubblesLarge[2], x + 4 * unitsize, y - 2 * unitsize);
                this.eightBitter.things.add(bubblesSmall[0], x, y - 4 * unitsize);
                this.eightBitter.things.add(bubblesSmall[1], x + unitsize, y + 8 * unitsize);
                this.eightBitter.things.add(bubblesSmall[2], x + 8 * unitsize, y + 6 * unitsize);

                this.eightBitter.timeHandler.addEvent(
                    (): void => {
                        for (let j: number = 0; j < 4; j += 1) {
                            this.eightBitter.physics.killNormal(bubblesLarge[j]);
                            this.eightBitter.physics.killNormal(bubblesSmall[j]);
                        }
                    },
                    2 * 24);
            } else {
                const bubblesLarge: IThing[] = [];
                const bubblesSmall: IThing[] = [];

                for (let j: number = 0; j < 4; j += 1) {
                    bubblesLarge[j] = this.eightBitter.objectMaker.make("BubbleLarge");
                    bubblesSmall[j] = this.eightBitter.objectMaker.make("BubbleSmall");
                }

                this.eightBitter.things.add(bubblesLarge[0], x + 4 * unitsize, y + 12 * unitsize);
                this.eightBitter.things.add(bubblesLarge[1], x, y);
                this.eightBitter.things.add(bubblesLarge[2], x + 8 * unitsize, y + 4 * unitsize);
                this.eightBitter.things.add(bubblesSmall[0], x + 4 * unitsize, y - 4 * unitsize);
                this.eightBitter.things.add(bubblesSmall[1], x + 8 * unitsize, y);
                this.eightBitter.things.add(bubblesSmall[2], x, y + 12 * unitsize);
                this.eightBitter.timeHandler.addEvent(
                    (): void => {
                        for (let j: number = 0; j < 4; j += 1) {
                            this.eightBitter.physics.killNormal(bubblesLarge[j]);
                            this.eightBitter.physics.killNormal(bubblesSmall[j]);
                        }
                    },
                    24);
            }
        };

        if (direction === 1) {
            xPositions[0] = menu.left + (attacker.width + 6) * this.eightBitter.unitsize;
            xPositions[1] = xPositions[0] + 10 * unitsize;
            xPositions[2] = xPositions[1] + 10 * unitsize;
            xPositions[3] = xPositions[2] + 10 * unitsize;
            yPositions[0] = menu.bottom - (attacker.height * 2 - 4) * this.eightBitter.unitsize;
            yPositions[1] = yPositions[0];
            yPositions[2] = yPositions[1] - (menu.bottom - yPositions[1]) / 3;
            yPositions[3] = yPositions[2] - (menu.bottom - yPositions[1]) / 3;
        } else {
            // These positions are incorrect and need to be updated. See issue #343.
            xPositions[0] = menu.right - attacker.width / 2 * this.eightBitter.unitsize;
            yPositions[0] = menu.top + attacker.height * this.eightBitter.unitsize;
        }

        for (let i: number = 0; i < 4; i += 1) {
            this.eightBitter.timeHandler.addEvent(
                (): void => {
                    animateBubble(xPositions[i], yPositions[i], i);
                },
                24 * i);
        }

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.animateScreenShake(
                    3,
                    0,
                    4,
                    undefined,
                    args.callback);
            },
            100);
    }

    /**
     * Cutscene for a Sand Attack attack in battle.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleAttackSandAttack(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const defenderName: string = args.defenderName!;
        const defender: IThing = this.eightBitter.BattleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.eightBitter.MenuGrapher.getMenu("BattleDisplayInitial") as IMenu;

        const explosions: IThing[] = [
            this.eightBitter.objectMaker.make("ExplosionSmall"),
            this.eightBitter.objectMaker.make("ExplosionSmall"),
            this.eightBitter.objectMaker.make("ExplosionSmall")
        ];
        let startX: number[] = [];
        let startY: number;

        if (direction === -1) {
            // Enemy use
        } else {
            startX[0] = menu.left + (defender.width + 8) * this.eightBitter.unitsize;
            startX[1] = startX[0] + 5 * this.eightBitter.unitsize;
            startX[2] = startX[1] + 5 * this.eightBitter.unitsize;
            startY = menu.bottom - (defender.height + 10) * this.eightBitter.unitsize;
        }

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.things.add(explosions[0], startX[0], startY);
            },
            4);
        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.physics.killNormal(explosions[0]);
                this.eightBitter.things.add(explosions[1], startX[1], startY);
            },
            8);
        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.physics.killNormal(explosions[1]);
                this.eightBitter.things.add(explosions[2], startX[2], startY);
            },
            12);
        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.physics.killNormal(explosions[2]),
            16);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.animateScreenShake(
                    3,
                    0,
                    6,
                    undefined,
                    this.eightBitter.scenePlayer.bindRoutine(
                        "ChangeStatistic",
                        {
                            callback: args.callback,
                            defenderName: defenderName,
                            statistic: "Accuracy",
                            amount: -1
                        }));
            },
            (20) | 0);
    }

    /**
     * Cutscene for a Gust attack in battle.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleAttackGust(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const defenderName: string = args.defenderName!;
        const defender: IThing = this.eightBitter.BattleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.eightBitter.MenuGrapher.getMenu("BattleDisplayInitial") as IMenu;

        const gusts: IThing[] = [];
        for (let i: number = 0; i < 8; i += 1) {
            if (i % 2 === 0) {
                gusts[i] = this.eightBitter.objectMaker.make("ExplosionSmall");
            } else {
                gusts[i] = this.eightBitter.objectMaker.make("ExplosionLarge");
            }
        }

        let gustX: number;
        let gustY: number;
        let gustDx: number;
        let gustDy: number;
        if (direction === -1) {
            // Enemy use
        } else {
            gustX = menu.left + (defender.width) * this.eightBitter.unitsize;
            gustY = menu.bottom - (defender.height) * this.eightBitter.unitsize;
            gustDx = 4 * this.eightBitter.unitsize;
            gustDy = -4 * this.eightBitter.unitsize;
        }

        for (let i: number = 0; i < 9; i += 1) {
            this.eightBitter.timeHandler.addEvent(
                (): void => {
                    if (i === 0) {
                        this.eightBitter.things.add(gusts[i], gustX, gustY);
                    } else if (i < 5) {
                        this.eightBitter.physics.killNormal(gusts[i - 1]);
                        this.eightBitter.things.add(gusts[i], gustX + (gustDx * i), gustY);
                    } else if (i < 8) {
                        this.eightBitter.physics.killNormal(gusts[i - 1]);
                        this.eightBitter.things.add(gusts[i], gustX + (gustDx * i), gustY + (gustDy * (i - 4)));
                    } else {
                        this.eightBitter.physics.killNormal(gusts[i - 1]);
                    }
                },
                5 * i);
        }

        const explosions: IThing[] = [
            this.eightBitter.objectMaker.make("ExplosionSmall"),
            this.eightBitter.objectMaker.make("ExplosionSmall"),
            this.eightBitter.objectMaker.make("ExplosionSmall")
        ];
        let startX: number[] = [];
        let startY: number[] = [];
        if (direction === -1) {
            // Enemy use
        } else {
            startX[0] = menu.left + (defender.width + 40) * this.eightBitter.unitsize;
            startY[0] = menu.bottom - (defender.height + 22) * this.eightBitter.unitsize;
            startX[1] = startX[0] - 16 * this.eightBitter.unitsize;
            startY[1] = startY[0] + 4 * this.eightBitter.unitsize;
            startX[2] = startX[1] + 10 * this.eightBitter.unitsize;
            startY[2] = startY[1] + 4 * this.eightBitter.unitsize;
        }

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.things.add(explosions[0], startX[0], startY[0]);
                this.eightBitter.timeHandler.addEvent(
                    (): void => {
                        this.eightBitter.physics.killNormal(explosions[0]);
                        this.eightBitter.things.add(explosions[1], startX[1], startY[1]);
                    },
                    5);
                this.eightBitter.timeHandler.addEvent(
                    (): void => {
                        this.eightBitter.physics.killNormal(explosions[1]);
                        this.eightBitter.things.add(explosions[2], startX[2], startY[2]);
                    },
                    10);
                this.eightBitter.timeHandler.addEvent(
                    (): void => {
                        this.eightBitter.physics.killNormal(explosions[2]);
                        this.eightBitter.animations.animateFlicker(defender, 12, 6, args.callback);
                    },
                    15);
            },
            44);
    }

    /**
     * Cutscene for when a trainer is encountered for battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneTrainerSpottedExclamation(settings: any): void {
        this.eightBitter.animations.animateCharacterPreventWalking(this.eightBitter.player);
        this.eightBitter.animations.animateExclamation(
            settings.triggerer,
            70,
            this.eightBitter.scenePlayer.bindRoutine("Approach"));
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
        const blocks: number = Math.max(0, distance / this.eightBitter.unitsize / 8);

        if (blocks) {
            this.eightBitter.animations.animateCharacterStartWalking(
                triggerer,
                direction,
                [
                    blocks,
                    this.eightBitter.scenePlayer.bindRoutine("Dialog")
                ]
            );
        } else {
            this.eightBitter.scenePlayer.playRoutine("Dialog");
        }
    }

    /**
     * Cutscene for a trainer introduction after the player is approached.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneTrainerSpottedDialog(settings: any): void {
        this.eightBitter.collisions.collideCharacterDialog(settings.player, settings.triggerer);
        this.eightBitter.MapScreener.blockInputs = false;
    }

    /**
     * Cutscene for a nurse's welcome at the Pokemon Center.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutscenePokeCenterWelcome(settings: any): void {
        settings.nurse = this.eightBitter.utilities.getThingById(settings.nurseId || "Nurse");
        settings.machine = this.eightBitter.utilities.getThingById(settings.machineId || "HealingMachine");

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Welcome to our %%%%%%%POKEMON%%%%%%% CENTER!",
                "We heal your %%%%%%%POKEMON%%%%%%% back to perfect health!",
                "Shall we heal your %%%%%%%POKEMON%%%%%%%?"
            ],
            this.eightBitter.scenePlayer.bindRoutine("Choose")
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for choosing whether or not to heal Pokemon.
     */
    public cutscenePokeCenterChoose(): void {
        this.eightBitter.MenuGrapher.createMenu("Heal/Cancel");
        this.eightBitter.MenuGrapher.addMenuList(
            "Heal/Cancel",
            {
                options: [
                    {
                        text: "HEAL",
                        callback: this.eightBitter.scenePlayer.bindRoutine("ChooseHeal")
                    },
                    {
                        text: "CANCEL",
                        callback: this.eightBitter.scenePlayer.bindRoutine("ChooseCancel")
                    }
                ]
            }
        );
        this.eightBitter.MenuGrapher.setActiveMenu("Heal/Cancel");
    }

    /**
     * Cutscene for choosing to heal Pokemon.
     */
    public cutscenePokeCenterChooseHeal(): void {
        this.eightBitter.MenuGrapher.deleteMenu("Heal/Cancel");

        this.eightBitter.MenuGrapher.createMenu("GeneralText", {
            ignoreA: true,
            finishAutomatically: true
        });
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Ok. We'll need your %%%%%%%POKEMON%%%%%%%."
            ],
            this.eightBitter.scenePlayer.bindRoutine("Healing")
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for placing Pokeballs into the healing machine.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutscenePokeCenterHealing(settings: any): void {
        const party: IPokemon[] = this.eightBitter.itemsHolder.getItem("PokemonInParty");
        const balls: IThing[] = [];
        const dt: number = 35;
        const left: number = settings.machine.left + 5 * this.eightBitter.unitsize;
        const top: number = settings.machine.top + 7 * this.eightBitter.unitsize;
        let i: number = 0;

        settings.balls = balls;
        this.eightBitter.animations.animateCharacterSetDirection(settings.nurse, 3);

        this.eightBitter.timeHandler.addEventInterval(
            (): void => {
                balls.push(
                    this.eightBitter.things.add(
                        "HealingMachineBall",
                        left + (i % 2) * 3 * this.eightBitter.unitsize,
                        top + Math.floor(i / 2) * 2.5 * this.eightBitter.unitsize
                    )
                );
                i += 1;
            },
            dt,
            party.length);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.scenePlayer.playRoutine(
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

        this.eightBitter.timeHandler.addEventInterval(
            (): void => {
                changer = i % 2 === 0
                    ? (thing: IThing, className: string): void => this.eightBitter.graphics.addClass(thing, className)
                    : (thing: IThing, className: string): void => this.eightBitter.graphics.removeClass(thing, className);

                for (const ball of balls) {
                    changer(ball, "lit");
                }

                changer(settings.machine, "lit");

                i += 1;
            },
            21,
            numFlashes);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.scenePlayer.playRoutine(
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
        const party: IPokemon[] = this.eightBitter.itemsHolder.getItem("PokemonInParty");

        for (const ball of balls) {
            this.eightBitter.physics.killNormal(ball);
        }

        for (const pokemon of party) {
            this.eightBitter.battles.healPokemon(pokemon);
        }

        this.eightBitter.animations.animateCharacterSetDirection(settings.nurse, 2);

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you! \n Your %%%%%%%POKEMON%%%%%%% are fighting fit!",
                "We hope to see you again!"
            ],
            (): void => {
                this.eightBitter.MenuGrapher.deleteMenu("GeneralText");
                this.eightBitter.scenePlayer.stopCutscene();
            });
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for choosing not to heal Pokemon.
     */
    public cutscenePokeCenterChooseCancel(): void {
        this.eightBitter.MenuGrapher.deleteMenu("Heal/Cancel");

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "We hope to see you again!"
            ],
            (): void => {
                this.eightBitter.MenuGrapher.deleteMenu("GeneralText");
                this.eightBitter.scenePlayer.stopCutscene();
            });
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for speaking to a PokeMart cashier.
     */
    public cutscenePokeMartGreeting(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
            ignoreA: true,
            ignoreB: true
        });
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hi there! \n May I help you?"
            ],
            this.eightBitter.scenePlayer.bindRoutine("Options"));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the PokeMart action options.
     */
    public cutscenePokeMartOptions(): void {
        this.eightBitter.MenuGrapher.createMenu("Money");

        this.eightBitter.MenuGrapher.createMenu("Buy/Sell", {
            killOnB: ["Money", "GeneralText"],
            onMenuDelete: this.eightBitter.scenePlayer.bindRoutine("Exit")
        });
        this.eightBitter.MenuGrapher.addMenuList("Buy/Sell", {
            options: [{
                text: "BUY",
                callback: this.eightBitter.scenePlayer.bindRoutine("BuyMenu")
            }, {
                    text: "SELL",
                    callback: undefined
                }, {
                    text: "QUIT",
                    callback: this.eightBitter.MenuGrapher.registerB
                }]
        });
        this.eightBitter.MenuGrapher.setActiveMenu("Buy/Sell");
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
                    callback: this.eightBitter.scenePlayer.bindRoutine(
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
            callback: this.eightBitter.MenuGrapher.registerB
        });

        this.eightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Take your time."
            ],
            (): void => {
                this.eightBitter.MenuGrapher.createMenu("ShopItems", {
                    backMenu: "Buy/Sell"
                });
                this.eightBitter.MenuGrapher.addMenuList("ShopItems", {
                    options: options
                });
                this.eightBitter.MenuGrapher.setActiveMenu("ShopItems");
            }
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for selecting the amount of an item the player wishes to buy.
     *
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutscenePokeMartSelectAmount(_settings: any, args: any): void {
        const reference: any = args.reference;
        const amount: number = args.amount;
        const cost: number = args.cost;
        const costTotal: number = cost * amount;
        const text: string = this.eightBitter.utilities.makeDigit(amount, 2)
            + this.eightBitter.utilities.makeDigit("$" + costTotal, 8, " ");

        this.eightBitter.MenuGrapher.createMenu("ShopItemsAmount", {
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
                } as IMenuWordSchema,
                {
                    type: "text",
                    words: [text],
                    position: {
                        offset: {
                            left: 8,
                            top: 3.75
                        }
                    }
                } as IMenuWordSchema],
            onUp: this.eightBitter.scenePlayer.bindRoutine(
                "SelectAmount",
                {
                    amount: (amount === 99) ? 1 : amount + 1,
                    cost: cost,
                    reference: reference
                }),
            onDown: this.eightBitter.scenePlayer.bindRoutine(
                "SelectAmount",
                {
                    amount: (amount === 1) ? 99 : amount - 1,
                    cost: cost,
                    reference: reference
                }),
            callback: this.eightBitter.scenePlayer.bindRoutine("ConfirmPurchase", args)
        });
        this.eightBitter.MenuGrapher.setActiveMenu("ShopItemsAmount");
    }

    /**
     * Cutscene for confirming a PokeMart purchase.
     *
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutscenePokeMartConfirmPurchase(_settings: any, args: any): void {
        const reference: any = args.reference;
        const cost: number = args.cost;
        const amount: number = args.amount;
        const costTotal: number = args.costTotal = cost * amount;

        this.eightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                reference.item.toUpperCase() + "? \n That will be $" + costTotal + ". OK?"
            ],
            (): void => {
                this.eightBitter.MenuGrapher.createMenu("Yes/No", {
                    position: {
                        horizontal: "right",
                        vertical: "bottom",
                        offset: {
                            top: 0,
                            left: 0
                        }
                    },
                    onMenuDelete: this.eightBitter.scenePlayer.bindRoutine(
                        "CancelPurchase"
                    ),
                    container: "ShopItemsAmount"
                });
                this.eightBitter.MenuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: this.eightBitter.scenePlayer.bindRoutine(
                                "TryPurchase", args)
                        }, {
                            text: "NO",
                            callback: this.eightBitter.scenePlayer.bindRoutine(
                                "CancelPurchase")
                        }]
                });
                this.eightBitter.MenuGrapher.setActiveMenu("Yes/No");
            });
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for canceling a PokeMart purchase.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutscenePokeMartCancelPurchase(): void {
        this.eightBitter.scenePlayer.playRoutine("BuyMenu");
    }

    /**
     * Cutscene for carrying out a PokeMart transaction. Can either confirm or deny
     * the purchase based on the player's total money. 
     *
     * @param _settings   Settings used for the cutscene.
     * @param args  Settings for the routine.
     */
    public cutscenePokeMartTryPurchase(_settings: any, args: any): void {
        const costTotal: number = args.costTotal;

        if (this.eightBitter.itemsHolder.getItem("money") < costTotal) {
            this.eightBitter.scenePlayer.playRoutine("FailPurchase", args);
            return;
        }

        this.eightBitter.itemsHolder.decrease("money", args.costTotal);
        this.eightBitter.MenuGrapher.createMenu("Money");
        this.eightBitter.itemsHolder.getItem("items").push({
            item: args.reference.item,
            amount: args.amount
        });

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Here you are! \n Thank you!"
            ],
            this.eightBitter.scenePlayer.bindRoutine("ContinueShopping"));

        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for when the player does not have enough money for the 
     * PokeMart purchase.
     */
    public cutscenePokeMartFailPurchase(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You don't have enough money."
            ],
            this.eightBitter.scenePlayer.bindRoutine("ContinueShopping")
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for asking if the player wants to continue shopping.
     */
    public cutscenePokeMartContinueShopping(): void {
        if (this.eightBitter.MenuGrapher.getMenu("Yes/No")) {
            delete this.eightBitter.MenuGrapher.getMenu("Yes/No").onMenuDelete;
        }

        this.eightBitter.MenuGrapher.deleteMenu("ShopItems");
        this.eightBitter.MenuGrapher.deleteMenu("ShopItemsAmount");
        this.eightBitter.MenuGrapher.deleteMenu("Yes/No");

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Is there anything else I can do?"
            ]);

        this.eightBitter.MenuGrapher.setActiveMenu("Buy/Sell");

        this.eightBitter.storage.autoSave();
    }

    /**
     * Cutscene for the player choosing to stop shopping.
     */
    public cutscenePokeMartExit(): void {
        this.eightBitter.scenePlayer.stopCutscene();

        this.eightBitter.MenuGrapher.deleteMenu("Buy/Sell");
        this.eightBitter.MenuGrapher.deleteMenu("Money");

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you!"
            ],
            this.eightBitter.MenuGrapher.deleteActiveMenu
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the beginning of the game introduction.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroFadeIn(settings: any): void {
        const oak: IThing = this.eightBitter.objectMaker.make("OakPortrait", {
            opacity: 0
        });

        settings.oak = oak;

        console.warn("Cannot find Introduction audio theme!");
        // this.eightBitter.audioPlayer.playTheme("Introduction");
        this.eightBitter.modAttacher.fireEvent("onIntroFadeIn", oak);

        this.eightBitter.maps.setMap("Blank", "White");
        this.eightBitter.MenuGrapher.deleteActiveMenu();

        this.eightBitter.things.add(oak);
        this.eightBitter.physics.setMidX(oak, this.eightBitter.MapScreener.middleX | 0);
        this.eightBitter.physics.setMidY(oak, this.eightBitter.MapScreener.middleY | 0);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.animateFadeAttribute(
                    oak,
                    "opacity",
                    .15,
                    1,
                    14,
                    this.eightBitter.scenePlayer.bindRoutine("FirstDialog"));
            },
            70);
    }

    /**
     * Cutscene for Oak's introduction.
     */
    public cutsceneIntroFirstDialog(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hello there! \n Welcome to the world of %%%%%%%POKEMON%%%%%%%!",
                "My name is OAK! People call me the %%%%%%%POKEMON%%%%%%% PROF!"
            ],
            this.eightBitter.scenePlayer.bindRoutine("FirstDialogFade")
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak's introduction exit.
     */
    public cutsceneIntroFirstDialogFade(): void {
        let blank: IThing = this.eightBitter.objectMaker.make("WhiteSquare", {
            width: this.eightBitter.MapScreener.width,
            height: this.eightBitter.MapScreener.height,
            opacity: 0
        });

        this.eightBitter.things.add(blank, 0, 0);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.animateFadeAttribute(
                blank,
                "opacity",
                .15,
                1,
                7,
                this.eightBitter.scenePlayer.bindRoutine("PokemonExpo"));
            },
            35);
    }

    /**
     * Cutscene for transitioning Nidorino onto the screen.
     */
    public cutsceneIntroPokemonExpo(): void {
        let pokemon: IThing = this.eightBitter.objectMaker.make("NIDORINOFront", {
            flipHoriz: true,
            opacity: .01
        });

        this.eightBitter.groupHolder.applyOnAll(this.eightBitter.physics, this.eightBitter.physics.killNormal);

        this.eightBitter.things.add(
            pokemon,
            (this.eightBitter.MapScreener.middleX + 24 * this.eightBitter.unitsize) | 0,
            0);

        this.eightBitter.physics.setMidY(pokemon, this.eightBitter.MapScreener.middleY);

        this.eightBitter.animations.animateFadeAttribute(
            pokemon,
            "opacity",
            .15,
            1,
            3);

        this.eightBitter.animations.animateSlideHorizontal(
            pokemon,
            -this.eightBitter.unitsize * 2,
            this.eightBitter.MapScreener.middleX | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("PokemonExplanation"));
    }

    /**
     * Cutscene for showing an explanation of the Pokemon world.
     */
    public cutsceneIntroPokemonExplanation(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This world is inhabited by creatures called %%%%%%%POKEMON%%%%%%%!",
                "For some people, %%%%%%%POKEMON%%%%%%% are pets. Others use them for fights.",
                "Myself...",
                "I study %%%%%%%POKEMON%%%%%%% as a profession."
            ],
            this.eightBitter.scenePlayer.bindRoutine("PlayerAppear")
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerAppear(settings: any): void {
        const middleX: number = this.eightBitter.MapScreener.middleX | 0;
        const player: IPlayer = this.eightBitter.objectMaker.make("PlayerPortrait", {
            flipHoriz: true,
            opacity: .01
        });

        settings.player = player;

        this.eightBitter.groupHolder.applyOnAll(this.eightBitter.physics, this.eightBitter.physics.killNormal);

        this.eightBitter.things.add(player, this.eightBitter.MapScreener.middleX + 24 * this.eightBitter.unitsize, 0);

        this.eightBitter.physics.setMidY(player, this.eightBitter.MapScreener.middleY);

        this.eightBitter.animations.animateFadeAttribute(player, "opacity", .15, 1, 3);

        this.eightBitter.animations.animateSlideHorizontal(
            player,
            -this.eightBitter.unitsize * 2,
            middleX - player.width * this.eightBitter.unitsize / 2,
            1,
            this.eightBitter.scenePlayer.bindRoutine("PlayerName"));
    }

    /**
     * Cutscene asking the player to enter his/her name.
     */
    public cutsceneIntroPlayerName(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "First, what is your name?"
            ],
            this.eightBitter.scenePlayer.bindRoutine("PlayerSlide"));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the player over to show the naming options.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerSlide(settings: any): void {
        this.eightBitter.animations.animateSlideHorizontal(
            settings.player,
            this.eightBitter.unitsize,
            (this.eightBitter.MapScreener.middleX + 16 * this.eightBitter.unitsize) | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("PlayerNameOptions"));
    }

    /**
     * Cutscene for showing the player naming option menu.
     */
    public cutsceneIntroPlayerNameOptions(): void {
        const fromMenu: () => void = this.eightBitter.scenePlayer.bindRoutine("PlayerNameFromMenu");
        const fromKeyboard: () => void = this.eightBitter.scenePlayer.bindRoutine("PlayerNameFromKeyboard");

        this.eightBitter.MenuGrapher.createMenu("NameOptions");
        this.eightBitter.MenuGrapher.addMenuList("NameOptions", {
            options: [
                {
                    text: "NEW NAME".split(""),
                    callback: () => this.eightBitter.menus.openKeyboardMenu({
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
        this.eightBitter.MenuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for the player selecting Blue, Gary, or John.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerNameFromMenu(settings: any): void {
        settings.name = this.eightBitter.MenuGrapher.getMenuSelectedOption("NameOptions").text;

        this.eightBitter.MenuGrapher.deleteMenu("NameOptions");

        this.eightBitter.animations.animateSlideHorizontal(
            settings.player,
            -this.eightBitter.unitsize,
            this.eightBitter.MapScreener.middleX | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene for the player choosing to customize a new name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerNameFromKeyboard(settings: any): void {
        settings.name = (this.eightBitter.MenuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;

        this.eightBitter.MenuGrapher.deleteMenu("Keyboard");
        this.eightBitter.MenuGrapher.deleteMenu("NameOptions");

        this.eightBitter.animations.animateSlideHorizontal(
            settings.player,
            -this.eightBitter.unitsize,
            this.eightBitter.MapScreener.middleX | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene confirming the player's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerNameConfirm(settings: any): void {
        this.eightBitter.itemsHolder.setItem("name", settings.name);

        this.eightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "Right! So your name is ".split(""),
                    settings.name,
                    "!".split("")
                ]
            ],
            this.eightBitter.scenePlayer.bindRoutine("PlayerNameComplete"));
    }

    /**
     * Cutscene fading the player out.
     */
    public cutsceneIntroPlayerNameComplete(): void {
        const blank: IThing = this.eightBitter.objectMaker.make("WhiteSquare", {
            width: this.eightBitter.MapScreener.width,
            height: this.eightBitter.MapScreener.height,
            opacity: 0
        });

        this.eightBitter.things.add(blank, 0, 0);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.animateFadeAttribute(
                    blank,
                    "opacity",
                    .2,
                    1,
                    7,
                    this.eightBitter.scenePlayer.bindRoutine("RivalAppear"));
            },
            35);
    }

    /**
     * Cutscene for showing the rival.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalAppear(settings: any): void {
        const rival: IThing = this.eightBitter.objectMaker.make("RivalPortrait", {
            opacity: 0
        });

        settings.rival = rival;

        this.eightBitter.groupHolder.applyOnAll(this.eightBitter.physics, this.eightBitter.physics.killNormal);

        this.eightBitter.things.add(rival, 0, 0);
        this.eightBitter.physics.setMidX(rival, this.eightBitter.MapScreener.middleX | 0);
        this.eightBitter.physics.setMidY(rival, this.eightBitter.MapScreener.middleY | 0);
        this.eightBitter.animations.animateFadeAttribute(
            rival,
            "opacity",
            .1,
            1,
            1,
            this.eightBitter.scenePlayer.bindRoutine("RivalName"));
    }

    /**
     * Cutscene introducing the rival.
     */
    public cutsceneIntroRivalName(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This is my grand-son. He's been your rival since you were a baby.",
                "...Erm, what is his name again?"
            ],
            this.eightBitter.scenePlayer.bindRoutine("RivalSlide")
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the rival over to show the rival naming options.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalSlide(settings: any): void {
        this.eightBitter.animations.animateSlideHorizontal(
            settings.rival,
            this.eightBitter.unitsize,
            (this.eightBitter.MapScreener.middleX + 16 * this.eightBitter.unitsize) | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("RivalNameOptions"));
    }

    /**
     * Cutscene for showing the rival naming option menu.
     */
    public cutsceneIntroRivalNameOptions(): void {
        const fromMenu: () => void = this.eightBitter.scenePlayer.bindRoutine("RivalNameFromMenu");
        const fromKeyboard: () => void = this.eightBitter.scenePlayer.bindRoutine("RivalNameFromKeyboard");

        this.eightBitter.MenuGrapher.createMenu("NameOptions");
        this.eightBitter.MenuGrapher.addMenuList("NameOptions", {
            options: [
                {
                    text: "NEW NAME",
                    callback: (): void => this.eightBitter.menus.openKeyboardMenu({
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
        this.eightBitter.MenuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for choosing to name the rival Red, Ash, or Jack.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalNameFromMenu(settings: any): void {
        settings.name = this.eightBitter.MenuGrapher.getMenuSelectedOption("NameOptions").text;

        this.eightBitter.MenuGrapher.deleteMenu("NameOptions");

        this.eightBitter.animations.animateSlideHorizontal(
            settings.rival,
            -this.eightBitter.unitsize,
            this.eightBitter.MapScreener.middleX | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for choosing to customize the rival's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalNameFromKeyboard(settings: any): void {
        settings.name = (this.eightBitter.MenuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;

        this.eightBitter.MenuGrapher.deleteMenu("Keyboard");
        this.eightBitter.MenuGrapher.deleteMenu("NameOptions");

        this.eightBitter.animations.animateSlideHorizontal(
            settings.rival,
            -this.eightBitter.unitsize,
            this.eightBitter.MapScreener.middleX | 0,
            1,
            this.eightBitter.scenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for confirming the rival's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalNameConfirm(settings: any): void {
        this.eightBitter.itemsHolder.setItem("nameRival", settings.name);

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "That's right! I remember now! His name is ", settings.name, "!"
                ]
            ],
            this.eightBitter.scenePlayer.bindRoutine("RivalNameComplete"));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene fading the rival out.
     */
    public cutsceneIntroRivalNameComplete(): void {
        let blank: IThing = this.eightBitter.objectMaker.make("WhiteSquare", {
            width: this.eightBitter.MapScreener.width,
            height: this.eightBitter.MapScreener.height,
            opacity: 0
        });

        this.eightBitter.things.add(blank, 0, 0);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.animateFadeAttribute(
                    blank,
                    "opacity",
                    .2,
                    1,
                    7,
                    this.eightBitter.scenePlayer.bindRoutine("LastDialogAppear"));
            },
            35);
    }

    /**
     * Cutscene for fading the player in.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroLastDialogAppear(settings: any): void {
        const portrait: IThing = this.eightBitter.objectMaker.make("PlayerPortrait", {
            flipHoriz: true,
            opacity: 0
        });

        settings.portrait = portrait;

        this.eightBitter.groupHolder.applyOnAll(this.eightBitter.physics, this.eightBitter.physics.killNormal);

        this.eightBitter.things.add(portrait, 0, 0);
        this.eightBitter.physics.setMidX(portrait, this.eightBitter.MapScreener.middleX | 0);
        this.eightBitter.physics.setMidY(portrait, this.eightBitter.MapScreener.middleY | 0);

        this.eightBitter.animations.animateFadeAttribute(
            portrait,
            "opacity",
            .1,
            1,
            1,
            this.eightBitter.scenePlayer.bindRoutine("LastDialog"));
    }

    /**
     * Cutscene for the last part of the introduction.
     */
    public cutsceneIntroLastDialog(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%!",
                "Your very own %%%%%%%POKEMON%%%%%%% legend is about to unfold!",
                "A world of dreams and adventures with %%%%%%%POKEMON%%%%%%% awaits! Let's go!"
            ],
            this.eightBitter.scenePlayer.bindRoutine("ShrinkPlayer"));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for shrinking the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroShrinkPlayer(settings: any): void {
        const silhouetteLarge: IThing = this.eightBitter.objectMaker.make("PlayerSilhouetteLarge");
        const silhouetteSmall: IThing = this.eightBitter.objectMaker.make("PlayerSilhouetteSmall");
        const player: IPlayer = this.eightBitter.objectMaker.make("Player");
        const timeDelay: number = 49;

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.things.add(silhouetteLarge);
                this.eightBitter.physics.setMidObj(silhouetteLarge, settings.portrait);
                this.eightBitter.physics.killNormal(settings.portrait);
            },
            timeDelay);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.things.add(silhouetteSmall);
                this.eightBitter.physics.setMidObj(silhouetteSmall, silhouetteLarge);
                this.eightBitter.physics.killNormal(silhouetteLarge);
            },
            timeDelay * 2);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.things.add(player);
                this.eightBitter.physics.setMidObj(player, silhouetteSmall);
                this.eightBitter.physics.killNormal(silhouetteSmall);
            },
            timeDelay * 3);

        this.eightBitter.timeHandler.addEvent(
            this.eightBitter.scenePlayer.bindRoutine("FadeOut"),
            timeDelay * 4);
    }

    /**
     * Cutscene for completing the introduction and fading it out.
     */
    public cutsceneIntroFadeOut(): void {
        const blank: IThing = this.eightBitter.objectMaker.make("WhiteSquare", {
            width: this.eightBitter.MapScreener.width,
            height: this.eightBitter.MapScreener.height,
            opacity: 0
        });

        this.eightBitter.things.add(blank, 0, 0);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.animateFadeAttribute(
                    blank,
                    "opacity",
                    .2,
                    1,
                    7,
                    this.eightBitter.scenePlayer.bindRoutine("Finish"));
            },
            35);
    }

    /**
     * Cutscene showing the player in his bedroom.
     */
    public cutsceneIntroFinish(): void {
        delete this.eightBitter.MapScreener.cutscene;

        this.eightBitter.MenuGrapher.deleteActiveMenu();
        this.eightBitter.scenePlayer.stopCutscene();
        this.eightBitter.itemsHolder.setItem("gameStarted", true);

        this.eightBitter.maps.setMap("Pallet Town", "Start Game");
    }

    /**
     * Cutscene for walking into the grass before receiving a Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroFirstDialog(settings: any): void {
        let triggered: boolean = false;

        settings.triggerer.alive = false;
        this.eightBitter.StateHolder.addChange(settings.triggerer.id, "alive", false);

        if (this.eightBitter.itemsHolder.getItem("starter")) {
            this.eightBitter.MapScreener.blockInputs = false;
            return;
        }

        this.eightBitter.animations.animatePlayerDialogFreeze(settings.player);
        this.eightBitter.animations.animateCharacterSetDirection(settings.player, 2);

        this.eightBitter.audioPlayer.playTheme("Professor Oak");
        this.eightBitter.MapScreener.blockInputs = true;

        this.eightBitter.MenuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
            finishAutomaticSpeed: 28
        });
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            "OAK: Hey! Wait! Don't go out!",
            (): void => {
                if (!triggered) {
                    triggered = true;
                    this.eightBitter.scenePlayer.playRoutine("Exclamation");
                }
            });
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the exclamation point over the player's head.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroExclamation(settings: any): void {
        const timeout: number = 49;

        this.eightBitter.animations.animateExclamation(settings.player, timeout);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.MenuGrapher.hideMenu("GeneralText"),
            timeout);

        this.eightBitter.timeHandler.addEvent(
            this.eightBitter.scenePlayer.bindRoutine("Catchup"),
            timeout);
    }

    /**
     * Cutscene for animating Oak to walk to the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroCatchup(settings: any): void {
        const door: IThing = this.eightBitter.utilities.getThingById("Oak's Lab Door");
        const oak: ICharacter = this.eightBitter.objectMaker.make("Oak", {
            outerOk: true,
            nocollide: true
        });
        const isToLeft: boolean = this.eightBitter.player.bordering[Direction.Left] !== undefined;
        const walkingSteps: any[] = [
            1, "left", 4, "top", 8, "right", 1, "top", 1, "right", 1, "top", 1
        ];

        if (!isToLeft) {
            walkingSteps.push("right", 1, "top", 0);
        }

        walkingSteps.push(this.eightBitter.scenePlayer.bindRoutine("GrassWarning"));

        settings.oak = oak;
        settings.isToLeft = isToLeft;

        this.eightBitter.things.add(oak, door.left, door.top);
        this.eightBitter.animations.animateCharacterStartWalkingCycle(oak, 2, walkingSteps);
    }

    /**
     * Cutscene for Oak telling the player to keep out of the grass.
     */
    public cutsceneOakIntroGrassWarning(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "It's unsafe! Wild %%%%%%%POKEMON%%%%%%% live in tall grass!",
                "You need your own %%%%%%%POKEMON%%%%%%% for your protection. \n I know!",
                "Here, come with me."
            ],
            this.eightBitter.scenePlayer.bindRoutine("FollowToLab"));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
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

        walkingSteps.push(this.eightBitter.scenePlayer.bindRoutine("EnterLab"));

        this.eightBitter.MenuGrapher.deleteMenu("GeneralText");
        this.eightBitter.animations.animateCharacterFollow(settings.player, settings.oak);
        this.eightBitter.animations.animateCharacterStartWalkingCycle(
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
        this.eightBitter.StateHolder.addChange("Pallet Town::Oak's Lab::Oak", "alive", true);
        settings.oak.hidden = true;

        this.eightBitter.timeHandler.addEvent(
            this.eightBitter.animations.animateCharacterStartWalkingCycle,
            this.eightBitter.mathDecider.compute("speedWalking", this.eightBitter.player),
            this.eightBitter.player,
            0,
            [
                0,
                (): void => {
                    this.eightBitter.maps.setMap("Pallet Town", "Oak's Lab Floor 1 Door", false);
                    this.eightBitter.player.hidden = true;

                    this.eightBitter.scenePlayer.playRoutine("WalkToTable");
                }
            ]);
    }

    /**
     * Cutscene for Oak offering a Pokemon to the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroWalkToTable(settings: any): void {
        const oak: ICharacter = this.eightBitter.utilities.getThingById("Oak") as ICharacter;
        const rival: ICharacter = this.eightBitter.utilities.getThingById("Rival") as ICharacter;

        settings.oak = oak;
        settings.player = this.eightBitter.player;

        oak.dialog = "OAK: Now, %%%%%%%PLAYER%%%%%%%, which %%%%%%%POKEMON%%%%%%% do you want?";
        oak.hidden = false;
        oak.nocollide = true;
        this.eightBitter.physics.setMidXObj(oak, settings.player);
        this.eightBitter.physics.setBottom(oak, settings.player.top);

        this.eightBitter.StateHolder.addChange(oak.id, "hidden", false);
        this.eightBitter.StateHolder.addChange(oak.id, "nocollide", false);
        this.eightBitter.StateHolder.addChange(oak.id, "dialog", oak.dialog);

        rival.dialog = [
            "%%%%%%%RIVAL%%%%%%%: Heh, I don't need to be greedy like you!",
            "Go ahead and choose, %%%%%%%PLAYER%%%%%%%!"
        ];
        this.eightBitter.StateHolder.addChange(rival.id, "dialog", rival.dialog);

        this.eightBitter.animations.animateCharacterStartWalking(oak, 0, [
            8, "bottom", 0
        ]);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.player.hidden = false;
            },
            112 - this.eightBitter.mathDecider.compute("speedWalking", settings.player));

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.animations.animateCharacterStartWalking(
                    settings.player,
                    0,
                    [8, this.eightBitter.scenePlayer.bindRoutine("RivalComplain")]);
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
        this.eightBitter.StateHolder.addChange(settings.oak.id, "nocollide", false);

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            "%%%%%%%RIVAL%%%%%%%: Gramps! I'm fed up with waiting!",
            this.eightBitter.scenePlayer.bindRoutine("OakThinksToRival"));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak telling the player to pick a Pokemon.
     */
    public cutsceneOakIntroOakThinksToRival(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
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
            this.eightBitter.scenePlayer.bindRoutine("RivalProtests"));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival protesting to Oak.
     */
    public cutsceneOakIntroRivalProtests(): void {
        let timeout: number = 21;

        this.eightBitter.MenuGrapher.deleteMenu("GeneralText");

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.MenuGrapher.createMenu("GeneralText");
            },
            timeout);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%RIVAL%%%%%%%: Hey! Gramps! What about me?"
                ],
                this.eightBitter.scenePlayer.bindRoutine("OakRespondsToProtest")),
            timeout);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.MenuGrapher.setActiveMenu("GeneralText"),
            timeout);
    }

    /**
     * Cutscene for Oak responding to the rival's protest.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroOakRespondsToProtest(settings: any): void {
        const blocker: IThing = this.eightBitter.utilities.getThingById("OakBlocker");
        const timeout: number = 21;

        settings.player.nocollide = false;
        settings.oak.nocollide = false;

        blocker.nocollide = false;
        this.eightBitter.StateHolder.addChange(blocker.id, "nocollide", false);

        this.eightBitter.MapScreener.blockInputs = false;

        this.eightBitter.MenuGrapher.deleteMenu("GeneralText");

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.MenuGrapher.createMenu(
                    "GeneralText",
                    {
                        deleteOnFinish: true
                    });
            },
            timeout);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.MenuGrapher.addMenuDialog(
                "GeneralText",
                "Oak: Be patient! %%%%%%%RIVAL%%%%%%%, you can have one too!"),
            timeout);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.MenuGrapher.setActiveMenu("GeneralText"),
            timeout);
    }

    /**
     * Cutscene for the player checking a Pokeball.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoicePlayerChecksPokeball(settings: any): void {
        // If Oak is hidden, this cutscene shouldn't be starting (too early)
        if (this.eightBitter.utilities.getThingById("Oak").hidden) {
            this.eightBitter.scenePlayer.stopCutscene();

            this.eightBitter.MenuGrapher.createMenu("GeneralText");
            this.eightBitter.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Those are %%%%%%%POKE%%%%%%% Balls. They contain %%%%%%%POKEMON%%%%%%%!"
                ]);
            this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");

            return;
        }

        // If there's already a starter, ignore this sad last ball...
        if (this.eightBitter.itemsHolder.getItem("starter")) {
            return;
        }

        let pokeball: IPokeball = settings.triggerer;
        settings.chosen = pokeball.pokemon;

        this.eightBitter.menus.openPokedexListing(
            pokeball.pokemon!,
            this.eightBitter.scenePlayer.bindRoutine("PlayerDecidesPokemon"),
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
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "So! You want the " + settings.triggerer.description + " %%%%%%%POKEMON%%%%%%%, ", settings.chosen, "?"
                ]
            ],
            (): void => {
                this.eightBitter.MenuGrapher.createMenu("Yes/No", {
                    killOnB: ["GeneralText"]
                });
                this.eightBitter.MenuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: this.eightBitter.scenePlayer.bindRoutine("PlayerTakesPokemon")
                        }, {
                            text: "NO",
                            callback: this.eightBitter.MenuGrapher.registerB
                        }]
                });
                this.eightBitter.MenuGrapher.setActiveMenu("Yes/No");
            });
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player receiving his Pokemon.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutsceneOakIntroPokemonChoicePlayerTakesPokemon(settings: any): void {
        const oak: ICharacter = this.eightBitter.utilities.getThingById("Oak") as ICharacter;
        const rival: ICharacter = this.eightBitter.utilities.getThingById("Rival") as ICharacter;
        const dialogOak: string = "Oak: If a wild %%%%%%%POKEMON%%%%%%% appears, your %%%%%%%POKEMON%%%%%%% can fight against it!";
        const dialogRival: string = "%%%%%%%RIVAL%%%%%%%: My %%%%%%%POKEMON%%%%%%% looks a lot stronger.";

        settings.oak = oak;
        oak.dialog = dialogOak;
        this.eightBitter.StateHolder.addChange(oak.id, "dialog", dialogOak);

        settings.rival = rival;
        rival.dialog = dialogRival;
        this.eightBitter.StateHolder.addChange(rival.id, "dialog", dialogRival);

        this.eightBitter.itemsHolder.setItem("starter", settings.chosen.join(""));
        settings.triggerer.hidden = true;
        this.eightBitter.StateHolder.addChange(settings.triggerer.id, "hidden", true);
        this.eightBitter.StateHolder.addChange(settings.triggerer.id, "nocollide", true);
        this.eightBitter.physics.killNormal(settings.triggerer);

        this.eightBitter.MenuGrapher.deleteMenu("Yes/No");
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
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
            this.eightBitter.scenePlayer.bindRoutine("PlayerChoosesNickname"));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");

        this.eightBitter.itemsHolder.setItem("starter", settings.chosen);
        this.eightBitter.itemsHolder.setItem("PokemonInParty", [
            this.eightBitter.mathDecider.compute("newPokemon", settings.chosen, 5)
        ]);
        this.eightBitter.storage.addPokemonToPokedex(settings.chosen, PokedexListingStatus.Caught);
    }

    /**
     * Cutscene for allowing the player to choose his Pokemon's nickname. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoicePlayerChoosesNickname(settings: any): void {
        this.eightBitter.MenuGrapher.createMenu("Yes/No", {
            ignoreB: true,
            killOnB: ["GeneralText"]
        });
        this.eightBitter.MenuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: (): void => this.eightBitter.menus.openKeyboardMenu({
                        title: settings.chosen,
                        callback: this.eightBitter.scenePlayer.bindRoutine("PlayerSetsNickname")
                    })
                }, {
                    text: "NO",
                    callback: this.eightBitter.scenePlayer.bindRoutine("RivalWalksToPokemon")
                }]
        });
        this.eightBitter.MenuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * Cutscene for the player finishing the naming process.
     */
    public cutsceneOakIntroPokemonChoicePlayerSetsNickname(): void {
        const party: IPokemon[] = this.eightBitter.itemsHolder.getItem("PokemonInParty");
        const menu: IKeyboardResultsMenu = this.eightBitter.MenuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu;
        const result: string[] = menu.completeValue;

        party[0].nickname = result;

        this.eightBitter.scenePlayer.playRoutine("RivalWalksToPokemon");
    }

    /**
     * Cutscene for the rival selecting his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoiceRivalWalksToPokemon(settings: any): void {
        const rival: ICharacter = this.eightBitter.utilities.getThingById("Rival") as ICharacter;
        let starterRival: string[];
        let steps: number;

        this.eightBitter.MenuGrapher.deleteMenu("Keyboard");
        this.eightBitter.MenuGrapher.deleteMenu("GeneralText");
        this.eightBitter.MenuGrapher.deleteMenu("Yes/No");
        this.eightBitter.MapScreener.blockInputs = true;

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
        this.eightBitter.itemsHolder.setItem("starterRival", starterRival);
        this.eightBitter.storage.addPokemonToPokedex(starterRival, PokedexListingStatus.Caught);

        let pokeball: IPokeball = this.eightBitter.utilities.getThingById("Pokeball" + starterRival.join("")) as IPokeball;
        settings.rivalPokeball = pokeball;

        this.eightBitter.animations.animateCharacterStartWalkingCycle(
            rival,
            2,
            [
                2, "right", steps, "top", 1,
                (): void => this.eightBitter.scenePlayer.playRoutine("RivalTakesPokemon")
            ]);
    }

    /**
     * Cutscene for the rival receiving his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoiceRivalTakesPokemon(settings: any): void {
        const oakblocker: IThing = this.eightBitter.utilities.getThingById("OakBlocker");
        const rivalblocker: IThing = this.eightBitter.utilities.getThingById("RivalBlocker");

        this.eightBitter.MenuGrapher.deleteMenu("Yes/No");

        oakblocker.nocollide = true;
        this.eightBitter.StateHolder.addChange(oakblocker.id, "nocollide", true);

        rivalblocker.nocollide = false;
        this.eightBitter.StateHolder.addChange(rivalblocker.id, "nocollide", false);

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: I'll take this one, then!",
                [
                    "%%%%%%%RIVAL%%%%%%% received a ", settings.rivalPokemon, "!"
                ]
            ],
            (): void => {
                settings.rivalPokeball.hidden = true;
                this.eightBitter.StateHolder.addChange(settings.rivalPokeball.id, "hidden", true);
                this.eightBitter.MenuGrapher.deleteActiveMenu();
                this.eightBitter.MapScreener.blockInputs = false;
            });
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");

    }

    /**
     * Cutscene for the rival challenging the player to a Pokemon battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroRivalBattleApproach(settings: any): void {
        const rival: ICharacter = this.eightBitter.utilities.getThingById("Rival") as ICharacter;
        const dx: number = Math.abs(settings.triggerer.left - settings.player.left);
        const further: boolean = dx < this.eightBitter.unitsize;

        this.eightBitter.audioPlayer.playTheme("Rival Appears");

        settings.rival = rival;
        this.eightBitter.animations.animateCharacterSetDirection(rival, Direction.Bottom);
        this.eightBitter.animations.animateCharacterSetDirection(settings.player, Direction.Top);

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Wait, %%%%%%%PLAYER%%%%%%%! Let's check out our %%%%%%%POKEMON%%%%%%%!",
                "Come on, I'll take you on!"
            ],
            this.eightBitter.scenePlayer.bindRoutine(
                "Challenge",
                {
                    further: further
                }
            ));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for showing the lab after the battle ends.
     */
    public cutsceneOakIntroRivalLeavesAfterBattle(): void {
        this.eightBitter.MapScreener.blockInputs = true;

        for (const pokemon of this.eightBitter.itemsHolder.getItem("PokemonInParty")) {
            this.eightBitter.battles.healPokemon(pokemon);
        }

        this.eightBitter.timeHandler.addEvent(this.eightBitter.scenePlayer.bindRoutine("Complaint"), 49);
    }

    /**
     * Cutscene for the rival's comment after losing the battle.
     */
    public cutsceneOakIntroRivalLeavesComplaint(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Okay! I'll make my %%%%%%%POKEMON%%%%%%% fight to toughen it up!"
            ],
            (): void => {
                this.eightBitter.MenuGrapher.deleteActiveMenu();
                this.eightBitter.timeHandler.addEvent(this.eightBitter.scenePlayer.bindRoutine("Goodbye"), 21);
            }
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival telling Oak he is leaving.
     */
    public cutsceneOakIntroRivalLeavesGoodbye(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%! Gramps! Smell ya later!"
            ],
            this.eightBitter.scenePlayer.bindRoutine("Walking"));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival leaving the lab and Oak giving the player advice.
     */
    public cutsceneOakIntroRivalLeavesWalking(): void {
        const oak: ICharacter = this.eightBitter.utilities.getThingById("Oak") as ICharacter;
        const rival: ICharacter = this.eightBitter.utilities.getThingById("Rival") as ICharacter;
        const isRight: boolean = Math.abs(oak.left - rival.left) < this.eightBitter.unitsize;
        const steps: any[] = [
            1,
            "bottom",
            6,
            (): void => {
                this.eightBitter.physics.killNormal(rival);
                this.eightBitter.StateHolder.addChange(rival.id, "alive", false);
                this.eightBitter.MapScreener.blockInputs = false;
            }
        ];
        const dialog: string[] = [
            "OAK: %%%%%%%PLAYER%%%%%%%, raise your young %%%%%%%POKEMON%%%%%%% by making it fight!"
        ];

        console.log("Shouldn't this say the dialog?", dialog);

        this.eightBitter.scenePlayer.stopCutscene();
        this.eightBitter.MenuGrapher.deleteMenu("GeneralText");

        rival.nocollide = true;
        this.eightBitter.animations.animateCharacterStartWalkingCycle(rival, isRight ? Direction.Left : Direction.Right, steps);
    }

    /**
     * Cutscene for the battle between the player and the rival.
     *
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneOakIntroRivalBattleChallenge(settings: any, args: any): void {
        const starterRival: string[] = this.eightBitter.itemsHolder.getItem("starterRival");
        const battleInfo: IBattleInfo = {
            battlers: {
                opponent: {
                    sprite: "RivalPortrait",
                    name: this.eightBitter.itemsHolder.getItem("nameRival"),
                    category: "Trainer",
                    hasActors: true,
                    reward: 175,
                    actors: [
                        this.eightBitter.mathDecider.compute("newPokemon", starterRival, 5)
                    ]
                }
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
            keptThings: this.eightBitter.graphics.collectBattleKeptThings(["player", "Rival"]),
            nextCutscene: "OakIntroRivalLeaves"
        };
        let steps: number;

        switch (this.eightBitter.itemsHolder.getItem("starterRival").join("")) {
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

        this.eightBitter.animations.animateCharacterStartWalkingCycle(
            settings.rival,
            3,
            [
                steps,
                "bottom",
                1,
                (): void => this.eightBitter.battles.startBattle(battleInfo)
            ]);
    }

    /**
     * Cutscene for the PokeMart clerk calling the player to pick up Oak's parcel.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelPickupGreeting(settings: any): void {
        settings.triggerer.alive = false;
        this.eightBitter.StateHolder.addChange(settings.triggerer.id, "alive", false);

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hey! You came from PALLET TOWN?"
            ],
            this.eightBitter.scenePlayer.bindRoutine("WalkToCounter"));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player walking to the counter when picking up the parcel.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelPickupWalkToCounter(settings: any): void {
        this.eightBitter.animations.animateCharacterStartWalkingCycle(
            settings.player,
            0,
            [
                2,
                "left",
                1,
                this.eightBitter.scenePlayer.bindRoutine("CounterDialog")
            ]);
    }

    /**
     * Cutscene for the player receiving the parcel from the PokeMart clerk.
     */
    public cutsceneOakParcelPickupCounterDialog(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You know PROF. Oak, right?",
                "His order came in. Will you take it to him?",
                "%%%%%%%PLAYER%%%%%%% got OAK's PARCEL!"
            ],
            (): void => {
                this.eightBitter.MenuGrapher.deleteMenu("GeneralText");
                this.eightBitter.scenePlayer.stopCutscene();
                this.eightBitter.MapScreener.blockInputs = false;
            });
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");

        this.eightBitter.StateHolder.addCollectionChange(
            "Pallet Town::Oak's Lab", "Oak", "cutscene", "OakParcelDelivery"
        );
    }

    /**
     * Cutscene for when the player delivers the parcel to Oak.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryGreeting(settings: any): void {
        settings.rival = this.eightBitter.utilities.getThingById("Rival");
        settings.oak = settings.triggerer;
        delete settings.oak.cutscene;
        delete settings.oak.dialog;

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
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
                this.eightBitter.timeHandler.addEvent(
                    this.eightBitter.scenePlayer.bindRoutine("RivalInterrupts"),
                    14);
            }
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");

        this.eightBitter.StateHolder.addCollectionChange(
            "Viridian City::PokeMart", "CashierDetector", "dialog", false);

        this.eightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGrandpa", "alive", false);
        this.eightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGrandpaBlocker", "alive", false);
        this.eightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGranddaughter", "alive", false);

        this.eightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "HappyGrandpa", "alive", true);
        this.eightBitter.StateHolder.addCollectionChange(
            "Viridian City::Land", "HappyGranddaughter", "alive", true);
    }

    /**
     * Cutscene for when the rival interrupts Oak and the player.
     */
    public cutsceneOakParcelDeliveryRivalInterrupts(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Gramps!"
            ],
            this.eightBitter.scenePlayer.bindRoutine("RivalWalksUp")
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival walking up to Oak and the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryRivalWalksUp(settings: any): void {
        const doormat: IThing = this.eightBitter.utilities.getThingById("DoormatLeft");
        const rival: ICharacter = this.eightBitter.things.add("Rival", doormat.left, doormat.top) as ICharacter;

        rival.alive = true;
        settings.rival = rival;

        this.eightBitter.MenuGrapher.deleteMenu("GeneralText");

        this.eightBitter.animations.animateCharacterStartWalkingCycle(
            rival,
            0,
            [
                8,
                (): void => this.eightBitter.scenePlayer.playRoutine("RivalInquires")
            ]);
    }

    /**
     * Cutscene for the rival asking Oak why he was called.
     */
    public cutsceneOakParcelDeliveryRivalInquires(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: What did you call me for?"
            ],
            (): void => {
                this.eightBitter.timeHandler.addEvent(
                    this.eightBitter.scenePlayer.bindRoutine("OakRequests"),
                    14);
            }
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak requesting something of the player and rival.
     */
    public cutsceneOakParcelDeliveryOakRequests(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Oak: Oh right! I have a request of you two."
            ],
            (): void => {
                this.eightBitter.timeHandler.addEvent(
                    this.eightBitter.scenePlayer.bindRoutine("OakDescribesPokedex"),
                    14);
            });
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing the Pokedex.
     */
    public cutsceneOakParcelDeliveryOakDescribesPokedex(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "On the desk there is my invention, %%%%%%%POKEDEX%%%%%%%!",
                "It automatically records data on %%%%%%%POKEMON%%%%%%% you've seen or caught!",
                "It's a hi-tech encyclopedia!"
            ],
            (): void => {
                this.eightBitter.timeHandler.addEvent(
                    this.eightBitter.scenePlayer.bindRoutine("OakGivesPokedex"),
                    14);
            });
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak giving the player and rival Pokedexes.
     */
    public cutsceneOakParcelDeliveryOakGivesPokedex(): void {
        const bookLeft: IThing = this.eightBitter.utilities.getThingById("BookLeft");
        const bookRight: IThing = this.eightBitter.utilities.getThingById("BookRight");

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: %%%%%%%PLAYER%%%%%%% and %%%%%%%RIVAL%%%%%%%! Take these with you!",
                "%%%%%%%PLAYER%%%%%%% got %%%%%%%POKEDEX%%%%%%% from OAK!"
            ],
            (): void => {
                this.eightBitter.timeHandler.addEvent(
                    this.eightBitter.scenePlayer.bindRoutine("OakDescribesGoal"),
                    14);

                this.eightBitter.physics.killNormal(bookLeft);
                this.eightBitter.physics.killNormal(bookRight);

                this.eightBitter.StateHolder.addChange(bookLeft.id, "alive", false);
                this.eightBitter.StateHolder.addChange(bookRight.id, "alive", false);

                this.eightBitter.itemsHolder.setItem("hasPokedex", true);
            }
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing his life goal.
     */
    public cutsceneOakParcelDeliveryOakDescribesGoal(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
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
                this.eightBitter.timeHandler.addEvent(
                    this.eightBitter.scenePlayer.bindRoutine("RivalAccepts"),
                    14);
            }
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival accepting the Pokedex and challenge to complete Oak's goal. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryRivalAccepts(settings: any): void {
        this.eightBitter.animations.animateCharacterSetDirection(settings.rival, 1);

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Alright Gramps! Leave it all to me!",
                "%%%%%%%PLAYER%%%%%%%, I hate to say it, but I don't need you!",
                "I know! I'll borrow a TOWN MAP from my sis!",
                "I'll tell her not to lend you one, %%%%%%%PLAYER%%%%%%%! Hahaha!"
            ],
            (): void => {
                this.eightBitter.scenePlayer.stopCutscene();
                this.eightBitter.MenuGrapher.deleteMenu("GeneralText");

                delete settings.oak.activate;
                settings.rival.nocollide = true;
                this.eightBitter.animations.animateCharacterStartWalkingCycle(
                    settings.rival,
                    2,
                    [
                        8,
                        (): void => {
                            this.eightBitter.physics.killNormal(settings.rival);
                            this.eightBitter.player.canKeyWalking = true;
                        }
                    ]);

                delete settings.oak.cutscene;
                settings.oak.dialog = [
                    "%%%%%%%POKEMON%%%%%%% around the world wait for you, %%%%%%%PLAYER%%%%%%%!"
                ];

                this.eightBitter.StateHolder.addChange(
                    settings.oak.id, "dialog", settings.oak.dialog
                );
                this.eightBitter.StateHolder.addChange(
                    settings.oak.id, "cutscene", undefined
                );
            }
        );
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Daisy giving the player a Town Map.
     */
    public cutsceneDaisyTownMapGreeting(): void {
        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Grandpa asked you to run an errand? Here, this will help you!"
            ],
            this.eightBitter.scenePlayer.bindRoutine("ReceiveMap"));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player receiving the Town Map. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneDaisyTownMapReceiveMap(settings: any): void {
        const book: IThing = this.eightBitter.utilities.getThingById("Book");
        const daisy: ICharacter = settings.triggerer;

        this.eightBitter.physics.killNormal(book);
        this.eightBitter.StateHolder.addChange(book.id, "alive", false);

        delete daisy.cutscene;
        this.eightBitter.StateHolder.addChange(daisy.id, "cutscene", undefined);

        daisy.dialog = [
            "Use the TOWN MAP to find out where you are."
        ];
        this.eightBitter.StateHolder.addChange(daisy.id, "dialog", daisy.dialog);

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% got a TOWN MAP!"
            ],
            (): void => {
                this.eightBitter.scenePlayer.stopCutscene();
                this.eightBitter.MenuGrapher.deleteMenu("GeneralText");
            });
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");

        console.warn("Player does not actually get a Town Map...");
    }

    /**
     * Cutscene for the old man battling a Weedle.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutsceneElderTrainingStartBattle(settings: any): void {
        this.eightBitter.MapScreener.blockInputs = true;
        this.eightBitter.battles.startBattle({
            keptThings: this.eightBitter.graphics.collectBattleKeptThings([settings.player, settings.triggerer]),
            battlers: {
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
                        this.eightBitter.mathDecider.compute("newPokemon", "WEEDLE".split(""), 5)
                    ]
                }
            },
            items: [{
                item: "Pokeball",
                amount: 50
            }],
            automaticMenus: true,
            onShowPlayerMenu: (): void => {
                const timeout: number = 70;

                this.eightBitter.timeHandler.addEvent(
                    (): void => this.eightBitter.MenuGrapher.registerDown(),
                    timeout);
                this.eightBitter.timeHandler.addEvent(
                    (): void => this.eightBitter.MenuGrapher.registerA(),
                    timeout * 2);
                this.eightBitter.timeHandler.addEvent(
                    (): void => this.eightBitter.MenuGrapher.registerA(),
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
        const playerUpper: number = Number(Math.abs(player.top - triggerer.top) < this.eightBitter.unitsize);
        const steps: any[] = [
            2,
            "right",
            3 + playerUpper,
        ];
        const rival: ICharacter = this.eightBitter.objectMaker.make("Rival", {
            direction: 0,
            nocollide: true,
            opacity: 0
        });

        if (playerUpper) {
            steps.push("top");
            steps.push(0);
        }

        settings.rival = rival;

        steps.push(this.eightBitter.scenePlayer.bindRoutine("RivalTalks"));

        // thing, attribute, change, goal, speed, onCompletion
        this.eightBitter.animations.animateFadeAttribute(rival, "opacity", .2, 1, 3);

        this.eightBitter.things.add(
            rival,
            triggerer.left - this.eightBitter.unitsize * 28,
            triggerer.top + this.eightBitter.unitsize * 24);

        this.eightBitter.animations.animateCharacterStartWalkingCycle(rival, 0, steps);
    }

    /**
     * Cutscene for the rival talking to the player before the battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneRivalRoute22RivalTalks(settings: any): void {
        const rivalTitle: string[] = this.eightBitter.itemsHolder.getItem("starterRival");

        this.eightBitter.animations.animateCharacterSetDirection(
            settings.player,
            this.eightBitter.physics.getDirectionBordering(settings.player, settings.rival)!);

        this.eightBitter.MenuGrapher.createMenu("GeneralText");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Hey! %%%%%%%PLAYER%%%%%%%!",
                "You're going to %%%%%%%POKEMON%%%%%%% LEAGUE?",
                "Forget it! You probably don't have any BADGES!",
                "The guard won't let you through!",
                "By the way did your %%%%%%%POKEMON%%%%%%% get any stronger?"
            ],
            (): void => this.eightBitter.battles.startBattle({
                battlers: {
                    opponent: {
                        sprite: "RivalPortrait",
                        name: this.eightBitter.itemsHolder.getItem("nameRival"),
                        category: "Trainer",
                        hasActors: true,
                        reward: 280,
                        actors: [
                            this.eightBitter.mathDecider.compute("newPokemon", rivalTitle, 8),
                            this.eightBitter.mathDecider.compute("newPokemon", "PIDGEY".split(""), 9)
                        ]
                    }
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
                keptThings: this.eightBitter.graphics.collectBattleKeptThings(["player", "Rival"])
            }));
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }
}
