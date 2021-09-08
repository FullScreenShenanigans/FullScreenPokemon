import { CallbackRegister, Mod } from "modattachr";

import { ModComponent } from "./ModComponent";

/**
 * Mod to scale enemy Pokemon to be around the same level as the trainer's party.
 */
export class ScalingLevelsMod extends ModComponent implements Mod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Scaling Levels";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: CallbackRegister = {
        /**
         * Right before the battle starts, scales the enemy Pokemon
         * to be around the same level as those in the player's party.
         *
         * @param battleInfo   Settings for the current battle.
         */
        [this.eventNames.onBattleStart]: (battleInfo: any): void => {
            console.log("Should scale levels in", battleInfo);
            // const opponent: Battler = battleInfo.battlers.opponent;
            // const player: Battler = battleInfo.battlers.player!;
            // const isWildBattle: boolean = opponent.name === opponent.actors[0].nickname;
            // const wildPokemonOptions: WildPokemonSchema[] | undefined = this.game.mapScreener.activeArea.wildPokemon;
            //     .wildPokemon.grass;
            // if (!wildPokemonOptions) {
            //     return;
            // }

            // const statistics: string[] = this.game.constants.pokemon.statisticNames;
            // const enemyPokemonAvg: number = isWildBattle ?
            //     this.game.equations.averageLevelWildPokemon(wildPokemonOptions) :
            //     this.game.equations.averageLevel(opponent.actors);
            // const playerPokemonAvg: number = this.game.equations.averageLevel(player.actors);

            // for (const actor of opponent.actors as Pokemon[]) {
            //     const schema: PokemonListing = this.game.constants.pokemon.byName[actor.title.join("")];
            //     actor.level += playerPokemonAvg - enemyPokemonAvg;

            //     for (const statistic of statistics) {
            //         actor.statistics[statistic] = this.game.equations.pokemonStatistic(
            //             statistic,
            //             schema[statistic],
            //             actor.level,
            //             actor.ev[statistic],
            //             actor.iv[statistic]);
            //     }
            // }
        },
    };
}
