import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

// import { IPokemon } from "../../components/Battles";
// import { IPokemonListing } from "../../components/constants/Pokemon";
// import { IArea, IWildPokemonSchema } from "../../components/Maps";
import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Mod to scale enemy Pokemon to be around the same level as the trainer's party.
 */
export class ScalingLevelsMod<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Scaling Levels";

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
        onBattleReady: (battleInfo: any): void => {
            console.log("Should scale levels in", battleInfo);
            // const opponent: IBattler = battleInfo.battlers.opponent;
            // const player: IBattler = battleInfo.battlers.player!;
            // const isWildBattle: boolean = opponent.name === opponent.actors[0].nickname;
            // const wildPokemonOptions: IWildPokemonSchema[] | undefined = (this.gameStarter.areaSpawner.getArea() as IArea)
            //     .wildPokemon.grass;
            // if (!wildPokemonOptions) {
            //     return;
            // }

            // const statistics: string[] = this.gameStarter.constants.pokemon.statisticNames;
            // const enemyPokemonAvg: number = isWildBattle ?
            //     this.gameStarter.equations.averageLevelWildPokemon(wildPokemonOptions) :
            //     this.gameStarter.equations.averageLevel(opponent.actors);
            // const playerPokemonAvg: number = this.gameStarter.equations.averageLevel(player.actors);

            // for (const actor of opponent.actors as IPokemon[]) {
            //     const schema: IPokemonListing = this.gameStarter.constants.pokemon.byName[actor.title.join("")];
            //     actor.level += playerPokemonAvg - enemyPokemonAvg;

            //     for (const statistic of statistics) {
            //         actor.statistics[statistic] = this.gameStarter.equations.pokemonStatistic(
            //             statistic,
            //             schema[statistic],
            //             actor.level,
            //             actor.ev[statistic],
            //             actor.iv[statistic]);
            //     }
            // }
        }
    };
}
