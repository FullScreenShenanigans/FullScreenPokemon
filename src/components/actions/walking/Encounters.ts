import { GeneralComponent } from "gamestartr";

import { component } from "babyioc";
import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleTeam, IPokemon } from "../../Battles";
import { IArea, IMap, IWildPokemonSchema } from "../../Maps";
import { ICharacter, IPlayer } from "../../Things";
import { EncounterChoices } from "./encounters/EncounterChoices";
import { EncounterStarting } from "./encounters/EncounterStarting";

/**
 * Checks for and starts wild Pokemon encounters during walking.
 */
export class Encounters<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Chooses wild Pokemon to encounter during walking.
     */
    @component(EncounterChoices)
    public readonly choices: EncounterChoices<TGameStartr>;

    /**
     * Starts wild Pokemon encounters during walking.
     */
    @component(EncounterStarting)
    public readonly starting: EncounterStarting<TGameStartr>;
}
