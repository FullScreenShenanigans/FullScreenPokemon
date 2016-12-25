import { IActorExperience } from "battlemovr/lib/IBattleMovr";
import { IMenuWordSchema } from "menugraphr/lib/IMenuGraphr";
import { ITimeEvent } from "timehandlr/lib/ITimeHandlr";

import { Direction, DirectionAliases, DirectionOpposites, PokedexListingStatus } from "./Constants";
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
export class Cutscenes {
    /**
     * Cutscene for starting a battle with a spiral.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleTransitionLineSpiral(settings: ITransitionLineSpiralSettings): void {
        const unitsize: number = 4;
        const divisor: number = settings.divisor || 15;
        const screenWidth: number = this.mapScreener.width;
        const screenHeight: number = this.mapScreener.height;
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
                        this.physics.killNormal(other);
                    }
                }

                return;
            }

            switch (thing.direction) {
                case Direction.Top:
                    thing = this.objectMaker.make("BlackSquare", {
                        width: width / unitsize,
                        height: screenHeight / unitsize
                    });
                    this.things.add(
                        thing,
                        screenWidth - ((numTimes + 1) * width),
                        screenHeight - ((numTimes + 1) * divisor));
                    difference = -height;
                    destination = numTimes * height;
                    break;

                case Direction.Right:
                    thing = this.objectMaker.make("BlackSquare", {
                        width: screenWidth / unitsize,
                        height: height / unitsize
                    });
                    this.things.add(
                        thing,
                        numTimes * divisor - screenWidth,
                        screenHeight - (numTimes + 1) * height);
                    difference = width;
                    destination = screenWidth - numTimes * width;
                    break;

                case Direction.Bottom:
                    thing = this.objectMaker.make("BlackSquare", {
                        width: width / unitsize,
                        height: screenHeight / unitsize
                    });
                    this.things.add(
                        thing,
                        numTimes * width,
                        numTimes * height - screenHeight);
                    difference = height;
                    destination = screenHeight - numTimes * height;
                    break;

                case Direction.Left:
                    thing = this.objectMaker.make("BlackSquare", {
                        width: screenWidth / unitsize,
                        height: height / unitsize
                    });
                    this.things.add(
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

            this.graphics.moveBattleKeptThingsToText(settings.battleInfo!);

            this.timeHandler.addEventInterval(
                (): boolean => {
                    if (direction % 2 === 1) {
                        this.physics.shiftHoriz(thing, difference);
                    } else {
                        this.physics.shiftVert(thing, difference);
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
                    this.graphics.moveBattleKeptThingsToText(settings.battleInfo!);

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

            this.animations.animateFadeToColor({
                color: color,
                change: change,
                speed: speed,
                callback: (): void => {
                    this.animations.animateFadeFromColor({
                        color: color,
                        change: change,
                        speed: speed,
                        callback: repeater
                    });
                }
            });

            this.graphics.moveBattleKeptThingsToText(settings.battleInfo!);
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
        const menu: IMenu = this.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
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

        this.physics.setLeft(player, menu.right + player.width * 4);
        this.physics.setRight(opponent, menu.left);
        this.physics.setTop(opponent, menu.top);

        // They should be visible halfway through (2 * (1 / timeout))
        this.animations.animateFadeAttribute(player, "opacity", 2 / timeout, 1, 1);
        this.animations.animateFadeAttribute(opponent, "opacity", 2 / timeout, 1, 1);

        playerX = this.physics.getMidX(player);
        opponentX = this.physics.getMidX(opponent);
        playerGoal = menu.left + player.width * 4 / 2;
        opponentGoal = menu.right - opponent.width * 4 / 2;

        this.animations.animateSlideHorizontal(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        this.animations.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        this.storage.addPokemonToPokedex(battleInfo.battlers.opponent.actors[0].title, PokedexListingStatus.Seen);

        this.timeHandler.addEvent(this.scenePlayer.bindRoutine("OpeningText"), timeout);

        this.menuGrapher.setActiveMenu("GeneralText");
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
                this.timeHandler.addEvent(
                    (): void => this.scenePlayer.playRoutine(nextRoutine),
                    70);
            };
        } else {
            callback = this.scenePlayer.bindRoutine(nextRoutine);
        }

        this.menuGrapher.createMenu("BattlePlayerHealth");
        this.battles.addBattleDisplayPokeballs(
            this.menuGrapher.getMenu("BattlePlayerHealth") as IMenu,
            battleInfo.battlers.player!);

        if (battleInfo.battlers.opponent.hasActors) {
            this.menuGrapher.createMenu("BattleOpponentHealth");
            this.battles.addBattleDisplayPokeballs(
                this.menuGrapher.getMenu("BattleOpponentHealth") as IMenu,
                battleInfo.battlers.player!,
                true);
        } else {
            this.battles.addBattleDisplayPokemonHealth("opponent");
        }

        this.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: battleInfo.automaticMenus
        });
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    textStart[0], battleInfo.battlers.opponent.name, textStart[1]
                ]
            ],
            callback
        );
        this.menuGrapher.setActiveMenu("GeneralText");
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
        const menu: IMenu = this.menuGrapher.getMenu("GeneralText") as IMenu;
        const opponentX: number = this.physics.getMidX(opponent);
        const opponentGoal: number = menu.right + opponent.width * 4 / 2;
        const battleInfo: IBattleInfo = settings.battleInfo;
        const callback: string = battleInfo.battlers.opponent.hasActors
            ? "OpponentSendOut"
            : "PlayerIntro";
        const timeout: number = 49;
        const textOpponentSendOut: [string, string, string] = battleInfo.textOpponentSendOut || ["", "", ""];

        this.animations.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        this.timeHandler.addEvent(
            (): void => {
                this.animations.animateFadeAttribute(
                    opponent,
                    "opacity",
                    -2 / timeout,
                    0,
                    1);
            },
            (timeout / 2) | 0);

        this.menuGrapher.deleteMenu("BattleOpponentHealth");
        this.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.menuGrapher.addMenuDialog(
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
        this.menuGrapher.setActiveMenu("GeneralText");

        this.timeHandler.addEvent(
            this.scenePlayer.bindRoutine(
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
        const menu: IMenu = this.menuGrapher.getMenu("GeneralText") as IMenu;
        const playerX: number = this.physics.getMidX(player);
        const playerGoal: number = menu.left - player.width * 4 / 2;
        const battleInfo: IBattleInfo = settings.battleInfo;
        const textPlayerSendOut: [string, string] = battleInfo.textPlayerSendOut || ["", ""];
        const timeout: number = 24;

        this.menuGrapher.deleteMenu("BattlePlayerHealth");

        if (!battleInfo.battlers.player!.hasActors) {
            this.scenePlayer.playRoutine("ShowPlayerMenu");
            return;
        }

        this.animations.animateSlideHorizontal(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        this.timeHandler.addEvent(
            (): void => {
                this.animations.animateFadeAttribute(
                    player,
                    "opacity",
                    -2 / timeout,
                    0,
                    1);
            },
            (timeout / 2) | 0);

        this.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    textPlayerSendOut[0],
                    battleInfo.battlers.player!.actors[0].nickname,
                    textPlayerSendOut[1]
                ]
            ]
        );
        this.menuGrapher.setActiveMenu("GeneralText");

        this.timeHandler.addEvent(
            this.scenePlayer.bindRoutine(
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
        this.menuGrapher.deleteMenu("Yes/No");

        this.menuGrapher.createMenu("GeneralText");
        this.battleMover.showPlayerMenu();

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
        const left: number = menu.right - 4 * 8;
        const top: number = menu.top + 4 * 32;

        console.warn("Should reset *Normal statistics for opponent Pokemon.");

        settings.opponentLeft = left;
        settings.opponentTop = top;

        this.menuGrapher.setActiveMenu(undefined);

        this.animations.animateSmokeSmall(
            left,
            top,
            this.scenePlayer.bindRoutine("OpponentSendOutAppear", args)
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
        const pokemon: IThing = this.battleMover.setThing(
            "opponent",
            pokemonInfo.title.join("") + "Front") as IThing;

        console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);

        this.battles.addBattleDisplayPokemonHealth("opponent");
        this.storage.addPokemonToPokedex(pokemonInfo.title, PokedexListingStatus.Seen);

        if (args) {
            this.scenePlayer.playRoutine(args.nextRoutine!);
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
        const left: number = menu.left + 4 * 8;
        const top: number = menu.bottom - 4 * 8;

        console.warn("Should reset *Normal statistics for player Pokemon.");

        settings.playerLeft = left;
        settings.playerTop = top;

        this.menuGrapher.setActiveMenu(undefined);

        this.animations.animateSmokeSmall(
            left,
            top,
            this.scenePlayer.bindRoutine("PlayerSendOutAppear", args));
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
        const pokemon: IThing = this.battleMover.setThing(
            "player",
            pokemonInfo.title.join("") + "Back") as IThing;

        console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);

        this.battles.addBattleDisplayPokemonHealth("player");

        this.menuGrapher.createMenu("BattlePlayerHealthNumbers");
        this.battles.setBattleDisplayPokemonHealthBar("Player", pokemonInfo.HP, pokemonInfo.HPNormal);
        this.scenePlayer.playRoutine(args.nextRoutine!);
    }

    /**
     * Cutscene for the player attempting to switch a Pokemon with itself.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattlePlayerSwitchesSamePokemon(settings: IBattleCutsceneSettings): void {
        this.menuGrapher.createMenu("GeneralText", {
            backMenu: "PokemonMenuContext"
        });
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                settings.battleInfo.battlers.player!.selectedActor!.nickname, " is already out!"
            ]);
        this.menuGrapher.setActiveMenu("GeneralText");
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

        args.damage = this.mathDecider.compute("damage", choice, playerActor, opponentActor);

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    playerActor.nickname, " used ", choice + "!"
                ]
            ],
            this.scenePlayer.bindRoutine("MovePlayerAnimate", args)
        );
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for animating the player's chosen move.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleMovePlayerAnimate(_settings: any, args: IBattleMoveRoutineSettings): void {
        const choice: string = args.choicePlayer!;
        const move: IPokemonMoveListing = this.mathDecider.getConstant("moves")[choice];

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
                    this.menuGrapher.createMenu("GeneralText");
                    this.battleMover.showPlayerMenu();
                };
            } else {
                callback = (): void => {
                    this.timeHandler.addEvent(
                        (): void => this.scenePlayer.playRoutine("MoveOpponent", args),
                        7);
                };
            }

            this.scenePlayer.playRoutine("Damage", {
                battlerName: "opponent",
                damage: args.damage,
                callback: callback
            });
        };

        // @todo: When all moves have been implemented, this will be simplified.
        if (!this.scenePlayer.getOtherRoutine("Attack" + choice.replace(" ", ""))) {
            console.warn(choice + " attack animation not implemented...");
            args.callback();
        } else {
            this.scenePlayer.playRoutine("Attack" + choice.replace(" ", ""), args);
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

        args.damage = this.mathDecider.compute("damage", choice, opponentActor, playerActor);

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    opponentActor.nickname, " used ", choice + "!"
                ]
            ],
            this.scenePlayer.bindRoutine("MoveOpponentAnimate", args));
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for animating an opponent's chosen move.
     * 
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleMoveOpponentAnimate(_settings: IBattleCutsceneSettings, args: IBattleMoveRoutineSettings): void {
        const choice: string = args.choiceOpponent!;
        const move: string = this.mathDecider.getConstant("moves")[choice];

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
                    this.menuGrapher.createMenu("GeneralText");
                    this.battleMover.showPlayerMenu();
                };
            } else {
                callback = (): void => {
                    this.timeHandler.addEvent(
                        (): void => this.scenePlayer.playRoutine("MovePlayer", args),
                        7);
                };
            }

            this.scenePlayer.playRoutine("Damage", {
                battlerName: "player",
                damage: args.damage,
                callback: callback
            });
        };

        // @todo: When all moves have been implemented, this will be simplified.
        if (!this.scenePlayer.getOtherRoutine("Attack" + choice.replace(" ", ""))) {
            console.warn(choice + " attack animation not implemented...");
            args.callback();
        } else {
            this.scenePlayer.playRoutine("Attack" + choice.replace(" ", ""), args);
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
        const battleInfo: IBattleInfo = this.battleMover.getBattleInfo() as IBattleInfo;
        const battler: IBattler = battleInfo.battlers[battlerName]!;
        const actor: IPokemon = battler.selectedActor as IPokemon;
        const hpStart: number = actor.HP;
        const hpEnd: number = Math.max(hpStart - damage, 0);
        const callback: (() => void) | undefined = hpEnd === 0
            ? (): void => {
                this.timeHandler.addEvent(
                    (): void => {
                        this.scenePlayer.playRoutine(
                            "PokemonFaints",
                            {
                                battlerName: battlerName
                            });
                    },
                    49);
            }
            : args.callback;

        if (damage !== 0) {
            this.battles.animateBattleDisplayPokemonHealthBar(
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
        const battleInfo: IBattleInfo = this.battleMover.getBattleInfo() as IBattleInfo;
        const actor: IPokemon = battleInfo.battlers[battlerName]!.selectedActor!;
        const thing: IThing = settings.things[battlerName];
        const blank: IThing = this.objectMaker.make(
            "WhiteSquare",
            {
                width: thing.width * thing.scale,
                height: thing.height * thing.scale
            });
        const texts: IThing[] = this.groupHolder.getGroup("Text") as IThing[];
        const background: IThing = this.battleMover.getBackgroundThing() as IThing;
        const backgroundIndex: number = texts.indexOf(background);
        const nextRoutine: string = battlerName === "player"
            ? "AfterPlayerPokemonFaints" : "AfterOpponentPokemonFaints";

        this.things.add(
            blank,
            thing.left,
            thing.top + thing.height * thing.scale * 4);

        this.utilities.arrayToIndex(blank, texts, backgroundIndex + 1);
        this.utilities.arrayToIndex(thing, texts, backgroundIndex + 1);

        this.animations.animateSlideVertical(
            thing,
            4 * 2,
            this.physics.getMidY(thing) + thing.height * thing.scale * 4,
            1,
            (): void => {
                this.physics.killNormal(thing);
                this.physics.killNormal(blank);
                this.menuGrapher.createMenu("GeneralText");
                this.menuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        [
                            actor.nickname, " fainted!"
                        ]
                    ],
                    this.scenePlayer.bindRoutine(nextRoutine, args)
                );
                this.menuGrapher.setActiveMenu("GeneralText");
            });

        this.modAttacher.fireEvent("onFaint", actor, battleInfo.battlers.player!.actors);
    }

    /**
     * Cutscene for choosing what to do after a Pokemon faints in battle.
     */
    public cutsceneBattleAfterPlayerPokemonFaints(): void {
        const battleInfo: IBattleInfo = this.battleMover.getBattleInfo() as IBattleInfo;
        const actorAvailable: boolean = this.utilities.checkArrayMembersIndex(battleInfo.battlers.player!.actors, "HP");

        if (actorAvailable) {
            this.scenePlayer.playRoutine("PlayerChoosesPokemon");
        } else {
            this.scenePlayer.playRoutine("Defeat");
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
        const actorAvailable: boolean = this.utilities.checkArrayMembersIndex(opponent.actors, "HP");
        const experienceGained: number = this.mathDecider.compute(
            "experienceGained", battleInfo.battlers.player!, battleInfo.battlers.opponent);
        let callback: Function;

        if (actorAvailable) {
            callback = this.scenePlayer.bindRoutine("OpponentSwitchesPokemon");
        } else {
            callback = this.scenePlayer.bindRoutine("Victory");
        }

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    battleInfo.battlers.player!.selectedActor!.nickname,
                    " gained ",
                    experienceGained.toString(),
                    " EXP. points!"
                ]
            ],
            this.scenePlayer.bindRoutine(
                "ExperienceGain",
                {
                    experienceGained: experienceGained,
                    callback: callback
                }
            ));
        this.menuGrapher.setActiveMenu("GeneralText");
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

        this.battleMover.switchActor("opponent", opponent.selectedIndex + 1);

        this.menuGrapher.createMenu("GeneralText", {
            deleteOnFinish: false
        });
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                opponent.name,
                "is about to use",
                nicknameExclaim,
                "Will %%%%%%%PLAYER%%%%%%% change %%%%%%%POKEMON%%%%%%%?"
            ],
            (): void => {
                this.menuGrapher.createMenu("Yes/No");
                this.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "Yes",
                            callback: this.scenePlayer.bindRoutine(
                                "PlayerSwitchesPokemon",
                                {
                                    nextRoutine: "OpponentSendOut"
                                })
                        }, {
                            text: "No",
                            callback: this.scenePlayer.bindRoutine(
                                "OpponentSendOut",
                                {
                                    nextRoutine: "ShowPlayerMenu"
                                })
                        }]
                });
                this.menuGrapher.setActiveMenu("Yes/No");
            }
        );
        this.menuGrapher.setActiveMenu("GeneralText");

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
            this.scenePlayer.playRoutine("LevelUp", {
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
        actor.experience = this.mathDecider.compute(
            "newPokemonExperience", actor.title, actor.level);

        console.warn("Leveling up does not yet increase stats...");

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    actor.nickname,
                    " grew to level ",
                    actor.level.toString(),
                    "!"
                ]
            ],
            this.scenePlayer.bindRoutine("LevelUpStats", args)
        );
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for displaying a Pokemon's statistics in battle.
     * 
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneBattleLevelUpStats(settings: IBattleCutsceneSettings, args: IBattleLevelRoutineSettings): void {
        this.menus.openPokemonLevelUpStats({
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
        this.menuGrapher.setActiveMenu("LevelUpStats");

        console.warn("For stones, LevelUpStats should be taken out of battles.");
    }

    /**
     * Cutscene for a player choosing a Pokemon (creating the menu for it).
     */
    public cutsceneBattlePlayerChoosesPokemon(): void {
        this.menuGrapher.createMenu("Pokemon", {
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
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            "No! There's no running from a trainer battle!",
            this.scenePlayer.bindRoutine("BattleExitFailReturn"));
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for returning to a battle after failing to exit.
     * 
     */
    public cutsceneBattleExitFailReturn(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.battleMover.showPlayerMenu();
    }

    /**
     * Cutscene for becoming victorious in battle.
     */
    public cutsceneBattleVictory(): void {
        const battleInfo: IBattleInfo = this.battleMover.getBattleInfo() as IBattleInfo;
        const opponent: IBattler = battleInfo.battlers.opponent;

        if (!opponent.hasActors) {
            this.battleMover.closeBattle((): void => {
                this.animations.animateFadeFromColor({
                    color: "White"
                });
            });
            return;
        }

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "%%%%%%%PLAYER%%%%%%% defeated ",
                    opponent.name,
                    "!"
                ]
            ],
            this.scenePlayer.bindRoutine("VictorySpeech")
        );
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the opponent responding to the player's victory.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleVictorySpeech(settings: IBattleCutsceneSettings): void {
        const battleInfo: IBattleInfo = settings.battleInfo;
        const menu: IMenu = this.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const opponent: IThing = this.battleMover.setThing("opponent", battleInfo.battlers.opponent.sprite) as IThing;
        const timeout: number = 35;
        let opponentX: number;
        let opponentGoal: number;

        opponent.opacity = 0;

        this.physics.setTop(opponent, menu.top);
        this.physics.setLeft(opponent, menu.right);
        opponentX = this.physics.getMidX(opponent);
        opponentGoal = menu.right - opponent.width * 4 / 2;

        this.animations.animateFadeAttribute(opponent, "opacity", 4 / timeout, 1, 1);
        this.animations.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1,
            (): void => {
                this.menuGrapher.createMenu("GeneralText");
                this.menuGrapher.addMenuDialog(
                    "GeneralText",
                    battleInfo.textVictory!,
                    this.scenePlayer.bindRoutine("VictoryWinnings"));
                this.menuGrapher.setActiveMenu("GeneralText");
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
            this.battleMover.closeBattle((): void => {
                this.animations.animateFadeFromColor(animationSettings);
            });
        };

        if (battleInfo.giftAfterBattle) {
            this.storage.addItemToBag(battleInfo.giftAfterBattle, battleInfo.giftAfterBattleAmount || 1);
        }

        if (battleInfo.badge) {
            this.itemsHolder.getItem("badges")[battleInfo.badge] = true;
        }

        if (battleInfo.textAfterBattle) {
            animationSettings.callback = (): void => {
                this.menuGrapher.createMenu("GeneralText");
                this.menuGrapher.addMenuDialog("GeneralText", battleInfo.textAfterBattle!);
                this.menuGrapher.setActiveMenu("GeneralText");
            };
        }

        if (!reward) {
            callback();
            return;
        }

        this.itemsHolder.increase("money", reward);

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% got $" + reward + " for winning!"
            ],
            callback);
        this.menuGrapher.setActiveMenu("GeneralText");
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
                let transport: ITransportSchema = this.itemsHolder.getItem("lastPokecenter");

                this.battleMover.closeBattle();
                this.maps.setMap(transport.map, transport.location);

                for (const pokemon of this.itemsHolder.getItem("PokemonInParty")) {
                    this.battles.healPokemon(pokemon);
                }

                this.storage.autoSave();
            };
        } else {
            callback = (): void => this.battleMover.closeBattle();
        }

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            message,
            (): void => {
                this.animations.animateFadeToColor({
                    color: "Black",
                    callback: callback
                });
            });
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for a battle completely finishing.
     * 
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneBattleComplete(settings: IBattleCutsceneSettings): void {
        this.mapScreener.blockInputs = false;
        this.graphics.moveBattleKeptThingsBack(settings.battleInfo);
        this.itemsHolder.setItem("PokemonInParty", settings.battleInfo.battlers.player!.actors);
        this.modAttacher.fireEvent("onBattleComplete", settings.battleInfo);
        if (this.mapScreener.theme) {
            this.audioPlayer.playTheme(this.mapScreener.theme);
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

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
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
        this.menuGrapher.setActiveMenu("GeneralText");
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
        const attacker: IThing = this.battleMover.getThing(attackerName) as IThing;
        const defender: IThing = this.battleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const notes: IThing[] = [
            this.objectMaker.make("Note"),
            this.objectMaker.make("Note")
        ];
        const menu: IMenu = this.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        let startX: number;
        let startY: number;
        let animateNote: (note: IThing, dt: number) => void = (note: IThing, dt: number): void => {
            let flip: number = 1;
            let differenceX: number;
            let differenceY: number;

            if (direction === 1) {
                differenceX = menu.right - startX;
                differenceY = (menu.top + defender.height / 2 * 4) - startY;
            } else {
                differenceX = menu.left - startX;
                differenceY = (menu.bottom - defender.height * 4) - startY;
            }

            for (let i: number = 1; i <= 4; i += 1) {
                this.timeHandler.addEvent(
                    (): void => {
                        this.physics.shiftHoriz(note, differenceX / 4);
                        if (flip === 1) {
                            this.physics.shiftVert(note, differenceY / 10 * 6);
                        } else {
                            this.physics.shiftVert(note, -1 * differenceY / 8);
                        }
                        flip *= -1;
                    },
                    dt * i);
            }
        };

        if (direction === 1) {
            startX = menu.left + attacker.width / 2 * 4;
            startY = menu.bottom - attacker.height * 4;
        } else {
            startX = menu.right - attacker.width / 2 * 4;
            startY = menu.top + attacker.height * 4;
        }

        this.things.add(notes[0], startX, startY);
        this.timeHandler.addEvent(
            (): void => {
                this.things.add(
                    notes[1],
                    startX + notes[1].width / 2 * 4,
                    startY + 4 * 3);
            },
            2);

        animateNote(notes[0], 10);
        animateNote(notes[1], 12);

        this.timeHandler.addEvent(
            (): void => this.physics.killNormal(notes[0]),
            50);
        this.timeHandler.addEvent(
            (): void => this.physics.killNormal(notes[1]),
            52);

        this.timeHandler.addEvent(
            (): void => {
                this.animations.animateScreenShake(
                    3,
                    0,
                    6,
                    undefined,
                    this.scenePlayer.bindRoutine(
                        "ChangeStatistic",
                        this.utilities.proliferate(
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
        const attacker: IThing = this.battleMover.getThing(attackerName) as IThing;
        const defender: IThing = this.battleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        let xvel: number = 7 * direction;
        let dt: number = 7;
        const movement: ITimeEvent = this.timeHandler.addEventInterval(
            (): void => {
                this.physics.shiftHoriz(attacker, xvel);
            },
            1,
            Infinity);

        this.timeHandler.addEvent(
            (): void => {
                xvel *= -1;
            },
            dt);

        this.timeHandler.addEvent(this.timeHandler.cancelEvent, dt * 2 - 1, movement);

        if (attackerName === "player") {
            this.timeHandler.addEvent(
                (): void => {
                    this.animations.animateFlicker(
                        defender,
                        14,
                        5,
                        args.callback);
                },
                dt * 2);
        } else {
            this.timeHandler.addEvent(
                (): void => {
                    this.animations.animateScreenShake(
                        0,
                        undefined,
                        undefined,
                        undefined,
                        (): void => {
                            this.animations.animateFlicker(
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
        const attacker: IThing = this.battleMover.getThing(attackerName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const dt: number = 11;
        const dx: number = 4 * 4;

        this.physics.shiftHoriz(attacker, dx * direction);

        this.timeHandler.addEvent(
            (): void => this.physics.shiftHoriz(attacker, -dx * direction),
            dt);
        this.timeHandler.addEvent(
            (): void => this.physics.shiftHoriz(attacker, dx * direction),
            dt * 2);
        this.timeHandler.addEvent(
            (): void => this.physics.shiftHoriz(attacker, -dx * direction),
            dt * 3);

        this.timeHandler.addEvent(
            (): void => {
                this.animations.animateScreenShake(
                    3,
                    0,
                    6,
                    undefined,
                    this.scenePlayer.bindRoutine(
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
        const defender: IThing = this.battleMover.getThing(defenderName) as IThing;
        const dt: number = 1;
        const direction: number = defenderName === "opponent" ? -1 : 1;
        const differenceX: number = defender.width / 2 * 4;
        const lineArray: IThing[] = [];
        const menu: IMenu = this.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const scratches: IThing[] = [
            this.objectMaker.make("ExplosionSmall"),
            this.objectMaker.make("ExplosionSmall"),
            this.objectMaker.make("ExplosionSmall")
        ];
        let startX: number;
        let startY: number;

        if (direction === -1) {
            startX = menu.right - defender.width / 2 * 4;
            startY = menu.top;
        } else {
            startX = menu.left + defender.width * 4;
            startY = menu.bottom - (defender.height + 8) * 4;
        }

        this.things.add(scratches[0], startX, startY);
        const offset: number = scratches[0].width * 4 / 2;
        this.things.add(scratches[1], startX + offset * direction * -1, startY + offset);
        this.things.add(scratches[2], startX + offset * direction * -2, startY + offset * 2);

        this.timeHandler.addEventInterval(
            (): void => {
                for (const scratch of scratches) {
                    const left: number = direction === -1 ? scratch.left : scratch.right - 3 * 4;
                    const top: number =  scratch.bottom - 3 * 4;

                    this.timeHandler.addEvent(
                        (): void => this.physics.shiftHoriz(scratch, differenceX * direction / 16),
                        dt);
                    this.timeHandler.addEvent(
                        (): void => this.physics.shiftVert(scratch, differenceX * direction / 16),
                        dt);

                    const line: IThing = this.things.add("ScratchLine", left, top);
                    if (direction === 1) {
                        this.graphics.flipHoriz(line);
                    }
                    lineArray.push(line);
                }
            },
            dt,
            16);

        this.timeHandler.addEvent(
            (): void => {
                for (const scratch of scratches) {
                    this.physics.killNormal(scratch);
                }

                for (const line of lineArray) {
                    this.physics.killNormal(line);
                }

                this.animations.animateFlicker(defender, 14, 5, args.callback);
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
        const attacker: IThing = this.battleMover.getThing(attackerName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const xPositions: number[] = new Array(3);
        let yPosition: number;
        const animateEmber: (x: number, y: number) => void = (x: number, y: number): void => {
            const emberSmall: IThing = this.objectMaker.make("EmberSmall");
            this.things.add(emberSmall, x + 4, y + 12);
            this.animations.animateFlicker(emberSmall, 3, 6);

            this.timeHandler.addEvent(
                    (): void => {
                            const emberLarge: IThing = this.objectMaker.make("EmberLarge");
                            this.things.add(emberLarge, x, y);
                            this.animations.animateFlicker(
                                emberLarge,
                                3,
                                6,
                                (): void => {
                                    this.physics.killNormal(emberSmall);
                                    this.physics.killNormal(emberLarge);
                                });
                    },
                    6);
        };

        if (direction === 1) {
            xPositions[0] = menu.left + (attacker.width * 3 + 4) * 4;
            xPositions[1] = xPositions[0] + (menu.left + xPositions[0]) / 30;
            xPositions[2] = xPositions[0] + (menu.left + xPositions[0]) / 60;
            yPosition = menu.bottom - (attacker.height * 2 - 4) * 4;
        } else {
            // These positions are incorrect and need to be updated. See issue #327
            xPositions[0] = menu.right - attacker.width / 2 * 4;
            yPosition = menu.top + attacker.height * 4;
        }

        for (let i: number = 0; i < 3; i += 1) {
            this.timeHandler.addEvent(
                (): void => {
                    animateEmber(xPositions[i], yPosition);
                },
                24 * i);
        }

        this.timeHandler.addEvent(
            (): void => {
                this.animations.animateScreenShake(
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
        const attacker: IThing = this.battleMover.getThing(attackerName) as IThing;
        const defender: IThing = this.battleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;

        let xvel: number = -7 * direction;

        this.timeHandler.addEventInterval(
            (): void => this.physics.shiftHoriz(attacker, xvel),
            1,
            38);
        this.timeHandler.addEvent(
            (): void => {
                xvel *= -1;
            },
            20);
        this.timeHandler.addEvent(
            (): void => {
                attacker.hidden = !attacker.hidden;
            },
            15);
        this.timeHandler.addEvent(
            (): void => {
                attacker.hidden = !attacker.hidden;
                this.animations.animateFlicker(defender, 12, 6, args.callback);
            },
            40);

        const explosions: IThing[] = [
            this.objectMaker.make("ExplosionLarge"),
            this.objectMaker.make("ExplosionLarge"),
            this.objectMaker.make("ExplosionLarge")
        ];
        let startX: number[] = [];
        let startY: number[] = [];
        if (direction === -1) {
            startX[0] = menu.right - defender.width / 2 * 4;
            startY[0] = menu.top;
        } else {
            startX[0] = menu.left + (defender.width + 32) * 4;
            startY[0] = menu.bottom - (defender.height + 16) * 4;
            startX[1] = startX[0] + 6 * 4;
            startY[1] = startY[0] - 6 * 4;
            startX[2] = startX[1] + 6 * 4;
            startY[2] = startY[1] - 8 * 4;
        }

        this.timeHandler.addEvent(
            (): void => {
                this.things.add(explosions[0], startX[0], startY[0]);
                this.timeHandler.addEvent(
                    (): void => {
                        this.physics.killNormal(explosions[0]);
                        this.things.add(explosions[1], startX[1], startY[1]);
                    },
                    4);
                this.timeHandler.addEvent(
                    (): void => {
                        this.physics.killNormal(explosions[1]);
                        this.things.add(explosions[2], startX[2], startY[2]);
                    },
                    8);
                this.timeHandler.addEvent(
                    (): void => this.physics.killNormal(explosions[2]),
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
        const unitsize: number = 4;
        const attackerName: string = args.attackerName!;
        const attacker: IThing = this.battleMover.getThing(attackerName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
        const xPositions: number[] = [];
        const yPositions: number[] = [];
        const animateBubble: (x: number, y: number, i: number) => void = (x: number, y: number, i: number): void => {
            if (i === 0) {
                const bubbleLarge: IThing = this.things.add("BubbleLarge", x, y);

                this.timeHandler.addEvent(
                    (): void => {
                        this.physics.killNormal(bubbleLarge);
                    },
                    4 * 24);
            } else if (i === 1) {
                const bubbleLarge: IThing = this.things.add("BubbleLarge", x, y);
                const bubblesSmall: IThing[] = [];

                for (let j: number = 0; j < 4; j += 1) {
                    bubblesSmall[j] = this.objectMaker.make("BubbleSmall");
                }

                this.things.add(bubblesSmall[0], x, y - 4 * unitsize);
                this.things.add(bubblesSmall[1], x + 4 * unitsize, y - 3 * unitsize);
                this.things.add(bubblesSmall[2], x + 8 * unitsize, y + 4 * unitsize);
                this.things.add(bubblesSmall[3], x, y + 8 * unitsize);

                this.timeHandler.addEvent(
                    (): void => {
                        this.physics.killNormal(bubbleLarge);
                        for (let j: number = 0; j < 4; j += 1) {
                            this.physics.killNormal(bubblesSmall[j]);
                        }
                    },
                    3 * 24);
            } else if (i === 2) {
                const bubblesLarge: IThing[] = [];
                const bubblesSmall: IThing[] = [];

                for (let j: number = 0; j < 3; j += 1) {
                    bubblesLarge[j] = this.objectMaker.make("BubbleLarge");
                    bubblesSmall[j] = this.objectMaker.make("BubbleSmall");
                }

                this.things.add(bubblesLarge[0], x, y - 4 * unitsize);
                this.things.add(bubblesLarge[1], x, y);
                this.things.add(bubblesLarge[2], x + 4 * unitsize, y - 2 * unitsize);
                this.things.add(bubblesSmall[0], x, y - 4 * unitsize);
                this.things.add(bubblesSmall[1], x + unitsize, y + 8 * unitsize);
                this.things.add(bubblesSmall[2], x + 8 * unitsize, y + 6 * unitsize);

                this.timeHandler.addEvent(
                    (): void => {
                        for (let j: number = 0; j < 4; j += 1) {
                            this.physics.killNormal(bubblesLarge[j]);
                            this.physics.killNormal(bubblesSmall[j]);
                        }
                    },
                    2 * 24);
            } else {
                const bubblesLarge: IThing[] = [];
                const bubblesSmall: IThing[] = [];

                for (let j: number = 0; j < 4; j += 1) {
                    bubblesLarge[j] = this.objectMaker.make("BubbleLarge");
                    bubblesSmall[j] = this.objectMaker.make("BubbleSmall");
                }

                this.things.add(bubblesLarge[0], x + 4 * unitsize, y + 12 * unitsize);
                this.things.add(bubblesLarge[1], x, y);
                this.things.add(bubblesLarge[2], x + 8 * unitsize, y + 4 * unitsize);
                this.things.add(bubblesSmall[0], x + 4 * unitsize, y - 4 * unitsize);
                this.things.add(bubblesSmall[1], x + 8 * unitsize, y);
                this.things.add(bubblesSmall[2], x, y + 12 * unitsize);
                this.timeHandler.addEvent(
                    (): void => {
                        for (let j: number = 0; j < 4; j += 1) {
                            this.physics.killNormal(bubblesLarge[j]);
                            this.physics.killNormal(bubblesSmall[j]);
                        }
                    },
                    24);
            }
        };

        if (direction === 1) {
            xPositions[0] = menu.left + (attacker.width + 6) * 4;
            xPositions[1] = xPositions[0] + 10 * unitsize;
            xPositions[2] = xPositions[1] + 10 * unitsize;
            xPositions[3] = xPositions[2] + 10 * unitsize;
            yPositions[0] = menu.bottom - (attacker.height * 2 - 4) * 4;
            yPositions[1] = yPositions[0];
            yPositions[2] = yPositions[1] - (menu.bottom - yPositions[1]) / 3;
            yPositions[3] = yPositions[2] - (menu.bottom - yPositions[1]) / 3;
        } else {
            // These positions are incorrect and need to be updated. See issue #343.
            xPositions[0] = menu.right - attacker.width / 2 * 4;
            yPositions[0] = menu.top + attacker.height * 4;
        }

        for (let i: number = 0; i < 4; i += 1) {
            this.timeHandler.addEvent(
                (): void => {
                    animateBubble(xPositions[i], yPositions[i], i);
                },
                24 * i);
        }

        this.timeHandler.addEvent(
            (): void => {
                this.animations.animateScreenShake(
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
        const defender: IThing = this.battleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;

        const explosions: IThing[] = [
            this.objectMaker.make("ExplosionSmall"),
            this.objectMaker.make("ExplosionSmall"),
            this.objectMaker.make("ExplosionSmall")
        ];
        let startX: number[] = [];
        let startY: number;

        if (direction === -1) {
            // Enemy use
        } else {
            startX[0] = menu.left + (defender.width + 8) * 4;
            startX[1] = startX[0] + 5 * 4;
            startX[2] = startX[1] + 5 * 4;
            startY = menu.bottom - (defender.height + 10) * 4;
        }

        this.timeHandler.addEvent(
            (): void => {
                this.things.add(explosions[0], startX[0], startY);
            },
            4);
        this.timeHandler.addEvent(
            (): void => {
                this.physics.killNormal(explosions[0]);
                this.things.add(explosions[1], startX[1], startY);
            },
            8);
        this.timeHandler.addEvent(
            (): void => {
                this.physics.killNormal(explosions[1]);
                this.things.add(explosions[2], startX[2], startY);
            },
            12);
        this.timeHandler.addEvent(
            (): void => this.physics.killNormal(explosions[2]),
            16);

        this.timeHandler.addEvent(
            (): void => {
                this.animations.animateScreenShake(
                    3,
                    0,
                    6,
                    undefined,
                    this.scenePlayer.bindRoutine(
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
        const defender: IThing = this.battleMover.getThing(defenderName) as IThing;
        const direction: number = attackerName === "player" ? 1 : -1;
        const menu: IMenu = this.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;

        const gusts: IThing[] = [];
        for (let i: number = 0; i < 8; i += 1) {
            if (i % 2 === 0) {
                gusts[i] = this.objectMaker.make("ExplosionSmall");
            } else {
                gusts[i] = this.objectMaker.make("ExplosionLarge");
            }
        }

        let gustX: number;
        let gustY: number;
        let gustDx: number;
        let gustDy: number;
        if (direction === -1) {
            // Enemy use
        } else {
            gustX = menu.left + (defender.width) * 4;
            gustY = menu.bottom - (defender.height) * 4;
            gustDx = 4 * 4;
            gustDy = -4 * 4;
        }

        for (let i: number = 0; i < 9; i += 1) {
            this.timeHandler.addEvent(
                (): void => {
                    if (i === 0) {
                        this.things.add(gusts[i], gustX, gustY);
                    } else if (i < 5) {
                        this.physics.killNormal(gusts[i - 1]);
                        this.things.add(gusts[i], gustX + (gustDx * i), gustY);
                    } else if (i < 8) {
                        this.physics.killNormal(gusts[i - 1]);
                        this.things.add(gusts[i], gustX + (gustDx * i), gustY + (gustDy * (i - 4)));
                    } else {
                        this.physics.killNormal(gusts[i - 1]);
                    }
                },
                5 * i);
        }

        const explosions: IThing[] = [
            this.objectMaker.make("ExplosionSmall"),
            this.objectMaker.make("ExplosionSmall"),
            this.objectMaker.make("ExplosionSmall")
        ];
        let startX: number[] = [];
        let startY: number[] = [];
        if (direction === -1) {
            // Enemy use
        } else {
            startX[0] = menu.left + (defender.width + 40) * 4;
            startY[0] = menu.bottom - (defender.height + 22) * 4;
            startX[1] = startX[0] - 16 * 4;
            startY[1] = startY[0] + 4 * 4;
            startX[2] = startX[1] + 10 * 4;
            startY[2] = startY[1] + 4 * 4;
        }

        this.timeHandler.addEvent(
            (): void => {
                this.things.add(explosions[0], startX[0], startY[0]);
                this.timeHandler.addEvent(
                    (): void => {
                        this.physics.killNormal(explosions[0]);
                        this.things.add(explosions[1], startX[1], startY[1]);
                    },
                    5);
                this.timeHandler.addEvent(
                    (): void => {
                        this.physics.killNormal(explosions[1]);
                        this.things.add(explosions[2], startX[2], startY[2]);
                    },
                    10);
                this.timeHandler.addEvent(
                    (): void => {
                        this.physics.killNormal(explosions[2]);
                        this.animations.animateFlicker(defender, 12, 6, args.callback);
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
        this.animations.animateCharacterPreventWalking(this.player);
        this.animations.animateExclamation(
            settings.triggerer,
            70,
            this.scenePlayer.bindRoutine("Approach"));
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
        const blocks: number = Math.max(0, distance / 4 / 8);

        if (blocks) {
            this.animations.animateCharacterStartWalking(
                triggerer,
                direction,
                [
                    blocks,
                    this.scenePlayer.bindRoutine("Dialog")
                ]
            );
        } else {
            this.scenePlayer.playRoutine("Dialog");
        }
    }

    /**
     * Cutscene for a trainer introduction after the player is approached.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneTrainerSpottedDialog(settings: any): void {
        this.collisions.collideCharacterDialog(settings.player, settings.triggerer);
        this.mapScreener.blockInputs = false;
    }

    /**
     * Cutscene for a nurse's welcome at the Pokemon Center.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutscenePokeCenterWelcome(settings: any): void {
        settings.nurse = this.utilities.getThingById(settings.nurseId || "Nurse");
        settings.machine = this.utilities.getThingById(settings.machineId || "HealingMachine");

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Welcome to our %%%%%%%POKEMON%%%%%%% CENTER!",
                "We heal your %%%%%%%POKEMON%%%%%%% back to perfect health!",
                "Shall we heal your %%%%%%%POKEMON%%%%%%%?"
            ],
            this.scenePlayer.bindRoutine("Choose")
        );
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for choosing whether or not to heal Pokemon.
     */
    public cutscenePokeCenterChoose(): void {
        this.menuGrapher.createMenu("Heal/Cancel");
        this.menuGrapher.addMenuList(
            "Heal/Cancel",
            {
                options: [
                    {
                        text: "HEAL",
                        callback: this.scenePlayer.bindRoutine("ChooseHeal")
                    },
                    {
                        text: "CANCEL",
                        callback: this.scenePlayer.bindRoutine("ChooseCancel")
                    }
                ]
            }
        );
        this.menuGrapher.setActiveMenu("Heal/Cancel");
    }

    /**
     * Cutscene for choosing to heal Pokemon.
     */
    public cutscenePokeCenterChooseHeal(): void {
        this.menuGrapher.deleteMenu("Heal/Cancel");

        this.menuGrapher.createMenu("GeneralText", {
            ignoreA: true,
            finishAutomatically: true
        });
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Ok. We'll need your %%%%%%%POKEMON%%%%%%%."
            ],
            this.scenePlayer.bindRoutine("Healing")
        );
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for placing Pokeballs into the healing machine.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutscenePokeCenterHealing(settings: any): void {
        const party: IPokemon[] = this.itemsHolder.getItem("PokemonInParty");
        const balls: IThing[] = [];
        const dt: number = 35;
        const left: number = settings.machine.left + 5 * 4;
        const top: number = settings.machine.top + 7 * 4;
        let i: number = 0;

        settings.balls = balls;
        this.animations.animateCharacterSetDirection(settings.nurse, 3);

        this.timeHandler.addEventInterval(
            (): void => {
                balls.push(
                    this.things.add(
                        "HealingMachineBall",
                        left + (i % 2) * 3 * 4,
                        top + Math.floor(i / 2) * 2.5 * 4
                    )
                );
                i += 1;
            },
            dt,
            party.length);

        this.timeHandler.addEvent(
            (): void => this.scenePlayer.playRoutine(
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

        this.timeHandler.addEventInterval(
            (): void => {
                changer = i % 2 === 0
                    ? (thing: IThing, className: string): void => this.graphics.addClass(thing, className)
                    : (thing: IThing, className: string): void => this.graphics.removeClass(thing, className);

                for (const ball of balls) {
                    changer(ball, "lit");
                }

                changer(settings.machine, "lit");

                i += 1;
            },
            21,
            numFlashes);

        this.timeHandler.addEvent(
            (): void => this.scenePlayer.playRoutine(
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
        const party: IPokemon[] = this.itemsHolder.getItem("PokemonInParty");

        for (const ball of balls) {
            this.physics.killNormal(ball);
        }

        for (const pokemon of party) {
            this.battles.healPokemon(pokemon);
        }

        this.animations.animateCharacterSetDirection(settings.nurse, 2);

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you! \n Your %%%%%%%POKEMON%%%%%%% are fighting fit!",
                "We hope to see you again!"
            ],
            (): void => {
                this.menuGrapher.deleteMenu("GeneralText");
                this.scenePlayer.stopCutscene();
            });
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for choosing not to heal Pokemon.
     */
    public cutscenePokeCenterChooseCancel(): void {
        this.menuGrapher.deleteMenu("Heal/Cancel");

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "We hope to see you again!"
            ],
            (): void => {
                this.menuGrapher.deleteMenu("GeneralText");
                this.scenePlayer.stopCutscene();
            });
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for speaking to a PokeMart cashier.
     */
    public cutscenePokeMartGreeting(): void {
        this.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
            ignoreA: true,
            ignoreB: true
        });
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hi there! \n May I help you?"
            ],
            this.scenePlayer.bindRoutine("Options"));
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the PokeMart action options.
     */
    public cutscenePokeMartOptions(): void {
        this.menuGrapher.createMenu("Money");

        this.menuGrapher.createMenu("Buy/Sell", {
            killOnB: ["Money", "GeneralText"],
            onMenuDelete: this.scenePlayer.bindRoutine("Exit")
        });
        this.menuGrapher.addMenuList("Buy/Sell", {
            options: [{
                text: "BUY",
                callback: this.scenePlayer.bindRoutine("BuyMenu")
            }, {
                    text: "SELL",
                    callback: undefined
                }, {
                    text: "QUIT",
                    callback: this.menuGrapher.registerB
                }]
        });
        this.menuGrapher.setActiveMenu("Buy/Sell");
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
                    callback: this.scenePlayer.bindRoutine(
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
            callback: this.menuGrapher.registerB
        });

        this.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Take your time."
            ],
            (): void => {
                this.menuGrapher.createMenu("ShopItems", {
                    backMenu: "Buy/Sell"
                });
                this.menuGrapher.addMenuList("ShopItems", {
                    options: options
                });
                this.menuGrapher.setActiveMenu("ShopItems");
            }
        );
        this.menuGrapher.setActiveMenu("GeneralText");
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
        const text: string = this.utilities.makeDigit(amount, 2)
            + this.utilities.makeDigit("$" + costTotal, 8, " ");

        this.menuGrapher.createMenu("ShopItemsAmount", {
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
            onUp: this.scenePlayer.bindRoutine(
                "SelectAmount",
                {
                    amount: (amount === 99) ? 1 : amount + 1,
                    cost: cost,
                    reference: reference
                }),
            onDown: this.scenePlayer.bindRoutine(
                "SelectAmount",
                {
                    amount: (amount === 1) ? 99 : amount - 1,
                    cost: cost,
                    reference: reference
                }),
            callback: this.scenePlayer.bindRoutine("ConfirmPurchase", args)
        });
        this.menuGrapher.setActiveMenu("ShopItemsAmount");
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

        this.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                reference.item.toUpperCase() + "? \n That will be $" + costTotal + ". OK?"
            ],
            (): void => {
                this.menuGrapher.createMenu("Yes/No", {
                    position: {
                        horizontal: "right",
                        vertical: "bottom",
                        offset: {
                            top: 0,
                            left: 0
                        }
                    },
                    onMenuDelete: this.scenePlayer.bindRoutine(
                        "CancelPurchase"
                    ),
                    container: "ShopItemsAmount"
                });
                this.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: this.scenePlayer.bindRoutine(
                                "TryPurchase", args)
                        }, {
                            text: "NO",
                            callback: this.scenePlayer.bindRoutine(
                                "CancelPurchase")
                        }]
                });
                this.menuGrapher.setActiveMenu("Yes/No");
            });
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for canceling a PokeMart purchase.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutscenePokeMartCancelPurchase(): void {
        this.scenePlayer.playRoutine("BuyMenu");
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

        if (this.itemsHolder.getItem("money") < costTotal) {
            this.scenePlayer.playRoutine("FailPurchase", args);
            return;
        }

        this.itemsHolder.decrease("money", args.costTotal);
        this.menuGrapher.createMenu("Money");
        this.itemsHolder.getItem("items").push({
            item: args.reference.item,
            amount: args.amount
        });

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Here you are! \n Thank you!"
            ],
            this.scenePlayer.bindRoutine("ContinueShopping"));

        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for when the player does not have enough money for the 
     * PokeMart purchase.
     */
    public cutscenePokeMartFailPurchase(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You don't have enough money."
            ],
            this.scenePlayer.bindRoutine("ContinueShopping")
        );
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for asking if the player wants to continue shopping.
     */
    public cutscenePokeMartContinueShopping(): void {
        if (this.menuGrapher.getMenu("Yes/No")) {
            delete this.menuGrapher.getMenu("Yes/No").onMenuDelete;
        }

        this.menuGrapher.deleteMenu("ShopItems");
        this.menuGrapher.deleteMenu("ShopItemsAmount");
        this.menuGrapher.deleteMenu("Yes/No");

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Is there anything else I can do?"
            ]);

        this.menuGrapher.setActiveMenu("Buy/Sell");

        this.storage.autoSave();
    }

    /**
     * Cutscene for the player choosing to stop shopping.
     */
    public cutscenePokeMartExit(): void {
        this.scenePlayer.stopCutscene();

        this.menuGrapher.deleteMenu("Buy/Sell");
        this.menuGrapher.deleteMenu("Money");

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you!"
            ],
            this.menuGrapher.deleteActiveMenu
        );
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the beginning of the game introduction.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroFadeIn(settings: any): void {
        const oak: IThing = this.objectMaker.make("OakPortrait", {
            opacity: 0
        });

        settings.oak = oak;

        console.warn("Cannot find Introduction audio theme!");
        // this.audioPlayer.playTheme("Introduction");
        this.modAttacher.fireEvent("onIntroFadeIn", oak);

        this.maps.setMap("Blank", "White");
        this.menuGrapher.deleteActiveMenu();

        this.things.add(oak);
        this.physics.setMidX(oak, this.mapScreener.middleX | 0);
        this.physics.setMidY(oak, this.mapScreener.middleY | 0);

        this.timeHandler.addEvent(
            (): void => {
                this.animations.animateFadeAttribute(
                    oak,
                    "opacity",
                    .15,
                    1,
                    14,
                    this.scenePlayer.bindRoutine("FirstDialog"));
            },
            70);
    }

    /**
     * Cutscene for Oak's introduction.
     */
    public cutsceneIntroFirstDialog(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hello there! \n Welcome to the world of %%%%%%%POKEMON%%%%%%%!",
                "My name is OAK! People call me the %%%%%%%POKEMON%%%%%%% PROF!"
            ],
            this.scenePlayer.bindRoutine("FirstDialogFade")
        );
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak's introduction exit.
     */
    public cutsceneIntroFirstDialogFade(): void {
        let blank: IThing = this.objectMaker.make("WhiteSquare", {
            width: this.mapScreener.width,
            height: this.mapScreener.height,
            opacity: 0
        });

        this.things.add(blank, 0, 0);

        this.timeHandler.addEvent(
            (): void => {
                this.animations.animateFadeAttribute(
                blank,
                "opacity",
                .15,
                1,
                7,
                this.scenePlayer.bindRoutine("PokemonExpo"));
            },
            35);
    }

    /**
     * Cutscene for transitioning Nidorino onto the screen.
     */
    public cutsceneIntroPokemonExpo(): void {
        let pokemon: IThing = this.objectMaker.make("NIDORINOFront", {
            flipHoriz: true,
            opacity: .01
        });

        this.groupHolder.applyOnAll(this.physics, this.physics.killNormal);

        this.things.add(
            pokemon,
            (this.mapScreener.middleX + 24 * 4) | 0,
            0);

        this.physics.setMidY(pokemon, this.mapScreener.middleY);

        this.animations.animateFadeAttribute(
            pokemon,
            "opacity",
            .15,
            1,
            3);

        this.animations.animateSlideHorizontal(
            pokemon,
            -4 * 2,
            this.mapScreener.middleX | 0,
            1,
            this.scenePlayer.bindRoutine("PokemonExplanation"));
    }

    /**
     * Cutscene for showing an explanation of the Pokemon world.
     */
    public cutsceneIntroPokemonExplanation(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This world is inhabited by creatures called %%%%%%%POKEMON%%%%%%%!",
                "For some people, %%%%%%%POKEMON%%%%%%% are pets. Others use them for fights.",
                "Myself...",
                "I study %%%%%%%POKEMON%%%%%%% as a profession."
            ],
            this.scenePlayer.bindRoutine("PlayerAppear")
        );
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerAppear(settings: any): void {
        const middleX: number = this.mapScreener.middleX | 0;
        const player: IPlayer = this.objectMaker.make("PlayerPortrait", {
            flipHoriz: true,
            opacity: .01
        });

        settings.player = player;

        this.groupHolder.applyOnAll(this.physics, this.physics.killNormal);

        this.things.add(player, this.mapScreener.middleX + 24 * 4, 0);

        this.physics.setMidY(player, this.mapScreener.middleY);

        this.animations.animateFadeAttribute(player, "opacity", .15, 1, 3);

        this.animations.animateSlideHorizontal(
            player,
            -4 * 2,
            middleX - player.width * 4 / 2,
            1,
            this.scenePlayer.bindRoutine("PlayerName"));
    }

    /**
     * Cutscene asking the player to enter his/her name.
     */
    public cutsceneIntroPlayerName(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "First, what is your name?"
            ],
            this.scenePlayer.bindRoutine("PlayerSlide"));
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the player over to show the naming options.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerSlide(settings: any): void {
        this.animations.animateSlideHorizontal(
            settings.player,
            4,
            (this.mapScreener.middleX + 16 * 4) | 0,
            1,
            this.scenePlayer.bindRoutine("PlayerNameOptions"));
    }

    /**
     * Cutscene for showing the player naming option menu.
     */
    public cutsceneIntroPlayerNameOptions(): void {
        const fromMenu: () => void = this.scenePlayer.bindRoutine("PlayerNameFromMenu");
        const fromKeyboard: () => void = this.scenePlayer.bindRoutine("PlayerNameFromKeyboard");

        this.menuGrapher.createMenu("NameOptions");
        this.menuGrapher.addMenuList("NameOptions", {
            options: [
                {
                    text: "NEW NAME".split(""),
                    callback: () => this.menus.openKeyboardMenu({
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
        this.menuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for the player selecting Blue, Gary, or John.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerNameFromMenu(settings: any): void {
        settings.name = this.menuGrapher.getMenuSelectedOption("NameOptions").text;

        this.menuGrapher.deleteMenu("NameOptions");

        this.animations.animateSlideHorizontal(
            settings.player,
            -4,
            this.mapScreener.middleX | 0,
            1,
            this.scenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene for the player choosing to customize a new name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerNameFromKeyboard(settings: any): void {
        settings.name = (this.menuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;

        this.menuGrapher.deleteMenu("Keyboard");
        this.menuGrapher.deleteMenu("NameOptions");

        this.animations.animateSlideHorizontal(
            settings.player,
            -4,
            this.mapScreener.middleX | 0,
            1,
            this.scenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene confirming the player's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroPlayerNameConfirm(settings: any): void {
        this.itemsHolder.setItem("name", settings.name);

        this.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "Right! So your name is ".split(""),
                    settings.name,
                    "!".split("")
                ]
            ],
            this.scenePlayer.bindRoutine("PlayerNameComplete"));
    }

    /**
     * Cutscene fading the player out.
     */
    public cutsceneIntroPlayerNameComplete(): void {
        const blank: IThing = this.objectMaker.make("WhiteSquare", {
            width: this.mapScreener.width,
            height: this.mapScreener.height,
            opacity: 0
        });

        this.things.add(blank, 0, 0);

        this.timeHandler.addEvent(
            (): void => {
                this.animations.animateFadeAttribute(
                    blank,
                    "opacity",
                    .2,
                    1,
                    7,
                    this.scenePlayer.bindRoutine("RivalAppear"));
            },
            35);
    }

    /**
     * Cutscene for showing the rival.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalAppear(settings: any): void {
        const rival: IThing = this.objectMaker.make("RivalPortrait", {
            opacity: 0
        });

        settings.rival = rival;

        this.groupHolder.applyOnAll(this.physics, this.physics.killNormal);

        this.things.add(rival, 0, 0);
        this.physics.setMidX(rival, this.mapScreener.middleX | 0);
        this.physics.setMidY(rival, this.mapScreener.middleY | 0);
        this.animations.animateFadeAttribute(
            rival,
            "opacity",
            .1,
            1,
            1,
            this.scenePlayer.bindRoutine("RivalName"));
    }

    /**
     * Cutscene introducing the rival.
     */
    public cutsceneIntroRivalName(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This is my grand-son. He's been your rival since you were a baby.",
                "...Erm, what is his name again?"
            ],
            this.scenePlayer.bindRoutine("RivalSlide")
        );
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the rival over to show the rival naming options.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalSlide(settings: any): void {
        this.animations.animateSlideHorizontal(
            settings.rival,
            4,
            (this.mapScreener.middleX + 16 * 4) | 0,
            1,
            this.scenePlayer.bindRoutine("RivalNameOptions"));
    }

    /**
     * Cutscene for showing the rival naming option menu.
     */
    public cutsceneIntroRivalNameOptions(): void {
        const fromMenu: () => void = this.scenePlayer.bindRoutine("RivalNameFromMenu");
        const fromKeyboard: () => void = this.scenePlayer.bindRoutine("RivalNameFromKeyboard");

        this.menuGrapher.createMenu("NameOptions");
        this.menuGrapher.addMenuList("NameOptions", {
            options: [
                {
                    text: "NEW NAME",
                    callback: (): void => this.menus.openKeyboardMenu({
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
        this.menuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for choosing to name the rival Red, Ash, or Jack.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalNameFromMenu(settings: any): void {
        settings.name = this.menuGrapher.getMenuSelectedOption("NameOptions").text;

        this.menuGrapher.deleteMenu("NameOptions");

        this.animations.animateSlideHorizontal(
            settings.rival,
            -4,
            this.mapScreener.middleX | 0,
            1,
            this.scenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for choosing to customize the rival's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalNameFromKeyboard(settings: any): void {
        settings.name = (this.menuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu).completeValue;

        this.menuGrapher.deleteMenu("Keyboard");
        this.menuGrapher.deleteMenu("NameOptions");

        this.animations.animateSlideHorizontal(
            settings.rival,
            -4,
            this.mapScreener.middleX | 0,
            1,
            this.scenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for confirming the rival's name.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroRivalNameConfirm(settings: any): void {
        this.itemsHolder.setItem("nameRival", settings.name);

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "That's right! I remember now! His name is ", settings.name, "!"
                ]
            ],
            this.scenePlayer.bindRoutine("RivalNameComplete"));
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene fading the rival out.
     */
    public cutsceneIntroRivalNameComplete(): void {
        let blank: IThing = this.objectMaker.make("WhiteSquare", {
            width: this.mapScreener.width,
            height: this.mapScreener.height,
            opacity: 0
        });

        this.things.add(blank, 0, 0);

        this.timeHandler.addEvent(
            (): void => {
                this.animations.animateFadeAttribute(
                    blank,
                    "opacity",
                    .2,
                    1,
                    7,
                    this.scenePlayer.bindRoutine("LastDialogAppear"));
            },
            35);
    }

    /**
     * Cutscene for fading the player in.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroLastDialogAppear(settings: any): void {
        const portrait: IThing = this.objectMaker.make("PlayerPortrait", {
            flipHoriz: true,
            opacity: 0
        });

        settings.portrait = portrait;

        this.groupHolder.applyOnAll(this.physics, this.physics.killNormal);

        this.things.add(portrait, 0, 0);
        this.physics.setMidX(portrait, this.mapScreener.middleX | 0);
        this.physics.setMidY(portrait, this.mapScreener.middleY | 0);

        this.animations.animateFadeAttribute(
            portrait,
            "opacity",
            .1,
            1,
            1,
            this.scenePlayer.bindRoutine("LastDialog"));
    }

    /**
     * Cutscene for the last part of the introduction.
     */
    public cutsceneIntroLastDialog(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%!",
                "Your very own %%%%%%%POKEMON%%%%%%% legend is about to unfold!",
                "A world of dreams and adventures with %%%%%%%POKEMON%%%%%%% awaits! Let's go!"
            ],
            this.scenePlayer.bindRoutine("ShrinkPlayer"));
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for shrinking the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneIntroShrinkPlayer(settings: any): void {
        const silhouetteLarge: IThing = this.objectMaker.make("PlayerSilhouetteLarge");
        const silhouetteSmall: IThing = this.objectMaker.make("PlayerSilhouetteSmall");
        const player: IPlayer = this.objectMaker.make("Player");
        const timeDelay: number = 49;

        this.timeHandler.addEvent(
            (): void => {
                this.things.add(silhouetteLarge);
                this.physics.setMidObj(silhouetteLarge, settings.portrait);
                this.physics.killNormal(settings.portrait);
            },
            timeDelay);

        this.timeHandler.addEvent(
            (): void => {
                this.things.add(silhouetteSmall);
                this.physics.setMidObj(silhouetteSmall, silhouetteLarge);
                this.physics.killNormal(silhouetteLarge);
            },
            timeDelay * 2);

        this.timeHandler.addEvent(
            (): void => {
                this.things.add(player);
                this.physics.setMidObj(player, silhouetteSmall);
                this.physics.killNormal(silhouetteSmall);
            },
            timeDelay * 3);

        this.timeHandler.addEvent(
            this.scenePlayer.bindRoutine("FadeOut"),
            timeDelay * 4);
    }

    /**
     * Cutscene for completing the introduction and fading it out.
     */
    public cutsceneIntroFadeOut(): void {
        const blank: IThing = this.objectMaker.make("WhiteSquare", {
            width: this.mapScreener.width,
            height: this.mapScreener.height,
            opacity: 0
        });

        this.things.add(blank, 0, 0);

        this.timeHandler.addEvent(
            (): void => {
                this.animations.animateFadeAttribute(
                    blank,
                    "opacity",
                    .2,
                    1,
                    7,
                    this.scenePlayer.bindRoutine("Finish"));
            },
            35);
    }

    /**
     * Cutscene showing the player in his bedroom.
     */
    public cutsceneIntroFinish(): void {
        delete this.mapScreener.cutscene;

        this.menuGrapher.deleteActiveMenu();
        this.scenePlayer.stopCutscene();
        this.itemsHolder.setItem("gameStarted", true);

        this.maps.setMap("Pallet Town", "Start Game");
    }

    /**
     * Cutscene for walking into the grass before receiving a Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroFirstDialog(settings: any): void {
        let triggered: boolean = false;

        settings.triggerer.alive = false;
        this.stateHolder.addChange(settings.triggerer.id, "alive", false);

        if (this.itemsHolder.getItem("starter")) {
            this.mapScreener.blockInputs = false;
            return;
        }

        this.animations.animatePlayerDialogFreeze(settings.player);
        this.animations.animateCharacterSetDirection(settings.player, 2);

        this.audioPlayer.playTheme("Professor Oak");
        this.mapScreener.blockInputs = true;

        this.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
            finishAutomaticSpeed: 28
        });
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            "OAK: Hey! Wait! Don't go out!",
            (): void => {
                if (!triggered) {
                    triggered = true;
                    this.scenePlayer.playRoutine("Exclamation");
                }
            });
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the exclamation point over the player's head.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroExclamation(settings: any): void {
        const timeout: number = 49;

        this.animations.animateExclamation(settings.player, timeout);

        this.timeHandler.addEvent(
            (): void => this.menuGrapher.hideMenu("GeneralText"),
            timeout);

        this.timeHandler.addEvent(
            this.scenePlayer.bindRoutine("Catchup"),
            timeout);
    }

    /**
     * Cutscene for animating Oak to walk to the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroCatchup(settings: any): void {
        const door: IThing = this.utilities.getThingById("Oak's Lab Door");
        const oak: ICharacter = this.objectMaker.make("Oak", {
            outerOk: true,
            nocollide: true
        });
        const isToLeft: boolean = this.player.bordering[Direction.Left] !== undefined;
        const walkingSteps: any[] = [
            1, "left", 4, "top", 8, "right", 1, "top", 1, "right", 1, "top", 1
        ];

        if (!isToLeft) {
            walkingSteps.push("right", 1, "top", 0);
        }

        walkingSteps.push(this.scenePlayer.bindRoutine("GrassWarning"));

        settings.oak = oak;
        settings.isToLeft = isToLeft;

        this.things.add(oak, door.left, door.top);
        this.animations.animateCharacterStartWalkingCycle(oak, 2, walkingSteps);
    }

    /**
     * Cutscene for Oak telling the player to keep out of the grass.
     */
    public cutsceneOakIntroGrassWarning(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "It's unsafe! Wild %%%%%%%POKEMON%%%%%%% live in tall grass!",
                "You need your own %%%%%%%POKEMON%%%%%%% for your protection. \n I know!",
                "Here, come with me."
            ],
            this.scenePlayer.bindRoutine("FollowToLab"));
        this.menuGrapher.setActiveMenu("GeneralText");
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

        walkingSteps.push(this.scenePlayer.bindRoutine("EnterLab"));

        this.menuGrapher.deleteMenu("GeneralText");
        this.animations.animateCharacterFollow(settings.player, settings.oak);
        this.animations.animateCharacterStartWalkingCycle(
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
        this.stateHolder.addChange("Pallet Town::Oak's Lab::Oak", "alive", true);
        settings.oak.hidden = true;

        this.timeHandler.addEvent(
            this.animations.animateCharacterStartWalkingCycle,
            this.mathDecider.compute("speedWalking", this.player),
            this.player,
            0,
            [
                0,
                (): void => {
                    this.maps.setMap("Pallet Town", "Oak's Lab Floor 1 Door", false);
                    this.player.hidden = true;

                    this.scenePlayer.playRoutine("WalkToTable");
                }
            ]);
    }

    /**
     * Cutscene for Oak offering a Pokemon to the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroWalkToTable(settings: any): void {
        const oak: ICharacter = this.utilities.getThingById("Oak") as ICharacter;
        const rival: ICharacter = this.utilities.getThingById("Rival") as ICharacter;

        settings.oak = oak;
        settings.player = this.player;

        oak.dialog = "OAK: Now, %%%%%%%PLAYER%%%%%%%, which %%%%%%%POKEMON%%%%%%% do you want?";
        oak.hidden = false;
        oak.nocollide = true;
        this.physics.setMidXObj(oak, settings.player);
        this.physics.setBottom(oak, settings.player.top);

        this.stateHolder.addChange(oak.id, "hidden", false);
        this.stateHolder.addChange(oak.id, "nocollide", false);
        this.stateHolder.addChange(oak.id, "dialog", oak.dialog);

        rival.dialog = [
            "%%%%%%%RIVAL%%%%%%%: Heh, I don't need to be greedy like you!",
            "Go ahead and choose, %%%%%%%PLAYER%%%%%%%!"
        ];
        this.stateHolder.addChange(rival.id, "dialog", rival.dialog);

        this.animations.animateCharacterStartWalking(oak, 0, [
            8, "bottom", 0
        ]);

        this.timeHandler.addEvent(
            (): void => {
                this.player.hidden = false;
            },
            112 - this.mathDecider.compute("speedWalking", settings.player));

        this.timeHandler.addEvent(
            (): void => {
                this.animations.animateCharacterStartWalking(
                    settings.player,
                    0,
                    [8, this.scenePlayer.bindRoutine("RivalComplain")]);
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
        this.stateHolder.addChange(settings.oak.id, "nocollide", false);

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            "%%%%%%%RIVAL%%%%%%%: Gramps! I'm fed up with waiting!",
            this.scenePlayer.bindRoutine("OakThinksToRival"));
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak telling the player to pick a Pokemon.
     */
    public cutsceneOakIntroOakThinksToRival(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
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
            this.scenePlayer.bindRoutine("RivalProtests"));
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival protesting to Oak.
     */
    public cutsceneOakIntroRivalProtests(): void {
        let timeout: number = 21;

        this.menuGrapher.deleteMenu("GeneralText");

        this.timeHandler.addEvent(
            (): void => {
                this.menuGrapher.createMenu("GeneralText");
            },
            timeout);

        this.timeHandler.addEvent(
            (): void => this.menuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%RIVAL%%%%%%%: Hey! Gramps! What about me?"
                ],
                this.scenePlayer.bindRoutine("OakRespondsToProtest")),
            timeout);

        this.timeHandler.addEvent(
            (): void => this.menuGrapher.setActiveMenu("GeneralText"),
            timeout);
    }

    /**
     * Cutscene for Oak responding to the rival's protest.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroOakRespondsToProtest(settings: any): void {
        const blocker: IThing = this.utilities.getThingById("OakBlocker");
        const timeout: number = 21;

        settings.player.nocollide = false;
        settings.oak.nocollide = false;

        blocker.nocollide = false;
        this.stateHolder.addChange(blocker.id, "nocollide", false);

        this.mapScreener.blockInputs = false;

        this.menuGrapher.deleteMenu("GeneralText");

        this.timeHandler.addEvent(
            (): void => {
                this.menuGrapher.createMenu(
                    "GeneralText",
                    {
                        deleteOnFinish: true
                    });
            },
            timeout);

        this.timeHandler.addEvent(
            (): void => this.menuGrapher.addMenuDialog(
                "GeneralText",
                "Oak: Be patient! %%%%%%%RIVAL%%%%%%%, you can have one too!"),
            timeout);

        this.timeHandler.addEvent(
            (): void => this.menuGrapher.setActiveMenu("GeneralText"),
            timeout);
    }

    /**
     * Cutscene for the player checking a Pokeball.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoicePlayerChecksPokeball(settings: any): void {
        // If Oak is hidden, this cutscene shouldn't be starting (too early)
        if (this.utilities.getThingById("Oak").hidden) {
            this.scenePlayer.stopCutscene();

            this.menuGrapher.createMenu("GeneralText");
            this.menuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Those are %%%%%%%POKE%%%%%%% Balls. They contain %%%%%%%POKEMON%%%%%%%!"
                ]);
            this.menuGrapher.setActiveMenu("GeneralText");

            return;
        }

        // If there's already a starter, ignore this sad last ball...
        if (this.itemsHolder.getItem("starter")) {
            return;
        }

        let pokeball: IPokeball = settings.triggerer;
        settings.chosen = pokeball.pokemon;

        this.menus.openPokedexListing(
            pokeball.pokemon!,
            this.scenePlayer.bindRoutine("PlayerDecidesPokemon"),
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
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "So! You want the " + settings.triggerer.description + " %%%%%%%POKEMON%%%%%%%, ", settings.chosen, "?"
                ]
            ],
            (): void => {
                this.menuGrapher.createMenu("Yes/No", {
                    killOnB: ["GeneralText"]
                });
                this.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: this.scenePlayer.bindRoutine("PlayerTakesPokemon")
                        }, {
                            text: "NO",
                            callback: this.menuGrapher.registerB
                        }]
                });
                this.menuGrapher.setActiveMenu("Yes/No");
            });
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player receiving his Pokemon.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutsceneOakIntroPokemonChoicePlayerTakesPokemon(settings: any): void {
        const oak: ICharacter = this.utilities.getThingById("Oak") as ICharacter;
        const rival: ICharacter = this.utilities.getThingById("Rival") as ICharacter;
        const dialogOak: string = "Oak: If a wild %%%%%%%POKEMON%%%%%%% appears, your %%%%%%%POKEMON%%%%%%% can fight against it!";
        const dialogRival: string = "%%%%%%%RIVAL%%%%%%%: My %%%%%%%POKEMON%%%%%%% looks a lot stronger.";

        settings.oak = oak;
        oak.dialog = dialogOak;
        this.stateHolder.addChange(oak.id, "dialog", dialogOak);

        settings.rival = rival;
        rival.dialog = dialogRival;
        this.stateHolder.addChange(rival.id, "dialog", dialogRival);

        this.itemsHolder.setItem("starter", settings.chosen.join(""));
        settings.triggerer.hidden = true;
        this.stateHolder.addChange(settings.triggerer.id, "hidden", true);
        this.stateHolder.addChange(settings.triggerer.id, "nocollide", true);
        this.physics.killNormal(settings.triggerer);

        this.menuGrapher.deleteMenu("Yes/No");
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
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
            this.scenePlayer.bindRoutine("PlayerChoosesNickname"));
        this.menuGrapher.setActiveMenu("GeneralText");

        this.itemsHolder.setItem("starter", settings.chosen);
        this.itemsHolder.setItem("PokemonInParty", [
            this.mathDecider.compute("newPokemon", settings.chosen, 5)
        ]);
        this.storage.addPokemonToPokedex(settings.chosen, PokedexListingStatus.Caught);
    }

    /**
     * Cutscene for allowing the player to choose his Pokemon's nickname. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoicePlayerChoosesNickname(settings: any): void {
        this.menuGrapher.createMenu("Yes/No", {
            ignoreB: true,
            killOnB: ["GeneralText"]
        });
        this.menuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: (): void => this.menus.openKeyboardMenu({
                        title: settings.chosen,
                        callback: this.scenePlayer.bindRoutine("PlayerSetsNickname")
                    })
                }, {
                    text: "NO",
                    callback: this.scenePlayer.bindRoutine("RivalWalksToPokemon")
                }]
        });
        this.menuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * Cutscene for the player finishing the naming process.
     */
    public cutsceneOakIntroPokemonChoicePlayerSetsNickname(): void {
        const party: IPokemon[] = this.itemsHolder.getItem("PokemonInParty");
        const menu: IKeyboardResultsMenu = this.menuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu;
        const result: string[] = menu.completeValue;

        party[0].nickname = result;

        this.scenePlayer.playRoutine("RivalWalksToPokemon");
    }

    /**
     * Cutscene for the rival selecting his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoiceRivalWalksToPokemon(settings: any): void {
        const rival: ICharacter = this.utilities.getThingById("Rival") as ICharacter;
        let starterRival: string[];
        let steps: number;

        this.menuGrapher.deleteMenu("Keyboard");
        this.menuGrapher.deleteMenu("GeneralText");
        this.menuGrapher.deleteMenu("Yes/No");
        this.mapScreener.blockInputs = true;

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
        this.itemsHolder.setItem("starterRival", starterRival);
        this.storage.addPokemonToPokedex(starterRival, PokedexListingStatus.Caught);

        let pokeball: IPokeball = this.utilities.getThingById("Pokeball" + starterRival.join("")) as IPokeball;
        settings.rivalPokeball = pokeball;

        this.animations.animateCharacterStartWalkingCycle(
            rival,
            2,
            [
                2, "right", steps, "top", 1,
                (): void => this.scenePlayer.playRoutine("RivalTakesPokemon")
            ]);
    }

    /**
     * Cutscene for the rival receiving his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroPokemonChoiceRivalTakesPokemon(settings: any): void {
        const oakblocker: IThing = this.utilities.getThingById("OakBlocker");
        const rivalblocker: IThing = this.utilities.getThingById("RivalBlocker");

        this.menuGrapher.deleteMenu("Yes/No");

        oakblocker.nocollide = true;
        this.stateHolder.addChange(oakblocker.id, "nocollide", true);

        rivalblocker.nocollide = false;
        this.stateHolder.addChange(rivalblocker.id, "nocollide", false);

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: I'll take this one, then!",
                [
                    "%%%%%%%RIVAL%%%%%%% received a ", settings.rivalPokemon, "!"
                ]
            ],
            (): void => {
                settings.rivalPokeball.hidden = true;
                this.stateHolder.addChange(settings.rivalPokeball.id, "hidden", true);
                this.menuGrapher.deleteActiveMenu();
                this.mapScreener.blockInputs = false;
            });
        this.menuGrapher.setActiveMenu("GeneralText");

    }

    /**
     * Cutscene for the rival challenging the player to a Pokemon battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakIntroRivalBattleApproach(settings: any): void {
        const rival: ICharacter = this.utilities.getThingById("Rival") as ICharacter;
        const dx: number = Math.abs(settings.triggerer.left - settings.player.left);
        const further: boolean = dx < 4;

        this.audioPlayer.playTheme("Rival Appears");

        settings.rival = rival;
        this.animations.animateCharacterSetDirection(rival, Direction.Bottom);
        this.animations.animateCharacterSetDirection(settings.player, Direction.Top);

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Wait, %%%%%%%PLAYER%%%%%%%! Let's check out our %%%%%%%POKEMON%%%%%%%!",
                "Come on, I'll take you on!"
            ],
            this.scenePlayer.bindRoutine(
                "Challenge",
                {
                    further: further
                }
            ));
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for showing the lab after the battle ends.
     */
    public cutsceneOakIntroRivalLeavesAfterBattle(): void {
        this.mapScreener.blockInputs = true;

        for (const pokemon of this.itemsHolder.getItem("PokemonInParty")) {
            this.battles.healPokemon(pokemon);
        }

        this.timeHandler.addEvent(this.scenePlayer.bindRoutine("Complaint"), 49);
    }

    /**
     * Cutscene for the rival's comment after losing the battle.
     */
    public cutsceneOakIntroRivalLeavesComplaint(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Okay! I'll make my %%%%%%%POKEMON%%%%%%% fight to toughen it up!"
            ],
            (): void => {
                this.menuGrapher.deleteActiveMenu();
                this.timeHandler.addEvent(this.scenePlayer.bindRoutine("Goodbye"), 21);
            }
        );
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival telling Oak he is leaving.
     */
    public cutsceneOakIntroRivalLeavesGoodbye(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%! Gramps! Smell ya later!"
            ],
            this.scenePlayer.bindRoutine("Walking"));
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival leaving the lab and Oak giving the player advice.
     */
    public cutsceneOakIntroRivalLeavesWalking(): void {
        const oak: ICharacter = this.utilities.getThingById("Oak") as ICharacter;
        const rival: ICharacter = this.utilities.getThingById("Rival") as ICharacter;
        const isRight: boolean = Math.abs(oak.left - rival.left) < 4;
        const steps: any[] = [
            1,
            "bottom",
            6,
            (): void => {
                this.physics.killNormal(rival);
                this.stateHolder.addChange(rival.id, "alive", false);
                this.mapScreener.blockInputs = false;
            }
        ];
        const dialog: string[] = [
            "OAK: %%%%%%%PLAYER%%%%%%%, raise your young %%%%%%%POKEMON%%%%%%% by making it fight!"
        ];

        console.log("Shouldn't this say the dialog?", dialog);

        this.scenePlayer.stopCutscene();
        this.menuGrapher.deleteMenu("GeneralText");

        rival.nocollide = true;
        this.animations.animateCharacterStartWalkingCycle(rival, isRight ? Direction.Left : Direction.Right, steps);
    }

    /**
     * Cutscene for the battle between the player and the rival.
     *
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public cutsceneOakIntroRivalBattleChallenge(settings: any, args: any): void {
        const starterRival: string[] = this.itemsHolder.getItem("starterRival");
        const battleInfo: IBattleInfo = {
            battlers: {
                opponent: {
                    sprite: "RivalPortrait",
                    name: this.itemsHolder.getItem("nameRival"),
                    category: "Trainer",
                    hasActors: true,
                    reward: 175,
                    actors: [
                        this.mathDecider.compute("newPokemon", starterRival, 5)
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
            keptThings: this.graphics.collectBattleKeptThings(["player", "Rival"]),
            nextCutscene: "OakIntroRivalLeaves"
        };
        let steps: number;

        switch (this.itemsHolder.getItem("starterRival").join("")) {
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

        this.animations.animateCharacterStartWalkingCycle(
            settings.rival,
            3,
            [
                steps,
                "bottom",
                1,
                (): void => this.battles.startBattle(battleInfo)
            ]);
    }

    /**
     * Cutscene for the PokeMart clerk calling the player to pick up Oak's parcel.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelPickupGreeting(settings: any): void {
        settings.triggerer.alive = false;
        this.stateHolder.addChange(settings.triggerer.id, "alive", false);

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hey! You came from PALLET TOWN?"
            ],
            this.scenePlayer.bindRoutine("WalkToCounter"));
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player walking to the counter when picking up the parcel.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelPickupWalkToCounter(settings: any): void {
        this.animations.animateCharacterStartWalkingCycle(
            settings.player,
            0,
            [
                2,
                "left",
                1,
                this.scenePlayer.bindRoutine("CounterDialog")
            ]);
    }

    /**
     * Cutscene for the player receiving the parcel from the PokeMart clerk.
     */
    public cutsceneOakParcelPickupCounterDialog(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You know PROF. Oak, right?",
                "His order came in. Will you take it to him?",
                "%%%%%%%PLAYER%%%%%%% got OAK's PARCEL!"
            ],
            (): void => {
                this.menuGrapher.deleteMenu("GeneralText");
                this.scenePlayer.stopCutscene();
                this.mapScreener.blockInputs = false;
            });
        this.menuGrapher.setActiveMenu("GeneralText");

        this.stateHolder.addCollectionChange(
            "Pallet Town::Oak's Lab", "Oak", "cutscene", "OakParcelDelivery"
        );
    }

    /**
     * Cutscene for when the player delivers the parcel to Oak.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryGreeting(settings: any): void {
        settings.rival = this.utilities.getThingById("Rival");
        settings.oak = settings.triggerer;
        delete settings.oak.cutscene;
        delete settings.oak.dialog;

        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
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
                this.timeHandler.addEvent(
                    this.scenePlayer.bindRoutine("RivalInterrupts"),
                    14);
            }
        );
        this.menuGrapher.setActiveMenu("GeneralText");

        this.stateHolder.addCollectionChange(
            "Viridian City::PokeMart", "CashierDetector", "dialog", false);

        this.stateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGrandpa", "alive", false);
        this.stateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGrandpaBlocker", "alive", false);
        this.stateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGranddaughter", "alive", false);

        this.stateHolder.addCollectionChange(
            "Viridian City::Land", "HappyGrandpa", "alive", true);
        this.stateHolder.addCollectionChange(
            "Viridian City::Land", "HappyGranddaughter", "alive", true);
    }

    /**
     * Cutscene for when the rival interrupts Oak and the player.
     */
    public cutsceneOakParcelDeliveryRivalInterrupts(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Gramps!"
            ],
            this.scenePlayer.bindRoutine("RivalWalksUp")
        );
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival walking up to Oak and the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryRivalWalksUp(settings: any): void {
        const doormat: IThing = this.utilities.getThingById("DoormatLeft");
        const rival: ICharacter = this.things.add("Rival", doormat.left, doormat.top) as ICharacter;

        rival.alive = true;
        settings.rival = rival;

        this.menuGrapher.deleteMenu("GeneralText");

        this.animations.animateCharacterStartWalkingCycle(
            rival,
            0,
            [
                8,
                (): void => this.scenePlayer.playRoutine("RivalInquires")
            ]);
    }

    /**
     * Cutscene for the rival asking Oak why he was called.
     */
    public cutsceneOakParcelDeliveryRivalInquires(): void {
        this.menuGrapher.createMenu("GeneralText");
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: What did you call me for?"
            ],
            (): void => {
                this.timeHandler.addEvent(
                    this.scenePlayer.bindRoutine("OakRequests"),
                    14);
            }
        );
        this.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak requesting something of the player and rival.
     */
    public cutsceneOakParcelDeliveryOakRequests(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Oak: Oh right! I have a request of you two."
            ],
            (): void => {
                this.eightBitter.timeHandler.addEvent(
                    this.eightBitter.scenePlayer.bindRoutine("OakDescribesPokedex"),
                    14);
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing the Pokedex.
     */
    public cutsceneOakParcelDeliveryOakDescribesPokedex(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
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
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak giving the player and rival Pokedexes.
     */
    public cutsceneOakParcelDeliveryOakGivesPokedex(): void {
        const bookLeft: IThing = this.eightBitter.utilities.getThingById("BookLeft");
        const bookRight: IThing = this.eightBitter.utilities.getThingById("BookRight");

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
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

                this.eightBitter.stateHolder.addChange(bookLeft.id, "alive", false);
                this.eightBitter.stateHolder.addChange(bookRight.id, "alive", false);

                this.eightBitter.itemsHolder.setItem("hasPokedex", true);
            }
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing his life goal.
     */
    public cutsceneOakParcelDeliveryOakDescribesGoal(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
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
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival accepting the Pokedex and challenge to complete Oak's goal. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public cutsceneOakParcelDeliveryRivalAccepts(settings: any): void {
        this.eightBitter.animations.animateCharacterSetDirection(settings.rival, 1);

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Alright Gramps! Leave it all to me!",
                "%%%%%%%PLAYER%%%%%%%, I hate to say it, but I don't need you!",
                "I know! I'll borrow a TOWN MAP from my sis!",
                "I'll tell her not to lend you one, %%%%%%%PLAYER%%%%%%%! Hahaha!"
            ],
            (): void => {
                this.eightBitter.scenePlayer.stopCutscene();
                this.eightBitter.menuGrapher.deleteMenu("GeneralText");

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

                this.eightBitter.stateHolder.addChange(
                    settings.oak.id, "dialog", settings.oak.dialog
                );
                this.eightBitter.stateHolder.addChange(
                    settings.oak.id, "cutscene", undefined
                );
            }
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Daisy giving the player a Town Map.
     */
    public cutsceneDaisyTownMapGreeting(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Grandpa asked you to run an errand? Here, this will help you!"
            ],
            this.eightBitter.scenePlayer.bindRoutine("ReceiveMap"));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
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
        this.eightBitter.stateHolder.addChange(book.id, "alive", false);

        delete daisy.cutscene;
        this.eightBitter.stateHolder.addChange(daisy.id, "cutscene", undefined);

        daisy.dialog = [
            "Use the TOWN MAP to find out where you are."
        ];
        this.eightBitter.stateHolder.addChange(daisy.id, "dialog", daisy.dialog);

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% got a TOWN MAP!"
            ],
            (): void => {
                this.eightBitter.scenePlayer.stopCutscene();
                this.eightBitter.menuGrapher.deleteMenu("GeneralText");
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");

        console.warn("Player does not actually get a Town Map...");
    }

    /**
     * Cutscene for the old man battling a Weedle.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public cutsceneElderTrainingStartBattle(settings: any): void {
        this.eightBitter.mapScreener.blockInputs = true;
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
                    (): void => this.eightBitter.menuGrapher.registerDown(),
                    timeout);
                this.eightBitter.timeHandler.addEvent(
                    (): void => this.eightBitter.menuGrapher.registerA(),
                    timeout * 2);
                this.eightBitter.timeHandler.addEvent(
                    (): void => this.eightBitter.menuGrapher.registerA(),
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

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
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
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }
}
