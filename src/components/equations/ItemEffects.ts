import { IMove, IStatistic } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokemon } from "../Battles";

export class ItemEffects<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Restores a certain amount of PP to a move.
     *
     * @param move   The move whose PP is being modified.
     * @param amount   The amount of PP that is being restored.
     */
    public addPP(move: IMove, amount: number) {
        if (amount < 0) {
            throw new Error("PP decrements aren't allowed.");
        }

        move.remaining = Math.min(move.remaining + amount, move.uses);
    }

    /**
     * Increases a stat by 1.
     *
     * @param statistic   The statistic that is being modified.
     */
    private increaseBattleStat(statistic: IStatistic) {
        statistic.current = Math.min(statistic.normal * 4, (statistic.normal / 2) + statistic.current);
    }

    /**
     * Opens dialog menu for using a battle item like X Attack / X Defend.
     *
     * @param pokemon   The pokemon who the X Item is being used on.
     * @param statistic   The stat that is being modified by the item.
     * @param type   The string representing the stat name.
     */
    public useXItem(pokemon: IPokemon, statistic: IStatistic, type: string) {

        //TODO: Implement X Accuracy
        //https://github.com/FullScreenShenanigans/FullScreenPokemon/issues/657

        this.eightBitter.menuGrapher.createMenu("GeneralText", {
            deleteOnFinish: true,
        });
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "%%%%%%%PLAYER%%%%%%% used X " + type.toUpperCase() + "!",
                ],
                pokemon.title.join("") + "'s " + type.toUpperCase() + " rose!",
            ],
            (): void => {
                this.increaseBattleStat(statistic);
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Revives a Pokemon.
     *
     * @param pokemon   An in-game Pokemon to revive.
     * @param percentage   The percentage of health restored by the revive (use 50% for Revive, 100% for Max Revive).
     */
    private revivePokemon(pokemon: IPokemon, percentage: number): void {
        if (percentage < 0 || percentage > 1) {
            throw new Error("Invalid percentage value.");
        }

        for (const statisticName of this.eightBitter.constants.pokemon.statisticNames) {
            pokemon.statistics[statisticName].current = (statisticName === "health") ? pokemon.statistics[statisticName].normal * percentage
                : pokemon.statistics[statisticName].current = pokemon.statistics[statisticName].normal;
        }

        pokemon.status = undefined;
    }

    /**
     * The dialog options for using a Revive or Max Revive.
     *
     * @param pokemon   An in-game Pokemon to revive.
     * @param percentage   The percentage of health restored by the revive (use 50% for Revive, 100% for Max Revive).
     */
    public useRevive(pokemon: IPokemon, percentage: number) {
        this.eightBitter.menuGrapher.createMenu("GeneralText", {
            deleteOnFinish: true,
        });
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    pokemon.title.join("") + " is revitalized!",
                ],
            ],
            (): void => {
                this.revivePokemon(pokemon, percentage);
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Allows you to add a wild Pokemon to your party.
     *
     * @param pokemon   A Pokemon that you're capturing.
     * @returns Whether the Pokemon was added to your party or not.
     */
    public capturePokemon(pokemon: IPokemon): boolean {
        if (this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.pokemonInParty).length >= 6) {
            return false;
        }
        this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.pokemonInParty).push(pokemon);
        return true;
    }
}
