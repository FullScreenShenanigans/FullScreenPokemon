import { member } from "babyioc";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";

import { EncounterChoices } from "./encounters/EncounterChoices";
import { EncounterStarting } from "./encounters/EncounterStarting";

/**
 * Checks for and starts wild Pokemon encounters during walking.
 */
export class Encounters extends Section<FullScreenPokemon> {
    /**
     * Chooses wild Pokemon to encounter during walking.
     */
    @member(EncounterChoices)
    public readonly choices: EncounterChoices;

    /**
     * Starts wild Pokemon encounters during walking.
     */
    @member(EncounterStarting)
    public readonly starting: EncounterStarting;
}
