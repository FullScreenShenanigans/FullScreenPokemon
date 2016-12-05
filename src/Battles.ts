import { IMove } from "battlemovr/lib/IBattleMovr";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "./FullScreenPokemon";
import {
    IBattleInfo, IBattler, IMenu, IPlayer, IPokemon, IThing, IWildPokemonSchema
} from "./IFullScreenPokemon";

/**
 * Battle functions used by FullScreenPokemon instances.
 */
export class Battles<TEightBittr extends FullScreenPokemon> extends Component<TEightBittr> {
    /**
     * Starts a Pokemon battle.
     * 
     * @param battleInfo   Settings for the battle.
     */
    public startBattle(battleInfo: IBattleInfo): void {
        this.eightBitter.modAttacher.fireEvent("onBattleStart", battleInfo);

        const animations: string[] = battleInfo.animations || [
            // "LineSpiral", "Flash"
            "Flash"
        ];
        const animation: string = this.eightBitter.numberMaker.randomArrayMember(animations);
        let player: any = battleInfo.battlers.player;

        if (!player) {
            battleInfo.battlers.player = player = {} as any;
        }

        player.name = player.name || "%%%%%%%PLAYER%%%%%%%";
        player.sprite = player.sprite || "PlayerBack";
        player.category = player.category || "Trainer";
        player.actors = player.actors || this.eightBitter.itemsHolder.getItem("PokemonInParty");
        player.hasActors = typeof player.hasActors === "undefined"
            ? true : player.hasActors;

        this.eightBitter.modAttacher.fireEvent("onBattleReady", battleInfo);

        this.eightBitter.audioPlayer.playTheme(battleInfo.theme || "Battle Trainer");

        (this.eightBitter.cutscenes as any)["cutsceneBattleTransition" + animation](
            {
                battleInfo,
                callback: (): void => this.eightBitter.BattleMover.startBattle(battleInfo)
            }
        );

        this.eightBitter.graphics.moveBattleKeptThingsToText(battleInfo);
    }

    /**
     * Heals a Pokemon back to full health.
     * 
     * @param pokemon   An in-game Pokemon to heal.
     */
    public healPokemon(pokemon: IPokemon): void {
        const moves: IMove[] = this.eightBitter.mathDecider.getConstant("moves");
        const statisticNames: string[] = this.eightBitter.mathDecider.getConstant("statisticNames");

        for (let statisticName of statisticNames) {
            (pokemon as any)[statisticName] = (pokemon as any)[statisticName + "Normal"];
        }

        for (let move of pokemon.moves) {
            move.remaining = (moves as any)[move.title].PP;
        }

        pokemon.status = "";
    }

    /**
     * Starts grass battle if a Player is in grass, using the doesGrassEncounterHappen
     * equation.
     * 
     * @param thing   An in-game Player.
     */
    public checkPlayerGrassBattle(thing: IPlayer): boolean {
        if (!thing.grass || this.eightBitter.MenuGrapher.getActiveMenu()) {
            return false;
        }

        if (!this.eightBitter.thingHitter.checkHitForThings(thing as any, thing.grass as any)) {
            delete thing.grass;
            return false;
        }

        if (!this.eightBitter.mathDecider.compute("doesGrassEncounterHappen", thing.grass)) {
            return false;
        }

        thing.keys = thing.getKeys();
        this.eightBitter.animations.animateGrassBattleStart(thing, thing.grass);

        return true;
    }

    /**
     * Chooses a random wild Pokemon schema from the given ones.
     * 
     * @param options   Potential Pokemon schemas to choose from.
     * @returns One of the potential Pokemon schemas at random.
     */
    public chooseRandomWildPokemon(options: IWildPokemonSchema[]): IWildPokemonSchema {
        const choice: number = this.eightBitter.numberMaker.random();
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

        this.eightBitter.MenuGrapher.addMenuDialog(menu.name, [text]);
    }

    /**
     * Adds a Pokemon's health display to its appropriate menu.
     * 
     * @param battlerName   Which battler to add the display for.
     */
    public addBattleDisplayPokemonHealth(battlerName: "player" | "opponent"): void {
        const battleInfo: IBattleInfo = this.eightBitter.BattleMover.getBattleInfo() as IBattleInfo;
        const pokemon: IPokemon = battleInfo.battlers[battlerName]!.selectedActor!;
        const menu: string = [
            "Battle",
            battlerName[0].toUpperCase(),
            battlerName.slice(1),
            "Health"
        ].join("");

        this.eightBitter.MenuGrapher.createMenu(menu);
        this.eightBitter.MenuGrapher.createMenu(menu + "Title");
        this.eightBitter.MenuGrapher.createMenu(menu + "Level");
        this.eightBitter.MenuGrapher.createMenu(menu + "Amount");

        this.setBattleDisplayPokemonHealthBar(
            battlerName,
            pokemon.HP,
            pokemon.HPNormal);

        this.eightBitter.MenuGrapher.addMenuDialog(menu + "Title", [[pokemon.nickname]]);

        this.eightBitter.MenuGrapher.addMenuDialog(menu + "Level", String(pokemon.level));
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
        const bar: IThing = this.eightBitter.utilities.getThingById("HPBarFill" + nameUpper);
        const barWidth: number = this.eightBitter.mathDecider.compute("widthHealthBar", 25, hp, hpNormal);
        const healthDialog: string = this.eightBitter.utilities.makeDigit(hp, 3, "\t")
            + "/"
            + this.eightBitter.utilities.makeDigit(hpNormal, 3, "\t");

        if (this.eightBitter.MenuGrapher.getMenu(menuNumbers)) {
            for (const menu of this.eightBitter.MenuGrapher.getMenu(menuNumbers).children) {
                this.eightBitter.physics.killNormal(menu as IThing);
            }

            this.eightBitter.MenuGrapher.addMenuDialog(menuNumbers, healthDialog);
        }

        this.eightBitter.physics.setWidth(bar, barWidth);
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

        this.eightBitter.timeHandler.addEvent(
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
        const actorMoves: IMove[] = this.eightBitter.BattleMover.getBattleInfo().battlers.player!.selectedActor!.moves;
        const options: any[] = actorMoves.map((move: IMove): any => {
            return {
                text: move.title.toUpperCase(),
                remaining: move.remaining,
                callback: (): void => {
                    this.eightBitter.BattleMover.playMove(move.title);
                }
            };
        });

        for (let i: number = actorMoves.length; i < 4; i += 1) {
            options.push({
                text: "-"
            });
        }

        this.eightBitter.MenuGrapher.createMenu("BattleFightList");
        this.eightBitter.MenuGrapher.addMenuList("BattleFightList", { options });
        this.eightBitter.MenuGrapher.setActiveMenu("BattleFightList");
    }

    /**
     * Opens the in-battle items menu.
     */
    public openBattleItemsMenu(): void {
        this.eightBitter.menus.openPokemonMenu({
            position: {
                horizontal: "right",
                vertical: "bottom",
                offset: {
                    left: 0
                }
            },
            size: {
                height: 44
            },
            container: "Battle",
            backMenu: "BattleOptions"
        });
    }

    /**
     * Opens the in-battle Pokemon menu.
     */
    public openBattlePokemonMenu(): void {
        this.eightBitter.menus.openItemsMenu({
            backMenu: "BattleOptions",
            container: "Battle"
        });
    }

    /**
     * Starts the dialog to exit a battle.
     */
    public startBattleExit(): void {
        if (this.eightBitter.BattleMover.getBattleInfo().battlers.opponent!.category === "Trainer") {
            this.eightBitter.scenePlayer.playRoutine("BattleExitFail");
            return;
        }

        this.eightBitter.MenuGrapher.deleteMenu("BattleOptions");
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            this.eightBitter.BattleMover.getBattleInfo().exitDialog
                || this.eightBitter.BattleMover.getDefaults().exitDialog || "",
            (): void => {
                this.eightBitter.BattleMover.closeBattle();
            });
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }
}
