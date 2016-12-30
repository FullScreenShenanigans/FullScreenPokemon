import { IActorExperience } from "battlemovr/lib/IBattleMovr";
import { Component } from "eightbittr/lib/Component";
import { ITimeEvent } from "timehandlr/lib/ITimeHandlr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import {
    IBattleActionRoutineSettings, IBattleAttackRoutineSettings,
    IBattleCutsceneSettings, IBattleInfo, IBattleLevelRoutineSettings, IBattleMoveRoutineSettings,
    IBattler, IBattleRoutineSettings, IBattleStatisticRoutineSettings,
    IBattleThingsById, IBattleTransitionSettings,
    IPokemon, ITransitionFlashSettings, ITransitionLineSpiralSettings
} from "../Battles";
import { Direction, PokedexListingStatus } from "../Constants";
import { IMenu } from "../Menus";
import { ICharacter, IEnemy, IPlayer, IThing, ITransportSchema } from "../Things";

/**
 * Battle cutscene functions used by FullScreenPokemon instances.
 */
export class BattleCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Cutscene for starting a battle with a spiral.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public TransitionLineSpiral(settings: ITransitionLineSpiralSettings): void {
        const unitsize: number = 4;
        const divisor: number = settings.divisor || 15;
        const screenWidth: number = this.gameStarter.mapScreener.width;
        const screenHeight: number = this.gameStarter.mapScreener.height;
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
                        this.gameStarter.physics.killNormal(other);
                    }
                }

                return;
            }

            switch (thing.direction) {
                case Direction.Top:
                    thing = this.gameStarter.objectMaker.make("BlackSquare", {
                        width: width / unitsize,
                        height: screenHeight / unitsize
                    });
                    this.gameStarter.things.add(
                        thing,
                        screenWidth - ((numTimes + 1) * width),
                        screenHeight - ((numTimes + 1) * divisor));
                    difference = -height;
                    destination = numTimes * height;
                    break;

                case Direction.Right:
                    thing = this.gameStarter.objectMaker.make("BlackSquare", {
                        width: screenWidth / unitsize,
                        height: height / unitsize
                    });
                    this.gameStarter.things.add(
                        thing,
                        numTimes * divisor - screenWidth,
                        screenHeight - (numTimes + 1) * height);
                    difference = width;
                    destination = screenWidth - numTimes * width;
                    break;

                case Direction.Bottom:
                    thing = this.gameStarter.objectMaker.make("BlackSquare", {
                        width: width / unitsize,
                        height: screenHeight / unitsize
                    });
                    this.gameStarter.things.add(
                        thing,
                        numTimes * width,
                        numTimes * height - screenHeight);
                    difference = height;
                    destination = screenHeight - numTimes * height;
                    break;

                case Direction.Left:
                    thing = this.gameStarter.objectMaker.make("BlackSquare", {
                        width: screenWidth / unitsize,
                        height: height / unitsize
                    });
                    this.gameStarter.things.add(
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

            this.gameStarter.graphics.moveBattleKeptThingsToText(settings.battleInfo!);

            this.gameStarter.timeHandler.addEventInterval(
                (): boolean => {
                    if (direction % 2 === 1) {
                        this.gameStarter.physics.shiftHoriz(thing, difference);
                    } else {
                        this.gameStarter.physics.shiftVert(thing, difference);
                    }

                    if (direction === Direction.Right || direction === Direction.Bottom) {
                        if (thing[this.gameStarter.constants.directionAliases[direction]] < destination) {
                            return false;
                        }
                    } else {
                        if (thing[this.gameStarter.constants.directionAliases[direction]] > destination) {
                            return false;
                        }
                    }

                    direction = (direction + 3) % 4;
                    if (direction === 2) {
                        numTimes += 1;
                    }

                    addLineSpiralThing();
                    this.gameStarter.graphics.moveBattleKeptThingsToText(settings.battleInfo!);

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
    public TransitionFlash(settings: ITransitionFlashSettings): void {
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

            this.gameStarter.actions.animateFadeToColor({
                color: color,
                change: change,
                speed: speed,
                callback: (): void => {
                    this.gameStarter.actions.animateFadeFromColor({
                        color: color,
                        change: change,
                        speed: speed,
                        callback: repeater
                    });
                }
            });

            this.gameStarter.graphics.moveBattleKeptThingsToText(settings.battleInfo!);
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
    public TransitionTwist(_settings: IBattleTransitionSettings): void {
        throw new Error("Not yet implemented.");
    }

    /**
     * Cutscene for starting a battle with a flash, then a twist..
     * 
     * @param settings   Settings used for the cutscene.
     */
    public TransitionFlashTwist(settings: IBattleTransitionSettings): void {
        this.TransitionFlash(
            {
                callback: (): void => this.TransitionTwist(settings)
            });
    }

    /**
     * Cutscene for starting a battle. Players slide in, then the openingText
     * cutscene is called.
     * 
     * @param settings   Settings used for the cutscene
     */
    public Entrance(settings: IBattleCutsceneSettings): void {
        const things: IBattleThingsById = settings.things;
        const battleInfo: IBattleInfo = settings.battleInfo;
        const player: IPlayer = things.player;
        const opponent: IEnemy = things.opponent;
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
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

        this.gameStarter.physics.setLeft(player, menu.right + player.width);
        this.gameStarter.physics.setBottom(player, menu.bottom - player.height);
        this.gameStarter.physics.setRight(opponent, menu.left);
        this.gameStarter.physics.setTop(opponent, menu.top);

        // They should be visible halfway through (2 * (1 / timeout))
        this.gameStarter.actions.animateFadeAttribute(player, "opacity", 2 / timeout, 1, 1);
        this.gameStarter.actions.animateFadeAttribute(opponent, "opacity", 2 / timeout, 1, 1);

        playerX = this.gameStarter.physics.getMidX(player);
        opponentX = this.gameStarter.physics.getMidX(opponent);
        playerGoal = menu.left + player.width / 2;
        opponentGoal = menu.right - opponent.width / 2;

        this.gameStarter.actions.animateSlideHorizontal(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        this.gameStarter.actions.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        this.gameStarter.saves.addPokemonToPokedex(battleInfo.battlers.opponent.actors[0].title, PokedexListingStatus.Seen);

        this.gameStarter.timeHandler.addEvent(this.gameStarter.scenePlayer.bindRoutine("OpeningText"), timeout);

        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the opening text and base menus in a battle. Afer this,
     * the OpponentIntro or PlayerIntro cutscene is triggered.
     * 
     * @param settings   Settings used for the cutscene
     */
    public OpeningText(settings: IBattleCutsceneSettings): void {
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
                this.gameStarter.timeHandler.addEvent(
                    (): void => this.gameStarter.scenePlayer.playRoutine(nextRoutine),
                    70);
            };
        } else {
            callback = this.gameStarter.scenePlayer.bindRoutine(nextRoutine);
        }

        this.gameStarter.menuGrapher.createMenu("BattlePlayerHealth");
        this.gameStarter.battles.addBattleDisplayPokeballs(
            this.gameStarter.menuGrapher.getMenu("BattlePlayerHealth") as IMenu,
            battleInfo.battlers.player!);

        if (battleInfo.battlers.opponent.hasActors) {
            this.gameStarter.menuGrapher.createMenu("BattleOpponentHealth");
            this.gameStarter.battles.addBattleDisplayPokeballs(
                this.gameStarter.menuGrapher.getMenu("BattleOpponentHealth") as IMenu,
                battleInfo.battlers.player!,
                true);
        } else {
            this.gameStarter.battles.addBattleDisplayPokemonHealth("opponent");
        }

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: battleInfo.automaticMenus
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    textStart[0], battleInfo.battlers.opponent.name, textStart[1]
                ]
            ],
            callback
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for an enemy's intro in a battle. They enter, and either send
     * out a Pokemon or let the player intro.
     * 
     * @param settings   Settings used for the cutscene
     */
    public OpponentIntro(settings: IBattleCutsceneSettings): void {
        const things: any = settings.things;
        const opponent: ICharacter = things.opponent;
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("GeneralText") as IMenu;
        const opponentX: number = this.gameStarter.physics.getMidX(opponent);
        const opponentGoal: number = menu.right + opponent.width / 2;
        const battleInfo: IBattleInfo = settings.battleInfo;
        const callback: string = battleInfo.battlers.opponent.hasActors
            ? "OpponentSendOut"
            : "PlayerIntro";
        const timeout: number = 49;
        const textOpponentSendOut: [string, string, string] = battleInfo.textOpponentSendOut || ["", "", ""];

        this.gameStarter.actions.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateFadeAttribute(
                    opponent,
                    "opacity",
                    -2 / timeout,
                    0,
                    1);
            },
            (timeout / 2) | 0);

        this.gameStarter.menuGrapher.deleteMenu("BattleOpponentHealth");
        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.gameStarter.menuGrapher.addMenuDialog(
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
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");

        this.gameStarter.timeHandler.addEvent(
            this.gameStarter.scenePlayer.bindRoutine(
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
    public PlayerIntro(settings: IBattleCutsceneSettings): void {
        const things: any = settings.things;
        const player: IPlayer = things.player;
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("GeneralText") as IMenu;
        const playerX: number = this.gameStarter.physics.getMidX(player);
        const playerGoal: number = menu.left - player.width / 2;
        const battleInfo: IBattleInfo = settings.battleInfo;
        const textPlayerSendOut: [string, string] = battleInfo.textPlayerSendOut || ["", ""];
        const timeout: number = 24;

        this.gameStarter.menuGrapher.deleteMenu("BattlePlayerHealth");

        if (!battleInfo.battlers.player!.hasActors) {
            this.gameStarter.scenePlayer.playRoutine("ShowPlayerMenu");
            return;
        }

        this.gameStarter.actions.animateSlideHorizontal(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateFadeAttribute(
                    player,
                    "opacity",
                    -2 / timeout,
                    0,
                    1);
            },
            (timeout / 2) | 0);

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    textPlayerSendOut[0],
                    battleInfo.battlers.player!.actors[0].nickname,
                    textPlayerSendOut[1]
                ]
            ]
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");

        this.gameStarter.timeHandler.addEvent(
            this.gameStarter.scenePlayer.bindRoutine(
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
    public ShowPlayerMenu(settings: IBattleCutsceneSettings): void {
        this.gameStarter.menuGrapher.deleteMenu("Yes/No");

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.battleMover.showPlayerMenu();

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
    public OpponentSendOut(settings: IBattleCutsceneSettings, args: IBattleRoutineSettings): void {
        const menu: IMenu = settings.things.menu;
        const left: number = menu.right - 32;
        const top: number = menu.top + 32;

        console.warn("Should reset *Normal statistics for opponent Pokemon.");

        settings.opponentLeft = left;
        settings.opponentTop = top;

        this.gameStarter.actions.animateSmokeSmall(
            left,
            top,
            this.gameStarter.scenePlayer.bindRoutine("OpponentSendOutAppear", args)
        );
    }

    /**
     * Cutscene for the opponent's Pokemon appearing. The .nextRoutine from args
     * is played.
     * 
     * @param settings   Settings used for the cutscene
     * @param args   Settings to pass to the next routine.
     */
    public OpponentSendOutAppear(settings: IBattleCutsceneSettings, args: IBattleRoutineSettings): void {
        const opponentInfo: IBattler = settings.battleInfo.battlers.opponent;
        const pokemonInfo: IPokemon = opponentInfo.actors[opponentInfo.selectedIndex!];
        const pokemon: IThing = this.gameStarter.battleMover.setThing(
            "opponent",
            pokemonInfo.title.join("") + "Front") as IThing;

        console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);

        this.gameStarter.battles.addBattleDisplayPokemonHealth("opponent");
        this.gameStarter.saves.addPokemonToPokedex(pokemonInfo.title, PokedexListingStatus.Seen);

        if (args) {
            this.gameStarter.scenePlayer.playRoutine(args.nextRoutine!);
        }
    }

    /**
     * Cutscene for the player starting to send out a Pokemon. A smoke effect
     * plays, then the PlayerSendOutAppear cutscene triggers.
     * 
     * @param settings   Settings used for the cutscene
     * @param args   Settings to pass to the PlayerSendOut cutscene.
     */
    public PlayerSendOut(settings: any, args: IBattleRoutineSettings): void {
        const menu: IMenu = settings.things.menu;
        const left: number = menu.left + 32;
        const top: number = menu.bottom - 32;

        console.warn("Should reset *Normal statistics for player Pokemon.");

        settings.playerLeft = left;
        settings.playerTop = top;

        this.gameStarter.actions.animateSmokeSmall(
            left,
            top,
            this.gameStarter.scenePlayer.bindRoutine("PlayerSendOutAppear", args));
    }

    /**
     * Cutscene for the player's Pokemon appearing. The .nextRoutine from args
     * is played.
     * 
     * @param settings   Settings used for the cutscene
     * @param args   Settings to pass to the next routine.
     */
    public PlayerSendOutAppear(settings: IBattleCutsceneSettings, args: IBattleRoutineSettings): void {
        const playerInfo: IBattler = settings.battleInfo.battlers.player!;
        const pokemonInfo: IPokemon = playerInfo.selectedActor as IPokemon;
        const pokemon: IThing = this.gameStarter.battleMover.setThing(
            "player",
            pokemonInfo.title.join("") + "Back") as IThing;

        console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);

        this.gameStarter.battles.addBattleDisplayPokemonHealth("player");

        this.gameStarter.menuGrapher.createMenu("BattlePlayerHealthNumbers");
        this.gameStarter.battles.setBattleDisplayPokemonHealthBar("Player", pokemonInfo.HP, pokemonInfo.HPNormal);
        this.gameStarter.scenePlayer.playRoutine(args.nextRoutine!);
    }

    /**
     * Cutscene for the player attempting to switch a Pokemon with itself.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public PlayerSwitchesSamePokemon(settings: IBattleCutsceneSettings): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            backMenu: "PokemonMenuContext"
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                settings.battleInfo.battlers.player!.selectedActor!.nickname, " is already out!"
            ]);
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player to start a Pokemon move. After the announcement text,
     * the MovePlayerAnimate cutscene is played.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public MovePlayer(settings: IBattleCutsceneSettings, args: IBattleMoveRoutineSettings): void {
        const player: IBattler = settings.battleInfo.battlers.player!;
        const playerActor: IPokemon = player.selectedActor as IPokemon;
        const opponent: IBattler = settings.battleInfo.battlers.opponent;
        const opponentActor: IPokemon = opponent.selectedActor as IPokemon;
        const choice: string = args.choicePlayer!;

        args.damage = this.gameStarter.equations.damage(choice, playerActor, opponentActor);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    playerActor.nickname, " used ", choice + "!"
                ]
            ],
            this.gameStarter.scenePlayer.bindRoutine("MovePlayerAnimate", args)
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for animating the player's chosen move.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public MovePlayerAnimate(_settings: any, args: IBattleMoveRoutineSettings): void {
        const choice: string = args.choicePlayer!;

        args.attackerName = "player";
        args.defenderName = "opponent";

        args.callback = (): void => {
            let callback: Function;

            args.movePlayerDone = true;

            if (args.moveOpponentDone) {
                callback = (): void => {
                    args.movePlayerDone = false;
                    args.moveOpponentDone = false;
                    this.gameStarter.menuGrapher.createMenu("GeneralText");
                    this.gameStarter.battleMover.showPlayerMenu();
                };
            } else {
                callback = (): void => {
                    this.gameStarter.timeHandler.addEvent(
                        (): void => this.gameStarter.scenePlayer.playRoutine("MoveOpponent", args),
                        7);
                };
            }

            this.gameStarter.scenePlayer.playRoutine("Damage", {
                battlerName: "opponent",
                damage: args.damage,
                callback: callback
            });
        };

        // @todo: When all moves have been implemented, this will be simplified.
        if (!this.gameStarter.scenePlayer.getOtherRoutine("Attack" + choice.replace(" ", ""))) {
            console.warn(choice + " attack animation not implemented...");
            args.callback();
        } else {
            this.gameStarter.scenePlayer.playRoutine("Attack" + choice.replace(" ", ""), args);
        }
    }

    /**
     * Cutscene for the opponent to start a Pokemon move. After the announcement text,
     * the MoveOpponentAnimate cutscene is played.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public MoveOpponent(settings: IBattleCutsceneSettings, args: IBattleMoveRoutineSettings): void {
        const opponent: IBattler = settings.battleInfo.battlers.opponent;
        const opponentActor: IPokemon = opponent.selectedActor as IPokemon;
        const player: IBattler = settings.battleInfo.battlers.player!;
        const playerActor: IPokemon = player.selectedActor as IPokemon;
        const choice: string = args.choiceOpponent!;

        args.damage = this.gameStarter.equations.damage(choice, opponentActor, playerActor);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    opponentActor.nickname, " used ", choice + "!"
                ]
            ],
            this.gameStarter.scenePlayer.bindRoutine("MoveOpponentAnimate", args));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for animating an opponent's chosen move.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public MoveOpponentAnimate(_settings: IBattleCutsceneSettings, args: IBattleMoveRoutineSettings): void {
        const choice: string = args.choiceOpponent!;

        args.attackerName = "opponent";
        args.defenderName = "player";

        args.callback = (): void => {
            let callback: Function;

            args.moveOpponentDone = true;

            if (args.movePlayerDone) {
                callback = (): void => {
                    args.movePlayerDone = false;
                    args.moveOpponentDone = false;
                    this.gameStarter.menuGrapher.createMenu("GeneralText");
                    this.gameStarter.battleMover.showPlayerMenu();
                };
            } else {
                callback = (): void => {
                    this.gameStarter.timeHandler.addEvent(
                        (): void => this.gameStarter.scenePlayer.playRoutine("MovePlayer", args),
                        7);
                };
            }

            this.gameStarter.scenePlayer.playRoutine("Damage", {
                battlerName: "player",
                damage: args.damage,
                callback: callback
            });
        };

        // @todo: When all moves have been implemented, this will be simplified.
        if (!this.gameStarter.scenePlayer.getOtherRoutine("Attack" + choice.replace(" ", ""))) {
            console.warn(choice + " attack animation not implemented...");
            args.callback();
        } else {
            this.gameStarter.scenePlayer.playRoutine("Attack" + choice.replace(" ", ""), args);
        }
    }

    /**
     * Cutscene for applying and animating damage in battle.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public Damage(_settings: IBattleCutsceneSettings, args: IBattleActionRoutineSettings): void {
        const battlerName: "player" | "opponent" = args.battlerName!;
        const damage: number = args.damage!;
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const battler: IBattler = battleInfo.battlers[battlerName]!;
        const actor: IPokemon = battler.selectedActor as IPokemon;
        const hpStart: number = actor.HP;
        const hpEnd: number = Math.max(hpStart - damage, 0);
        const callback: (() => void) | undefined = hpEnd === 0
            ? (): void => {
                this.gameStarter.timeHandler.addEvent(
                    (): void => {
                        this.gameStarter.scenePlayer.playRoutine(
                            "PokemonFaints",
                            {
                                battlerName: battlerName
                            });
                    },
                    49);
            }
            : args.callback;

        if (damage !== 0) {
            this.gameStarter.battles.animateBattleDisplayPokemonHealthBar(
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
    public PokemonFaints(settings: IBattleCutsceneSettings, args: IBattleActionRoutineSettings): void {
        const battlerName: "player" | "opponent" = args.battlerName!;
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const actor: IPokemon = battleInfo.battlers[battlerName]!.selectedActor!;
        const thing: IThing = settings.things[battlerName];
        const blank: IThing = this.gameStarter.objectMaker.make(
            "WhiteSquare",
            {
                width: thing.width * thing.scale,
                height: thing.height * thing.scale
            });
        const texts: IThing[] = this.gameStarter.groupHolder.getGroup("Text") as IThing[];
        const background: IThing = this.gameStarter.battleMover.getBackgroundThing() as IThing;
        const backgroundIndex: number = texts.indexOf(background);
        const nextRoutine: string = battlerName === "player"
            ? "AfterPlayerPokemonFaints" : "AfterOpponentPokemonFaints";

        this.gameStarter.things.add(
            blank,
            thing.left,
            thing.top + thing.height * thing.scale);

        this.gameStarter.utilities.arrayToIndex(blank, texts, backgroundIndex + 1);
        this.gameStarter.utilities.arrayToIndex(thing, texts, backgroundIndex + 1);

        this.gameStarter.actions.animateSlideVertical(
            thing,
            4 * 2,
            this.gameStarter.physics.getMidY(thing) + thing.height * thing.scale,
            1,
            (): void => {
                this.gameStarter.physics.killNormal(thing);
                this.gameStarter.physics.killNormal(blank);
                this.gameStarter.menuGrapher.createMenu("GeneralText");
                this.gameStarter.menuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        [
                            actor.nickname, " fainted!"
                        ]
                    ],
                    this.gameStarter.scenePlayer.bindRoutine(nextRoutine, args)
                );
                this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
            });

        this.gameStarter.modAttacher.fireEvent("onFaint", actor, battleInfo.battlers.player!.actors);
    }

    /**
     * Cutscene for choosing what to do after a Pokemon faints in battle.
     */
    public AfterPlayerPokemonFaints(): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const actorAvailable: boolean = this.gameStarter.utilities.checkArrayMembersIndex(battleInfo.battlers.player!.actors, "HP");

        if (actorAvailable) {
            this.gameStarter.scenePlayer.playRoutine("PlayerChoosesPokemon");
        } else {
            this.gameStarter.scenePlayer.playRoutine("Defeat");
        }
    }

    /**
     * Cutscene for after an opponent's Pokemon faints in battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public AfterOpponentPokemonFaints(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const opponent: IBattler = battleInfo.battlers.opponent;
        const actorAvailable: boolean = this.gameStarter.utilities.checkArrayMembersIndex(opponent.actors, "HP");
        const experienceGained: number = this.gameStarter.equations.experienceGained(
            battleInfo.battlers.player!, battleInfo.battlers.opponent);
        let callback: Function;

        if (actorAvailable) {
            callback = this.gameStarter.scenePlayer.bindRoutine("OpponentSwitchesPokemon");
        } else {
            callback = this.gameStarter.scenePlayer.bindRoutine("Victory");
        }

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    battleInfo.battlers.player!.selectedActor!.nickname,
                    " gained ",
                    experienceGained.toString(),
                    " EXP. points!"
                ]
            ],
            this.gameStarter.scenePlayer.bindRoutine(
                "ExperienceGain",
                {
                    experienceGained: experienceGained,
                    callback: callback
                }
            ));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for an opponent switching Pokemon in battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public OpponentSwitchesPokemon(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const opponent: IBattler = battleInfo.battlers.opponent;
        const opponentActor: IPokemon = opponent.selectedActor as IPokemon;
        const nicknameExclaim: string[] = opponentActor.nickname.slice();

        nicknameExclaim.push("!");

        this.gameStarter.battleMover.switchActor("opponent", opponent.selectedIndex + 1);

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            deleteOnFinish: false
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                opponent.name,
                "is about to use",
                nicknameExclaim,
                "Will %%%%%%%PLAYER%%%%%%% change %%%%%%%POKEMON%%%%%%%?"
            ],
            (): void => {
                this.gameStarter.menuGrapher.createMenu("Yes/No");
                this.gameStarter.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "Yes",
                            callback: this.gameStarter.scenePlayer.bindRoutine(
                                "PlayerSwitchesPokemon",
                                {
                                    nextRoutine: "OpponentSendOut"
                                })
                        }, {
                            text: "No",
                            callback: this.gameStarter.scenePlayer.bindRoutine(
                                "OpponentSendOut",
                                {
                                    nextRoutine: "ShowPlayerMenu"
                                })
                        }]
                });
                this.gameStarter.menuGrapher.setActiveMenu("Yes/No");
            }
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");

    }

    /**
     * Cutscene for a player's Pokemon gaining experience in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public ExperienceGain(settings: IBattleCutsceneSettings, args: IBattleLevelRoutineSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const actor: IPokemon = battleInfo.battlers.player!.selectedActor!;
        const experience: IActorExperience = actor.experience;
        let gains: number = args.experienceGained!;

        console.warn("Experience gain is hardcoded to the current actor...");

        experience.current += gains;

        if (experience.next - experience.current < 0) {
            gains -= (experience.next - experience.current);
            this.gameStarter.scenePlayer.playRoutine("LevelUp", {
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
    public LevelUp(settings: IBattleCutsceneSettings, args: IBattleLevelRoutineSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        // const gains: number = args.experienceGained;
        const actor: IPokemon = battleInfo.battlers.player!.selectedActor!;

        actor.level += 1;
        actor.experience = this.gameStarter.equations.newPokemonExperience(actor.title, actor.level);

        console.warn("Leveling up does not yet increase stats...");

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    actor.nickname,
                    " grew to level ",
                    actor.level.toString(),
                    "!"
                ]
            ],
            this.gameStarter.scenePlayer.bindRoutine("LevelUpStats", args)
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for displaying a Pokemon's statistics in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public LevelUpStats(settings: IBattleCutsceneSettings, args: IBattleLevelRoutineSettings): void {
        this.gameStarter.menus.openPokemonLevelUpStats({
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
        this.gameStarter.menuGrapher.setActiveMenu("LevelUpStats");

        console.warn("For stones, LevelUpStats should be taken out of battles.");
    }

    /**
     * Cutscene for a player choosing a Pokemon (creating the menu for it).
     */
    public PlayerChoosesPokemon(): void {
        this.gameStarter.menuGrapher.createMenu("Pokemon", {
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
    public ExitFail(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            "No! There's no running from a trainer battle!",
            this.gameStarter.scenePlayer.bindRoutine("BattleExitFailReturn"));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for returning to a battle after failing to exit.
     * 
     */
    public ExitFailReturn(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.battleMover.showPlayerMenu();
    }

    /**
     * Cutscene for becoming victorious in battle.
     */
    public Victory(): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const opponent: IBattler = battleInfo.battlers.opponent;

        if (!opponent.hasActors) {
            this.gameStarter.battleMover.closeBattle((): void => {
                this.gameStarter.actions.animateFadeFromColor({
                    color: "White"
                });
            });
            return;
        }

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "%%%%%%%PLAYER%%%%%%% defeated ",
                    [...opponent.name, "!"]
                ]
            ],
            this.gameStarter.scenePlayer.bindRoutine("VictorySpeech")
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the opponent responding to the player's victory.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public VictorySpeech(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const opponent: IThing = this.gameStarter.battleMover.setThing("opponent", battleInfo.battlers.opponent.sprite) as IThing;
        const timeout: number = 35;
        let opponentX: number;
        let opponentGoal: number;

        opponent.opacity = 0;

        this.gameStarter.physics.setTop(opponent, menu.top);
        this.gameStarter.physics.setLeft(opponent, menu.right);
        opponentX = this.gameStarter.physics.getMidX(opponent);
        opponentGoal = menu.right - opponent.width / 2;

        this.gameStarter.actions.animateFadeAttribute(opponent, "opacity", 4 / timeout, 1, 1);
        this.gameStarter.actions.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1,
            (): void => {
                this.gameStarter.menuGrapher.createMenu("GeneralText");
                this.gameStarter.menuGrapher.addMenuDialog(
                    "GeneralText",
                    battleInfo.textVictory!,
                    this.gameStarter.scenePlayer.bindRoutine("VictoryWinnings"));
                this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
            });
    }

    /**
     * Cutscene for receiving cash for defeating an opponent.
     * 
     * @param settings   Settings used for the cutscene
     */
    public VictoryWinnings(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const reward: number = battleInfo.battlers.opponent.reward!;
        const animationSettings: any = {
            color: "White"
        };
        const callback: () => void = (): void => {
            this.gameStarter.battleMover.closeBattle((): void => {
                this.gameStarter.actions.animateFadeFromColor(animationSettings);
            });
        };

        if (battleInfo.giftAfterBattle) {
            this.gameStarter.saves.addItemToBag(battleInfo.giftAfterBattle, battleInfo.giftAfterBattleAmount || 1);
        }

        if (battleInfo.badge) {
            this.gameStarter.itemsHolder.getItem("badges")[battleInfo.badge] = true;
        }

        if (battleInfo.textAfterBattle) {
            animationSettings.callback = (): void => {
                this.gameStarter.menuGrapher.createMenu("GeneralText");
                this.gameStarter.menuGrapher.addMenuDialog("GeneralText", battleInfo.textAfterBattle!);
                this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
            };
        }

        if (!reward) {
            callback();
            return;
        }

        this.gameStarter.itemsHolder.increase("money", reward);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% got $" + reward + " for winning!"
            ],
            callback);
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player being defeated in battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public Defeat(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const message: string[] = ["%%%%%%%PLAYER%%%%%%% is out of useable %%%%%%%POKEMON%%%%%%%!"];
        let callback: () => void;

        if (!battleInfo.noBlackout) {
            message.push("%%%%%%%PLAYER%%%%%%% blacked out!");
            callback = (): void => {
                const transport: ITransportSchema = this.gameStarter.itemsHolder.getItem("lastPokecenter");

                this.gameStarter.battleMover.closeBattle();
                this.gameStarter.maps.setMap(transport.map, transport.location);

                for (const pokemon of this.gameStarter.itemsHolder.getItem("PokemonInParty")) {
                    this.gameStarter.battles.healPokemon(pokemon);
                }

                this.gameStarter.saves.autoSave();
            };
        } else {
            callback = (): void => this.gameStarter.battleMover.closeBattle();
        }

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            message,
            (): void => {
                this.gameStarter.actions.animateFadeToColor({
                    color: "Black",
                    callback: callback
                });
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for a battle completely finishing.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public Complete(settings: IBattleCutsceneSettings): void {
        this.gameStarter.mapScreener.blockInputs = false;
        this.gameStarter.graphics.moveBattleKeptThingsBack(settings.battleInfo);
        this.gameStarter.itemsHolder.setItem("PokemonInParty", settings.battleInfo.battlers.player!.actors);
        this.gameStarter.modAttacher.fireEvent("onBattleComplete", settings.battleInfo);
        if (this.gameStarter.mapScreener.theme) {
            this.gameStarter.audioPlayer.playTheme(this.gameStarter.mapScreener.theme);
        }
    }

    /**
     * Cutscene for changing a statistic in battle.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public ChangeStatistic(settings: any, args: IBattleStatisticRoutineSettings): void {
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

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
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
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for a Growl attack in battle.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public AttackGrowl(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const defenderName: string = args.defenderName!;
        const attacker: IThing = this.gameStarter.battleMover.getThing(attackerName) as IThing;
        const defender: IThing = this.gameStarter.battleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const notes: IThing[] = [
            this.gameStarter.objectMaker.make("Note"),
            this.gameStarter.objectMaker.make("Note")
        ];
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        let startX: number;
        let startY: number;
        let animateNote: (note: IThing, dt: number) => void = (note: IThing, dt: number): void => {
            let flip: number = 1;
            let differenceX: number;
            let differenceY: number;

            if (direction === 1) {
                differenceX = menu.right - startX;
                differenceY = (menu.top + defender.height / 2) - startY;
            } else {
                differenceX = menu.left - startX;
                differenceY = (menu.bottom - defender.height) - startY;
            }

            for (let i: number = 1; i <= 4; i += 1) {
                this.gameStarter.timeHandler.addEvent(
                    (): void => {
                        this.gameStarter.physics.shiftHoriz(note, differenceX / 4);
                        if (flip === 1) {
                            this.gameStarter.physics.shiftVert(note, differenceY / 10 * 6);
                        } else {
                            this.gameStarter.physics.shiftVert(note, -1 * differenceY / 8);
                        }
                        flip *= -1;
                    },
                    dt * i);
            }
        };

        if (direction === 1) {
            startX = menu.left + attacker.width / 2;
            startY = menu.bottom - attacker.height;
        } else {
            startX = menu.right - attacker.width / 2;
            startY = menu.top + attacker.height;
        }

        this.gameStarter.things.add(notes[0], startX, startY);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.things.add(
                    notes[1],
                    startX + notes[1].width / 2,
                    startY + 4 * 3);
            },
            2);

        animateNote(notes[0], 10);
        animateNote(notes[1], 12);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.physics.killNormal(notes[0]),
            50);
        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.physics.killNormal(notes[1]),
            52);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateScreenShake(
                    3,
                    0,
                    6,
                    undefined,
                    this.gameStarter.scenePlayer.bindRoutine(
                        "ChangeStatistic",
                        {
                            callback: args.callback,
                            defenderName: defenderName,
                            statistic: "Attack",
                            amount: -1,
                            ...args
                        }));
            },
            50);
    }

    /**
     * Cutscene for a Tackle attack in battle.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public AttackTackle(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const defenderName: string = args.defenderName!;
        const attacker: IThing = this.gameStarter.battleMover.getThing(attackerName) as IThing;
        const defender: IThing = this.gameStarter.battleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        let xvel: number = 7 * direction;
        let dt: number = 7;
        const movement: ITimeEvent = this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                this.gameStarter.physics.shiftHoriz(attacker, xvel);
            },
            1,
            Infinity);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                xvel *= -1;
            },
            dt);

        this.gameStarter.timeHandler.addEvent(this.gameStarter.timeHandler.cancelEvent, dt * 2 - 1, movement);

        if (attackerName === "player") {
            this.gameStarter.timeHandler.addEvent(
                (): void => {
                    this.gameStarter.actions.animateFlicker(
                        defender,
                        14,
                        5,
                        args.callback);
                },
                dt * 2);
        } else {
            this.gameStarter.timeHandler.addEvent(
                (): void => {
                    this.gameStarter.actions.animateScreenShake(
                        0,
                        undefined,
                        undefined,
                        undefined,
                        (): void => {
                            this.gameStarter.actions.animateFlicker(
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
    public AttackTailWhip(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const defenderName: string = args.defenderName!;
        const attacker: IThing = this.gameStarter.battleMover.getThing(attackerName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const dt: number = 11;
        const dx: number = 16;

        this.gameStarter.physics.shiftHoriz(attacker, dx * direction);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.physics.shiftHoriz(attacker, -dx * direction),
            dt);
        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.physics.shiftHoriz(attacker, dx * direction),
            dt * 2);
        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.physics.shiftHoriz(attacker, -dx * direction),
            dt * 3);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateScreenShake(
                    3,
                    0,
                    6,
                    undefined,
                    this.gameStarter.scenePlayer.bindRoutine(
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
    public AttackScratch(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const defenderName: string = args.defenderName!;
        const defender: IThing = this.gameStarter.battleMover.getThing(defenderName) as IThing;
        const dt: number = 1;
        const direction: number = defenderName === "opponent" ? -1 : 1;
        const differenceX: number = defender.width / 2;
        const lineArray: IThing[] = [];
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const scratches: IThing[] = [
            this.gameStarter.objectMaker.make("ExplosionSmall"),
            this.gameStarter.objectMaker.make("ExplosionSmall"),
            this.gameStarter.objectMaker.make("ExplosionSmall")
        ];
        let startX: number;
        let startY: number;

        if (direction === -1) {
            startX = menu.right - defender.width / 2;
            startY = menu.top;
        } else {
            startX = menu.left + defender.width;
            startY = menu.bottom - (defender.height + 8);
        }

        this.gameStarter.things.add(scratches[0], startX, startY);
        const offset: number = scratches[0].width / 2;
        this.gameStarter.things.add(scratches[1], startX + offset * direction * -1, startY + offset);
        this.gameStarter.things.add(scratches[2], startX + offset * direction * -2, startY + offset * 2);

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                for (const scratch of scratches) {
                    const left: number = direction === -1 ? scratch.left : scratch.right - 3;
                    const top: number =  scratch.bottom - 3;

                    this.gameStarter.timeHandler.addEvent(
                        (): void => this.gameStarter.physics.shiftHoriz(scratch, differenceX * direction / 16),
                        dt);
                    this.gameStarter.timeHandler.addEvent(
                        (): void => this.gameStarter.physics.shiftVert(scratch, differenceX * direction / 16),
                        dt);

                    const line: IThing = this.gameStarter.things.add("ScratchLine", left, top);
                    if (direction === 1) {
                        this.gameStarter.graphics.flipHoriz(line);
                    }
                    lineArray.push(line);
                }
            },
            dt,
            16);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                for (const scratch of scratches) {
                    this.gameStarter.physics.killNormal(scratch);
                }

                for (const line of lineArray) {
                    this.gameStarter.physics.killNormal(line);
                }

                this.gameStarter.actions.animateFlicker(defender, 14, 5, args.callback);
            },
            17 * dt);
    }

    /**
     * Cutscene for an Ember attack in battle.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public AttackEmber(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const attacker: IThing = this.gameStarter.battleMover.getThing(attackerName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const xPositions: number[] = new Array(3);
        let yPosition: number;
        const animateEmber: (x: number, y: number) => void = (x: number, y: number): void => {
            const emberSmall: IThing = this.gameStarter.objectMaker.make("EmberSmall");
            this.gameStarter.things.add(emberSmall, x + 4, y + 12);
            this.gameStarter.actions.animateFlicker(emberSmall, 3, 6);

            this.gameStarter.timeHandler.addEvent(
                    (): void => {
                            const emberLarge: IThing = this.gameStarter.objectMaker.make("EmberLarge");
                            this.gameStarter.things.add(emberLarge, x, y);
                            this.gameStarter.actions.animateFlicker(
                                emberLarge,
                                3,
                                6,
                                (): void => {
                                    this.gameStarter.physics.killNormal(emberSmall);
                                    this.gameStarter.physics.killNormal(emberLarge);
                                });
                    },
                    6);
        };

        if (direction === 1) {
            xPositions[0] = menu.left + (attacker.width * 3 + 4);
            xPositions[1] = xPositions[0] + (menu.left + xPositions[0]) / 30;
            xPositions[2] = xPositions[0] + (menu.left + xPositions[0]) / 60;
            yPosition = menu.bottom - (attacker.height * 2 - 4);
        } else {
            // These positions are incorrect and need to be updated. See issue #327
            xPositions[0] = menu.right - attacker.width / 2;
            yPosition = menu.top + attacker.height;
        }

        for (let i: number = 0; i < 3; i += 1) {
            this.gameStarter.timeHandler.addEvent(
                (): void => {
                    animateEmber(xPositions[i], yPosition);
                },
                24 * i);
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateScreenShake(
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
    public AttackQuickAttack(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const defenderName: string = args.defenderName!;
        const attacker: IThing = this.gameStarter.battleMover.getThing(attackerName) as IThing;
        const defender: IThing = this.gameStarter.battleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;

        let xvel: number = -7 * direction;

        this.gameStarter.timeHandler.addEventInterval(
            (): void => this.gameStarter.physics.shiftHoriz(attacker, xvel),
            1,
            38);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                xvel *= -1;
            },
            20);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                attacker.hidden = !attacker.hidden;
            },
            15);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                attacker.hidden = !attacker.hidden;
                this.gameStarter.actions.animateFlicker(defender, 12, 6, args.callback);
            },
            40);

        const explosions: IThing[] = [
            this.gameStarter.objectMaker.make("ExplosionLarge"),
            this.gameStarter.objectMaker.make("ExplosionLarge"),
            this.gameStarter.objectMaker.make("ExplosionLarge")
        ];
        let startX: number[] = [];
        let startY: number[] = [];
        if (direction === -1) {
            startX[0] = menu.right - defender.width / 2;
            startY[0] = menu.top;
        } else {
            startX[0] = menu.left + (defender.width + 32);
            startY[0] = menu.bottom - (defender.height + 16);
            startX[1] = startX[0] + 6;
            startY[1] = startY[0] - 6;
            startX[2] = startX[1] + 6;
            startY[2] = startY[1] - 8;
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.things.add(explosions[0], startX[0], startY[0]);
                this.gameStarter.timeHandler.addEvent(
                    (): void => {
                        this.gameStarter.physics.killNormal(explosions[0]);
                        this.gameStarter.things.add(explosions[1], startX[1], startY[1]);
                    },
                    4);
                this.gameStarter.timeHandler.addEvent(
                    (): void => {
                        this.gameStarter.physics.killNormal(explosions[1]);
                        this.gameStarter.things.add(explosions[2], startX[2], startY[2]);
                    },
                    8);
                this.gameStarter.timeHandler.addEvent(
                    (): void => this.gameStarter.physics.killNormal(explosions[2]),
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
    public AttackBubble(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const unitsize: number = 4;
        const attackerName: string = args.attackerName!;
        const attacker: IThing = this.gameStarter.battleMover.getThing(attackerName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const xPositions: number[] = [];
        const yPositions: number[] = [];
        const animateBubble: (x: number, y: number, i: number) => void = (x: number, y: number, i: number): void => {
            if (i === 0) {
                const bubbleLarge: IThing = this.gameStarter.things.add("BubbleLarge", x, y);

                this.gameStarter.timeHandler.addEvent(
                    (): void => {
                        this.gameStarter.physics.killNormal(bubbleLarge);
                    },
                    4 * 24);
            } else if (i === 1) {
                const bubbleLarge: IThing = this.gameStarter.things.add("BubbleLarge", x, y);
                const bubblesSmall: IThing[] = [];

                for (let j: number = 0; j < 4; j += 1) {
                    bubblesSmall[j] = this.gameStarter.objectMaker.make("BubbleSmall");
                }

                this.gameStarter.things.add(bubblesSmall[0], x, y - 4 * unitsize);
                this.gameStarter.things.add(bubblesSmall[1], x + 4 * unitsize, y - 3 * unitsize);
                this.gameStarter.things.add(bubblesSmall[2], x + 8 * unitsize, y + 4 * unitsize);
                this.gameStarter.things.add(bubblesSmall[3], x, y + 8 * unitsize);

                this.gameStarter.timeHandler.addEvent(
                    (): void => {
                        this.gameStarter.physics.killNormal(bubbleLarge);
                        for (let j: number = 0; j < 4; j += 1) {
                            this.gameStarter.physics.killNormal(bubblesSmall[j]);
                        }
                    },
                    3 * 24);
            } else if (i === 2) {
                const bubblesLarge: IThing[] = [];
                const bubblesSmall: IThing[] = [];

                for (let j: number = 0; j < 3; j += 1) {
                    bubblesLarge[j] = this.gameStarter.objectMaker.make("BubbleLarge");
                    bubblesSmall[j] = this.gameStarter.objectMaker.make("BubbleSmall");
                }

                this.gameStarter.things.add(bubblesLarge[0], x, y - 4 * unitsize);
                this.gameStarter.things.add(bubblesLarge[1], x, y);
                this.gameStarter.things.add(bubblesLarge[2], x + 4 * unitsize, y - 2 * unitsize);
                this.gameStarter.things.add(bubblesSmall[0], x, y - 4 * unitsize);
                this.gameStarter.things.add(bubblesSmall[1], x + unitsize, y + 8 * unitsize);
                this.gameStarter.things.add(bubblesSmall[2], x + 8 * unitsize, y + 6 * unitsize);

                this.gameStarter.timeHandler.addEvent(
                    (): void => {
                        for (let j: number = 0; j < 4; j += 1) {
                            this.gameStarter.physics.killNormal(bubblesLarge[j]);
                            this.gameStarter.physics.killNormal(bubblesSmall[j]);
                        }
                    },
                    2 * 24);
            } else {
                const bubblesLarge: IThing[] = [];
                const bubblesSmall: IThing[] = [];

                for (let j: number = 0; j < 4; j += 1) {
                    bubblesLarge[j] = this.gameStarter.objectMaker.make("BubbleLarge");
                    bubblesSmall[j] = this.gameStarter.objectMaker.make("BubbleSmall");
                }

                this.gameStarter.things.add(bubblesLarge[0], x + 4 * unitsize, y + 12 * unitsize);
                this.gameStarter.things.add(bubblesLarge[1], x, y);
                this.gameStarter.things.add(bubblesLarge[2], x + 8 * unitsize, y + 4 * unitsize);
                this.gameStarter.things.add(bubblesSmall[0], x + 4 * unitsize, y - 4 * unitsize);
                this.gameStarter.things.add(bubblesSmall[1], x + 8 * unitsize, y);
                this.gameStarter.things.add(bubblesSmall[2], x, y + 12 * unitsize);
                this.gameStarter.timeHandler.addEvent(
                    (): void => {
                        for (let j: number = 0; j < 4; j += 1) {
                            this.gameStarter.physics.killNormal(bubblesLarge[j]);
                            this.gameStarter.physics.killNormal(bubblesSmall[j]);
                        }
                    },
                    24);
            }
        };

        if (direction === 1) {
            xPositions[0] = menu.left + (attacker.width + 6);
            xPositions[1] = xPositions[0] + 10 * unitsize;
            xPositions[2] = xPositions[1] + 10 * unitsize;
            xPositions[3] = xPositions[2] + 10 * unitsize;
            yPositions[0] = menu.bottom - (attacker.height * 2 - 4);
            yPositions[1] = yPositions[0];
            yPositions[2] = yPositions[1] - (menu.bottom - yPositions[1]) / 3;
            yPositions[3] = yPositions[2] - (menu.bottom - yPositions[1]) / 3;
        } else {
            // These positions are incorrect and need to be updated. See issue #343.
            xPositions[0] = menu.right - attacker.width / 2;
            yPositions[0] = menu.top + attacker.height;
        }

        for (let i: number = 0; i < 4; i += 1) {
            this.gameStarter.timeHandler.addEvent(
                (): void => {
                    animateBubble(xPositions[i], yPositions[i], i);
                },
                24 * i);
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateScreenShake(
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
    public AttackSandAttack(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const defenderName: string = args.defenderName!;
        const defender: IThing = this.gameStarter.battleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;

        const explosions: IThing[] = [
            this.gameStarter.objectMaker.make("ExplosionSmall"),
            this.gameStarter.objectMaker.make("ExplosionSmall"),
            this.gameStarter.objectMaker.make("ExplosionSmall")
        ];
        let startX: number[] = [];
        let startY: number;

        if (direction === -1) {
            // Enemy use
        } else {
            startX[0] = menu.left + (defender.width + 8);
            startX[1] = startX[0] + 5;
            startX[2] = startX[1] + 5;
            startY = menu.bottom - (defender.height + 10);
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.things.add(explosions[0], startX[0], startY);
            },
            4);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.physics.killNormal(explosions[0]);
                this.gameStarter.things.add(explosions[1], startX[1], startY);
            },
            8);
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.physics.killNormal(explosions[1]);
                this.gameStarter.things.add(explosions[2], startX[2], startY);
            },
            12);
        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.physics.killNormal(explosions[2]),
            16);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.animateScreenShake(
                    3,
                    0,
                    6,
                    undefined,
                    this.gameStarter.scenePlayer.bindRoutine(
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
    public AttackGust(_settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        const attackerName: string = args.attackerName!;
        const defenderName: string = args.defenderName!;
        const defender: IThing = this.gameStarter.battleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;

        const gusts: IThing[] = [];
        for (let i: number = 0; i < 8; i += 1) {
            if (i % 2 === 0) {
                gusts[i] = this.gameStarter.objectMaker.make("ExplosionSmall");
            } else {
                gusts[i] = this.gameStarter.objectMaker.make("ExplosionLarge");
            }
        }

        let gustX: number;
        let gustY: number;
        let gustDx: number;
        let gustDy: number;
        if (direction === -1) {
            // Enemy use
        } else {
            gustX = menu.left + (defender.width);
            gustY = menu.bottom - (defender.height);
            gustDx = 4;
            gustDy = -4;
        }

        for (let i: number = 0; i < 9; i += 1) {
            this.gameStarter.timeHandler.addEvent(
                (): void => {
                    if (i === 0) {
                        this.gameStarter.things.add(gusts[i], gustX, gustY);
                    } else if (i < 5) {
                        this.gameStarter.physics.killNormal(gusts[i - 1]);
                        this.gameStarter.things.add(gusts[i], gustX + (gustDx * i), gustY);
                    } else if (i < 8) {
                        this.gameStarter.physics.killNormal(gusts[i - 1]);
                        this.gameStarter.things.add(gusts[i], gustX + (gustDx * i), gustY + (gustDy * (i - 4)));
                    } else {
                        this.gameStarter.physics.killNormal(gusts[i - 1]);
                    }
                },
                5 * i);
        }

        const explosions: IThing[] = [
            this.gameStarter.objectMaker.make("ExplosionSmall"),
            this.gameStarter.objectMaker.make("ExplosionSmall"),
            this.gameStarter.objectMaker.make("ExplosionSmall")
        ];
        let startX: number[] = [];
        let startY: number[] = [];
        if (direction === -1) {
            // Enemy use
        } else {
            startX[0] = menu.left + (defender.width + 40);
            startY[0] = menu.bottom - (defender.height + 22);
            startX[1] = startX[0] - 16;
            startY[1] = startY[0] + 4;
            startX[2] = startX[1] + 10;
            startY[2] = startY[1] + 4;
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.things.add(explosions[0], startX[0], startY[0]);
                this.gameStarter.timeHandler.addEvent(
                    (): void => {
                        this.gameStarter.physics.killNormal(explosions[0]);
                        this.gameStarter.things.add(explosions[1], startX[1], startY[1]);
                    },
                    5);
                this.gameStarter.timeHandler.addEvent(
                    (): void => {
                        this.gameStarter.physics.killNormal(explosions[1]);
                        this.gameStarter.things.add(explosions[2], startX[2], startY[2]);
                    },
                    10);
                this.gameStarter.timeHandler.addEvent(
                    (): void => {
                        this.gameStarter.physics.killNormal(explosions[2]);
                        this.gameStarter.actions.animateFlicker(defender, 12, 6, args.callback);
                    },
                    15);
            },
            44);
    }
}
