/// <reference path="../typings/EightBittr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";
import {
    IBattleInfo, IMenu, IPlayer, IPokemon, IThing, IWildPokemonSchema
} from "./IFullScreenPokemon";

/**
 * Battle functions used by FullScreenPokemon instances.
 */
export class Battles<TEightBittr extends FullScreenPokemon> extends EightBittr.Component<TEightBittr> {
    /**
     * Starts a Pokemon battle.
     * 
     * @param battleInfo   Settings for the battle.
     */
    public startBattle(battleInfo: IBattleInfo): void {
        this.EightBitter.ModAttacher.fireEvent("onBattleStart", battleInfo);

        const animations: string[] = battleInfo.animations || [
            // "LineSpiral", "Flash"
            "Flash"
        ];
        const animation: string = this.EightBitter.NumberMaker.randomArrayMember(animations);
        let player: any = battleInfo.battlers.player;

        if (!player) {
            battleInfo.battlers.player = player = {} as any;
        }

        player.name = player.name || "%%%%%%%PLAYER%%%%%%%";
        player.sprite = player.sprite || "PlayerBack";
        player.category = player.category || "Trainer";
        player.actors = player.actors || this.EightBitter.ItemsHolder.getItem("PokemonInParty");
        player.hasActors = typeof player.hasActors === "undefined"
            ? true : player.hasActors;

        this.EightBitter.ModAttacher.fireEvent("onBattleReady", battleInfo);

        this.EightBitter.AudioPlayer.playTheme(battleInfo.theme || "Battle Trainer");

        (this.EightBitter.cutscenes as any)["cutsceneBattleTransition" + animation](
            {
                battleInfo,
                callback: (): void => this.EightBitter.BattleMover.startBattle(battleInfo)
            }
        );

        this.EightBitter.graphics.moveBattleKeptThingsToText(battleInfo);
    }

    /**
     * Heals a Pokemon back to full health.
     * 
     * @param pokemon   An in-game Pokemon to heal.
     */
    public healPokemon(pokemon: IPokemon): void {
        const moves: BattleMovr.IMove[] = this.EightBitter.MathDecider.getConstant("moves");
        const statisticNames: string[] = this.EightBitter.MathDecider.getConstant("statisticNames");

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
        if (!thing.grass || this.EightBitter.MenuGrapher.getActiveMenu()) {
            return false;
        }

        if (!this.EightBitter.ThingHitter.checkHitForThings(thing as any, thing.grass as any)) {
            delete thing.grass;
            return false;
        }

        if (!this.EightBitter.MathDecider.compute("doesGrassEncounterHappen", thing.grass)) {
            return false;
        }

        thing.keys = thing.getKeys();
        this.EightBitter.animations.animateGrassBattleStart(thing, thing.grass);

        return true;
    }

    /**
     * Chooses a random wild Pokemon schema from the given ones.
     * 
     * @param options   Potential Pokemon schemas to choose from.
     * @returns One of the potential Pokemon schemas at random.
     */
    public chooseRandomWildPokemon(options: IWildPokemonSchema[]): IWildPokemonSchema {
        const choice: number = this.EightBitter.NumberMaker.random();
        let sum: number = 0;

        for (const option of options) {
            sum += option.rate;
            if (sum >= choice) {
                return option;
            }
        }
    }

    /**
     * Adds Ball and BallEmpty Things to a menu representing inventory Pokemon.
     * 
     * @param menu   A menu to add the Things to.
     * @param battler   Information on the Pokemon to add balls for.
     */
    public addBattleDisplayPokeballs(menu: IMenu, battler: BattleMovr.IBattler, opposite?: boolean): void {
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

        this.EightBitter.MenuGrapher.addMenuDialog(menu.name, [text]);
    }

    /**
     * Adds a Pokemon's health display to its appropriate menu.
     * 
     * @param battlerName   Which battler to add the display for.
     */
    public addBattleDisplayPokemonHealth(battlerName: "player" | "opponent"): void {
        const battleInfo: IBattleInfo = this.EightBitter.BattleMover.getBattleInfo() as IBattleInfo;
        const pokemon: IPokemon = battleInfo.battlers[battlerName].selectedActor;
        const menu: string = [
            "Battle",
            battlerName[0].toUpperCase(),
            battlerName.slice(1),
            "Health"
        ].join("");

        this.EightBitter.MenuGrapher.createMenu(menu);
        this.EightBitter.MenuGrapher.createMenu(menu + "Title");
        this.EightBitter.MenuGrapher.createMenu(menu + "Level");
        this.EightBitter.MenuGrapher.createMenu(menu + "Amount");

        this.setBattleDisplayPokemonHealthBar(
            battlerName,
            pokemon.HP,
            pokemon.HPNormal);

        this.EightBitter.MenuGrapher.addMenuDialog(menu + "Title", [[pokemon.nickname]]);

        this.EightBitter.MenuGrapher.addMenuDialog(menu + "Level", String(pokemon.level));
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
        const bar: IThing = this.EightBitter.utilities.getThingById("HPBarFill" + nameUpper);
        const barWidth: number = this.EightBitter.MathDecider.compute("widthHealthBar", 25, hp, hpNormal);
        const healthDialog: string = this.EightBitter.utilities.makeDigit(hp, 3, "\t")
            + "/"
            + this.EightBitter.utilities.makeDigit(hpNormal, 3, "\t");

        if (this.EightBitter.MenuGrapher.getMenu(menuNumbers)) {
            for (const menu of this.EightBitter.MenuGrapher.getMenu(menuNumbers).children) {
                this.EightBitter.physics.killNormal(menu as IThing);
            }

            this.EightBitter.MenuGrapher.addMenuDialog(menuNumbers, healthDialog);
        }

        this.EightBitter.physics.setWidth(bar, barWidth);
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

        this.EightBitter.TimeHandler.addEvent(
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
        const actorMoves: BattleMovr.IMove[] = this.EightBitter.BattleMover.getBattleInfo().battlers.player.selectedActor.moves;
        const moveOptions: any[] = [];

        for (let i: number = 0; i < actorMoves.length; i += 1) {
            const move: BattleMovr.IMove = actorMoves[i];

            moveOptions.push({
                text: move.title.toUpperCase(),
                remaining: move.remaining,
                callback: (title: string): void => {
                    this.EightBitter.BattleMover.playMove(move.title);
                }
            });
        }

        for (let i: number = actorMoves.length; i < 4; i += 1) {
            moveOptions.push({
                text: "-"
            });
        }

        this.EightBitter.MenuGrapher.createMenu("BattleFightList");
        this.EightBitter.MenuGrapher.addMenuList("BattleFightList", {
            "options": moveOptions
        });
        this.EightBitter.MenuGrapher.setActiveMenu("BattleFightList");
    }

    /**
     * Opens the in-battle items menu.
     */
    public openBattleItemsMenu(): void {
        this.EightBitter.menus.openPokemonMenu({
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
        this.EightBitter.menus.openItemsMenu({
            backMenu: "BattleOptions",
            container: "Battle"
        });
    }

    /**
     * Starts the dialog to exit a battle.
     */
    public startBattleExit(): void {
        if (this.EightBitter.BattleMover.getBattleInfo().battlers.opponent.category === "Trainer") {
            this.EightBitter.ScenePlayer.playRoutine("BattleExitFail");
            return;
        }

        this.EightBitter.MenuGrapher.deleteMenu("BattleOptions");
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            this.EightBitter.BattleMover.getBattleInfo().exitDialog
                || this.EightBitter.BattleMover.getDefaults().exitDialog || "",
            (): void => {
                this.EightBitter.BattleMover.closeBattle();
            });
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
    }
}
