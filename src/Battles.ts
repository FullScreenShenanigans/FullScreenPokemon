/// <reference path="../typings/EightBittr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";
import { IThing } from "./IFullScreenPokemon";

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
        this.ModAttacher.fireEvent("onBattleStart", battleInfo);

        let animations: string[] = battleInfo.animations || [
            // "LineSpiral", "Flash"
            "Flash"
        ],
            animation: string = this.NumberMaker.randomArrayMember(animations),
            player: any = battleInfo.player;

        if (!player) {
            battleInfo.player = player = <any>{};
        }

        player.name = player.name || "%%%%%%%PLAYER%%%%%%%";
        player.sprite = player.sprite || "PlayerBack";
        player.category = player.category || "Trainer";
        player.actors = player.actors || this.ItemsHolder.getItem("PokemonInParty");
        player.hasActors = typeof player.hasActors === "undefined"
            ? true : player.hasActors;

        this.ModAttacher.fireEvent("onBattleReady", battleInfo);

        this.AudioPlayer.playTheme(battleInfo.theme || "Battle Trainer");

        this["cutsceneBattleTransition" + animation](
            this,
            {
                "battleInfo": battleInfo,
                "callback": this.BattleMover.startBattle.bind(this.BattleMover, battleInfo)
            }
        );

        this.moveBattleKeptThingsToText(battleInfo);
    }

    /**
     * Heals a Pokemon back to full health.
     * 
     * @param pokemon   An in-game Pokemon to heal.
     */
    healPokemon(pokemon: IPokemon): void {
        let moves: BattleMovr.IMove[] = this.MathDecider.getConstant("moves"),
            statisticNames: string[] = this.MathDecider.getConstant("statisticNames");

        for (let statisticName of statisticNames) {
            pokemon[statisticName] = pokemon[statisticName + "Normal"];
        }

        for (let move of pokemon.moves) {
            move.remaining = moves[move.title].PP;
        }

        pokemon.status = "";
    }

    /**
     * Starts grass battle if a Player is in grass, using the doesGrassEncounterHappen
     * equation.
     * 
     * @param thing   An in-game Player.
     */
    checkPlayerGrassBattle(thing: IPlayer): boolean {
        if (!thing.grass || this.MenuGrapher.getActiveMenu()) {
            return false;
        }

        if (!this.ThingHitter.checkHitForThings(thing, thing.grass)) {
            delete thing.grass;
            return false;
        }

        if (!this.MathDecider.compute("doesGrassEncounterHappen", thing.grass)) {
            return false;
        }

        thing.keys = thing.getKeys();
        this.animateGrassBattleStart(thing, thing.grass);

        return true;
    }

    /**
     * Chooses a random wild Pokemon schema from the given ones.
     * 
     * @param options   Potential Pokemon schemas to choose from.
     * @returns One of the potential Pokemon schemas at random.
     */
    chooseRandomWildPokemon(options: IWildPokemonSchema[]): IWildPokemonSchema {
        let choice: number = this.NumberMaker.random(),
            sum: number = 0;

        for (let option of options) {
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
    addBattleDisplayPokeballs(menu: IMenu, battler: BattleMovr.IBattleThingsInfo, opposite?: boolean): void {
        let text: string[][] = [],
            i: number;

        for (i = 0; i < battler.actors.length; i += 1) {
            text.push(["Ball"]);
        }

        for (; i < 6; i += 1) {
            text.push(["BallEmpty"]);
        }

        if (opposite) {
            text.reverse();
        }

        this.MenuGrapher.addMenuDialog(menu.name, [text]);
    }

    /**
     * Adds a Pokemon's health display to its appropriate menu.
     * 
     * @param battlerName   Which battler to add the display for, as "player"
     *                      or "opponent".
     */
    addBattleDisplayPokemonHealth(battlerName: string): void {
        let battleInfo: IBattleInfo = <IBattleInfo>this.BattleMover.getBattleInfo(),
            pokemon: IPokemon = battleInfo[battlerName].selectedActor,
            menu: string = [
                "Battle",
                battlerName[0].toUpperCase(),
                battlerName.slice(1),
                "Health"
            ].join("");

        this.MenuGrapher.createMenu(menu);
        this.MenuGrapher.createMenu(menu + "Title");
        this.MenuGrapher.createMenu(menu + "Level");
        this.MenuGrapher.createMenu(menu + "Amount");

        this.setBattleDisplayPokemonHealthBar(
            battlerName,
            pokemon.HP,
            pokemon.HPNormal);

        this.MenuGrapher.addMenuDialog(menu + "Title", [[pokemon.nickname]]);

        this.MenuGrapher.addMenuDialog(menu + "Level", String(pokemon.level));
    }

    /**
     * Adds a health bar to a battle display, with an appropriate width.
     * 
     * @param battlerName   Which battler to add the display for, as "player"
     *                      or "opponent".
     * @param hp   How much health the battler's Pokemon currently has.
     * @param hp   The battler's Pokemon's normal maximum health.
     */
    setBattleDisplayPokemonHealthBar(battlerName: string, hp: number, hpNormal: number): void {
        let nameUpper: string = battlerName[0].toUpperCase() + battlerName.slice(1),
            menuNumbers: string = "Battle" + nameUpper + "HealthNumbers",
            bar: IThing = this.getThingById("HPBarFill" + nameUpper),
            barWidth: number = this.MathDecider.compute("widthHealthBar", 25, hp, hpNormal),
            healthDialog: string = this.makeDigit(hp, 3, "\t") + "/" + this.makeDigit(hpNormal, 3, "\t");

        if (this.MenuGrapher.getMenu(menuNumbers)) {
            this.MenuGrapher.getMenu(menuNumbers).children.forEach(this.killNormal.bind(this));
            this.MenuGrapher.addMenuDialog(menuNumbers, healthDialog);
        }

        this.setWidth(bar, barWidth);
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
    animateBattleDisplayPokemonHealthBar(
        battlerName: string,
        hpStart: number,
        hpEnd: number,
        hpNormal: number,
        callback?: (...args: any[]) => void): void {
        let direction: number = hpStart > hpEnd ? -1 : 1,
            hpNew: number = Math.round(hpStart + direction);

        this.setBattleDisplayPokemonHealthBar(battlerName, hpNew, hpNormal);

        if (hpNew === hpEnd) {
            if (callback) {
                callback();
            }
            return;
        }

        this.TimeHandler.addEvent(
            this.animateBattleDisplayPokemonHealthBar.bind(this),
            2,
            battlerName,
            hpNew,
            hpEnd,
            hpNormal,
            callback);
    }
}
