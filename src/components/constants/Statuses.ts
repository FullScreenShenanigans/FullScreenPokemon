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
        "Paralyze": true,
        "Burn": true,
        "Poison": true
    };

    /**
     * Bonus probability points awarded for statuses in the canCatchPokemon equation
     * against the random generated N.
     *
     * @todo Where to get?
     */
    public readonly levels: { [i: string]: number } = {
        "Normal": -1,
        "Sleep": -1,
        "Freeze": -1,
        "Paralyze": -1,
        "Burn": -1,
        "Poison": -1
    };

    /**
     * Additional shake points(s) in the numBallShakes equation for each status.
     */
    public readonly shaking: { [i: string]: number } = {
        "Normal": 0,
        "Sleep": 10,
        "Freeze": 10,
        "Paralyze": 5,
        "Burn": 5,
        "Poison": 5
    };
}
