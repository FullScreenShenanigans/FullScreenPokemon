/**
 * A modifier for battle behavior in the opponentMove equation.
 */
export interface IBattleModification {
    /**
     * What type of opponents this applies to.
     */
    opponentType: string[];

    /**
     * Preferred move effects.
     */
    preferences: IModificationPreference[]; // ([string, string, number] | [string, string])[];
}

/**
 * Move effects that are preferred.
 */
export type IModificationPreference = (
    ["Effect", string]
    | ["Move", string]
    | ["Statistic", string, number]
    | ["Super", string, string]
    | ["Weak", string, string]);

/**
 * Battle modification constants used by FullScreenPokemon instances.
 */
export class Modifications {
    /**
     * Battle modifications for the second turn.
     */
    public readonly turnTwo: IBattleModification = {
        opponentType: [
            "Pokemaniac",
            "Super Nerd",
            "Juggler",
            "Psychic",
            "Chief",
            "Scientist",
            "Gentleman",
            "Lorelei"
        ],
        preferences: [
            ["Statistic", "Attack", 1],
            ["Statistic", "Defense", 1],
            ["Statistic", "Special", 1],
            ["Statistic", "Evasion", 1],
            ["Move", "Pay Day"],
            ["Move", "Swift"],
            ["Statistic", "Attack", -1],
            ["Statistic", "Defense", -1],
            ["Statistic", "Accuracy", -1],
            ["Move", "Conversion"],
            ["Move", "Haze"],
            ["Statistic", "Attack", 2],
            ["Statistic", "Defense", 2],
            ["Statistic", "Speed", 2],
            ["Statistic", "Special", 2],
            ["Effect", "Heal"],
            ["Statistic", "Defense", -2],
            ["Move", "Light Screen"],
            ["Move", "Reflect"]
        ]
    };

    /**
     * Battle modifications for smart opponents.
     */
    public readonly goodAi: IBattleModification = {
        // http://wiki.pokemonspeedruns.com/index.php/Pok%C3%A9mon_Red/Blue/Yellow_Trainer_AI
        opponentType: [
            "Smart",
            "Sailor",
            "Pokemaniac",
            "Burglar",
            "Fisher",
            "Swimmer",
            "Beauty",
            "Rocker",
            "Professor Oak",
            "Giovanni",
            "CooltrainerM",
            "CooltrainerF",
            "Misty",
            "Surge",
            "Erika",
            "Koga",
            "Blaine",
            "Sabrina",
            "Rival2",
            "Rival3",
            "Lorelei",
            "Lance"
        ],
        preferences: [
            ["Super", "Water", "Fire"],
            ["Super", "Fire", "Grass"],
            ["Super", "Fire", "Ice"],
            ["Super", "Grass", "Water"],
            ["Super", "Electric", "Water"],
            ["Super", "Water", "Rock"],
            ["Weak", "Ground", "Flying"],
            ["Weak", "Water", "Water"],
            ["Weak", "Fire", "Fire"],
            ["Weak", "Electric", "Electric"],
            ["Weak", "Ice", "Ice"],
            ["Weak", "Grass", "Grass"],
            ["Weak", "Psychic", "Psychic"],
            ["Weak", "Fire", "Water"],
            ["Weak", "Grass", "Fire"],
            ["Weak", "Water", "Grass"],
            ["Weak", "Normal", "Rock"],
            ["Weak", "Normal", "Ghost"],
            ["Super", "Ghost", "Ghost"],
            ["Super", "Fire", "Bug"],
            ["Weak", "Fire", "Rock"],
            ["Super", "Water", "Ground"],
            ["Weak", "Electric", "Ground"],
            ["Super", "Electric", "Flying"],
            ["Super", "Grass", "Ground"],
            ["Weak", "Grass", "Bug"],
            ["Weak", "Grass", "Poison"],
            ["Super", "Grass", "Rock"],
            ["Weak", "Grass", "Flying"],
            ["Weak", "Ice", "Water"],
            ["Super", "Ice", "Grass"],
            ["Super", "Ice", "Ground"],
            ["Super", "Ice", "Flying"],
            ["Super", "Fighting", "Normal"],
            ["Weak", "Fighting", "Poison"],
            ["Weak", "Fighting", "Flying"],
            ["Weak", "Fighting", "Psychic"],
            ["Weak", "Fighting", "Bug"],
            ["Super", "Fighting", "Rock"],
            ["Super", "Fighting", "Ice"],
            ["Weak", "Fighting", "Ghost"],
            ["Super", "Poison", "Grass"],
            ["Weak", "Poison", "Poison"],
            ["Weak", "Poison", "Ground"],
            ["Super", "Poison", "Bug"],
            ["Weak", "Poison", "Rock"],
            ["Weak", "Poison", "Ghost"],
            ["Super", "Ground", "Fire"],
            ["Super", "Ground", "Electric"],
            ["Weak", "Ground", "Grass"],
            ["Weak", "Ground", "Bug"],
            ["Super", "Ground", "Rock"],
            ["Super", "Ground", "Poison"],
            ["Weak", "Flying", "Electric"],
            ["Super", "Flying", "Fighting"],
            ["Super", "Flying", "Bug"],
            ["Super", "Flying", "Grass"],
            ["Weak", "Flying", "Rock"],
            ["Super", "Psychic", "Fighting"],
            ["Super", "Psychic", "Poison"],
            ["Weak", "Bug", "Fire"],
            ["Super", "Bug", "Grass"],
            ["Weak", "Bug", "Fighting"],
            ["Weak", "Bug", "Flying"],
            ["Super", "Bug", "Psychic"],
            ["Weak", "Bug", "Ghost"],
            ["Super", "Bug", "Poison"],
            ["Super", "Rock", "Fire"],
            ["Weak", "Rock", "Fighting"],
            ["Weak", "Rock", "Ground"],
            ["Super", "Rock", "Flying"],
            ["Super", "Rock", "Bug"],
            ["Super", "Rock", "Ice"],
            ["Weak", "Ghost", "Normal"],
            ["Weak", "Ghost", "Psychic"],
            ["Weak", "Fire", "Dragon"],
            ["Weak", "Water", "Dragon"],
            ["Weak", "Electric", "Dragon"],
            ["Weak", "Grass", "Dragon"],
            ["Super", "Ice", "Dragon"],
            ["Super", "Dragon", "Dragon"]
        ]
    };
}
