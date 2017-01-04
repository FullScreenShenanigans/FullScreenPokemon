/**
 * Information on Pokemon status effects.
 */
export class Statuses {
    /**
     * Names of all statuses Pokemon may have.
     */
    public readonly names: string[] = ["Sleep", "Freeze", "Paralyze", "Burn", "Poison"];

    /**
     * Statuses that will enable a Pokemon to be caught in the canCatchPokemon
     * equation if a random generated N is < 25.
     */
    public readonly probability25: { [i: string]: boolean } = {
        "Sleep": true,
        "Freeze": true
    };

    /**
     * Statuses that will enable a Pokemon to be caught in the canCatchPokemon
     * equation if a random generated N is < 12.
     */
    public readonly probability12: { [i: string]: boolean } = {
        "paralyze": true,
        "burn": true,
        "poison": true
    };

    /**
     * Bonus probability points awarded for statuses in the canCatchPokemon equation
     * against the random generated N.
     *
     * @todo Where to get?
     */
    public readonly levels: { [i: string]: number } = {
        "normal": -1,
        "sleep": -1,
        "freeze": -1,
        "paralyze": -1,
        "burn": -1,
        "poison": -1
    };

    /**
     * Additional shake points(s) in the numBallShakes equation for each status.
     */
    public readonly shaking: { [i: string]: number } = {
        "normal": 0,
        "sleep": 10,
        "freeze": 10,
        "paralyze": 5,
        "burn": 5,
        "poison": 5
    };
}
