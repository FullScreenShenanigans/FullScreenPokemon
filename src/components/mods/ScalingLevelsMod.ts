import { ICallbackRegister, IMod } from "modattachr";

// import { IPokemon } from "../../components/Battles";
// import { IPokemonListing } from "../../components/constants/Pokemon";
// import { IArea, IWildPokemonSchema } from "../../components/Maps";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ModComponent } from "./ModComponent";

/**
 * Mod to scale enemy Pokemon to be around the same level as the trainer's party.
 */
export class ScalingLevelsMod<TEightBittr extends FullScreenPokemon> extends ModComponent<TEightBittr> implements IMod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Scaling Levels";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        /**
         * Right before the battle starts, scales the enemy Pokemon
         * to be around the same level as those in the player's party.
         *
         * @param battleInfo   Settings for the current battle.
         */
        [this.eventNames.onBattleStart]: (battleInfo: any): void => {
            console.log("Should scale levels in", battleInfo);
            // const opponent: IBattler = battleInfo.battlers.opponent;
            // const player: IBattler = battleInfo.battlers.player!;
            // const isWildBattle: boolean = opponent.name === opponent.actors[0].nickname;
            // const wildPokemonOptions: IWildPokemonSchema[] | undefined = this.eightBitter.mapScreener.activeArea.wildPokemon;
            //     .wildPokemon.grass;
            // if (!wildPokemonOptions) {
            //     return;
            // }

            // const statistics: string[] = this.eightBitter.constants.pokemon.statisticNames;
            // const enemyPokemonAvg: number = isWildBattle ?
            //     this.eightBitter.equations.averageLevelWildPokemon(wildPokemonOptions) :
            //     this.eightBitter.equations.averageLevel(opponent.actors);
            // const playerPokemonAvg: number = this.eightBitter.equations.averageLevel(player.actors);

            // for (const actor of opponent.actors as IPokemon[]) {
            //     const schema: IPokemonListing = this.eightBitter.constants.pokemon.byName[actor.title.join("")];
            //     actor.level += playerPokemonAvg - enemyPokemonAvg;

            //     for (const statistic of statistics) {
            //         actor.statistics[statistic] = this.eightBitter.equations.pokemonStatistic(
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
