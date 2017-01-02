import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { IPokemon } from "../../components/Battles";
import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Mod to make the trainer's Pokemon all level 100.
 */
export class Level100Mod<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Level 100";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        onModEnable: (): void => {
            const partyPokemon: IPokemon[] = this.gameStarter.itemsHolder.getItem("PokemonInParty");
            const statistics: string[] = this.gameStarter.constants.pokemon.statisticNames;

            for (let i: number = 0; i < partyPokemon.length; i += 1) {
                partyPokemon[i].previousLevel = partyPokemon[i].level;
                partyPokemon[i].level = 100;
                for (let j: number = 0; j < statistics.length; j += 1) {
                    (partyPokemon[i] as any)[statistics[j]] = (partyPokemon[i] as any)[statistics[j] + "Normal"] =
                        this.gameStarter.equations.pokemonStatistic(partyPokemon[i], statistics[j]);
                }
            }
        },
        onModDisable: (): void => {
            const partyPokemon: IPokemon[] = this.gameStarter.itemsHolder.getItem("PokemonInParty");
            const statistics: string[] = this.gameStarter.constants.pokemon.statisticNames;

            for (const pokemon of partyPokemon) {
                pokemon.level = pokemon.previousLevel!;
                pokemon.previousLevel = undefined;
                for (let j: number = 0; j < statistics.length; j += 1) {
                    (pokemon as any)[statistics[j]] = (pokemon as any)[statistics[j] + "Normal"] =
                        this.gameStarter.equations.pokemonStatistic(pokemon, statistics[j]);
                }
            }
        }
    };
}
