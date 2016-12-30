import * as ibattlemovr from "battlemovr/lib/IBattleMovr";
import { Component } from "eightbittr/lib/Component";
import * as imenugraphr from "menugraphr/lib/IMenuGraphr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IWildPokemonSchema } from "./Maps";
import { IMenu, IMenuBase } from "./Menus";
import { IEnemy, IPlayer, IThing, IThingsById } from "./Things";

/**
 * Things used in battle, stored by id.
 */
export interface IBattleThingsById extends IThingsById {
    /**
     * A container menu for a current battler, if applicable.
     */
    menu: IMenu;

    /**
     * The player's Character.
     */
    player: IPlayer;

    /**
     * The opponent's Character.
     */
    opponent: IEnemy;
}

export interface IBattleTransitionSettings {
    /**
     * In-game state and settings for the upcoming battle.
     */
    battleInfo?: IBattleInfo;

    /**
     * A callback for when the transition completes.
     */
    callback?: () => void;
}

/**
 * Settings for the TransitionLineSpiral battle animation routine.
 */
export interface ITransitionLineSpiralSettings extends IBattleTransitionSettings {
    /**
     * How large the lines should be in units (by default, 15).
     */
    divisor?: number;
}

/**
 * Settings for the TransitionFlash battle animation routine.
 */
export interface ITransitionFlashSettings extends IBattleTransitionSettings {
    /**
     * How much to change opacity each tick (by default, .33).
     */
    change?: number;

    /**
     * How many flashes in total (by default, 6).
     */
    flashes?: number;

    /**
     * The ordered flash colors (by default, ["Black", "White"]).
     */
    flashColors?: string[];

    /**
     * How many upkeeps between change ticks (by default, 1).
     */
    speed?: number;
}

/**
 * Settings for the Battle cutscene routines.
 */
export interface IBattleCutsceneSettings {
    /**
     * In-game state and settings for the ongoing battle.
     */
    battleInfo: IBattleInfo;

    /**
     * The left position of the in-game opponent Thing.
     */
    opponentLeft?: number;

    /**
     * The top position of the in-game opponent Thing.
     */
    opponentTop?: number;

    /**
     * Things used in the battle, stored by id.
     */
    things: IBattleThingsById;
}

/**
 * Settings for a typical routine in the Battle cutscene.
 */
export interface IBattleRoutineSettings {
    /**
     * A callback for when the routine is done, if applicable.
     */
    callback?: () => void;

    /**
     * A name of a routine to play when this is done, if applicable.
     */
    nextRoutine?: string;
}

/**
 * Settings for a typical move-based routine in the Battle cutscene.
 */
export interface IBattleMoveRoutineSettings extends IBattleRoutineSettings {
    /**
     * The name of the attacking battler, as "player" or "opponent".
     */
    attackerName?: string;

    /**
     * A callback for when the move is done.
     */
    callback?: () => void;

    /**
     * The move chosen by the user.
     */
    choiceOpponent?: string;

    /**
     * The move chosen by the user.
     */
    choicePlayer?: string;

    /**
     * How much damage will be done by the move.
     */
    damage?: number;

    /**
     * The name of the attacking battler, as "player" or "opponent".
     */
    defenderName?: string;

    /**
     * Whether the opponent has already moved this round.
     */
    moveOpponentDone?: boolean;

    /**
     * Whether the user has already moved this round.
     */
    movePlayerDone?: boolean;
}

/**
 * Settings for a typical action-based routine in the Battle cutscene.
 */
export interface IBattleActionRoutineSettings extends IBattleRoutineSettings {
    /**
     * Which battler this animation applies to.
     */
    battlerName?: "player" | "opponent";

    /**
     * How much damage this will do, if applicable.
     */
    damage?: number;
}

/**
 * Settings for a typical level-based routine in the Battle cutscene.
 */
export interface IBattleLevelRoutineSettings extends IBattleRoutineSettings {
    /**
     * How many experience points were gained, if applicable.
     */
    experienceGained?: number;
}

/**
 * Settings for an attacking move in battle.
 */
export interface IBattleAttackRoutineSettings extends IBattleRoutineSettings {
    /**
     * The attacking battler's name.
     */
    attackerName?: "player" | "opponent";

    /**
     * The defending battler's name.
     */
    defenderName?: "player" | "opponent";
}

/**
 * Settings for changing a defender's statistic in battle.
 */
export interface IBattleStatisticRoutineSettings extends IBattleAttackRoutineSettings {
    /**
     * How much to change the statistic.
     */
    amount?: number;

    /**
     * The name of the targeted statistic.
     */
    statistic?: string;
}

/**
 * A possible move to be chosen, with its probability.
 */
export interface IMovePossibility {
    /**
     * The concatenated name of the move.
     */
    move: string;

    /**
     * What priority the move has, for the applyMoveEffectPriority equation.
     */
    priority: number;
}

/**
 * In-game state and settings for an ongoing battle.
 */
export interface IBattleInfo extends ibattlemovr.IBattleInfo {
    /**
     * Allowed starting battle animations to choose between.
     */
    animations?: string[];

    /**
     * Whether the battle should advance its menus automatically.
     */
    automaticMenus?: boolean;

    /**
     * A badge to award the player upon victory.
     */
    badge?: string;

    /**
     * 
     */
    battlers: IBattlers;

    /**
     * How many times the player has attempted to flee.
     */
    currentEscapeAttempts?: number;

    /**
     * A gift to give the player upon victory.
     */
    giftAfterBattle?: string;

    /**
     * How much of the gift to give (by default, 1).
     */
    giftAfterBattleAmount?: number;

    /**
     * Things that should be visible above the starting animation.
     */
    keptThings?: IThing[];

    /**
     * Whether losing skip the player blacking out and respawning elsewhere.
     */
    noBlackout?: boolean;

    /**
     * A callback for after showing the player menu.
     */
    onShowPlayerMenu?: () => void;

    /**
     * Text to display after a battle victory when in the real world again.
     */
    textAfterBattle?: imenugraphr.IMenuDialogRaw;

    /**
     * Text to display upon defeat.
     */
    textDefeat?: imenugraphr.IMenuDialogRaw;

    /**
     * Text for when the opponent sends out a Pokemon. The opponent's name and the
     * Pokemon's nickname are between the Strings.
     */
    textOpponentSendOut?: [string, string, string];

    /**
     * Text for when the player sends out a Pokemon. The Pokemon's name is between the 
     * Strings.
     */
    textPlayerSendOut?: [string, string];

    /**
     * Text for when the battle starts. The opponent's name is between the Strings.
     */
    textStart?: [string, string];

    /**
     * Text to display upon victory.
     */
    textVictory?: imenugraphr.IMenuDialogRaw;

    /**
     * An audio theme to play during the battle.
     */
    theme?: string;
}

/**
 * 
 */
export interface IBattlers extends ibattlemovr.IBattlers {
    /**
     * The opponent battler's information.
     */
    opponent: IBattler;

    /**
     * The player's battle information.
     */
    player?: IBattler;

    [i: string]: IBattler | undefined;
}

/**
 * A trainer in battle, namely either the player or opponent.
 */
export interface IBattler extends ibattlemovr.IBattler {
    /**
     * The trainer's available Pokemon.
     */
    actors: IPokemon[];

    /**
     * Whether this opponent doesn't understand status effects, for the opponentMove equation.
     */
    dumb?: boolean;

    /**
     * The amount of money given for defeating this opponent.
     */
    reward?: number;

    /**
     * The trainer's currently selected Pokemon.
     */
    selectedActor?: IPokemon;
}

/**
 * A Pokemon, stored in the player's party and/or as an in-battle actor.
 */
export interface IPokemon extends ibattlemovr.IActor {
    /**
     * Current (in-battle) Attack.
     */
    Attack: number;

    /**
     * Default Attack.
     */
    AttackNormal: number;

    /**
     * Current (in-battle) Defense.
     */
    Defense: number;

    /**
     * Default Defense.
     */
    DefenseNormal: number;

    /**
     * Accumulated effort value points.
     */
    EV: {
        /**
         * Attack EV points.
         */
        Attack: number;

        /**
         * Defense EV points.
         */
        Defense: number;

        /**
         * Special EV points.
         */
        Special: number;

        /**
         * Speed EV points.
         */
        Speed: number;
    };

    /**
     * Current (in-battle) HP.
     */
    HP: number;

    /**
     * Default HP.
     */
    HPNormal: number;

    /**
     * Accumulated individual value points.
     */
    IV: {
        /**
         * Attack IV points.
         */
        Attack: number;

        /**
         * Defense IV points.
         */
        Defense: number;

        /**
         * HP IV points.
         */
        HP: number;

        /**
         * Special IV points.
         */
        Special: number;

        /**
         * Speed IV points.
         */
        Speed: number;
    };

    /**
     * Current (in-battle) Special.
     */
    Special: number;

    /**
     * Default Special.
     */
    SpecialNormal: number;

    /**
     * Current (in-battle) Speed.
     */
    Speed: number;

    /**
     * Default Speed.
     */
    SpeedNormal: number;

    /**
     * How difficult this is to catch, for the canCatchPokemon equation.
     */
    catchRate?: number;

    /**
     * How likely a critical hit is from this Pokemon, for the criticalHit equation.
     */
    criticalHitProbability?: boolean;

    /**
     * The Pokemon's nickname.
     */
    nickname: string[];

    /**
     * The level the Pokemon was before enabling the Level 100 mod.
     */
    previousLevel?: number;

    /**
     * Any current status, such as "Poison".
     */
    status: string;

    /**
     * Whether the Pokemon was traded from another trainer.
     */
    traded?: boolean;

    /**
     * What types this Pokemon is, such as "Water".
     */
    types: string[];
}

/**
 * Battle functions used by FullScreenPokemon instances.
 */
export class Battles<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Starts a Pokemon battle.
     * 
     * @param battleInfo   Settings for the battle.
     */
    public startBattle(battleInfo: IBattleInfo): void {
        this.gameStarter.modAttacher.fireEvent("onBattleStart", battleInfo);

        const animations: string[] = battleInfo.animations || [
            // "LineSpiral", "Flash"
            "Flash"
        ];
        const animation: string = this.gameStarter.numberMaker.randomArrayMember(animations);
        let player: any = battleInfo.battlers.player;

        if (!player) {
            battleInfo.battlers.player = player = {} as any;
        }

        player.name = player.name || "%%%%%%%PLAYER%%%%%%%";
        player.sprite = player.sprite || "PlayerBack";
        player.category = player.category || "Trainer";
        player.actors = player.actors || this.gameStarter.itemsHolder.getItem("PokemonInParty");
        player.hasActors = typeof player.hasActors === "undefined"
            ? true : player.hasActors;

        this.gameStarter.modAttacher.fireEvent("onBattleReady", battleInfo);

        this.gameStarter.audioPlayer.playTheme(battleInfo.theme || "Battle Trainer");

        (this.gameStarter.cutscenes.battle as any)["Transition" + animation](
            {
                battleInfo,
                callback: (): void => this.gameStarter.battleMover.startBattle(battleInfo)
            }
        );

        this.gameStarter.graphics.moveBattleKeptThingsToText(battleInfo);
    }

    /**
     * Heals a Pokemon back to full health.
     * 
     * @param pokemon   An in-game Pokemon to heal.
     */
    public healPokemon(pokemon: IPokemon): void {
        for (const statisticName of this.gameStarter.constants.pokemon.statisticNames) {
            (pokemon as any)[statisticName] = (pokemon as any)[statisticName + "Normal"];
        }

        for (const move of pokemon.moves) {
            move.remaining = this.gameStarter.constants.moves.byName[move.title].PP;
        }

        pokemon.status = "";
    }

    /**
     * Chooses a random wild Pokemon schema from the given ones.
     * 
     * @param options   Potential Pokemon schemas to choose from.
     * @returns One of the potential Pokemon schemas at random.
     */
    public chooseRandomWildPokemon(options: IWildPokemonSchema[]): IWildPokemonSchema {
        const choice: number = this.gameStarter.numberMaker.random();
        let sum: number = 0;

        for (const option of options) {
            sum += option.rate;
            if (sum >= choice) {
                return option;
            }
        }

        throw new Error("Failed to pick random wild Pokemon from options.");
    }

    /**
     * Adds Ball and BallEmpty Things to a menu representing inventory Pokemon.
     * 
     * @param menu   A menu to add the Things to.
     * @param battler   Information on the Pokemon to add balls for.
     */
    public addBattleDisplayPokeballs(menu: IMenu, battler: IBattler, opposite?: boolean): void {
        const text: string[][] = [];
        let i: number;

        for (i = 0; i < battler.actors.length; i += 1) {
            text.push(["Ball"]);
        }

        for (; i < 6; i += 1) {
            text.push(["BallEmpty"]);
        }

        if (opposite) {
            text.reverse();
        }

        this.gameStarter.menuGrapher.addMenuDialog(menu.name, [text]);
    }

    /**
     * Adds a Pokemon's health display to its appropriate menu.
     * 
     * @param battlerName   Which battler to add the display for.
     */
    public addBattleDisplayPokemonHealth(battlerName: "player" | "opponent"): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const pokemon: IPokemon = battleInfo.battlers[battlerName]!.selectedActor!;
        const menu: string = [
            "Battle",
            battlerName[0].toUpperCase(),
            battlerName.slice(1),
            "Health"
        ].join("");

        this.gameStarter.menuGrapher.createMenu(menu);
        this.gameStarter.menuGrapher.createMenu(menu + "Title");
        this.gameStarter.menuGrapher.createMenu(menu + "Level");
        this.gameStarter.menuGrapher.createMenu(menu + "Amount");

        this.setBattleDisplayPokemonHealthBar(
            battlerName,
            pokemon.HP,
            pokemon.HPNormal);

        this.gameStarter.menuGrapher.addMenuDialog(menu + "Title", [[pokemon.nickname]]);

        this.gameStarter.menuGrapher.addMenuDialog(menu + "Level", String(pokemon.level));
    }

    /**
     * Adds a health bar to a battle display, with an appropriate width.
     * 
     * @param battlerName   Which battler to add the display for, as "player"
     *                      or "opponent".
     * @param hp   How much health the battler's Pokemon currently has.
     * @param hp   The battler's Pokemon's normal maximum health.
     */
    public setBattleDisplayPokemonHealthBar(battlerName: string, hp: number, hpNormal: number): void {
        const nameUpper: string = battlerName[0].toUpperCase() + battlerName.slice(1);
        const menuNumbers: string = "Battle" + nameUpper + "HealthNumbers";
        const bar: IThing = this.gameStarter.utilities.getThingById("HPBarFill" + nameUpper);
        const barWidth: number = this.gameStarter.equations.widthHealthBar(100, hp, hpNormal);
        const healthDialog: string = this.gameStarter.utilities.makeDigit(hp, 3, "\t")
            + "/"
            + this.gameStarter.utilities.makeDigit(hpNormal, 3, "\t");

        if (this.gameStarter.menuGrapher.getMenu(menuNumbers)) {
            for (const menu of this.gameStarter.menuGrapher.getMenu(menuNumbers).children) {
                this.gameStarter.physics.killNormal(menu as IThing);
            }

            this.gameStarter.menuGrapher.addMenuDialog(menuNumbers, healthDialog);
        }

        this.gameStarter.physics.setWidth(bar, barWidth);
        bar.hidden = barWidth === 0;
    }

    /**
     * Animates a Pokemon's health bar to increase or decrease its width.
     * 
     * @param battlerName   Which battler to add the display for, as "player"
     *                      or "opponent".
     * @param hpStart   The battler's Pokemon's starting health.
     * @param hpEnd   The battler's Pokemon's ending health.
     * @param hpNormal   The battler's Pokemon's normal maximum health.
     * @param callback   A callback for when the bar is done resizing.
     */
    public animateBattleDisplayPokemonHealthBar(
        battlerName: string,
        hpStart: number,
        hpEnd: number,
        hpNormal: number,
        callback?: (...args: any[]) => void): void {
        const direction: number = hpStart > hpEnd ? -1 : 1;
        const hpNew: number = Math.round(hpStart + direction);

        this.setBattleDisplayPokemonHealthBar(battlerName, hpNew, hpNormal);

        if (hpNew === hpEnd) {
            if (callback) {
                callback();
            }
            return;
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => this.animateBattleDisplayPokemonHealthBar(
                battlerName,
                hpNew,
                hpEnd,
                hpNormal,
                callback),
            2);
    }

    /**
     * Opens the in-battle moves menu.
     */
    public openBattleMovesMenu(): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const actorMoves: ibattlemovr.IMove[] = battleInfo.battlers.player!.selectedActor!.moves;
        const options: any[] = actorMoves.map((move: ibattlemovr.IMove): any => {
            return {
                text: move.title.toUpperCase(),
                remaining: move.remaining,
                callback: (): void => {
                    const choiceOpponent: string = this.gameStarter.equations.opponentMove(
                        battleInfo.battlers.player!,
                        battleInfo.battlers.opponent);

                    const playerMovesFirst: boolean = this.gameStarter.equations.playerMovesFirst(
                        battleInfo.battlers.player!,
                        move.title,
                        battleInfo.battlers.opponent,
                        choiceOpponent);

                    this.gameStarter.battleMover.playMove(move.title, choiceOpponent, playerMovesFirst);
                }
            };
        });

        for (let i: number = actorMoves.length; i < 4; i += 1) {
            options.push({
                text: "-"
            });
        }

        this.gameStarter.menuGrapher.createMenu("BattleFightList");
        this.gameStarter.menuGrapher.addMenuList("BattleFightList", { options });
        this.gameStarter.menuGrapher.setActiveMenu("BattleFightList");
    }

    /**
     * Opens the in-battle items menu.
     */
    public openBattleItemsMenu(): void {
        this.gameStarter.menus.openItemsMenu({
            backMenu: "BattleOptions",
            container: "Battle"
        });
    }

    /**
     * Opens the in-battle Pokemon menu.
     */
    public openBattlePokemonMenu(): void {
        this.gameStarter.menus.openPokemonMenu({
            position: {
                vertical: "bottom",
                offset: {
                    left: 0,
                    top: 96
                }
            },
            container: "Battle",
            backMenu: "BattleOptions"
        } as IMenuBase);
    }

    /**
     * Starts the dialog to exit a battle.
     */
    public startBattleExit(): void {
        if (this.gameStarter.battleMover.getBattleInfo().battlers.opponent!.category === "Trainer") {
            this.gameStarter.scenePlayer.playRoutine("BattleExitFail");
            return;
        }

        this.gameStarter.menuGrapher.deleteMenu("BattleOptions");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            this.gameStarter.battleMover.getBattleInfo().exitDialog
                || this.gameStarter.battleMover.getDefaults().exitDialog || "",
            (): void => {
                this.gameStarter.battleMover.closeBattle();
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
