import { component } from "babyioc";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";

import { EncounterChoices } from "./encounters/EncounterChoices";
import { EncounterStarting } from "./encounters/EncounterStarting";

/**
 * Checks for and starts wild Pokemon encounters during walking.
 */
export class Encounters<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Chooses wild Pokemon to encounter during walking.
     */
    @component(EncounterChoices)
    public readonly choices: EncounterChoices<TEightBittr>;

    /**
     * Starts wild Pokemon encounters during walking.
     */
    @component(EncounterStarting)
    public readonly starting: EncounterStarting<TEightBittr>;
}
