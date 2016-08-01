/// <reference path="../typings/EightBittr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";
import { IThing } from "./IFullScreenPokemon";

/**
 * Cutscene functions used by FullScreenPokemon instances.
 */
export class Cutscenes<TEightBittr extends FullScreenPokemon> extends EightBittr.Component<TEightBittr> {

    /**
     * Cutscene for starting a battle with a spiral.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneBattleTransitionLineSpiral(FSP: FullScreenPokemon, settings: ITransitionLineSpiralSettings): void {
        let unitsize: number = FSP.unitsize,
            divisor: number = settings.divisor || 15,
            screenWidth: number = FSP.MapScreener.width,
            screenHeight: number = FSP.MapScreener.height,
            width: number = Math.ceil(screenWidth / divisor),
            height: number = Math.ceil(screenHeight / divisor),
            numTimes: number = 0,
            direction: number = 2,
            things: IThing[] = [],
            thing: IThing,
            difference: number,
            destination: number;

        function addLineSpiralThing(): void {
            if (numTimes >= ((divisor / 2) | 0)) {
                if (settings.callback) {
                    settings.callback();
                    things.forEach(FSP.killNormal);
                }
                return;
            }

            switch (thing.direction) {
                case 0:
                    thing = FSP.ObjectMaker.make("BlackSquare", {
                        "width": width / unitsize,
                        "height": screenHeight / unitsize
                    });
                    FSP.addThing(
                        thing,
                        screenWidth - ((numTimes + 1) * width),
                        screenHeight - ((numTimes + 1) * divisor)
                    );
                    difference = -height;
                    destination = numTimes * height;
                    break;

                case 1:
                    thing = FSP.ObjectMaker.make("BlackSquare", {
                        "width": screenWidth / unitsize,
                        "height": height / unitsize
                    });
                    FSP.addThing(
                        thing,
                        numTimes * divisor - screenWidth,
                        screenHeight - (numTimes + 1) * height
                    );
                    difference = width;
                    destination = screenWidth - numTimes * width;
                    break;

                case 2:
                    thing = FSP.ObjectMaker.make("BlackSquare", {
                        "width": width / unitsize,
                        "height": screenHeight / unitsize
                    });
                    FSP.addThing(
                        thing,
                        numTimes * width,
                        numTimes * height - screenHeight
                    );
                    difference = height;
                    destination = screenHeight - numTimes * height;
                    break;

                case 3:
                    thing = FSP.ObjectMaker.make("BlackSquare", {
                        "width": screenWidth / unitsize,
                        "height": height / unitsize
                    });
                    FSP.addThing(
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

            FSP.moveBattleKeptThingsToText(settings.battleInfo);

            FSP.TimeHandler.addEventInterval(
                function (): boolean {
                    if (direction % 2 === 1) {
                        FSP.shiftHoriz(thing, difference);
                    } else {
                        FSP.shiftVert(thing, difference);
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
                    FSP.moveBattleKeptThingsToText(settings);
                    return true;
                },
                1,
                Infinity);
        }

        addLineSpiralThing();
    }

    /**
     * Cutscene for starting a battle with a series of flashes.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @remarks Three [black, white] flashes, then the spiral.
     */
    cutsceneBattleTransitionFlash(FSP: FullScreenPokemon, settings: ITransitionFlashSettings): void {
        let flashes: number = settings.flashes || 6,
            flashColors: string[] = settings.flashColors || ["Black", "White"],
            callback: Function = settings.callback,
            change: number = settings.change || .33,
            speed: number = settings.speed || 1,
            completed: number = 0,
            color: string,
            repeater: () => void = function (): void {
                if (completed >= flashes) {
                    if (callback) {
                        callback();
                    }
                    return;
                }

                color = flashColors[completed % flashColors.length];
                completed += 1;

                FSP.animateFadeToColor(FSP, {
                    "color": color,
                    "change": change,
                    "speed": speed,
                    "callback": FSP.animateFadeFromColor.bind(
                        FSP,
                        FSP,
                        {
                            "color": color,
                            "change": change,
                            "speed": speed,
                            "callback": repeater
                        })
                });

                FSP.moveBattleKeptThingsToText(settings.battleInfo);
            };

        repeater();
    }

    /**
     * Cutscene for starting a battle with a twist.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * 
     * I think the way to do this would be to treat each quarter of the screen
     * as one section. Divide each section into 10 parts. On each interval
     * increase the maximum the parts can be, while each part is a fraction of
     * the maximum, rounded to a large amount to appear pixellated (perhaps,
     * unitsize * 32?).
     */
    cutsceneBattleTransitionTwist(FSP: FullScreenPokemon, settings: IBattleTransitionSettings): void {
        throw new Error("Not yet implemented.");
    }

    /**
     * Cutscene for starting a battle with a flash, then a twist..
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneBattleTransitionFlashTwist(FSP: FullScreenPokemon, settings: IBattleTransitionSettings): void {
        FSP.cutsceneBattleTransitionFlash(
            FSP,
            {
                "callback": FSP.cutsceneBattleTransitionTwist.bind(FSP, FSP, settings)
            });
    }

    /**
     * Cutscene for starting a battle. Players slide in, then the openingText
     * cutscene is called.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene
     */
    cutsceneBattleEntrance(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings): void {
        let things: IBattleThingsById = settings.things,
            battleInfo: IBattleInfo = settings.battleInfo,
            player: IPlayer = things.player,
            opponent: IEnemy = things.opponent,
            menu: IMenu = <IMenu>FSP.MenuGrapher.getMenu("BattleDisplayInitial"),
            playerX: number,
            opponentX: number,
            playerGoal: number,
            opponentGoal: number,
            timeout: number = 70;

        battleInfo.player.selectedIndex = 0;
        battleInfo.player.selectedActor = battleInfo.player.actors[0];
        battleInfo.opponent.selectedIndex = 0;
        battleInfo.opponent.selectedActor = battleInfo.opponent.actors[0];

        player.opacity = 0;
        opponent.opacity = 0;

        FSP.setLeft(player, menu.right + player.width * FSP.unitsize);
        FSP.setRight(opponent, menu.left);
        FSP.setTop(opponent, menu.top);

        // They should be visible halfway through (2 * (1 / timeout))
        FSP.animateFadeAttribute(player, "opacity", 2 / timeout, 1, 1);
        FSP.animateFadeAttribute(opponent, "opacity", 2 / timeout, 1, 1);

        playerX = FSP.getMidX(player);
        opponentX = FSP.getMidX(opponent);
        playerGoal = menu.left + player.width * FSP.unitsize / 2;
        opponentGoal = menu.right - opponent.width * FSP.unitsize / 2;

        FSP.animateSlideHorizontal(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        FSP.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        FSP.addPokemonToPokedex(battleInfo.opponent.actors[0].title, PokedexListingStatus.Seen);

        FSP.TimeHandler.addEvent(FSP.ScenePlayer.bindRoutine("OpeningText"), timeout);

        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the opening text and base menus in a battle. Afer this,
     * the OpponentIntro or PlayerIntro cutscene is triggered.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene
     */
    cutsceneBattleOpeningText(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings): void {
        let battleInfo: IBattleInfo = settings.battleInfo,
            textStart: [string, string] = battleInfo.textStart,
            nextRoutine: string,
            callback: (...args: any[]) => void;

        if (settings.battleInfo.opponent.hasActors) {
            nextRoutine = "OpponentIntro";
        } else {
            nextRoutine = "PlayerIntro";
        }

        if (battleInfo.automaticMenus) {
            callback = FSP.TimeHandler.addEvent.bind(
                FSP.TimeHandler,
                FSP.ScenePlayer.playRoutine.bind(FSP.ScenePlayer),
                70,
                nextRoutine);
        } else {
            callback = FSP.ScenePlayer.bindRoutine(nextRoutine);
        }

        FSP.MenuGrapher.createMenu("BattlePlayerHealth");
        FSP.addBattleDisplayPokeballs(
            <IMenu>FSP.MenuGrapher.getMenu("BattlePlayerHealth"),
            battleInfo.player);

        if (battleInfo.opponent.hasActors) {
            FSP.MenuGrapher.createMenu("BattleOpponentHealth");
            FSP.addBattleDisplayPokeballs(
                <IMenu>FSP.MenuGrapher.getMenu("BattleOpponentHealth"),
                battleInfo.player,
                true);
        } else {
            FSP.addBattleDisplayPokemonHealth("opponent");
        }

        FSP.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": battleInfo.automaticMenus
        });
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    textStart[0], battleInfo.opponent.name, textStart[1]
                ]
            ],
            callback
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for an enemy's intro in a battle. They enter, and either send
     * out a Pokemon or let the player intro.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene
     */
    cutsceneBattleOpponentIntro(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings): void {
        let things: any = settings.things,
            opponent: ICharacter = things.opponent,
            menu: IMenu = <IMenu>FSP.MenuGrapher.getMenu("GeneralText"),
            opponentX: number = FSP.getMidX(opponent),
            opponentGoal: number = menu.right + opponent.width * FSP.unitsize / 2,
            battleInfo: IBattleInfo = settings.battleInfo,
            callback: string = battleInfo.opponent.hasActors
                ? "OpponentSendOut"
                : "PlayerIntro",
            timeout: number = 49;

        FSP.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        FSP.TimeHandler.addEvent(
            FSP.animateFadeAttribute,
            (timeout / 2) | 0,
            opponent,
            "opacity",
            -2 / timeout,
            0,
            1);

        FSP.MenuGrapher.deleteMenu("BattleOpponentHealth");
        FSP.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true
        });
        FSP.MenuGrapher.addMenuDialog(
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
        FSP.MenuGrapher.setActiveMenu("GeneralText");

        FSP.TimeHandler.addEvent(
            FSP.ScenePlayer.bindRoutine(
                callback,
                {
                    "nextRoutine": "PlayerIntro"
                }),
            timeout);
    }

    /**
     * Cutscene for a player's intro into battle. Afterwards, the ShowPlayerMenu
     * cutscene is triggered.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene
     */
    cutsceneBattlePlayerIntro(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings): void {
        let things: any = settings.things,
            player: IPlayer = things.player,
            menu: IMenu = <IMenu>FSP.MenuGrapher.getMenu("GeneralText"),
            playerX: number = FSP.getMidX(player),
            playerGoal: number = menu.left - player.width * FSP.unitsize / 2,
            battleInfo: IBattleInfo = settings.battleInfo,
            timeout: number = 24;

        FSP.MenuGrapher.deleteMenu("BattlePlayerHealth");

        if (!battleInfo.player.hasActors) {
            FSP.ScenePlayer.playRoutine("ShowPlayerMenu");
            return;
        }

        FSP.animateSlideHorizontal(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        FSP.TimeHandler.addEvent(
            FSP.animateFadeAttribute,
            (timeout / 2) | 0,
            player,
            "opacity",
            -2 / timeout,
            0,
            1);

        FSP.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true
        });
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    battleInfo.textPlayerSendOut[0],
                    battleInfo.player.actors[0].nickname,
                    battleInfo.textPlayerSendOut[1]
                ]
            ]
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");

        FSP.TimeHandler.addEvent(
            FSP.ScenePlayer.bindRoutine(
                "PlayerSendOut",
                {
                    "nextRoutine": "ShowPlayerMenu"
                }),
            timeout);
    }

    /**
     * Cutscene for showing the player menu. The user may now interact with
     * the menu for controlling their side of the battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene
     */
    cutsceneBattleShowPlayerMenu(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings): void {
        FSP.MenuGrapher.deleteMenu("Yes/No");

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.BattleMover.showPlayerMenu();

        if (settings.battleInfo.onShowPlayerMenu) {
            settings.battleInfo.onShowPlayerMenu(FSP);
        }
    }

    /**
     * Cutscene for the opponent starting to send out a Pokemon. A smoke effect
     * plays, then the OpponentSendOutAppear cutscene triggers.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene
     * @param args   Settings to pass to the OpponentSendOut cutscene.
     */
    cutsceneBattleOpponentSendOut(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleRoutineSettings): void {
        let menu: IMenu = settings.things.menu,
            left: number = menu.right - FSP.unitsize * 8,
            top: number = menu.top + FSP.unitsize * 32;

        console.warn("Should reset *Normal statistics for opponent Pokemon.");

        settings.opponentLeft = left;
        settings.opponentTop = top;

        FSP.MenuGrapher.setActiveMenu(undefined);

        FSP.animateSmokeSmall(
            left,
            top,
            FSP.ScenePlayer.bindRoutine("OpponentSendOutAppear", args)
        );
    }

    /**
     * Cutscene for the opponent's Pokemon appearing. The .nextRoutine from args
     * is played.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene
     * @param args   Settings to pass to the next routine.
     */
    cutsceneBattleOpponentSendOutAppear(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleRoutineSettings): void {
        let opponentInfo: BattleMovr.IBattleThingsInfo = settings.battleInfo.opponent,
            pokemonInfo: BattleMovr.IActor = opponentInfo.actors[opponentInfo.selectedIndex],
            pokemon: BattleMovr.IThing = FSP.BattleMover.setThing(
                "opponent",
                pokemonInfo.title.join("") + "Front");

        console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);

        FSP.addBattleDisplayPokemonHealth("opponent");
        FSP.addPokemonToPokedex(pokemonInfo.title, PokedexListingStatus.Seen);

        if (args) {
            FSP.ScenePlayer.playRoutine(args.nextRoutine);
        }
    }

    /**
     * Cutscene for the player starting to send out a Pokemon. A smoke effect
     * plays, then the PlayerSendOutAppear cutscene triggers.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene
     * @param args   Settings to pass to the PlayerSendOut cutscene.
     */
    cutsceneBattlePlayerSendOut(FSP: FullScreenPokemon, settings: any, args: IBattleRoutineSettings): void {
        let menu: IMenu = settings.things.menu,
            left: number = menu.left + FSP.unitsize * 8,
            top: number = menu.bottom - FSP.unitsize * 8;

        console.warn("Should reset *Normal statistics for player Pokemon.");

        settings.playerLeft = left;
        settings.playerTop = top;

        FSP.MenuGrapher.setActiveMenu(undefined);

        FSP.animateSmokeSmall(
            left,
            top,
            FSP.ScenePlayer.bindRoutine("PlayerSendOutAppear", args));
    }

    /**
     * Cutscene for the player's Pokemon appearing. The .nextRoutine from args
     * is played.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene
     * @param args   Settings to pass to the next routine.
     */
    cutsceneBattlePlayerSendOutAppear(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleRoutineSettings): void {
        let playerInfo: BattleMovr.IBattleThingsInfo = settings.battleInfo.player,
            pokemonInfo: BattleMovr.IActor = playerInfo.selectedActor,
            pokemon: BattleMovr.IThing = FSP.BattleMover.setThing(
                "player",
                pokemonInfo.title.join("") + "Back");

        console.log("Should make the zoom-in animation for appearing Pokemon...", pokemon);

        FSP.addBattleDisplayPokemonHealth("player");

        FSP.MenuGrapher.createMenu("BattlePlayerHealthNumbers");
        FSP.setBattleDisplayPokemonHealthBar("Player", pokemonInfo.HP, pokemonInfo.HPNormal);
        FSP.ScenePlayer.playRoutine(args.nextRoutine);
    }

    /**
     * Cutscene for the player attempting to switch a Pokemon with itself.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneBattlePlayerSwitchesSamePokemon(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings): void {
        FSP.MenuGrapher.createMenu("GeneralText", {
            "backMenu": "PokemonMenuContext"
        });
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                settings.battleInfo.player.selectedActor.nickname, " is already out!"
            ]);
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player to start a Pokemon move. After the announcement text,
     * the MovePlayerAnimate cutscene is played.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneBattleMovePlayer(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleMoveRoutineSettings): void {
        let player: BattleMovr.IBattleThingsInfo = settings.battleInfo.player,
            playerActor: BattleMovr.IActor = player.selectedActor,
            opponent: BattleMovr.IBattleThingsInfo = settings.battleInfo.opponent,
            opponentActor: BattleMovr.IActor = opponent.selectedActor,
            choice: string = args.choicePlayer;

        args.damage = FSP.MathDecider.compute("damage", choice, playerActor, opponentActor);

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    playerActor.nickname, " used ", choice + "!"
                ]
            ],
            FSP.ScenePlayer.bindRoutine("MovePlayerAnimate", args)
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for animating the player's chosen move.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneBattleMovePlayerAnimate(FPS: FullScreenPokemon, settings: any, args: IBattleMoveRoutineSettings): void {
        let choice: string = args.choicePlayer,
            move: IPokemonMoveListing = FPS.MathDecider.getConstant("moves")[choice];

        console.log("Should do something with", move);

        args.attackerName = "player";
        args.defenderName = "opponent";

        args.callback = function (): void {
            let callback: Function;

            args.movePlayerDone = true;

            if (args.moveOpponentDone) {
                callback = function (): void {
                    args.movePlayerDone = false;
                    args.moveOpponentDone = false;
                    FPS.MenuGrapher.createMenu("GeneralText");
                    FPS.BattleMover.showPlayerMenu();
                };
            } else {
                callback = FPS.TimeHandler.addEvent.bind(
                    FPS.TimeHandler,
                    FPS.ScenePlayer.bindRoutine("MoveOpponent", args),
                    7);
            }

            FPS.ScenePlayer.playRoutine("Damage", {
                "battlerName": "opponent",
                "damage": args.damage,
                "callback": callback
            });
        };

        // @todo: When all moves have been implemented, this will be simplified.
        if (!FPS.ScenePlayer.getOtherRoutine("Attack" + choice.replace(" ", ""))) {
            console.warn(choice + " attack animation not implemented...");
            args.callback();
        } else {
            FPS.ScenePlayer.playRoutine("Attack" + choice.replace(" ", ""), args);
        }
    }

    /**
     * Cutscene for the opponent to start a Pokemon move. After the announcement text,
     * the MoveOpponentAnimate cutscene is played.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneBattleMoveOpponent(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleMoveRoutineSettings): void {
        let opponent: BattleMovr.IBattleThingsInfo = settings.battleInfo.opponent,
            opponentActor: BattleMovr.IActor = opponent.selectedActor,
            player: BattleMovr.IBattleThingsInfo = settings.battleInfo.player,
            playerActor: BattleMovr.IActor = player.selectedActor,
            choice: string = args.choiceOpponent;

        args.damage = FSP.MathDecider.compute("damage", choice, opponentActor, playerActor);

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    opponent.selectedActor.nickname, " used ", choice + "!"
                ]
            ],
            FSP.ScenePlayer.bindRoutine("MoveOpponentAnimate", args));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for animating an opponent's chosen move.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneBattleMoveOpponentAnimate(
        FSP: FullScreenPokemon,
        settings: IBattleCutsceneSettings,
        args: IBattleMoveRoutineSettings): void {
        let choice: string = args.choiceOpponent,
            move: string = FSP.MathDecider.getConstant("moves")[choice];

        console.log("Should do something with", move);

        args.attackerName = "opponent";
        args.defenderName = "player";

        args.callback = function (): void {
            let callback: Function;

            args.moveOpponentDone = true;

            if (args.movePlayerDone) {
                callback = function (): void {
                    args.movePlayerDone = false;
                    args.moveOpponentDone = false;
                    FSP.MenuGrapher.createMenu("GeneralText");
                    FSP.BattleMover.showPlayerMenu();
                };
            } else {
                callback = FSP.TimeHandler.addEvent.bind(
                    FSP.TimeHandler,
                    FSP.ScenePlayer.bindRoutine("MovePlayer", args),
                    7);
            }

            FSP.ScenePlayer.playRoutine("Damage", {
                "battlerName": "player",
                "damage": args.damage,
                "callback": callback
            });
        };

        // @todo: When all moves have been implemented, this will be simplified.
        if (!FSP.ScenePlayer.getOtherRoutine("Attack" + choice.replace(" ", ""))) {
            console.warn(choice + " attack animation not implemented...");
            args.callback();
        } else {
            FSP.ScenePlayer.playRoutine("Attack" + choice.replace(" ", ""), args);
        }
    }

    /**
     * Cutscene for applying and animating damage in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneBattleDamage(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleActionRoutineSettings): void {
        let battlerName: string = args.battlerName,
            damage: number = args.damage,
            battleInfo: IBattleInfo = <IBattleInfo>FSP.BattleMover.getBattleInfo(),
            battler: BattleMovr.IBattleThingsInfo = battleInfo[battlerName],
            actor: BattleMovr.IActor = battler.selectedActor,
            hpStart: number = actor.HP,
            hpEnd: number = Math.max(hpStart - damage, 0),
            callback: (...args: any[]) => void = hpEnd === 0
                ? FSP.TimeHandler.addEvent.bind(
                    FSP.TimeHandler,
                    FSP.ScenePlayer.bindRoutine(
                        "PokemonFaints",
                        {
                            "battlerName": battlerName
                        }),
                    49)
                : args.callback;

        if (damage !== 0) {
            FSP.animateBattleDisplayPokemonHealthBar(
                battlerName,
                hpStart,
                hpEnd,
                actor.HPNormal,
                callback);

            actor.HP = hpEnd;
        } else {
            callback(FSP);
        }
    }

    /**
     * Cutscene for a Pokemon fainting in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneBattlePokemonFaints(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleActionRoutineSettings): void {
        let battlerName: string = args.battlerName,
            battleInfo: IBattleInfo = <IBattleInfo>FSP.BattleMover.getBattleInfo(),
            actor: BattleMovr.IActor = battleInfo[battlerName].selectedActor,
            thing: IThing = settings.things[battlerName],
            blank: IThing = FSP.ObjectMaker.make(
                "WhiteSquare",
                {
                    "width": thing.width * thing.scale,
                    "height": thing.height * thing.scale
                }),
            texts: IThing[] = <IThing[]>FSP.GroupHolder.getGroup("Text"),
            background: IThing = <IThing>FSP.BattleMover.getBackgroundThing(),
            backgroundIndex: number = texts.indexOf(background),
            nextRoutine: string = battlerName === "player"
                ? "AfterPlayerPokemonFaints" : "AfterOpponentPokemonFaints";

        FSP.addThing(
            blank,
            thing.left,
            thing.top + thing.height * thing.scale * thing.FSP.unitsize);

        FSP.arrayToIndex(blank, texts, backgroundIndex + 1);
        FSP.arrayToIndex(thing, texts, backgroundIndex + 1);

        FSP.animateSlideVertical(
            thing,
            FSP.unitsize * 2,
            FSP.getMidY(thing) + thing.height * thing.scale * FSP.unitsize,
            1,
            function (): void {
                FSP.killNormal(thing);
                FSP.killNormal(blank);
                FSP.MenuGrapher.createMenu("GeneralText");
                FSP.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        [
                            actor.nickname, " fainted!"
                        ]
                    ],
                    FSP.ScenePlayer.bindRoutine(nextRoutine, args)
                );
                FSP.MenuGrapher.setActiveMenu("GeneralText");
            });

        FSP.ModAttacher.fireEvent("onFaint", actor, battleInfo.player.actors);
    }

    /**
     * Cutscene for choosing what to do after a Pokemon faints in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneBattleAfterPlayerPokemonFaints(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings): void {
        let battleInfo: IBattleInfo = <IBattleInfo>FSP.BattleMover.getBattleInfo(),
            actorAvailable: boolean = FSP.checkArrayMembersIndex(battleInfo.player.actors, "HP");

        if (actorAvailable) {
            FSP.ScenePlayer.playRoutine("PlayerChoosesPokemon");
        } else {
            FSP.ScenePlayer.playRoutine("Defeat");
        }
    }

    /**
     * Cutscene for after an opponent's Pokemon faints in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneBattleAfterOpponentPokemonFaints(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings): void {
        let battleInfo: IBattleInfo = settings.battleInfo,
            opponent: BattleMovr.IBattleThingsInfo = battleInfo.opponent,
            actorAvailable: boolean = FSP.checkArrayMembersIndex(opponent.actors, "HP"),
            experienceGained: number = FSP.MathDecider.compute(
                "experienceGained", battleInfo.player, battleInfo.opponent),
            callback: Function;

        if (actorAvailable) {
            callback = FSP.ScenePlayer.bindRoutine("OpponentSwitchesPokemon");
        } else {
            callback = FSP.ScenePlayer.bindRoutine("Victory");
        }

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    battleInfo.player.selectedActor.nickname,
                    " gained ",
                    experienceGained.toString(),
                    " EXP. points!"
                ]
            ],
            FSP.ScenePlayer.bindRoutine(
                "ExperienceGain",
                {
                    "experienceGained": experienceGained,
                    "callback": callback
                }
            ));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for an opponent switching Pokemon in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneBattleOpponentSwitchesPokemon(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings): void {
        let battleInfo: IBattleInfo = settings.battleInfo,
            opponent: BattleMovr.IBattleThingsInfo = battleInfo.opponent,
            nicknameExclaim: string[] = opponent.selectedActor.nickname.slice();

        nicknameExclaim.push("!");

        FSP.BattleMover.switchActor("opponent", opponent.selectedIndex + 1);

        FSP.MenuGrapher.createMenu("GeneralText", {
            "deleteOnFinish": false
        });
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                opponent.name,
                "is about to use",
                nicknameExclaim,
                "Will %%%%%%%PLAYER%%%%%%% change %%%%%%%POKEMON%%%%%%%?"
            ],
            function (): void {
                FSP.MenuGrapher.createMenu("Yes/No");
                FSP.MenuGrapher.addMenuList("Yes/No", {
                    "options": [
                        {
                            "text": "Yes",
                            "callback": FSP.ScenePlayer.bindRoutine(
                                "PlayerSwitchesPokemon",
                                {
                                    "nextRoutine": "OpponentSendOut"
                                })
                        }, {
                            "text": "No",
                            "callback": FSP.ScenePlayer.bindRoutine(
                                "OpponentSendOut",
                                {
                                    "nextRoutine": "ShowPlayerMenu"
                                })
                        }]
                });
                FSP.MenuGrapher.setActiveMenu("Yes/No");
            }
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");

    }

    /**
     * Cutscene for a player's Pokemon gaining experience in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneBattleExperienceGain(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleLevelRoutineSettings): void {
        let battleInfo: IBattleInfo = settings.battleInfo,
            gains: number = args.experienceGained,
            actor: BattleMovr.IActor = battleInfo.player.selectedActor,
            experience: BattleMovr.IActorExperience = actor.experience;

        console.warn("Experience gain is hardcoded to the current actor...");

        experience.current += gains;
        experience.remaining -= gains;

        if (experience.remaining < 0) {
            gains -= experience.remaining;
            FSP.ScenePlayer.playRoutine("LevelUp", {
                "experienceGained": gains,
                "callback": args.callback
            });
        } else {
            args.callback();
        }
    }

    /**
     * Cutscene for a player's Pokemon leveling up in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneBattleLevelUp(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleLevelRoutineSettings): void {
        let battleInfo: IBattleInfo = settings.battleInfo,
            // gains: number = args.experienceGained,
            actor: BattleMovr.IActor = battleInfo.player.selectedActor;

        actor.level += 1;
        actor.experience = FSP.MathDecider.compute(
            "newPokemonExperience", actor.title, actor.level);

        console.warn("Leveling up does not yet increase stats...");

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    actor.nickname,
                    " grew to level ",
                    actor.level.toString(),
                    "!"
                ]
            ],
            FSP.ScenePlayer.bindRoutine("LevelUpStats", args)
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for displaying a Pokemon's statistics in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneBattleLevelUpStats(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleLevelRoutineSettings): void {
        FSP.openPokemonLevelUpStats({
            "container": "BattleDisplayInitial",
            "position": {
                "horizontal": "right",
                "vertical": "bottom",
                "offset": {
                    "left": 4
                }
            },
            "pokemon": settings.battleInfo.player.selectedActor,
            "onMenuDelete": args.callback
        });
        FSP.MenuGrapher.setActiveMenu("LevelUpStats");

        console.warn("For stones, LevelUpStats should be taken out of battles.");
    }

    /**
     * Cutscene for a player choosing a Pokemon (creating the menu for it).
     * 
     * @param FSP
     */
    cutsceneBattlePlayerChoosesPokemon(FSP: FullScreenPokemon): void {
        FSP.MenuGrapher.createMenu("Pokemon", {
            "position": {
                "vertical": "center",
                "offset": {
                    "left": 0
                }
            }
        });
    }

    /**
     * Cutscene for failing to run from a trainer battle.
     * 
     * @param FSP
     */
    cutsceneBattleExitFail(FSP: FullScreenPokemon): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            "No! There's no running from a trainer battle!",
            FSP.ScenePlayer.bindRoutine("BattleExitFailReturn"));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for returning to a battle after failing to exit.
     * 
     * @param FSP
     */
    cutsceneBattleExitFailReturn(FSP: FullScreenPokemon): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.BattleMover.showPlayerMenu();
    }

    /**
     * Cutscene for becoming victorious in battle.
     * 
     * @param FSP
     */
    cutsceneBattleVictory(FSP: FullScreenPokemon): void {
        let battleInfo: IBattleInfo = <IBattleInfo>FSP.BattleMover.getBattleInfo(),
            opponent: BattleMovr.IBattleThingsInfo = battleInfo.opponent;

        if (!opponent.hasActors) {
            FSP.BattleMover.closeBattle(function (): void {
                FSP.animateFadeFromColor(FSP, {
                    "color": "White"
                });
            });
            return;
        }

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "%%%%%%%PLAYER%%%%%%% defeated ",
                    opponent.name,
                    "!"
                ]
            ],
            FSP.ScenePlayer.bindRoutine("VictorySpeech")
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the opponent responding to the player's victory.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneBattleVictorySpeech(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings): void {
        let battleInfo: IBattleInfo = settings.battleInfo,
            menu: IMenu = <IMenu>FSP.MenuGrapher.getMenu("BattleDisplayInitial"),
            opponent: IThing = <IThing>FSP.BattleMover.setThing("opponent", battleInfo.opponent.sprite),
            timeout: number = 35,
            opponentX: number,
            opponentGoal: number;

        opponent.opacity = 0;

        FSP.setTop(opponent, menu.top);
        FSP.setLeft(opponent, menu.right);
        opponentX = FSP.getMidX(opponent);
        opponentGoal = menu.right - opponent.width * FSP.unitsize / 2;

        FSP.animateFadeAttribute(opponent, "opacity", 4 / timeout, 1, 1);
        FSP.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1,
            function (): void {
                FSP.MenuGrapher.createMenu("GeneralText");
                FSP.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    battleInfo.textVictory,
                    FSP.ScenePlayer.bindRoutine("VictoryWinnings"));
                FSP.MenuGrapher.setActiveMenu("GeneralText");
            });
    }

    /**
     * Cutscene for receiving cash for defeating an opponent.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene
     */
    cutsceneBattleVictoryWinnings(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings): void {
        let battleInfo: IBattleInfo = settings.battleInfo,
            reward: number = battleInfo.opponent.reward,
            animationSettings: any = {
                "color": "White"
            },
            callback: () => void = function (): void {
                FSP.BattleMover.closeBattle(function (): void {
                    FSP.animateFadeFromColor(FSP, animationSettings);
                });
            };

        if (battleInfo.giftAfterBattle) {
            FSP.addItemToBag(battleInfo.giftAfterBattle, battleInfo.giftAfterBattleAmount || 1);
        }

        if (battleInfo.badge) {
            FSP.ItemsHolder.getItem("badges")[battleInfo.badge] = true;
        }

        if (battleInfo.textAfterBattle) {
            animationSettings.callback = function (): void {
                FSP.MenuGrapher.createMenu("GeneralText");
                FSP.MenuGrapher.addMenuDialog("GeneralText", battleInfo.textAfterBattle);
                FSP.MenuGrapher.setActiveMenu("GeneralText");
            };
        }

        if (!reward) {
            callback();
            return;
        }

        FSP.ItemsHolder.increase("money", reward);

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% got $" + reward + " for winning!"
            ],
            callback);
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player being defeated in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneBattleDefeat(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings): void {
        let battleInfo: IBattleInfo = settings.battleInfo,
            message: string[] = ["%%%%%%%PLAYER%%%%%%% is out of useable %%%%%%%POKEMON%%%%%%%!"],
            callback: Function;

        if (!battleInfo.noBlackout) {
            message.push("%%%%%%%PLAYER%%%%%%% blacked out!");
            callback = function (): void {
                let transport: ITransportSchema = FSP.ItemsHolder.getItem("lastPokecenter");

                FSP.BattleMover.closeBattle();
                FSP.setMap(transport.map, transport.location);

                FSP.ItemsHolder.getItem("PokemonInParty").forEach(FSP.healPokemon.bind(FSP));
            };
        } else {
            callback = function (): void {
                FSP.BattleMover.closeBattle();
            };
        }

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            message,
            FSP.animateFadeToColor.bind(FSP, FSP, {
                "color": "Black",
                "callback": function (): void {
                    callback();
                }
            }));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene a battle completely finishing.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneBattleComplete(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings): void {
        FSP.MapScreener.blockInputs = false;
        FSP.moveBattleKeptThingsBack(settings.battleInfo);
        FSP.ItemsHolder.setItem("PokemonInParty", settings.battleInfo.player.actors);
        FSP.ModAttacher.fireEvent("onBattleComplete", settings.battleInfo);
        if (FSP.MapScreener.theme) {
            FSP.AudioPlayer.playTheme(FSP.MapScreener.theme);
        }
    }

    /**
     * Cutscene for changing a statistic in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneBattleChangeStatistic(FSP: FullScreenPokemon, settings: any, args: IBattleStatisticRoutineSettings): void {
        let battleInfo: IBattleInfo = settings.battleInfo,
            defenderName: string = args.defenderName,
            defender: BattleMovr.IActor = battleInfo[defenderName].selectedActor,
            defenderLabel: string = defenderName === "opponent"
                ? "Enemy " : "",
            statistic: string = args.statistic,
            amount: number = args.amount,
            amountLabel: string;

        defender[statistic] -= amount;

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

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
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
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }


    /* Battle attack animations
    */

    /**
     * Cutscene for a Growl attack in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneBattleAttackGrowl(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        let attackerName: string = args.attackerName;
        let defenderName: string = args.defenderName;
        let attacker: IThing = <IThing>FSP.BattleMover.getThing(attackerName);
        let defender: IThing = <IThing>FSP.BattleMover.getThing(defenderName);
        let direction: number = attackerName === "player" ? 1 : -1;
        let notes: IThing[] = [
                FSP.ObjectMaker.make("Note"),
                FSP.ObjectMaker.make("Note")
            ];
        let menu: IMenu = <IMenu>FSP.MenuGrapher.getMenu("BattleDisplayInitial");
        let dt: number = 10;
        let startX: number;
        let startY: number;
        let movement: (note: IThing, dt: number) => void = function (note: IThing, dt: number): void {
            let flip: number = 1;
            let differenceX: number;
            let differenceY: number;

            if (direction === 1) {
                differenceX = menu.right - startX;
                differenceY = (menu.top + defender.height / 2 * FSP.unitsize) - startY;
            } else {
                differenceX = menu.left - startX;
                differenceY = (menu.bottom - defender.height * FSP.unitsize) - startY;
            }

            for (let i: number = 1; i <= 4; i += 1) {
                FSP.TimeHandler.addEvent(
                    function (): void {
                        FSP.shiftHoriz(note, differenceX / 4);
                        if (flip === 1) {
                            FSP.shiftVert(note, differenceY / 10 * 6);
                        } else {
                            FSP.shiftVert(note, -1 * differenceY / 8);
                        }
                        flip *= -1;
                    },
                    dt * i);
            }
        };

        if (direction === 1) {
            startX = menu.left + attacker.width / 2 * FSP.unitsize;
            startY = menu.bottom - attacker.height * FSP.unitsize;
        } else {
            startX = menu.right - attacker.width / 2 * FSP.unitsize;
            startY = menu.top + attacker.height * FSP.unitsize;
        }

        FSP.addThing(notes[0], startX, startY);
        FSP.TimeHandler.addEvent(
            FSP.addThing.bind(FSP),
            2,
            notes[1],
            startX + notes[1].width / 2 * FSP.unitsize,
            startY + FSP.unitsize * 3);

        movement(notes[0], dt);
        movement(notes[1], dt + 2);

        FSP.TimeHandler.addEvent(FSP.killNormal, 5 * dt, notes[0]);
        FSP.TimeHandler.addEvent(FSP.killNormal, 5 * dt + 2, notes[1]);

        FSP.TimeHandler.addEvent(
            function (): void {
                FSP.animateScreenShake(
                    FSP,
                    3,
                    0,
                    6,
                    undefined,
                    FSP.ScenePlayer.bindRoutine(
                        "ChangeStatistic",
                        FSP.proliferate(
                            {
                                "callback": args.callback,
                                "defenderName": defenderName,
                                "statistic": "Attack",
                                "amount": -1
                            },
                            args)));
            },
            5 * dt);

    }

    /**
     * Cutscene for a Tackle attack in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneBattleAttackTackle(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        let attackerName: string = args.attackerName,
            defenderName: string = args.defenderName,
            attacker: IThing = <IThing>FSP.BattleMover.getThing(attackerName),
            defender: IThing = <IThing>FSP.BattleMover.getThing(defenderName),
            direction: number = attackerName === "player" ? 1 : -1,
            xvel: number = 7 * direction,
            dt: number = 7,
            movement: TimeHandlr.ITimeEvent = FSP.TimeHandler.addEventInterval(
                function (): void {
                    FSP.shiftHoriz(attacker, xvel);
                },
                1,
                Infinity);

        FSP.TimeHandler.addEvent(
            function (): void {
                xvel *= -1;
            },
            dt);

        FSP.TimeHandler.addEvent(FSP.TimeHandler.cancelEvent, dt * 2 - 1, movement);

        if (attackerName === "player") {
            FSP.TimeHandler.addEvent(
                FSP.animateFlicker,
                dt * 2,
                defender,
                14,
                5,
                args.callback);
        } else {
            FSP.TimeHandler.addEvent(
                FSP.animateScreenShake,
                dt * 2,
                FSP,
                0,
                undefined,
                undefined,
                undefined,
                FSP.animateFlicker.bind(
                    FSP,
                    defender,
                    14,
                    5,
                    args.callback)
            );
        }
    }

    /**
     * Cutscene for a Tail Whip attack in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneBattleAttackTailWhip(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        let attackerName: string = args.attackerName,
            defenderName: string = args.defenderName,
            attacker: IThing = <IThing>FSP.BattleMover.getThing(attackerName),
            direction: number = attackerName === "player" ? 1 : -1,
            dt: number = 11,
            dx: number = FSP.unitsize * 4;

        FSP.shiftHoriz(attacker, dx * direction);

        FSP.TimeHandler.addEvent(FSP.shiftHoriz, dt, attacker, -dx * direction);
        FSP.TimeHandler.addEvent(FSP.shiftHoriz, dt * 2, attacker, dx * direction);
        FSP.TimeHandler.addEvent(FSP.shiftHoriz, dt * 3, attacker, -dx * direction);

        FSP.TimeHandler.addEvent(
            FSP.animateScreenShake,
            (dt * 3.5) | 0,
            FSP,
            3,
            0,
            6,
            undefined,
            FSP.ScenePlayer.bindRoutine(
                "ChangeStatistic",
                {
                    "callback": args.callback,
                    "defenderName": defenderName,
                    "statistic": "Defense",
                    "amount": -1
                }));
    }

    /**
     * Cutscene for a Scratch attack in battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneBattleAttackScratch(FSP: FullScreenPokemon, settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
        let defenderName: string = args.defenderName;
        let defender: IThing = <IThing>FSP.BattleMover.getThing(defenderName);
        let dt: number = 1;
        let direction: number = defenderName === "opponent" ? -1 : 1;
        let differenceX: number = defender.width / 2 * FSP.unitsize;
        let lineArray: IThing[] = [];
        let menu: IMenu = <IMenu>FSP.MenuGrapher.getMenu("BattleDisplayInitial");
        let scratches: IThing[] = [
            FSP.ObjectMaker.make("ExplosionSmall"),
            FSP.ObjectMaker.make("ExplosionSmall"),
            FSP.ObjectMaker.make("ExplosionSmall")
        ];
        let startX: number;
        let startY: number;

        if (direction === -1) {
            startX = menu.right - defender.width / 2 * FSP.unitsize;
            startY = menu.top;
        } else {
            startX = menu.left + defender.width * FSP.unitsize;
            startY = menu.bottom - (defender.height + 8) * FSP.unitsize;
        }

        FSP.addThing(scratches[0], startX, startY);
        let offset: number = scratches[0].width * FSP.unitsize / 2;
        FSP.addThing(scratches[1], startX + offset * direction * -1, startY + offset);
        FSP.addThing(scratches[2], startX + offset * direction * -2, startY + offset * 2);

        FSP.TimeHandler.addEventInterval(
            function (): void {
                for (let scratch of scratches) {
                    let left: number = direction === -1 ? scratch.left : scratch.right - 3 * FSP.unitsize;
                    let top: number =  scratch.bottom - 3 * FSP.unitsize;

                    FSP.TimeHandler.addEvent(FSP.shiftHoriz, dt, scratch, differenceX * direction / 16);
                    FSP.TimeHandler.addEvent(FSP.shiftVert, dt, scratch, differenceX / 16);

                    let line: IThing = FSP.addThing("ScratchLine", left, top);
                    if (direction === 1) {
                        FSP.flipHoriz(line);
                    }
                    lineArray.push(line);
                }
            },
            dt,
            16);

        FSP.TimeHandler.addEvent(
            function (): void {
                for (let scratch of scratches) {
                    FSP.killNormal(scratch);
                }

                for (let line of lineArray) {
                    FSP.killNormal(line);
                }

                FSP.animateFlicker(defender, 14, 5, args.callback);
            },
            17 * dt);
    }


    /* Outdoor cutscenes
    */

    /**
     * Cutscene for when a trainer is encountered for battle.
     * 
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneTrainerSpottedExclamation(FSP: FullScreenPokemon, settings: any): void {
        FSP.animateCharacterPreventWalking(FSP.player);
        FSP.animateExclamation(
            settings.triggerer,
            70,
            FSP.ScenePlayer.bindRoutine("Approach"));
    }

    /**
     * Cutscene for when a trainer approaches the player after being encountered. 
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneTrainerSpottedApproach(FSP: FullScreenPokemon, settings: any): void {
        let player: IPlayer = settings.player,
            triggerer: ICharacter = settings.triggerer,
            direction: Direction = triggerer.direction,
            directionName: string = Direction[direction].toLowerCase(),
            locationTriggerer: number = triggerer[directionName],
            locationPlayer: number = player[DirectionOpposites[directionName]],
            distance: number = Math.abs(locationTriggerer - locationPlayer),
            blocks: number = Math.max(0, distance / FSP.unitsize / 8);

        if (blocks) {
            FSP.animateCharacterStartWalking(
                triggerer,
                direction,
                [
                    blocks,
                    FSP.ScenePlayer.bindRoutine("Dialog")
                ]
            );
        } else {
            FSP.ScenePlayer.playRoutine("Dialog");
        }
    }

    /**
     * Cutscene for a trainer introduction after the player is approached.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneTrainerSpottedDialog(FSP: FullScreenPokemon, settings: any): void {
        FSP.collideCharacterDialog(settings.player, settings.triggerer);
        FSP.MapScreener.blockInputs = false;
    }

    /**
     * Cutscene for a nurse's welcome at the Pokemon Center.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene. 
     */
    cutscenePokeCenterWelcome(FSP: FullScreenPokemon, settings: any): void {
        settings.nurse = FSP.getThingById(settings.nurseId || "Nurse");
        settings.machine = FSP.getThingById(settings.machineId || "HealingMachine");

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Welcome to our %%%%%%%POKEMON%%%%%%% CENTER!",
                "We heal your %%%%%%%POKEMON%%%%%%% back to perfect health!",
                "Shall we heal your %%%%%%%POKEMON%%%%%%%?"
            ],
            FSP.ScenePlayer.bindRoutine("Choose")
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for choosing whether or not to heal Pokemon.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene. 
     */
    cutscenePokeCenterChoose(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("Heal/Cancel");
        FSP.MenuGrapher.addMenuList(
            "Heal/Cancel",
            {
                "options": [
                    {
                        "text": "HEAL",
                        "callback": FSP.ScenePlayer.bindRoutine("ChooseHeal")
                    },
                    {
                        "text": "CANCEL",
                        "callback": FSP.ScenePlayer.bindRoutine("ChooseCancel")
                    }
                ]
            }
        );
        FSP.MenuGrapher.setActiveMenu("Heal/Cancel");
    }

    /**
     * Cutscene for choosing to heal Pokemon.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutscenePokeCenterChooseHeal(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.deleteMenu("Heal/Cancel");

        FSP.MenuGrapher.createMenu("GeneralText", {
            "ignoreA": true,
            "finishAutomatically": true
        });
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Ok. We'll need your %%%%%%%POKEMON%%%%%%%."
            ],
            FSP.ScenePlayer.bindRoutine("Healing")
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for placing Pokeballs into the healing machine.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene. 
     */
    cutscenePokeCenterHealing(FSP: FullScreenPokemon, settings: any): void {
        let party: BattleMovr.IActor[] = FSP.ItemsHolder.getItem("PokemonInParty"),
            balls: IThing[] = [],
            dt: number = 35,
            left: number = settings.machine.left + 5 * FSP.unitsize,
            top: number = settings.machine.top + 7 * FSP.unitsize,
            i: number = 0;

        settings.balls = balls;
        FSP.animateCharacterSetDirection(settings.nurse, 3);

        FSP.TimeHandler.addEventInterval(
            function (): void {
                balls.push(
                    FSP.addThing(
                        "HealingMachineBall",
                        left + (i % 2) * 3 * FSP.unitsize,
                        top + Math.floor(i / 2) * 2.5 * FSP.unitsize
                    )
                );
                i += 1;
            },
            dt,
            party.length);

        FSP.TimeHandler.addEvent(
            FSP.ScenePlayer.playRoutine.bind(FSP.ScenePlayer),
            dt * (party.length + 1),
            "HealingAction",
            {
                "balls": balls
            });
    }

    /**
     * Cutscene for Pokemon being healed in the healing machine.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutscenePokeCenterHealingAction(FSP: FullScreenPokemon, settings: any, args: any): void {
        let balls: IThing[] = args.balls,
            numFlashes: number = 8,
            i: number = 0,
            changer: Function;

        FSP.TimeHandler.addEventInterval(
            function (): void {
                changer = i % 2 === 0
                    ? FSP.addClass
                    : FSP.removeClass;

                for (let ball of balls) {
                    changer(ball, "lit");
                }

                changer(settings.machine, "lit");

                i += 1;
            },
            21,
            numFlashes);

        FSP.TimeHandler.addEvent(
            FSP.ScenePlayer.playRoutine.bind(FSP.ScenePlayer),
            (numFlashes + 2) * 21,
            "HealingComplete",
            {
                "balls": balls
            }
        );
    }

    /**
     * Cutscene for when the Pokemon have finished healing.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args Settings for the routine.
     */
    cutscenePokeCenterHealingComplete(FSP: FullScreenPokemon, settings: any, args: any): void {
        let balls: IThing[] = args.balls,
            party: BattleMovr.IActor[] = FSP.ItemsHolder.getItem("PokemonInParty");

        balls.forEach(FSP.killNormal.bind(FSP));
        party.forEach(FSP.healPokemon.bind(FSP));

        FSP.animateCharacterSetDirection(settings.nurse, 2);

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you! \n Your %%%%%%%POKEMON%%%%%%% are fighting fit!",
                "We hope to see you again!"
            ],
            function (): void {
                FSP.MenuGrapher.deleteMenu("GeneralText");
                FSP.ScenePlayer.stopCutscene();
            });
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for choosing not to heal Pokemon.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutscenePokeCenterChooseCancel(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.deleteMenu("Heal/Cancel");

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "We hope to see you again!"
            ],
            function (): void {
                FSP.MenuGrapher.deleteMenu("GeneralText");
                FSP.ScenePlayer.stopCutscene();
            });
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for speaking to a PokeMart cashier.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutscenePokeMartGreeting(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true,
            "ignoreA": true,
            "ignoreB": true
        });
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hi there! \n May I help you?"
            ],
            FSP.ScenePlayer.bindRoutine("Options"));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the PokeMart action options.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutscenePokeMartOptions(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("Money");

        FSP.MenuGrapher.createMenu("Buy/Sell", {
            "killOnB": ["Money", "GeneralText"],
            "onMenuDelete": FSP.ScenePlayer.bindRoutine("Exit")
        });
        FSP.MenuGrapher.addMenuList("Buy/Sell", {
            "options": [{
                "text": "BUY",
                "callback": FSP.ScenePlayer.bindRoutine("BuyMenu")
            }, {
                    "text": "SELL",
                    "callback": undefined
                }, {
                    "text": "QUIT",
                    "callback": FSP.MenuGrapher.registerB
                }]
        });
        FSP.MenuGrapher.setActiveMenu("Buy/Sell");
    }

    /**
     * Cutscene for the PokeMart item menu.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * 
     * @todo Add constants for all items, for display names
     */
    cutscenePokeMartBuyMenu(FSP: FullScreenPokemon, settings: any): void {
        let options: any[] = settings.triggerer.items.map(
            function (reference: any): any {
                let text: string = reference.item.toUpperCase(),
                    cost: number = reference.cost;

                return {
                    "text": text,
                    "textsFloating": [{
                        "text": "$" + cost,
                        "x": 42 - String(cost).length * 3.5,
                        "y": 4
                    }],
                    "callback": FSP.ScenePlayer.bindRoutine(
                        "SelectAmount",
                        {
                            "reference": reference,
                            "amount": 1,
                            "cost": cost
                        }),
                    "reference": reference
                };
            });

        options.push({
            "text": "CANCEL",
            "callback": FSP.MenuGrapher.registerB
        });

        FSP.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true
        });
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Take your time."
            ],
            function (): void {
                FSP.MenuGrapher.createMenu("ShopItems", {
                    "backMenu": "Buy/Sell"
                });
                FSP.MenuGrapher.addMenuList("ShopItems", {
                    "options": options
                });
                FSP.MenuGrapher.setActiveMenu("ShopItems");
            }
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for selecting the amount of an item the player wishes to buy.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutscenePokeMartSelectAmount(FSP: FullScreenPokemon, settings: any, args: any): void {
        let reference: any = args.reference,
            amount: number = args.amount,
            cost: number = args.cost,
            costTotal: number = cost * amount,
            text: string = FSP.makeDigit(amount, 2) + FSP.makeDigit("$" + costTotal, 8, " ");

        FSP.MenuGrapher.createMenu("ShopItemsAmount", {
            "childrenSchemas": [
                <MenuGraphr.IMenuWordSchema>{
                    "type": "text",
                    "words": ["Times"],
                    "position": {
                        "offset": {
                            "left": 4,
                            "top": 4.25
                        }
                    }
                },
                <MenuGraphr.IMenuWordSchema>{
                    "type": "text",
                    "words": [text],
                    "position": {
                        "offset": {
                            "left": 8,
                            "top": 3.75
                        }
                    }
                }],
            "onUp": FSP.ScenePlayer.bindRoutine(
                "SelectAmount",
                {
                    "amount": (amount === 99) ? 1 : amount + 1,
                    "cost": cost,
                    "reference": reference
                }),
            "onDown": FSP.ScenePlayer.bindRoutine(
                "SelectAmount",
                {
                    "amount": (amount === 1) ? 99 : amount - 1,
                    "cost": cost,
                    "reference": reference
                }),
            "callback": FSP.ScenePlayer.bindRoutine("ConfirmPurchase", args)
        });
        FSP.MenuGrapher.setActiveMenu("ShopItemsAmount");
    }

    /**
     * Cutscene for confirming a PokeMart purchase.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutscenePokeMartConfirmPurchase(FSP: FullScreenPokemon, settings: any, args: any): void {
        let reference: any = args.reference,
            cost: number = args.cost,
            amount: number = args.amount,
            costTotal: number = args.costTotal = cost * amount;

        FSP.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true
        });
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                reference.item.toUpperCase() + "? \n That will be $" + costTotal + ". OK?"
            ],
            function (): void {
                FSP.MenuGrapher.createMenu("Yes/No", {
                    "position": {
                        "horizontal": "right",
                        "vertical": "bottom",
                        "offset": {
                            "top": 0,
                            "left": 0
                        }
                    },
                    "onMenuDelete": FSP.ScenePlayer.bindRoutine(
                        "CancelPurchase"
                    ),
                    "container": "ShopItemsAmount"
                });
                FSP.MenuGrapher.addMenuList("Yes/No", {
                    "options": [
                        {
                            "text": "YES",
                            "callback": FSP.ScenePlayer.bindRoutine(
                                "TryPurchase", args)
                        }, {
                            "text": "NO",
                            "callback": FSP.ScenePlayer.bindRoutine(
                                "CancelPurchase")
                        }]
                });
                FSP.MenuGrapher.setActiveMenu("Yes/No");
            });
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for canceling a PokeMart purchase.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * 
     * @todo Why is the BuyMenu text appearing twice?
     */
    cutscenePokeMartCancelPurchase(FSP: FullScreenPokemon, settings: any): void {
        FSP.ScenePlayer.playRoutine("BuyMenu");
    }

    /**
     * Cutscene for carrying out a PokeMart transaction. Can either confirm or deny
     * the purchase based on the player's total money. 
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args  Settings for the routine.
     */
    cutscenePokeMartTryPurchase(FSP: FullScreenPokemon, settings: any, args: any): void {
        let costTotal: number = args.costTotal;

        if (FSP.ItemsHolder.getItem("money") < costTotal) {
            FSP.ScenePlayer.playRoutine("FailPurchase", args);
            return;
        }

        FSP.ItemsHolder.decrease("money", args.costTotal);
        FSP.MenuGrapher.createMenu("Money");
        FSP.ItemsHolder.getItem("items").push({
            "item": args.reference.item,
            "amount": args.amount
        });

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Here you are! \n Thank you!"
            ],
            FSP.ScenePlayer.bindRoutine("ContinueShopping"));

        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for when the player does not have enough money for the 
     * PokeMart purchase.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutscenePokeMartFailPurchase(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You don't have enough money."
            ],
            FSP.ScenePlayer.bindRoutine("ContinueShopping")
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for asking if the player wants to continue shopping.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutscenePokeMartContinueShopping(FSP: FullScreenPokemon, settings: any): void {
        if (FSP.MenuGrapher.getMenu("Yes/No")) {
            delete FSP.MenuGrapher.getMenu("Yes/No").onMenuDelete;
        }

        FSP.MenuGrapher.deleteMenu("ShopItems");
        FSP.MenuGrapher.deleteMenu("ShopItemsAmount");
        FSP.MenuGrapher.deleteMenu("Yes/No");

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Is there anything else I can do?"
            ]);

        FSP.MenuGrapher.setActiveMenu("Buy/Sell");
    }

    /**
     * Cutscene for the player choosing to stop shopping.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutscenePokeMartExit(FSP: FullScreenPokemon, settings: any): void {
        FSP.ScenePlayer.stopCutscene();

        FSP.MenuGrapher.deleteMenu("Buy/Sell");
        FSP.MenuGrapher.deleteMenu("Money");

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you!"
            ],
            FSP.MenuGrapher.deleteActiveMenu
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the beginning of the game introduction.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroFadeIn(FSP: FullScreenPokemon, settings: any): void {
        let oak: IThing = FSP.ObjectMaker.make("OakPortrait", {
            "opacity": 0
        });

        settings.oak = oak;

        console.warn("Cannot find Introduction audio theme!");
        // FSP.AudioPlayer.playTheme("Introduction");
        FSP.ModAttacher.fireEvent("onIntroFadeIn", oak);

        FSP.setMap("Blank", "White");
        FSP.MenuGrapher.deleteActiveMenu();

        FSP.addThing(oak);
        FSP.setMidX(oak, FSP.MapScreener.middleX | 0);
        FSP.setMidY(oak, FSP.MapScreener.middleY | 0);

        FSP.TimeHandler.addEvent(
            FSP.animateFadeAttribute,
            70,
            oak,
            "opacity",
            .15,
            1,
            14,
            FSP.ScenePlayer.bindRoutine("FirstDialog"));
    }

    /**
     * Cutscene for Oak's introduction.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroFirstDialog(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hello there! \n Welcome to the world of %%%%%%%POKEMON%%%%%%%!",
                "My name is OAK! People call me the %%%%%%%POKEMON%%%%%%% PROF!"
            ],
            FSP.ScenePlayer.bindRoutine("FirstDialogFade")
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak's introduction exit.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroFirstDialogFade(FSP: FullScreenPokemon, settings: any): void {
        let blank: IThing = FSP.ObjectMaker.make("WhiteSquare", {
            "width": FSP.MapScreener.width,
            "height": FSP.MapScreener.height,
            "opacity": 0
        });

        FSP.addThing(blank, 0, 0);

        FSP.TimeHandler.addEvent(
            FSP.animateFadeAttribute,
            35,
            blank,
            "opacity",
            .15,
            1,
            7,
            FSP.ScenePlayer.bindRoutine("PokemonExpo"));
    }

    /**
     * Cutscene for transitioning Nidorino onto the screen.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroPokemonExpo(FSP: FullScreenPokemon, settings: any): void {
        let pokemon: IThing = FSP.ObjectMaker.make("NIDORINOFront", {
            "flipHoriz": true,
            "opacity": .01
        });

        FSP.GroupHolder.applyOnAll(FSP, FSP.killNormal);

        FSP.addThing(
            pokemon,
            (FSP.MapScreener.middleX + 24 * FSP.unitsize) | 0,
            0);

        FSP.setMidY(pokemon, FSP.MapScreener.middleY);

        FSP.animateFadeAttribute(
            pokemon,
            "opacity",
            .15,
            1,
            3);

        FSP.animateSlideHorizontal(
            pokemon,
            -FSP.unitsize * 2,
            FSP.MapScreener.middleX | 0,
            1,
            FSP.ScenePlayer.bindRoutine("PokemonExplanation"));
    }

    /**
     * Cutscene for showing an explanation of the Pokemon world.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroPokemonExplanation(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This world is inhabited by creatures called %%%%%%%POKEMON%%%%%%%!",
                "For some people, %%%%%%%POKEMON%%%%%%% are pets. Others use them for fights.",
                "Myself...",
                "I study %%%%%%%POKEMON%%%%%%% as a profession."
            ],
            FSP.ScenePlayer.bindRoutine("PlayerAppear")
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the player.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroPlayerAppear(FSP: FullScreenPokemon, settings: any): void {
        let middleX: number = FSP.MapScreener.middleX | 0,
            player: IPlayer = FSP.ObjectMaker.make("PlayerPortrait", {
                "flipHoriz": true,
                "opacity": .01
            });

        settings.player = player;

        FSP.GroupHolder.applyOnAll(FSP, FSP.killNormal);

        FSP.addThing(player, FSP.MapScreener.middleX + 24 * FSP.unitsize, 0);

        FSP.setMidY(player, FSP.MapScreener.middleY);

        FSP.animateFadeAttribute(player, "opacity", .15, 1, 3);

        FSP.animateSlideHorizontal(
            player,
            -FSP.unitsize * 2,
            middleX - player.width * FSP.unitsize / 2,
            1,
            FSP.ScenePlayer.bindRoutine("PlayerName"));
    }

    /**
     * Cutscene asking the player to enter his/her name.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroPlayerName(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "First, what is your name?"
            ],
            FSP.ScenePlayer.bindRoutine("PlayerSlide"));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the player over to show the naming options.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroPlayerSlide(FSP: FullScreenPokemon, settings: any): void {
        FSP.animateSlideHorizontal(
            settings.player,
            FSP.unitsize,
            (FSP.MapScreener.middleX + 16 * FSP.unitsize) | 0,
            1,
            FSP.ScenePlayer.bindRoutine("PlayerNameOptions"));
    }

    /**
     * Cutscene for showing the player naming option menu.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroPlayerNameOptions(FSP: FullScreenPokemon, settings: any): void {
        let fromMenu: Function = FSP.ScenePlayer.bindRoutine("PlayerNameFromMenu"),
            fromKeyboard: Function = FSP.ScenePlayer.bindRoutine("PlayerNameFromKeyboard");

        FSP.MenuGrapher.createMenu("NameOptions");
        FSP.MenuGrapher.addMenuList("NameOptions", {
            "options": [
                {
                    "text": "NEW NAME".split(""),
                    "callback": FSP.openKeyboardMenu.bind(FSP, {
                        "title": "YOUR NAME?",
                        "callback": fromKeyboard
                    })
                }, {
                    "text": "BLUE".split(""),
                    "callback": fromMenu
                }, {
                    "text": "GARY".split(""),
                    "callback": fromMenu
                }, {
                    "text": "JOHN".split(""),
                    "callback": fromMenu
                }]
        });
        FSP.MenuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for the player selecting Blue, Gary, or John.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroPlayerNameFromMenu(FSP: FullScreenPokemon, settings: any): void {
        settings.name = FSP.MenuGrapher.getMenuSelectedOption("NameOptions").text;

        FSP.MenuGrapher.deleteMenu("NameOptions");

        FSP.animateSlideHorizontal(
            settings.player,
            -FSP.unitsize,
            FSP.MapScreener.middleX | 0,
            1,
            FSP.ScenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene for the player choosing to customize a new name.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroPlayerNameFromKeyboard(FSP: FullScreenPokemon, settings: any): void {
        settings.name = (<IKeyboardResultsMenu>FSP.MenuGrapher.getMenu("KeyboardResult")).completeValue;

        FSP.MenuGrapher.deleteMenu("Keyboard");
        FSP.MenuGrapher.deleteMenu("NameOptions");

        FSP.animateSlideHorizontal(
            settings.player,
            -FSP.unitsize,
            FSP.MapScreener.middleX | 0,
            1,
            FSP.ScenePlayer.bindRoutine("PlayerNameConfirm"));
    }

    /**
     * Cutscene confirming the player's name.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroPlayerNameConfirm(FSP: FullScreenPokemon, settings: any): void {
        FSP.ItemsHolder.setItem("name", settings.name);

        FSP.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true
        });
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "Right! So your name is ".split(""),
                    settings.name,
                    "!".split("")
                ]
            ],
            FSP.ScenePlayer.bindRoutine("PlayerNameComplete"));
    }

    /**
     * Cutscene fading the player out.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroPlayerNameComplete(FSP: FullScreenPokemon, settings: any): void {
        let blank: IThing = FSP.ObjectMaker.make("WhiteSquare", {
            "width": FSP.MapScreener.width,
            "height": FSP.MapScreener.height,
            "opacity": 0
        });

        FSP.addThing(blank, 0, 0);

        FSP.TimeHandler.addEvent(
            FSP.animateFadeAttribute,
            35,
            blank,
            "opacity",
            .2,
            1,
            7,
            FSP.ScenePlayer.bindRoutine("RivalAppear"));
    }

    /**
     * Cutscene for showing the rival.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroRivalAppear(FSP: FullScreenPokemon, settings: any): void {
        let rival: IThing = FSP.ObjectMaker.make("RivalPortrait", {
            "opacity": 0
        });

        settings.rival = rival;

        FSP.GroupHolder.applyOnAll(FSP, FSP.killNormal);

        FSP.addThing(rival, 0, 0);
        FSP.setMidX(rival, FSP.MapScreener.middleX | 0);
        FSP.setMidY(rival, FSP.MapScreener.middleY | 0);
        FSP.animateFadeAttribute(
            rival,
            "opacity",
            .1,
            1,
            1,
            FSP.ScenePlayer.bindRoutine("RivalName"));
    }

    /**
     * Cutscene introducing the rival.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene. 
     */
    cutsceneIntroRivalName(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "This is my grand-son. He's been your rival since you were a baby.",
                "...Erm, what is his name again?"
            ],
            FSP.ScenePlayer.bindRoutine("RivalSlide")
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for sliding the rival over to show the rival naming options.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroRivalSlide(FSP: FullScreenPokemon, settings: any): void {
        FSP.animateSlideHorizontal(
            settings.rival,
            FSP.unitsize,
            (FSP.MapScreener.middleX + 16 * FSP.unitsize) | 0,
            1,
            FSP.ScenePlayer.bindRoutine("RivalNameOptions"));
    }

    /**
     * Cutscene for showing the rival naming option menu.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroRivalNameOptions(FSP: FullScreenPokemon, settings: any): void {
        let fromMenu: Function = FSP.ScenePlayer.bindRoutine("RivalNameFromMenu"),
            fromKeyboard: Function = FSP.ScenePlayer.bindRoutine("RivalNameFromKeyboard");

        FSP.MenuGrapher.createMenu("NameOptions");
        FSP.MenuGrapher.addMenuList("NameOptions", {
            "options": [
                {
                    "text": "NEW NAME",
                    "callback": FSP.openKeyboardMenu.bind(FSP, {
                        "title": "RIVAL's NAME?",
                        "callback": fromKeyboard
                    })
                }, {
                    "text": "RED".split(""),
                    "callback": fromMenu
                }, {
                    "text": "ASH".split(""),
                    "callback": fromMenu
                }, {
                    "text": "JACK".split(""),
                    "callback": fromMenu
                }]
        });
        FSP.MenuGrapher.setActiveMenu("NameOptions");
    }

    /**
     * Cutscene for choosing to name the rival Red, Ash, or Jack.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroRivalNameFromMenu(FSP: FullScreenPokemon, settings: any): void {
        settings.name = FSP.MenuGrapher.getMenuSelectedOption("NameOptions").text;

        FSP.MenuGrapher.deleteMenu("NameOptions");

        FSP.animateSlideHorizontal(
            settings.rival,
            -FSP.unitsize,
            FSP.MapScreener.middleX | 0,
            1,
            FSP.ScenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for choosing to customize the rival's name.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroRivalNameFromKeyboard(FSP: FullScreenPokemon, settings: any): void {
        settings.name = (<IKeyboardResultsMenu>FSP.MenuGrapher.getMenu("KeyboardResult")).completeValue;

        FSP.MenuGrapher.deleteMenu("Keyboard");
        FSP.MenuGrapher.deleteMenu("NameOptions");

        FSP.animateSlideHorizontal(
            settings.rival,
            -FSP.unitsize,
            FSP.MapScreener.middleX | 0,
            1,
            FSP.ScenePlayer.bindRoutine("RivalNameConfirm"));
    }

    /**
     * Cutscene for confirming the rival's name.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroRivalNameConfirm(FSP: FullScreenPokemon, settings: any): void {
        FSP.ItemsHolder.setItem("nameRival", settings.name);

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "That's right! I remember now! His name is ", settings.name, "!"
                ]
            ],
            FSP.ScenePlayer.bindRoutine("RivalNameComplete"));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene fading the rival out.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroRivalNameComplete(FSP: FullScreenPokemon, settings: any): void {
        let blank: IThing = FSP.ObjectMaker.make("WhiteSquare", {
            "width": FSP.MapScreener.width,
            "height": FSP.MapScreener.height,
            "opacity": 0
        });

        FSP.addThing(blank, 0, 0);

        FSP.TimeHandler.addEvent(
            FSP.animateFadeAttribute,
            35,
            blank,
            "opacity",
            .2,
            1,
            7,
            FSP.ScenePlayer.bindRoutine("LastDialogAppear"));
    }

    /**
     * Cutscene for fading the player in.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroLastDialogAppear(FSP: FullScreenPokemon, settings: any): void {
        let portrait: IThing = FSP.ObjectMaker.make("PlayerPortrait", {
            "flipHoriz": true,
            "opacity": 0
        });

        settings.portrait = portrait;

        FSP.GroupHolder.applyOnAll(FSP, FSP.killNormal);

        FSP.addThing(portrait, 0, 0);
        FSP.setMidX(portrait, FSP.MapScreener.middleX | 0);
        FSP.setMidY(portrait, FSP.MapScreener.middleY | 0);

        FSP.animateFadeAttribute(
            portrait,
            "opacity",
            .1,
            1,
            1,
            FSP.ScenePlayer.bindRoutine("LastDialog"));
    }

    /**
     * Cutscene for the last part of the introduction.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene. 
     */
    cutsceneIntroLastDialog(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%!",
                "Your very own %%%%%%%POKEMON%%%%%%% legend is about to unfold!",
                "A world of dreams and adventures with %%%%%%%POKEMON%%%%%%% awaits! Let's go!"
            ],
            FSP.ScenePlayer.bindRoutine("ShrinkPlayer"));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for shrinking the player.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroShrinkPlayer(FSP: FullScreenPokemon, settings: any): void {
        let silhouetteLarge: IThing = FSP.ObjectMaker.make("PlayerSilhouetteLarge"),
            silhouetteSmall: IThing = FSP.ObjectMaker.make("PlayerSilhouetteSmall"),
            player: IPlayer = FSP.ObjectMaker.make("Player"),
            timeDelay: number = 49;

        FSP.TimeHandler.addEvent(
            FSP.addThing.bind(FSP), timeDelay, silhouetteLarge);
        FSP.TimeHandler.addEvent(
            FSP.setMidObj, timeDelay, silhouetteLarge, settings.portrait);
        FSP.TimeHandler.addEvent(
            FSP.killNormal.bind(FSP), timeDelay, settings.portrait);

        FSP.TimeHandler.addEvent(
            FSP.addThing.bind(FSP), timeDelay * 2, silhouetteSmall);
        FSP.TimeHandler.addEvent(
            FSP.setMidObj, timeDelay * 2, silhouetteSmall, silhouetteLarge);
        FSP.TimeHandler.addEvent(
            FSP.killNormal.bind(FSP), timeDelay * 2, silhouetteLarge);

        FSP.TimeHandler.addEvent(
            FSP.addThing.bind(FSP), timeDelay * 3, player);
        FSP.TimeHandler.addEvent(
            FSP.setMidObj, timeDelay * 3, player, silhouetteSmall);
        FSP.TimeHandler.addEvent(
            FSP.killNormal.bind(FSP), timeDelay * 3, silhouetteSmall);

        FSP.TimeHandler.addEvent(
            FSP.ScenePlayer.bindRoutine("FadeOut"), timeDelay * 4);
    }

    /**
     * Cutscene for completing the introduction and fading it out.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroFadeOut(FSP: FullScreenPokemon, settings: any): void {
        let blank: IThing = FSP.ObjectMaker.make("WhiteSquare", {
            "width": FSP.MapScreener.width,
            "height": FSP.MapScreener.height,
            "opacity": 0
        });

        FSP.addThing(blank, 0, 0);

        FSP.TimeHandler.addEvent(
            FSP.animateFadeAttribute,
            35,
            blank,
            "opacity",
            .2,
            1,
            7,
            FSP.ScenePlayer.bindRoutine("Finish"));
    }

    /**
     * Cutscene showing the player in his bedroom.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneIntroFinish(FSP: FullScreenPokemon, settings: any): void {
        delete FSP.MapScreener.cutscene;

        FSP.MenuGrapher.deleteActiveMenu();
        FSP.ScenePlayer.stopCutscene();
        FSP.ItemsHolder.setItem("gameStarted", true);

        FSP.setMap("Pallet Town", "Start Game");
    }

    /**
     * Cutscene for walking into the grass before receiving a Pokemon.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroFirstDialog(FSP: FullScreenPokemon, settings: any): void {
        let triggered: boolean = false;

        settings.triggerer.alive = false;
        FSP.StateHolder.addChange(settings.triggerer.id, "alive", false);

        if (FSP.ItemsHolder.getItem("starter")) {
            FSP.MapScreener.blockInputs = false;
            return;
        }

        FSP.animatePlayerDialogFreeze(settings.player);
        FSP.animateCharacterSetDirection(settings.player, 2);

        FSP.AudioPlayer.playTheme("Professor Oak");
        FSP.MapScreener.blockInputs = true;

        FSP.MenuGrapher.createMenu("GeneralText", {
            "finishAutomatically": true,
            "finishAutomaticSpeed": 28
        });
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            "OAK: Hey! Wait! Don't go out!",
            function (): void {
                if (!triggered) {
                    triggered = true;
                    FSP.ScenePlayer.playRoutine("Exclamation");
                }
            });
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the exclamation point over the player's head.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroExclamation(FSP: FullScreenPokemon, settings: any): void {
        let timeout: number = 49;

        FSP.animateExclamation(settings.player, timeout);

        FSP.TimeHandler.addEvent(
            FSP.MenuGrapher.hideMenu.bind(FSP.MenuGrapher),
            timeout,
            "GeneralText");

        FSP.TimeHandler.addEvent(
            FSP.ScenePlayer.bindRoutine("Catchup"),
            timeout);
    }

    /**
     * Cutscene for animating Oak to walk to the player.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroCatchup(FSP: FullScreenPokemon, settings: any): void {
        let door: IThing = FSP.getThingById("Oak's Lab Door"),
            oak: ICharacter = FSP.ObjectMaker.make("Oak", {
                "outerok": true,
                "nocollide": true
            }),
            isToLeft: boolean = FSP.player.bordering[Direction.Left] !== undefined,
            walkingSteps: any[] = [
                1, "left", 4, "top", 8, "right", 1, "top", 1, "right", 1, "top", 1
            ];

        if (!isToLeft) {
            walkingSteps.push("right", 1, "top", 0);
        }

        walkingSteps.push(FSP.ScenePlayer.bindRoutine("GrassWarning"));

        settings.oak = oak;
        settings.isToLeft = isToLeft;

        FSP.addThing(oak, door.left, door.top);
        FSP.animateCharacterStartWalkingCycle(oak, 2, walkingSteps);
    }

    /**
     * Cutscene for Oak telling the player to keep out of the grass.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroGrassWarning(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "It's unsafe! Wild %%%%%%%POKEMON%%%%%%% live in tall grass!",
                "You need your own %%%%%%%POKEMON%%%%%%% for your protection. \n I know!",
                "Here, come with me."
            ],
            FSP.ScenePlayer.bindRoutine("FollowToLab"));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player following Oak to the Professor's lab.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroFollowToLab(FSP: FullScreenPokemon, settings: any): void {
        let startingDirection: number,
            walkingSteps: any[];

        if (settings.isToLeft) {
            startingDirection = Direction.Bottom;
            walkingSteps = [5, "left", 1, "bottom", 5, "right", 3, "top", 1];
        } else {
            startingDirection = Direction.Left;
            walkingSteps = [1, "bottom", 5, "left", 1, "bottom", 5, "right", 3, "top", 1];
        }

        walkingSteps.push(FSP.ScenePlayer.bindRoutine("EnterLab"));

        FSP.MenuGrapher.deleteMenu("GeneralText");
        FSP.animateCharacterFollow(settings.player, settings.oak);
        FSP.animateCharacterStartWalkingCycle(
            settings.oak,
            startingDirection,
            walkingSteps);
    }

    /**
     * Cutscene for entering Oak's lab.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroEnterLab(FSP: FullScreenPokemon, settings: any): void {
        FSP.StateHolder.addChange("Pallet Town::Oak's Lab::Oak", "alive", true);
        settings.oak.hidden = true;

        FSP.TimeHandler.addEvent(
            FSP.animateCharacterStartWalkingCycle,
            FSP.MathDecider.compute("speedWalking", FSP.player),
            FSP.player,
            0,
            [
                0,
                function (): void {
                    FSP.setMap("Pallet Town", "Oak's Lab Floor 1 Door", false);
                    FSP.player.hidden = true;

                    FSP.ScenePlayer.playRoutine("WalkToTable");
                }
            ]);
    }

    /**
     * Cutscene for Oak offering a Pokemon to the player.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroWalkToTable(FSP: FullScreenPokemon, settings: any): void {
        let oak: ICharacter = <ICharacter>FSP.getThingById("Oak"),
            rival: ICharacter = <ICharacter>FSP.getThingById("Rival");

        settings.oak = oak;
        settings.player = FSP.player;

        oak.dialog = "OAK: Now, %%%%%%%PLAYER%%%%%%%, which %%%%%%%POKEMON%%%%%%% do you want?";
        oak.hidden = false;
        oak.nocollide = true;
        FSP.setMidXObj(oak, settings.player);
        FSP.setBottom(oak, settings.player.top);

        FSP.StateHolder.addChange(oak.id, "hidden", false);
        FSP.StateHolder.addChange(oak.id, "nocollide", false);
        FSP.StateHolder.addChange(oak.id, "dialog", oak.dialog);

        rival.dialog = [
            "%%%%%%%RIVAL%%%%%%%: Heh, I don't need to be greedy like you!",
            "Go ahead and choose, %%%%%%%PLAYER%%%%%%%!"
        ];
        FSP.StateHolder.addChange(rival.id, "dialog", rival.dialog);

        FSP.animateCharacterStartWalking(oak, 0, [
            8, "bottom", 0
        ]);

        FSP.TimeHandler.addEvent(
            function (): void {
                FSP.player.hidden = false;
            },
            112 - FSP.MathDecider.compute("speedWalking", settings.player));

        FSP.TimeHandler.addEvent(
            function (): void {
                FSP.animateCharacterStartWalking(
                    settings.player,
                    0,
                    [8, FSP.ScenePlayer.bindRoutine("RivalComplain")]);
            },
            112);
    }

    /**
     * Cutscene for the rival complaining to Oak.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroRivalComplain(FSP: FullScreenPokemon, settings: any): void {
        settings.oak.nocollide = false;
        settings.player.nocollide = false;
        FSP.StateHolder.addChange(settings.oak.id, "nocollide", false);

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            "%%%%%%%RIVAL%%%%%%%: Gramps! I'm fed up with waiting!",
            FSP.ScenePlayer.bindRoutine("OakThinksToRival"));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak telling the player to pick a Pokemon.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroOakThinksToRival(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
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
            FSP.ScenePlayer.bindRoutine("RivalProtests"));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival protesting to Oak.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroRivalProtests(FSP: FullScreenPokemon, settings: any): void {
        let timeout: number = 21;

        FSP.MenuGrapher.deleteMenu("GeneralText");

        FSP.TimeHandler.addEvent(
            FSP.MenuGrapher.createMenu.bind(FSP.MenuGrapher),
            timeout,
            "GeneralText");

        FSP.TimeHandler.addEvent(
            FSP.MenuGrapher.addMenuDialog.bind(FSP.MenuGrapher),
            timeout,
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Hey! Gramps! What about me?"
            ],
            FSP.ScenePlayer.bindRoutine("OakRespondsToProtest"));

        FSP.TimeHandler.addEvent(
            FSP.MenuGrapher.setActiveMenu.bind(FSP.MenuGrapher),
            timeout,
            "GeneralText");
    }

    /**
     * Cutscene for Oak responding to the rival's protest.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroOakRespondsToProtest(FSP: FullScreenPokemon, settings: any): void {
        let blocker: IThing = FSP.getThingById("OakBlocker"),
            timeout: number = 21;

        settings.player.nocollide = false;
        settings.oak.nocollide = false;

        blocker.nocollide = false;
        FSP.StateHolder.addChange(blocker.id, "nocollide", false);

        FSP.MapScreener.blockInputs = false;

        FSP.MenuGrapher.deleteMenu("GeneralText");

        FSP.TimeHandler.addEvent(
            FSP.MenuGrapher.createMenu.bind(FSP.MenuGrapher),
            timeout,
            "GeneralText",
            {
                "deleteOnFinish": true
            });

        FSP.TimeHandler.addEvent(
            FSP.MenuGrapher.addMenuDialog.bind(FSP.MenuGrapher),
            timeout,
            "GeneralText",
            "Oak: Be patient! %%%%%%%RIVAL%%%%%%%, you can have one too!");

        FSP.TimeHandler.addEvent(
            FSP.MenuGrapher.setActiveMenu.bind(FSP.MenuGrapher),
            timeout,
            "GeneralText");
    }

    /**
     * Cutscene for the player checking a Pokeball.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroPokemonChoicePlayerChecksPokeball(FSP: FullScreenPokemon, settings: any): void {
        // If Oak is hidden, this cutscene shouldn't be starting (too early)
        if (FSP.getThingById("Oak").hidden) {
            FSP.ScenePlayer.stopCutscene();

            FSP.MenuGrapher.createMenu("GeneralText");
            FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Those are %%%%%%%POKE%%%%%%% Balls. They contain %%%%%%%POKEMON%%%%%%%!"
                ]);
            FSP.MenuGrapher.setActiveMenu("GeneralText");

            return;
        }

        // If there's already a starter, ignore this sad last ball...
        if (FSP.ItemsHolder.getItem("starter")) {
            return;
        }

        let pokeball: IPokeball = settings.triggerer;
        settings.chosen = pokeball.pokemon;

        FSP.openPokedexListing(
            pokeball.pokemon,
            FSP.ScenePlayer.bindRoutine("PlayerDecidesPokemon"),
            {
                "position": {
                    "vertical": "center",
                    "offset": {
                        "left": 0
                    }
                }
            });
    }

    /**
     * Cutscene for confirming the player wants to keep the chosen Pokemon.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroPokemonChoicePlayerDecidesPokemon(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "So! You want the " + settings.triggerer.description + " %%%%%%%POKEMON%%%%%%%, ", settings.chosen, "?"
                ]
            ],
            function (): void {
                FSP.MenuGrapher.createMenu("Yes/No", {
                    "killOnB": ["GeneralText"]
                });
                FSP.MenuGrapher.addMenuList("Yes/No", {
                    "options": [
                        {
                            "text": "YES",
                            "callback": FSP.ScenePlayer.bindRoutine("PlayerTakesPokemon")
                        }, {
                            "text": "NO",
                            "callback": FSP.MenuGrapher.registerB
                        }]
                });
                FSP.MenuGrapher.setActiveMenu("Yes/No");
            });
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player receiving his Pokemon.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene. 
     */
    cutsceneOakIntroPokemonChoicePlayerTakesPokemon(FSP: FullScreenPokemon, settings: any): void {
        let oak: ICharacter = <ICharacter>FSP.getThingById("Oak"),
            rival: ICharacter = <ICharacter>FSP.getThingById("Rival"),
            dialogOak: string = "Oak: If a wild %%%%%%%POKEMON%%%%%%% appears, your %%%%%%%POKEMON%%%%%%% can fight against it!",
            dialogRival: string = "%%%%%%%RIVAL%%%%%%%: My %%%%%%%POKEMON%%%%%%% looks a lot stronger.";

        settings.oak = oak;
        oak.dialog = dialogOak;
        FSP.StateHolder.addChange(oak.id, "dialog", dialogOak);

        settings.rival = rival;
        rival.dialog = dialogRival;
        FSP.StateHolder.addChange(rival.id, "dialog", dialogRival);

        FSP.ItemsHolder.setItem("starter", settings.chosen.join(""));
        settings.triggerer.hidden = true;
        FSP.StateHolder.addChange(settings.triggerer.id, "hidden", true);
        FSP.StateHolder.addChange(settings.triggerer.id, "nocollide", true);

        FSP.MenuGrapher.deleteMenu("Yes/No");
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
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
            FSP.ScenePlayer.bindRoutine("PlayerChoosesNickname"));
        FSP.MenuGrapher.setActiveMenu("GeneralText");

        FSP.ItemsHolder.setItem("starter", settings.chosen);
        FSP.ItemsHolder.setItem("PokemonInParty", [
            FSP.MathDecider.compute("newPokemon", settings.chosen, 5)
        ]);
        FSP.addPokemonToPokedex(settings.chosen, PokedexListingStatus.Caught);
    }

    /**
     * Cutscene for allowing the player to choose his Pokemon's nickname. 
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroPokemonChoicePlayerChoosesNickname(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("Yes/No", {
            "ignoreB": true,
            "killOnB": ["GeneralText"]
        });
        FSP.MenuGrapher.addMenuList("Yes/No", {
            "options": [
                {
                    "text": "YES",
                    "callback": FSP.openKeyboardMenu.bind(FSP, {
                        "position": {
                            "vertical": "center",
                            "offset": {
                                "top": -12
                            }
                        },
                        "title": settings.chosen,
                        "callback": FSP.ScenePlayer.bindRoutine("PlayerSetsNickname")
                    })
                }, {
                    "text": "NO",
                    "callback": FSP.ScenePlayer.bindRoutine("RivalWalksToPokemon")
                }]
        });
        FSP.MenuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * Cutscene for the player finishing the naming process.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroPokemonChoicePlayerSetsNickname(FSP: FullScreenPokemon, settings: any): void {
        let party: BattleMovr.IActor[] = FSP.ItemsHolder.getItem("PokemonInParty"),
            menu: IKeyboardResultsMenu = <IKeyboardResultsMenu>FSP.MenuGrapher.getMenu("KeyboardResult"),
            result: string[] = menu.completeValue;

        party[0].nickname = result;

        FSP.ScenePlayer.playRoutine("RivalWalksToPokemon");
    }

    /**
     * Cutscene for the rival selecting his Pokemon.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroPokemonChoiceRivalWalksToPokemon(FSP: FullScreenPokemon, settings: any): void {
        let rival: ICharacter = <ICharacter>FSP.getThingById("Rival"),
            starterRival: string[],
            steps: number;

        FSP.MenuGrapher.deleteMenu("Keyboard");
        FSP.MenuGrapher.deleteMenu("GeneralText");
        FSP.MenuGrapher.deleteMenu("Yes/No");
        FSP.MapScreener.blockInputs = true;

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
        FSP.ItemsHolder.setItem("starterRival", starterRival);
        FSP.addPokemonToPokedex(starterRival, PokedexListingStatus.Caught);

        let pokeball: IPokeball = <IPokeball>FSP.getThingById("Pokeball" + starterRival.join(""));
        settings.rivalPokeball = pokeball;

        FSP.animateCharacterStartWalkingCycle(
            rival,
            2,
            [
                2, "right", steps, "top", 1,
                (): void => FSP.ScenePlayer.playRoutine("RivalTakesPokemon")
            ]);
    }

    /**
     * Cutscene for the rival receiving his Pokemon.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroPokemonChoiceRivalTakesPokemon(FSP: FullScreenPokemon, settings: any): void {
        let oakblocker: IThing = FSP.getThingById("OakBlocker"),
            rivalblocker: IThing = FSP.getThingById("RivalBlocker");

        FSP.MenuGrapher.deleteMenu("Yes/No");

        oakblocker.nocollide = true;
        FSP.StateHolder.addChange(oakblocker.id, "nocollide", true);

        rivalblocker.nocollide = false;
        FSP.StateHolder.addChange(rivalblocker.id, "nocollide", false);

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: I'll take this one, then!",
                [
                    "%%%%%%%RIVAL%%%%%%% received a ", settings.rivalPokemon, "!"
                ]
            ],
            function (): void {
                settings.rivalPokeball.hidden = true;
                FSP.StateHolder.addChange(settings.rivalPokeball.id, "hidden", true);
                FSP.MenuGrapher.deleteActiveMenu();
                FSP.MapScreener.blockInputs = false;
            });
        FSP.MenuGrapher.setActiveMenu("GeneralText");

    }

    /**
     * Cutscene for the rival challenging the player to a Pokemon battle.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroRivalBattleApproach(FSP: FullScreenPokemon, settings: any): void {
        let rival: ICharacter = <ICharacter>FSP.getThingById("Rival"),
            dx: number = Math.abs(settings.triggerer.left - settings.player.left),
            further: boolean = dx < FSP.unitsize;

        FSP.AudioPlayer.playTheme("Rival Appears");

        settings.rival = rival;
        FSP.animateCharacterSetDirection(rival, Direction.Bottom);
        FSP.animateCharacterSetDirection(settings.player, Direction.Top);

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Wait, %%%%%%%PLAYER%%%%%%%! Let's check out our %%%%%%%POKEMON%%%%%%%!",
                "Come on, I'll take you on!"
            ],
            FSP.ScenePlayer.bindRoutine(
                "Challenge",
                {
                    "further": further
                }
            ));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for showing the lab after the battle ends.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroRivalLeavesAfterBattle(FSP: FullScreenPokemon, settings: any): void {
        FSP.MapScreener.blockInputs = true;
        FSP.ItemsHolder.getItem("PokemonInParty").forEach(FSP.healPokemon.bind(FSP));
        FSP.TimeHandler.addEvent(FSP.ScenePlayer.bindRoutine("Complaint"), 49);
    }

    /**
     * Cutscene for the rival's comment after losing the battle.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroRivalLeavesComplaint(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Okay! I'll make my %%%%%%%POKEMON%%%%%%% fight to toughen it up!"
            ],
            function (): void {
                FSP.MenuGrapher.deleteActiveMenu();
                FSP.TimeHandler.addEvent(FSP.ScenePlayer.bindRoutine("Goodbye"), 21);
            }
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival telling Oak he is leaving.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroRivalLeavesGoodbye(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%%! Gramps! Smell ya later!"
            ],
            FSP.ScenePlayer.bindRoutine("Walking"));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival leaving the lab and Oak giving the player advice.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakIntroRivalLeavesWalking(FSP: FullScreenPokemon, settings: any): void {
        let oak: ICharacter = <ICharacter>FSP.getThingById("Oak"),
            rival: ICharacter = <ICharacter>FSP.getThingById("Rival"),
            isRight: boolean = Math.abs(oak.left - rival.left) < FSP.unitsize,
            steps: any[] = [
                1,
                "bottom",
                6,
                function (): void {
                    FSP.killNormal(rival);
                    FSP.StateHolder.addChange(rival.id, "alive", false);
                    FSP.MapScreener.blockInputs = false;
                }
            ],
            dialog: string[] = [
                "OAK: %%%%%%%PLAYER%%%%%%%, raise your young %%%%%%%POKEMON%%%%%%% by making it fight!"
            ];

        console.log("Shouldn't this say the dialog?", dialog);

        FSP.ScenePlayer.stopCutscene();
        FSP.MenuGrapher.deleteMenu("GeneralText");

        rival.nocollide = true;
        FSP.animateCharacterStartWalkingCycle(rival, isRight ? Direction.Left : Direction.Right, steps);
    }

    /**
     * Cutscene for the battle between the player and the rival.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    cutsceneOakIntroRivalBattleChallenge(FSP: FullScreenPokemon, settings: any, args: any): void {
        let steps: number,
            starterRival: string[] = FSP.ItemsHolder.getItem("starterRival"),
            battleInfo: IBattleInfo = {
                "opponent": {
                    "sprite": "RivalPortrait",
                    "name": FSP.ItemsHolder.getItem("nameRival"),
                    "category": "Trainer",
                    "hasActors": true,
                    "reward": 175,
                    "actors": [
                        FSP.MathDecider.compute("newPokemon", starterRival, 5)
                    ]
                },
                "textStart": ["", " wants to fight!"],
                "textDefeat": ["%%%%%%%RIVAL%%%%%%% Yeah! Am I great or what?"],
                "textVictory": [
                    [
                        "%%%%%%%RIVAL%%%%%%%: WHAT?",
                        "Unbelievable!",
                        "I picked the wrong %%%%%%%POKEMON%%%%%%%!"
                    ].join(" ")
                ],
                // "animation": "LineSpiral",
                "noBlackout": true,
                "keptThings": FSP.collectBattleKeptThings(["player", "Rival"]),
                "nextCutscene": "OakIntroRivalLeaves"
            };

        switch (FSP.ItemsHolder.getItem("starterRival").join("")) {
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

        FSP.animateCharacterStartWalkingCycle(
            settings.rival,
            3,
            [
                steps,
                "bottom",
                1,
                FSP.startBattle.bind(FSP, battleInfo)
            ]);
    }

    /**
     * Cutscene for the PokeMart clerk calling the player to pick up Oak's parcel.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakParcelPickupGreeting(FSP: FullScreenPokemon, settings: any): void {
        settings.triggerer.alive = false;
        FSP.StateHolder.addChange(settings.triggerer.id, "alive", false);

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hey! You came from PALLET TOWN?"
            ],
            FSP.ScenePlayer.bindRoutine("WalkToCounter"));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player walking to the counter when picking up the parcel.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakParcelPickupWalkToCounter(FSP: FullScreenPokemon, settings: any): void {
        FSP.animateCharacterStartWalkingCycle(
            settings.player,
            0,
            [
                2,
                "left",
                1,
                FSP.ScenePlayer.bindRoutine("CounterDialog")
            ]);
    }

    /**
     * Cutscene for the player receiving the parcel from the PokeMart clerk.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakParcelPickupCounterDialog(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You know PROF. Oak, right?",
                "His order came in. Will you take it to him?",
                "%%%%%%%PLAYER%%%%%%% got OAK's PARCEL!"
            ],
            function (): void {
                FSP.MenuGrapher.deleteMenu("GeneralText");
                FSP.ScenePlayer.stopCutscene();
                FSP.MapScreener.blockInputs = false;
            });
        FSP.MenuGrapher.setActiveMenu("GeneralText");

        FSP.StateHolder.addCollectionChange(
            "Pallet Town::Oak's Lab", "Oak", "cutscene", "OakParcelDelivery"
        );
    }

    /**
     * Cutscene for when the player delivers the parcel to Oak.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakParcelDeliveryGreeting(FSP: FullScreenPokemon, settings: any): void {
        settings.rival = FSP.getThingById("Rival");
        settings.oak = settings.triggerer;
        delete settings.oak.cutscene;
        delete settings.oak.dialog;

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
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
            FSP.TimeHandler.addEvent.bind(
                FSP.TimeHandler,
                FSP.ScenePlayer.bindRoutine("RivalInterrupts"),
                14)
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");

        FSP.StateHolder.addCollectionChange(
            "Viridian City::PokeMart", "CashierDetector", "dialog", false);

        FSP.StateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGrandpa", "alive", false);
        FSP.StateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGrandpaBlocker", "alive", false);
        FSP.StateHolder.addCollectionChange(
            "Viridian City::Land", "CrankyGranddaughter", "alive", false);

        FSP.StateHolder.addCollectionChange(
            "Viridian City::Land", "HappyGrandpa", "alive", true);
        FSP.StateHolder.addCollectionChange(
            "Viridian City::Land", "HappyGranddaughter", "alive", true);
    }

    /**
     * Cutscene for when the rival interrupts Oak and the player.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakParcelDeliveryRivalInterrupts(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Gramps!"
            ],
            FSP.ScenePlayer.bindRoutine("RivalWalksUp")
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival walking up to Oak and the player.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakParcelDeliveryRivalWalksUp(FSP: FullScreenPokemon, settings: any): void {
        let doormat: IThing = FSP.getThingById("DoormatLeft"),
            rival: ICharacter = <ICharacter>FSP.addThing("Rival", doormat.left, doormat.top);

        rival.alive = true;
        settings.rival = rival;

        FSP.MenuGrapher.deleteMenu("GeneralText");

        FSP.animateCharacterStartWalkingCycle(
            rival,
            0,
            [
                8,
                (): void => FSP.ScenePlayer.playRoutine("RivalInquires")
            ]);
    }

    /**
     * Cutscene for the rival asking Oak why he was called.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakParcelDeliveryRivalInquires(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: What did you call me for?"
            ],
            FSP.TimeHandler.addEvent.bind(
                FSP.TimeHandler,
                FSP.ScenePlayer.bindRoutine("OakRequests"),
                14)
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak requesting something of the player and rival.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakParcelDeliveryOakRequests(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Oak: Oh right! I have a request of you two."
            ],
            FSP.TimeHandler.addEvent.bind(
                FSP.TimeHandler,
                FSP.ScenePlayer.bindRoutine("OakDescribesPokedex"),
                14)
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing the Pokedex. 
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakParcelDeliveryOakDescribesPokedex(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "On the desk there is my invention, %%%%%%%POKEDEX%%%%%%%!",
                "It automatically records data on %%%%%%%POKEMON%%%%%%% you've seen or caught!",
                "It's a hi-tech encyclopedia!"
            ],
            FSP.TimeHandler.addEvent.bind(
                FSP.TimeHandler,
                FSP.ScenePlayer.bindRoutine("OakGivesPokedex"),
                14)
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak giving the player and rival Pokedexes.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakParcelDeliveryOakGivesPokedex(FSP: FullScreenPokemon, settings: any): void {
        let bookLeft: IThing = FSP.getThingById("BookLeft"),
            bookRight: IThing = FSP.getThingById("BookRight");

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: %%%%%%%PLAYER%%%%%%% and %%%%%%%RIVAL%%%%%%%! Take these with you!",
                "%%%%%%%PLAYER%%%%%%% got %%%%%%%POKEDEX%%%%%%% from OAK!"
            ],
            function (): void {
                FSP.TimeHandler.addEvent(
                    FSP.ScenePlayer.playRoutine.bind(FSP.ScenePlayer),
                    14,
                    "OakDescribesGoal");

                FSP.killNormal(bookLeft);
                FSP.killNormal(bookRight);

                FSP.StateHolder.addChange(bookLeft.id, "alive", false);
                FSP.StateHolder.addChange(bookRight.id, "alive", false);

                FSP.ItemsHolder.setItem("hasPokedex", true);
            }
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak describing his life goal.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakParcelDeliveryOakDescribesGoal(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "To make a complete guide on all the %%%%%%%POKEMON%%%%%%% in the world...",
                "That was my dream!",
                "But, I'm too old! I can't do it!",
                "So, I want you two to fulfill my dream for me!",
                "Get moving, you two!",
                "This is a great undertaking in %%%%%%%POKEMON%%%%%%% history!"
            ],
            FSP.TimeHandler.addEvent.bind(
                FSP.TimeHandler,
                FSP.ScenePlayer.bindRoutine("RivalAccepts"),
                14)
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival accepting the Pokedex and challenge to complete Oak's goal. 
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneOakParcelDeliveryRivalAccepts(FSP: FullScreenPokemon, settings: any): void {
        FSP.animateCharacterSetDirection(settings.rival, 1);

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Alright Gramps! Leave it all to me!",
                "%%%%%%%PLAYER%%%%%%%, I hate to say it, but I don't need you!",
                "I know! I'll borrow a TOWN MAP from my sis!",
                "I'll tell her not to lend you one, %%%%%%%PLAYER%%%%%%%! Hahaha!"
            ],
            function (): void {
                FSP.ScenePlayer.stopCutscene();
                FSP.MenuGrapher.deleteMenu("GeneralText");

                delete settings.oak.activate;
                settings.rival.nocollide = true;
                FSP.animateCharacterStartWalkingCycle(
                    settings.rival,
                    2,
                    [
                        8,
                        function (): void {
                            FSP.killNormal(settings.rival);
                            FSP.player.canKeyWalking = true;
                        }
                    ]);

                delete settings.oak.cutscene;
                settings.oak.dialog = [
                    "%%%%%%%POKEMON%%%%%%% around the world wait for you, %%%%%%%PLAYER%%%%%%%!"
                ];

                FSP.StateHolder.addChange(
                    settings.oak.id, "dialog", settings.oak.dialog
                );
                FSP.StateHolder.addChange(
                    settings.oak.id, "cutscene", undefined
                );
            }
        );
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Daisy giving the player a Town Map.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneDaisyTownMapGreeting(FSP: FullScreenPokemon, settings: any): void {
        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Grandpa asked you to run an errand? Here, this will help you!"
            ],
            FSP.ScenePlayer.bindRoutine("ReceiveMap"));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player receiving the Town Map. 
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneDaisyTownMapReceiveMap(FSP: FullScreenPokemon, settings: any): void {
        let book: IThing = FSP.getThingById("Book"),
            daisy: ICharacter = settings.triggerer;

        FSP.killNormal(book);
        FSP.StateHolder.addChange(book.id, "alive", false);

        delete daisy.cutscene;
        FSP.StateHolder.addChange(daisy.id, "cutscene", undefined);

        daisy.dialog = [
            "Use the TOWN MAP to find out where you are."
        ];
        FSP.StateHolder.addChange(daisy.id, "dialog", daisy.dialog);

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% got a TOWN MAP!"
            ],
            function (): void {
                FSP.ScenePlayer.stopCutscene();
                FSP.MenuGrapher.deleteMenu("GeneralText");
            });
        FSP.MenuGrapher.setActiveMenu("GeneralText");

        console.warn("Player does not actually get a Town Map...");
    }

    /**
     * Cutscene for the old man battling a Weedle.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene. 
     */
    cutsceneElderTrainingStartBattle(FSP: FullScreenPokemon, settings: any): void {
        FSP.MapScreener.blockInputs = true;
        FSP.startBattle(<IBattleInfo>{
            "keptThings": FSP.collectBattleKeptThings([settings.player, settings.triggerer]),
            "player": {
                "name": "OLD MAN".split(""),
                "sprite": "ElderBack",
                "category": "Wild",
                "actors": []
            },
            "opponent": {
                "name": "WEEDLE".split(""),
                "sprite": "WeedleFront",
                "category": "Wild",
                "actors": [
                    FSP.MathDecider.compute("newPokemon", "WEEDLE".split(""), 5)
                ]
            },
            "items": [{
                "item": "Pokeball",
                "amount": 50
            }],
            "automaticMenus": true,
            "onShowPlayerMenu": function (): void {
                let timeout: number = 70;

                FSP.TimeHandler.addEvent(FSP.MenuGrapher.registerDown.bind(FSP.MenuGrapher), timeout);
                FSP.TimeHandler.addEvent(FSP.MenuGrapher.registerA.bind(FSP.MenuGrapher), timeout * 2);
                FSP.TimeHandler.addEvent(FSP.MenuGrapher.registerA.bind(FSP.MenuGrapher), timeout * 3);
            }
        });
    }

    /**
     * Cutscene for encountering the rival on Route 22.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneRivalRoute22RivalEmerges(FSP: FullScreenPokemon, settings: any): void {
        let player: IPlayer = settings.player,
            triggerer: ICharacter = settings.triggerer,
            playerUpper: number = Number(Math.abs(player.top - triggerer.top) < FSP.unitsize),
            steps: any[] = [
                2,
                "right",
                3 + playerUpper,
            ],
            rival: ICharacter = FSP.ObjectMaker.make("Rival", {
                "direction": 0,
                "nocollide": true,
                "opacity": 0
            });

        if (playerUpper) {
            steps.push("top");
            steps.push(0);
        }

        settings.rival = rival;

        steps.push(FSP.ScenePlayer.bindRoutine("RivalTalks"));

        // thing, attribute, change, goal, speed, onCompletion
        FSP.animateFadeAttribute(rival, "opacity", .2, 1, 3);

        FSP.addThing(
            rival,
            triggerer.left - FSP.unitsize * 28,
            triggerer.top + FSP.unitsize * 24);

        FSP.animateCharacterStartWalkingCycle(rival, 0, steps);
    }

    /**
     * Cutscene for the rival talking to the player before the battle.
     *
     * @param FSP
     * @param settings   Settings used for the cutscene.
     */
    cutsceneRivalRoute22RivalTalks(FSP: FullScreenPokemon, settings: any): void {
        let rivalTitle: string[] = FSP.ItemsHolder.getItem("starterRival");

        FSP.animateCharacterSetDirection(
            settings.player,
            FSP.getDirectionBordering(settings.player, settings.rival));

        FSP.MenuGrapher.createMenu("GeneralText");
        FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Hey! %%%%%%%PLAYER%%%%%%%!",
                "You're going to %%%%%%%POKEMON%%%%%%% LEAGUE?",
                "Forget it! You probably don't have any BADGES!",
                "The guard won't let you through!",
                "By the way did your %%%%%%%POKEMON%%%%%%% get any stronger?"
            ],
            FSP.startBattle.bind(FSP, {
                "opponent": {
                    "sprite": "RivalPortrait",
                    "name": FSP.ItemsHolder.getItem("nameRival"),
                    "category": "Trainer",
                    "hasActors": true,
                    "reward": 280,
                    "actors": [
                        FSP.MathDecider.compute("newPokemon", rivalTitle, 8),
                        FSP.MathDecider.compute("newPokemon", "PIDGEY".split(""), 9)
                    ]
                },
                "textStart": [
                    "".split(""),
                    " wants to fight!".split("")
                ],
                "textDefeat": [
                    "Yeah! Am I great or what?".split("")
                ],
                "textVictory": [
                    "Awww! You just lucked out!".split("")
                ],
                "keptThings": FSP.collectBattleKeptThings(["player", "Rival"])
            }));
        FSP.MenuGrapher.setActiveMenu("GeneralText");
    }
}
