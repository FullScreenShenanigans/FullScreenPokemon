/**
 * A modifier for battle behavior in the opponentMove equation.
 */
export interface IBattleModification {
    /**
     * What type of opponents this applies to.
     */
    opponentType: string[];

    /**
     * Move type preferences, as the type of change, the target, and optionally
     * a Number amount if relevant.
     */
    preferences: ([string, string, number] | [string, string])[];
}

/**
 * Battle modifications used in the opponentMove equation.
 */
export class BattleModifications {
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
            ["Raise", "Attack", 1],
            ["Raise", "Defense", 1],
            ["Raise", "Special", 1],
            ["Raise", "Evasion", 1],
            ["Move", "Pay Day"],
            ["Move", "Swift"],
            ["Lower", "Attack", 1],
            ["Lower", "Defense", 1],
            ["Lower", "Accuracy", 1],
            ["Move", "Conversion"],
            ["Move", "Haze"],
            ["Raise", "Attack", 2],
            ["Raise", "Defense", 2],
            ["Raise", "Speed", 2],
            ["Raise", "Special", 2],
            ["Effect", "Heal"],
            ["Lower", "Defense", 2],
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
            ["Super", "Water, Fire"],
            ["Super", "Fire, Grass"],
            ["Super", "Fire, Ice"],
            ["Super", "Grass, Water"],
            ["Super", "Electric, Water"],
            ["Super", "Water, Rock"],
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
            ["Super", "Ghost, Ghost"],
            ["Super", "Fire, Bug"],
            ["Weak", "Fire", "Rock"],
            ["Super", "Water, Ground"],
            ["Weak", "Electric", "Ground"],
            ["Super", "Electric, Flying"],
            ["Super", "Grass, Ground"],
            ["Weak", "Grass", "Bug"],
            ["Weak", "Grass", "Poison"],
            ["Super", "Grass, Rock"],
            ["Weak", "Grass", "Flying"],
            ["Weak", "Ice", "Water"],
            ["Super", "Ice, Grass"],
            ["Super", "Ice, Ground"],
            ["Super", "Ice, Flying"],
            ["Super", "Fighting, Normal"],
            ["Weak", "Fighting", "Poison"],
            ["Weak", "Fighting", "Flying"],
            ["Weak", "Fighting", "Psychic"],
            ["Weak", "Fighting", "Bug"],
            ["Super", "Fighting, Rock"],
            ["Super", "Fighting, Ice"],
            ["Weak", "Fighting", "Ghost"],
            ["Super", "Poison, Grass"],
            ["Weak", "Poison", "Poison"],
            ["Weak", "Poison", "Ground"],
            ["Super", "Poison, Bug"],
            ["Weak", "Poison", "Rock"],
            ["Weak", "Poison", "Ghost"],
            ["Super", "Ground, Fire"],
            ["Super", "Ground, Electric"],
            ["Weak", "Ground", "Grass"],
            ["Weak", "Ground", "Bug"],
            ["Super", "Ground, Rock"],
            ["Super", "Ground, Poison"],
            ["Weak", "Flying", "Electric"],
            ["Super", "Flying, Fighting"],
            ["Super", "Flying, Bug"],
            ["Super", "Flying, Grass"],
            ["Weak", "Flying", "Rock"],
            ["Super", "Psychic, Fighting"],
            ["Super", "Psychic, Poison"],
            ["Weak", "Bug", "Fire"],
            ["Super", "Bug, Grass"],
            ["Weak", "Bug", "Fighting"],
            ["Weak", "Bug", "Flying"],
            ["Super", "Bug, Psychic"],
            ["Weak", "Bug", "Ghost"],
            ["Super", "Bug, Poison"],
            ["Super", "Rock, Fire"],
            ["Weak", "Rock", "Fighting"],
            ["Weak", "Rock", "Ground"],
            ["Super", "Rock, Flying"],
            ["Super", "Rock, Bug"],
            ["Super", "Rock, Ice"],
            ["Weak", "Ghost", "Normal"],
            ["Weak", "Ghost", "Psychic"],
            ["Weak", "Fire", "Dragon"],
            ["Weak", "Water", "Dragon"],
            ["Weak", "Electric", "Dragon"],
            ["Weak", "Grass", "Dragon"],
            ["Super", "Ice, Dragon"],
            ["Super", "Dragon, Dragon"]
        ]
    };
};
