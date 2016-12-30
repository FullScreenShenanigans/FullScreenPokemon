/**
 * Information on move types.
 */
export class Types {
    /**
     * Names of types Pokemon may be.
     * 
     * @see http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart#Generation_I
     */
    public readonly names: string[] = [
        "Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug",
        "Ghost", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon"
    ];

    /**
     * Type names mapped to their location in the type effectiveness table.
     */
    public readonly indices: { [i: string]: number; } = {
        Normal: 0,
        Fighting: 1,
        Flying: 2,
        Poison: 3,
        Ground: 4,
        Rock: 5,
        Bug: 6,
        Ghost: 7,
        Fire: 8,
        Water: 9,
        Grass: 10,
        Electric: 11,
        Psychic: 12,
        Ice: 13,
        Dragon: 14
    };

    /**
     * The type effectiveness table, mapping each [attacker, defender] type
     * effectiveness multiplier.
     */
    public readonly effectivenessTable: number[][] = [
        [1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        [2.0, 1.0, 0.5, 0.5, 1.0, 2.0, 0.5, 0.0, 1.0, 1.0, 1.0, 1.0, 0.5, 2.0, 1.0],
        [1.0, 2.0, 1.0, 1.0, 1.0, 0.5, 2.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 1.0, 1.0],
        [1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 2.0, 0.5, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0],
        [1.0, 1.0, 0.0, 2.0, 1.0, 2.0, 0.5, 1.0, 2.0, 1.0, 0.5, 2.0, 1.0, 1.0, 1.0],
        [1.0, 0.5, 2.0, 1.0, 0.5, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0],
        [1.0, 0.5, 0.5, 2.0, 1.0, 1.0, 1.0, 0.5, 0.5, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0],
        [0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0],
        [1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 2.0, 1.0, 0.5, 0.5, 2.0, 1.0, 1.0, 2.0, 0.5],
        [1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 1.0, 1.0, 2.0, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5],
        [1.0, 1.0, 0.5, 0.5, 2.0, 2.0, 0.5, 1.0, 0.5, 2.0, 0.5, 1.0, 1.0, 1.0, 0.5],
        [1.0, 1.0, 2.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 0.5, 1.0, 1.0, 0.5],
        [1.0, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0],
        [1.0, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.5, 2.0, 1.0, 1.0, 0.5, 2.0],
        [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0]
    ];
}
