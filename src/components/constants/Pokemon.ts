import { IPokemonStatistics } from "../Battles";

/**
 * Static information about a known Pokemon.
 */
export interface IPokemonListing {
    /**
     * How difficult this is to catch, for the canCatchPokemon equation.
     * 
     * @todo Make this non-optional, once it's added to the data.
     */
    catchRate?: number;

    /**
     * The height of the Pokemon, as ["feet", "inches"].
     */
    height: [string, string];

    /**
     * A short label for the Pokemon, such as "Psi" for Abra.
     */
    label: string;

    /**
     * What number the Pokemon is in the Pokedex.
     */
    number: number;

    /**
     * The type of sprite used in-game for this Pokemon, such as "Water".
     */
    sprite: string;

    /**
     * Lines of text describing the Pokemon.
     */
    info: string[];

    /**
     * The name of the Pokemon this evolves into. This will be refactored eventually.
     */
    evolutions?: IPokemonEvolution[];

    /**
     * How quickly this gains experience, as "slow", "mediumSlow", "mediumFast", or "fast".
     */
    experienceType?: string; // Todo: once all are known, make non-optional

    /**
     * How much this weighs.
     */
    weight: number;

    /**
     * This Pokemon's 1 or 2 types.
     */
    types: string[];

    /**
     * The rate of Attack statistic growth.
     */
    attack: number;

    /**
     * The rate of Defense statistic growth.
     */
    defense: number;

    /**
     * The rate of HP statistic growth.
     */
    health: number;

    /**
     * The rate of Special statistic growth.
     */
    special: number;

    /**
     * The rate of HP statistic growth.
     */
    speed: number;

    /**
     * Known moves this Pokemon may learn.
     */
    moves: IPokemonMovesListing;
}

/**
 * Moves able to be learned by a Pokemon via different methods.
 */
export interface IPokemonMovesListing {
    /**
     * Moves a Pokemon may learn by leveling up.
     */
    natural: IPokemonMoveListing[];

    /**
     * Moves a Pokemon may learn by HM.
     */
    hm: IPokemonMoveListing[];

    /**
     * Moves a Pokemon may learn by TM.
     */
    tm: IPokemonMoveListing[];
}

/**
 * A description of a move a Pokemon may learn.
 */
export interface IPokemonMoveListing {
    /**
     * The concatenated title of the move.
     */
    move: string;

    /**
     * What level the move may be learned, if by leveling up.
     */
    level?: number;
}

/**
 * Data regarding requirements for a Pokemon's evolution
 */
export interface IPokemonEvolution {
    /**
     * The name of the Pokemon that this Pokemon evolves into.
     */
    evolvedForm: string[];

    /**
     * The requirements for the Pokemon to evolve.
     */
    requirements: IPokemonEvolutionRequirement[];
}

/**
 * The requirements for a Pokemon to be able to evolve.
 */
export type IPokemonEvolutionRequirement = 
    IPokemonEvolutionByLevel | IPokemonEvolutionByHappiness | IPokemonEvolutionByTime | 
    IPokemonEvolutionByTrade | IPokemonEvolutionByItem | IPokemonEvolutionByStats;

/**
 * Requirements for a Pokemon that evolves via levelup.
 */
export interface IPokemonEvolutionByLevel {
    /**
     * The type of requirement this falls into.
     */
    method: string;

    /**
     * The required Pokemon level to evolve.
     */
    level: number;
}

/**
 * Requirements for a Pokemon that evolves via happiness.
 */
export interface IPokemonEvolutionByHappiness {
    /**
     * The type of requirement this falls into.
     */
    method: string;

    /**
     * The required happiness level to evolve.
     */
    happiness: number;
}

/**
 * Requirements for a Pokemon that evolves via time of day.
 */
export interface IPokemonEvolutionByTime {
    /**
     * The type of requirement this falls into.
     */
    method: string;

    /**
     * The required time-of-day to evolve.
     */
    time: string;
}

/**
 * Requirements for a Pokemon that evolves via trade.
 */
export interface IPokemonEvolutionByTrade {
    /**
     * The type of requirement this falls into.
     */
    method: string;

    /**
     * The required held item to evolve.
     */
    item?: string;
}

/**
 * Requirements for a Pokemon that evolves via use of item.
 */
export interface IPokemonEvolutionByItem {
    /**
     * The type of requirement this falls into.
     */
    method: string;

    /**
     * The required item to evolve.
     */
    item: string;
}

/**
 * Requirements for a Pokemon that evolves based on its stats.
 */
export interface IPokemonEvolutionByStats {
    /**
     * The type of requirement this falls into.
     */
    method: string;

    /**
     * The stat that should be larger to achieve target evolution.
     */
    greaterStat: string;

    /**
     * The stat that should be smaller to achieve target evolution.
     */
    lesserStat: string;
    
    /**
     * Whether the two stats may be equal.
     */
    mayBeEqual?: boolean;
}

/**
 * A description of a Pokemon in a player's Pokedex.
 * @todo It's not clear how this is different from IPokedexInformation.
 */
export interface IPokedexListing extends IPokemonListing {
    /**
     * Whether the Pokemon has been caught.
     */
    caught?: boolean;

    /**
     * Whether the Pokemon has been seen.
     */
    seen?: boolean;

    /**
     * The concatenated title of the Pokemon.
     */
    title: string;
}

/**
 * A description of a Pokemon in a player's Pokedex.
 * @todo It's not clear how this is different from IPokedexListing.
 */
export interface IPokedexInformation {
    /**
     * Whether the Pokemon has been caught.
     */
    caught?: boolean;

    /**
     * Whether the Pokemon has been seen.
     */
    seen?: boolean;

    /**
     * The title of the Pokemon.
     */
    title: string[];
}

/**
 * A player's Pokedex, as a summary of seen Pokemon keyed by name.
 */
export interface IPokedex {
    [i: string]: IPokedexInformation;
}

/**
 * Information on stored Pokemon.
 */
export class Pokemon {
    /**
     * Names of all statistics Pokemon have.
     */
    public readonly statisticNames: (keyof IPokemonStatistics)[] = ["attack", "defense", "health", "special", "speed"];

    /**
     * Names of Pokemon statistics to display in statistics menus.
     */
    public readonly statisticNamesDisplayed: (keyof IPokemonStatistics)[] = ["attack", "defense", "special", "speed"];

    /**
     * All known Pokemon, keyed by concatenated name.
     */
    public readonly byName: { [i: string]: IPokemonListing } = {
        "ABRA": {
            "label": "Psi",
            "sprite": "Water",
            "info": [
                "Using its ability to read minds, it will identify impending danger and TELEPORT to safety."
            ],
            "evolutions": [{
                "evolvedForm": ["K", "A", "D", "A", "B", "R", "A"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 16
                    }
                ]
            }],
            "number": 63,
            "height": ["2", "11"],
            "weight": 43,
            "types": ["Psychic"],
            "health": 25,
            "attack": 20,
            "defense": 15,
            "special": 105,
            "speed": 90,
            "moves": {
                "natural": [{
                    "move": "Teleport",
                    "level": 1
                }],
                "hm": [{
                    "move": "Flash",
                    "level": 5
                }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "AERODACTYL": {
            "label": "Fossil",
            "sprite": "Water",
            "info": [
                "A ferocious, prehistoric %%%%%%%POKEMON%%%%%%% that goes for the enemy's throat with its serrated saw-like fangs."
            ],
            "number": 142,
            "height": ["5", "11"],
            "weight": 130.1,
            "types": ["Rock", "Flying"],
            "health": 80,
            "attack": 105,
            "defense": 65,
            "special": 60,
            "speed": 130,
            "moves": {
                "natural": [{
                    "move": "Agility",
                    "level": 1
                }, {
                        "move": "Wing Attack",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 33
                    }, {
                        "move": "Bite",
                        "level": 38
                    }, {
                        "move": "Take Down",
                        "level": 45
                    }, {
                        "move": "Hyper Beam",
                        "level": 54
                    }],
                "hm": [{
                    "move": "Fly",
                    "level": 2
                }],
                "tm": [{
                    "move": "Razor Wind",
                    "level": 2
                }, {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dragon Rage",
                        "level": 23
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Sky Attack",
                        "level": 43
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "ALAKAZAM": {
            "label": "Psi",
            "sprite": "Water",
            "info": [
                "Its brain can outperform a supercomputer. Its intelligence quotient is said to be 5,000."
            ],
            "number": 65,
            "height": ["4", "11"],
            "weight": 105.8,
            "types": ["Psychic"],
            "health": 55,
            "attack": 50,
            "defense": 45,
            "special": 135,
            "speed": 120,
            "moves": {
                "natural": [
                    {
                        "move": "Confusion",
                        "level": 1
                    }, {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Teleport",
                        "level": 1
                    }, {
                        "move": "Confusion",
                        "level": 16
                    }, {
                        "move": "Disable",
                        "level": 20
                    }, {
                        "move": "Psybeam",
                        "level": 27
                    }, {
                        "move": "Recover",
                        "level": 31
                    }, {
                        "move": "Psychic",
                        "level": 38
                    }, {
                        "move": "Reflect",
                        "level": 42
                    }],
                "hm": [{
                    "move": "Flash",
                    "level": 5
                }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "ARBOK": {
            "label": "Cobra",
            "sprite": "Water",
            "info": [
                "It is rumored that the ferocious warning markings on its belly differ from area to area."
            ],
            "number": 24,
            "height": ["11", "6"],
            "weight": 143.3,
            "types": ["Poison"],
            "health": 60,
            "attack": 85,
            "defense": 69,
            "special": 65,
            "speed": 80,
            "moves": {
                "natural": [
                    {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Poison Sting",
                        "level": 1
                    }, {
                        "move": "Wrap",
                        "level": 1
                    }, {
                        "move": "Poison Sting",
                        "level": 10
                    }, {
                        "move": "Bite",
                        "level": 17
                    }, {
                        "move": "Glare",
                        "level": 27
                    }, {
                        "move": "Screech",
                        "level": 36
                    }, {
                        "move": "Acid",
                        "level": 47
                    }],
                "hm": [{
                    "move": "Strength",
                    "level": 4
                }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "ARCANINE": {
            "label": "Legendary",
            "sprite": "Water",
            "info": [
                "A %%%%%%%POKEMON%%%%%%% that has been admired since the past for its beauty. It runs agilely as if on wings."
            ],
            "number": 59,
            "height": ["6", "3"],
            "weight": 341.7,
            "types": ["Fire"],
            "health": 90,
            "attack": 110,
            "defense": 80,
            "special": 100,
            "speed": 95,
            "moves": {
                "natural": [
                    {
                        "move": "Ember",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Roar",
                        "level": 1
                    }, {
                        "move": "Take Down",
                        "level": 1
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dragon Rage",
                        "level": 23
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dragon Rage",
                        "level": 23
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "ARTICUNO": {
            "label": "Freeze",
            "sprite": "Water",
            "info": [
                "A legendary bird %%%%%%%POKEMON%%%%%%% that is said to appear to doomed people who are lost in icy mountains."
            ],
            "number": 144,
            "height": ["5", "7"],
            "weight": 122.1,
            "types": ["Ice", "Flying"],
            "health": 90,
            "attack": 85,
            "defense": 100,
            "special": 95,
            "speed": 85,
            "moves": {
                "natural": [
                    {
                        "move": "Ice Beam",
                        "level": 1
                    }, {
                        "move": "Peck",
                        "level": 1
                    }, {
                        "move": "Blizzard",
                        "level": 51
                    }, {
                        "move": "Agility",
                        "level": 55
                    }, {
                        "move": "Mist",
                        "level": 60
                    }],
                "hm": [{
                    "move": "Fly",
                    "level": 2
                }],
                "tm": [
                    {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Sky Attack",
                        "level": 43
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "BEEDRILL": {
            "label": "Poison Bee",
            "sprite": "Water",
            "info": [
                "Flies at high speed and attacks using its large venomous stingers on its forelegs and tail."
            ],
            "number": 15,
            "height": ["3", "3"],
            "weight": 65,
            "types": ["Bug", "Poison"],
            "health": 65,
            "attack": 90,
            "defense": 40,
            "special": 45,
            "speed": 75,
            "moves": {
                "natural": [
                    {
                        "move": "Fury Attack",
                        "level": 1
                    }, {
                        "move": "Fury Attack",
                        "level": 12
                    }, {
                        "move": "Focus Energy",
                        "level": 16
                    }, {
                        "move": "Twineedle",
                        "level": 20
                    }, {
                        "move": "Rage",
                        "level": 25
                    }, {
                        "move": "Pin Missile",
                        "level": 30
                    }, {
                        "move": "Agility",
                        "level": 35
                    }],
                "hm": [{
                    "move": "Cut",
                    "level": 1
                }],
                "tm": [{
                    "move": "Cut",
                    "level": 1
                }]
            }
        },
        "BELLSPROUT": {
            "label": "Flower",
            "sprite": "Water",
            "info": [
                "A carnivorous %%%%%%%POKEMON%%%%%%% that traps and eats bugs. It uses its root feet to soak up needed moisture."
            ],
            "evolutions": [{
                "evolvedForm": ["W", "E", "E", "P", "I", "N", "B", "E", "L", "L"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 21
                    }
                ]
            }],
            "number": 69,
            "height": ["2", "4"],
            "weight": 8.8,
            "types": ["Grass", "Poison"],
            "health": 50,
            "attack": 75,
            "defense": 35,
            "special": 70,
            "speed": 40,
            "moves": {
                "natural": [
                    {
                        "move": "Growth",
                        "level": 1
                    }, {
                        "move": "Vine Whip",
                        "level": 1
                    }, {
                        "move": "Wrap",
                        "level": 13
                    }, {
                        "move": "Poison Powder",
                        "level": 15
                    }, {
                        "move": "Sleep Powder",
                        "level": 18
                    }, {
                        "move": "Stun Spore",
                        "level": 21
                    }, {
                        "move": "Acid",
                        "level": 26
                    }, {
                        "move": "Razor Leaf",
                        "level": 33
                    }, {
                        "move": "Slam",
                        "level": 42
                    }],
                "hm": [{
                    "move": "Cut",
                    "level": 1
                }],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "BLASTOISE": {
            "label": "Shellfish",
            "sprite": "Water",
            "info": [
                "A brutal %%%%%%%POKEMON%%%%%%% with pressurized water jets on its shell. They are used for high speed tackles."
            ],
            "number": 9,
            "height": ["5", "3"],
            "weight": 188.5,
            "types": ["Water"],
            "health": 79,
            "attack": 83,
            "defense": 100,
            "special": 85,
            "speed": 78,
            "moves": {
                "natural": [
                    {
                        "move": "Bubble",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Water Gun",
                        "level": 1
                    }, {
                        "move": "Bubble",
                        "level": 8
                    }, {
                        "move": "Water Gun",
                        "level": 15
                    }, {
                        "move": "Bite",
                        "level": 24
                    }, {
                        "move": "Withdraw",
                        "level": 31
                    }, {
                        "move": "Skull Bash",
                        "level": 42
                    }, {
                        "move": "Hydro Pump",
                        "level": 52
                    }],
                "hm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "BULBASAUR": {
            "label": "Seed",
            "sprite": "Water",
            "info": [
                "A strange seed was planted on its back at birth.",
                "The plant sprouts and grows with this %%%%%%%POKEMON%%%%%%%."
            ],
            "evolutions": [{
                "evolvedForm": ["I", "V", "Y", "S", "A", "U", "R"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 16
                    }
                ]
            }],
            "number": 1,
            "height": ["2", "4"],
            "weight": 15.2,
            "types": ["Grass", "Poison"],
            "health": 45,
            "attack": 49,
            "defense": 49,
            "special": 65,
            "speed": 45,
            "moves": {
                "natural": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Leech Seed",
                        "level": 7
                    }, {
                        "move": "Vine Whip",
                        "level": 13
                    }, {
                        "move": "Poison Powder",
                        "level": 20
                    }, {
                        "move": "Razor Leaf",
                        "level": 27
                    }, {
                        "move": "Growth",
                        "level": 34
                    }, {
                        "move": "Sleep Powder",
                        "level": 41
                    }, {
                        "move": "Solar Beam",
                        "level": 48
                    }],
                "hm": [{
                    "move": "Cut",
                    "level": 1
                }],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "BUTTERFREE": {
            "label": "Butterfly",
            "sprite": "Water",
            "info": [
                "In battle, it flaps its wings at high speed to release highly toxic dust into the air."
            ],
            "number": 12,
            "height": ["3", "7"],
            "weight": 70.5,
            "types": ["Bug", "Flying"],
            "health": 60,
            "attack": 45,
            "defense": 50,
            "special": 90,
            "speed": 70,
            "moves": {
                "natural": [
                    {
                        "move": "Confusion",
                        "level": 1
                    }, {
                        "move": "Confusion",
                        "level": 12
                    }, {
                        "move": "Poison Powder",
                        "level": 15
                    }, {
                        "move": "Stun Spore",
                        "level": 16
                    }, {
                        "move": "Sleep Powder",
                        "level": 17
                    }, {
                        "move": "Supersonic",
                        "level": 21
                    }, {
                        "move": "Whirlwind",
                        "level": 26
                    }, {
                        "move": "Psybeam",
                        "level": 32
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "CATERPIE": {
            "label": "Worm",
            "sprite": "Water",
            "info": [
                "Its short feet are tipped with suction pads that enable it to tirelessly climb slopes and walls."
            ],
            "evolutions": [{
                "evolvedForm": ["M", "E", "T", "A", "P", "O", "D"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 7
                    }
                ]
            }],
            "number": 10,
            "height": ["1", "0"],
            "weight": 6.4,
            "types": ["Bug"],
            "health": 45,
            "attack": 30,
            "defense": 35,
            "special": 20,
            "speed": 45,
            "moves": {
                "natural": [{
                    "move": "String Shot",
                    "level": 1
                }, {
                        "move": "Tackle",
                        "level": 1
                    }],
                "hm": [],
                "tm": []
            }
        },
        "CHANSEY": {
            "label": "Egg",
            "sprite": "Water",
            "info": [
                "A rare and elusive %%%%%%%POKEMON%%%%%%% that is said to bring happiness to those who manage to get it."
            ],
            "number": 113,
            "height": ["3", "7"],
            "weight": 76.3,
            "types": ["Normal"],
            "health": 250,
            "attack": 5,
            "defense": 5,
            "special": 35,
            "speed": 50,
            "moves": {
                "natural": [
                    {
                        "move": "Double Slap",
                        "level": 1
                    }, {
                        "move": "Pound",
                        "level": 1
                    }, {
                        "move": "Sing",
                        "level": 24
                    }, {
                        "move": "Growl",
                        "level": 30
                    }, {
                        "move": "Minimize",
                        "level": 38
                    }, {
                        "move": "Defense Curl",
                        "level": 44
                    }, {
                        "move": "Light Screen",
                        "level": 48
                    }, {
                        "move": "Double-Edge",
                        "level": 54
                    }],
                "hm": [
                    {
                        "move": "Strength",
                        "level": 4
                    }, {
                        "move": "Flash",
                        "level": 5
                    }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Egg Bomb",
                        "level": 37
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Soft-Boiled",
                        "level": 41
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "CHARIZARD": {
            "label": "Flame",
            "sprite": "Water",
            "info": [
                "Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally."
            ],
            "number": 6,
            "height": ["5", "7"],
            "weight": 199.5,
            "types": ["Fire", "Flying"],
            "health": 78,
            "attack": 84,
            "defense": 78,
            "special": 109,
            "speed": 100,
            "moves": {
                "natural": [
                    {
                        "move": "Ember",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Ember",
                        "level": 9
                    }, {
                        "move": "Leer",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 24
                    }, {
                        "move": "Slash",
                        "level": 36
                    }, {
                        "move": "Flamethrower",
                        "level": 46
                    }, {
                        "move": "Fire Spin",
                        "level": 55
                    }],
                "hm": [
                    {
                        "move": "Cut",
                        "level": 1
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dragon Rage",
                        "level": 23
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "CHARMANDER": {
            "label": "Lizard",
            "sprite": "Water",
            "info": [
                "Obviously prefers hot places.",
                "When it rains, steam is said to spout from the tip of its tail."
            ],
            "evolutions": [{
                "evolvedForm": ["C", "H", "A", "R", "M", "E", "L", "E", "O", "N"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 16
                    }
                ]
            }],
            "number": 4,
            "height": ["2", "0"],
            "weight": 18.7,
            "types": ["Fire"],
            "health": 39,
            "attack": 52,
            "defense": 43,
            "special": 60,
            "speed": 65,
            "moves": {
                "natural": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Ember",
                        "level": 9
                    }, {
                        "move": "Leer",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 22
                    }, {
                        "move": "Slash",
                        "level": 30
                    }, {
                        "move": "Flamethrower",
                        "level": 38
                    }, {
                        "move": "Fire Spin",
                        "level": 46
                    }],
                "hm": [
                    {
                        "move": "Cut",
                        "level": 1
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dragon Rage",
                        "level": 23
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "CHARMELEON": {
            "label": "Flame",
            "sprite": "Water",
            "info": [
                "When it swings its burning tail, it elevates the temperature to unbearably high levels."
            ],
            "evolutions": [{
                "evolvedForm": ["C", "H", "A", "R", "I", "Z", "A", "R", "D"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 36
                    }
                ]
            }],
            "number": 5,
            "height": ["3", "7"],
            "weight": 41.9,
            "types": ["Fire"],
            "health": 58,
            "attack": 64,
            "defense": 58,
            "special": 80,
            "speed": 80,
            "moves": {
                "natural": [
                    {
                        "move": "Ember",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Ember",
                        "level": 9
                    }, {
                        "move": "Leer",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 24
                    }, {
                        "move": "Slash",
                        "level": 33
                    }, {
                        "move": "Flamethrower",
                        "level": 42
                    }, {
                        "move": "Fire Spin",
                        "level": 56
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dragon Rage",
                        "level": 23
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "CLEFABLE": {
            "label": "Fairy",
            "sprite": "Water",
            "info": [
                "A timid fairy %%%%%%%POKEMON%%%%%%% that is rarely seen. It will run and hide the moment it senses people."
            ],
            "number": 36,
            "height": ["4", "3"],
            "weight": 88.2,
            "types": ["Fairy"],
            "health": 95,
            "attack": 70,
            "defense": 73,
            "special": 95,
            "speed": 60,
            "moves": {
                "natural": [
                    {
                        "move": "Double Slap",
                        "level": 1
                    }, {
                        "move": "Metronome",
                        "level": 1
                    }, {
                        "move": "Minimize",
                        "level": 1
                    }, {
                        "move": "Sing",
                        "level": 1
                    }],
                "hm": [
                    {
                        "move": "Strength",
                        "level": 4
                    }, {
                        "move": "Flash",
                        "level": 5
                    }],
                "tm": [
                    {
                        "move": "Strength",
                        "level": 4
                    }, {
                        "move": "Flash",
                        "level": 5
                    }]
            }
        },
        "CLEFAIRY": {
            "label": "Fairy",
            "sprite": "Water",
            "info": [
                "Its magical and cute appeal has many admirers. It is rare and found only in certain areas."
            ],
            "evolutions": [{
                "evolvedForm": ["C", "L", "E", "F", "A", "B", "L", "E"],
                "requirements": [
                    {
                        "method": "item",
                        "item": "Moon Stone"
                    }
                ]
            }],
            "number": 35,
            "height": ["2", "0"],
            "weight": 16.5,
            "types": ["Fairy"],
            "health": 70,
            "attack": 45,
            "defense": 48,
            "special": 60,
            "speed": 35,
            "moves": {
                "natural": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Pound",
                        "level": 1
                    }, {
                        "move": "Sing",
                        "level": 13
                    }, {
                        "move": "Double Slap",
                        "level": 18
                    }, {
                        "move": "Minimize",
                        "level": 24
                    }, {
                        "move": "Metronome",
                        "level": 31
                    }, {
                        "move": "Defense Curl",
                        "level": 39
                    }, {
                        "move": "Light Screen",
                        "level": 48
                    }],
                "hm": [
                    {
                        "move": "Strength",
                        "level": 4
                    }, {
                        "move": "Flash",
                        "level": 5
                    }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "CLOYSTER": {
            "label": "Bivalve",
            "sprite": "Water",
            "info": [
                "When attacked, it launches its horns in quick volleys. Its innards have never been seen."
            ],
            "number": 91,
            "height": ["4", "11"],
            "weight": 292.1,
            "types": ["Water", "Ice"],
            "health": 50,
            "attack": 95,
            "defense": 180,
            "special": 85,
            "speed": 70,
            "moves": {
                "natural": [
                    {
                        "move": "Aurora Beam",
                        "level": 1
                    }, {
                        "move": "Clamp",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 1
                    }, {
                        "move": "Withdraw",
                        "level": 1
                    }, {
                        "move": "Spike Cannon",
                        "level": 50
                    }],
                "hm": [],
                "tm": [{
                    "move": "Surf",
                    "level": 3
                }]
            }
        },
        "CUBONE": {
            "label": "Lonely",
            "sprite": "Water",
            "info": [
                "Because it never removes its skull helmet, no one has ever seen this %%%%%%%POKEMON%%%%%%%'s real face."
            ],
            "evolutions": [{
                "evolvedForm": ["M", "A", "R", "O", "W", "A", "K"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 28
                    }
                ]
            }],
            "number": 104,
            "height": ["1", "4"],
            "weight": 14.3,
            "types": ["Ground"],
            "health": 50,
            "attack": 50,
            "defense": 95,
            "special": 40,
            "speed": 35,
            "moves": {
                "natural": [
                    {
                        "move": "Bone Club",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 25
                    }, {
                        "move": "Focus Energy",
                        "level": 31
                    }, {
                        "move": "Thrash",
                        "level": 38
                    }, {
                        "move": "Bonemerang",
                        "level": 43
                    }, {
                        "move": "Rage",
                        "level": 46
                    }],
                "hm": [{
                    "move": "Strength",
                    "level": 4
                }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "DEWGONG": {
            "label": "Sea Lion",
            "sprite": "Water",
            "info": [
                "Stores thermal energy in its body. Swims at a steady 8 knots even in intensely cold waters."
            ],
            "number": 87,
            "height": ["5", "7"],
            "weight": 264.6,
            "types": ["Water", "Ice"],
            "health": 90,
            "attack": 70,
            "defense": 80,
            "special": 70,
            "speed": 70,
            "moves": {
                "natural": [
                    {
                        "move": "Aurora Beam",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Headbutt",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 30
                    }, {
                        "move": "Aurora Beam",
                        "level": 35
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Take Down",
                        "level": 50
                    }, {
                        "move": "Ice Beam",
                        "level": 56
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "DIGLETT": {
            "label": "Mole",
            "sprite": "Water",
            "info": [
                "Lives about one yard underground where it feeds on plant roots. It sometimes appears above ground."
            ],
            "evolutions": [{
                "evolvedForm": ["D", "U", "G", "T", "R", "I", "O"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 26
                    }
                ]
            }],
            "number": 50,
            "height": ["0", "8"],
            "weight": 1.8,
            "types": ["Ground"],
            "health": 10,
            "attack": 55,
            "defense": 25,
            "special": 35,
            "speed": 95,
            "moves": {
                "natural": [
                    {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 15
                    }, {
                        "move": "Dig",
                        "level": 19
                    }, {
                        "move": "Sand Attack",
                        "level": 24
                    }, {
                        "move": "Slash",
                        "level": 31
                    }, {
                        "move": "Earthquake",
                        "level": 40
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 15
                    }, {
                        "move": "Dig",
                        "level": 19
                    }, {
                        "move": "Sand Attack",
                        "level": 24
                    }, {
                        "move": "Slash",
                        "level": 31
                    }, {
                        "move": "Earthquake",
                        "level": 40
                    }]
            }
        },
        "DITTO": {
            "label": "Transform",
            "sprite": "Water",
            "info": [
                "Capable of copying an enemy's genetic code to instantly transform itself into a duplicate of the enemy."
            ],
            "number": 132,
            "height": ["1", "0"],
            "weight": 8.8,
            "types": ["Normal"],
            "health": 48,
            "attack": 48,
            "defense": 48,
            "special": 48,
            "speed": 48,
            "moves": {
                "natural": [{
                    "move": "Transform",
                    "level": 1
                }],
                "hm": [],
                "tm": []
            }
        },
        "DODRIO": {
            "label": "Triple Bird",
            "sprite": "Water",
            "info": [
                "Uses its three brains to execute complex plans. While two heads sleep, one head stays awake."
            ],
            "number": 85,
            "height": ["5", "11"],
            "weight": 187.8,
            "types": ["Normal", "Flying"],
            "health": 60,
            "attack": 110,
            "defense": 70,
            "special": 60,
            "speed": 100,
            "moves": {
                "natural": [
                    {
                        "move": "Fury Attack",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Peck",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 20
                    }, {
                        "move": "Fury Attack",
                        "level": 24
                    }, {
                        "move": "Drill Peck",
                        "level": 30
                    }, {
                        "move": "Rage",
                        "level": 39
                    }, {
                        "move": "Tri Attack",
                        "level": 45
                    }, {
                        "move": "Agility",
                        "level": 51
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Sky Attack",
                        "level": 43
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "DODUO": {
            "label": "Twin Bird",
            "sprite": "Water",
            "info": [
                "A bird that makes up for its poor flying with its fast foot speed. Leaves giant footprints."
            ],
            "evolutions": [{
                "evolvedForm": ["D", "O", "D", "R", "I", "O"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 31
                    }
                ]
            }],
            "number": 84,
            "height": ["4", "7"],
            "weight": 86.4,
            "types": ["Normal", "Flying"],
            "health": 35,
            "attack": 85,
            "defense": 45,
            "special": 35,
            "speed": 75,
            "moves": {
                "natural": [
                    {
                        "move": "Peck",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 20
                    }, {
                        "move": "Fury Attack",
                        "level": 24
                    }, {
                        "move": "Drill Peck",
                        "level": 30
                    }, {
                        "move": "Rage",
                        "level": 36
                    }, {
                        "move": "Tri Attack",
                        "level": 40
                    }, {
                        "move": "Agility",
                        "level": 44
                    }],
                "hm": [{
                    "move": "Fly",
                    "level": 2
                }],
                "tm": [
                    {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Sky Attack",
                        "level": 43
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "DRAGONAIR": {
            "label": "Dragon",
            "sprite": "Water",
            "info": [
                "A mystical %%%%%%%POKEMON%%%%%%% that exudes a gentle aura. Has the ability to change climate conditions."
            ],
            "evolutions": [{
                "evolvedForm": ["D", "R", "A", "G", "O", "N", "I", "T", "E"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 55
                    }
                ]
            }],
            "number": 148,
            "height": ["13", "1"],
            "weight": 36.4,
            "types": ["Dragon"],
            "health": 61,
            "attack": 84,
            "defense": 65,
            "special": 70,
            "speed": 70,
            "moves": {
                "natural": [
                    {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Thunder Wave",
                        "level": 1
                    }, {
                        "move": "Wrap",
                        "level": 1
                    }, {
                        "move": "Thunder Wave",
                        "level": 10
                    }, {
                        "move": "Agility",
                        "level": 20
                    }, {
                        "move": "Slam",
                        "level": 35
                    }, {
                        "move": "Dragon Rage",
                        "level": 45
                    }, {
                        "move": "Hyper Beam",
                        "level": 55
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dragon Rage",
                        "level": 23
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "DRAGONITE": {
            "label": "Dragon",
            "sprite": "Water",
            "info": [
                "An extremely rarely seen marine %%%%%%%POKEMON%%%%%%%. Its intelligence is said to match that of humans."
            ],
            "number": 149,
            "height": ["7", "3"],
            "weight": 463,
            "types": ["Dragon", "Flying"],
            "health": 91,
            "attack": 134,
            "defense": 95,
            "special": 100,
            "speed": 80,
            "moves": {
                "natural": [
                    {
                        "move": "Agility",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Thunder Wave",
                        "level": 1
                    }, {
                        "move": "Wrap",
                        "level": 1
                    }, {
                        "move": "Thunder Wave",
                        "level": 10
                    }, {
                        "move": "Agility",
                        "level": 20
                    }, {
                        "move": "Slam",
                        "level": 35
                    }, {
                        "move": "Dragon Rage",
                        "level": 45
                    }, {
                        "move": "Hyper Beam",
                        "level": 60
                    }],
                "hm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dragon Rage",
                        "level": 23
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "DRATINI": {
            "label": "Dragon",
            "sprite": "Water",
            "info": [
                "Long considered a mythical %%%%%%%POKEMON%%%%%%% until recently when a small colony was found living underwater."
            ],
            "evolutions": [{
                "evolvedForm": ["D", "R", "A", "G", "O", "N", "A", "I", "R"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 30
                    }
                ]
            }],
            "number": 147,
            "height": ["5", "11"],
            "weight": 7.3,
            "types": ["Dragon"],
            "health": 41,
            "attack": 64,
            "defense": 45,
            "special": 50,
            "speed": 50,
            "moves": {
                "natural": [
                    {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Wrap",
                        "level": 1
                    }, {
                        "move": "Thunder Wave",
                        "level": 10
                    }, {
                        "move": "Agility",
                        "level": 20
                    }, {
                        "move": "Slam",
                        "level": 30
                    }, {
                        "move": "Dragon Rage",
                        "level": 40
                    }, {
                        "move": "Hyper Beam",
                        "level": 50
                    }],
                "hm": [{
                    "move": "Surf",
                    "level": 3
                }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dragon Rage",
                        "level": 23
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "DROWZEE": {
            "label": "Hypnosis",
            "sprite": "Water",
            "info": [
                "Puts enemies to sleep then eats their dreams. Occasionally gets sick from eating bad dreams."
            ],
            "evolutions": [{
                "evolvedForm": ["H", "Y", "P", "N", "O"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 26
                    }
                ]
            }],
            "number": 96,
            "height": ["3", "3"],
            "weight": 71.4,
            "types": ["Psychic"],
            "health": 60,
            "attack": 48,
            "defense": 45,
            "special": 43,
            "speed": 42,
            "moves": {
                "natural": [
                    {
                        "move": "Hypnosis",
                        "level": 1
                    }, {
                        "move": "Pound",
                        "level": 1
                    }, {
                        "move": "Disable",
                        "level": 12
                    }, {
                        "move": "Confusion",
                        "level": 17
                    }, {
                        "move": "Headbutt",
                        "level": 24
                    }, {
                        "move": "Poison Gas",
                        "level": 29
                    }, {
                        "move": "Psychic",
                        "level": 32
                    }, {
                        "move": "Meditate",
                        "level": 37
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Dream Eater",
                        "level": 42
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "DUGTRIO": {
            "label": "Mole",
            "sprite": "Water",
            "info": [
                "A team of DIGLETT triplets. It triggers huge earthquakes by burrowing 60 miles underground."
            ],
            "number": 51,
            "height": ["2", "4"],
            "weight": 73.4,
            "types": ["Ground"],
            "health": 35,
            "attack": 80,
            "defense": 50,
            "special": 50,
            "speed": 120,
            "moves": {
                "natural": [
                    {
                        "move": "Dig",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 15
                    }, {
                        "move": "Dig",
                        "level": 19
                    }, {
                        "move": "Sand Attack",
                        "level": 24
                    }, {
                        "move": "Slash",
                        "level": 35
                    }, {
                        "move": "Earthquake",
                        "level": 47
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Dig",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 15
                    }, {
                        "move": "Dig",
                        "level": 19
                    }, {
                        "move": "Sand Attack",
                        "level": 24
                    }, {
                        "move": "Slash",
                        "level": 35
                    }, {
                        "move": "Earthquake",
                        "level": 47
                    }]
            }
        },
        "EEVEE": {
            "label": "evolutions",
            "sprite": "Water",
            "info": [
                "Its genetic code is irregular. It may mutate if it is exposed to radiation from element STONEs."
            ],
            "evolutions": [
                {
                    "evolvedForm": ["F", "L", "A", "R", "E", "O", "N"],
                    "requirements": [
                        {
                            "method": "item",
                            "item": "Fire Stone"
                        }
                    ]
                },
                {
                    "evolvedForm": ["V", "A", "P", "O", "R", "E", "O", "N"],
                    "requirements": [
                        {
                            "method": "item",
                            "item": "Water Stone"
                        }
                    ]
                },
                {
                    "evolvedForm": ["J", "O", "L", "T", "E", "O", "N"],
                    "requirements": [
                        {
                            "method": "item",
                            "item": "Thunder Stone"
                        }
                    ]
                }
            ],
            "number": 133,
            "height": ["1", "0"],
            "weight": 14.3,
            "types": ["Normal"],
            "health": 55,
            "attack": 55,
            "defense": 50,
            "special": 45,
            "speed": 55,
            "moves": {
                "natural": [
                    {
                        "move": "Sand Attack",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 27
                    }, {
                        "move": "Tail Whip",
                        "level": 31
                    }, {
                        "move": "Bite",
                        "level": 37
                    }, {
                        "move": "Take Down",
                        "level": 45
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Sand Attack",
                        "level": 8
                    }, {
                        "move": "Growl",
                        "level": 16
                    }, {
                        "move": "Quick Attack",
                        "level": 23
                    }, {
                        "move": "Bite",
                        "level": 30
                    }, {
                        "move": "Focus Energy",
                        "level": 36
                    }, {
                        "move": "Take Down",
                        "level": 42
                    }]
            }
        },
        "EKANS": {
            "label": "Snake",
            "sprite": "Water",
            "info": [
                "Moves silently and stealthily. Eats the eggs of birds, such as PIDGEY and SPEAROW, whole."
            ],
            "evolutions": [{
                "evolvedForm": ["A", "R", "B", "O", "K"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 22
                    }
                ]
            }],
            "number": 23,
            "height": ["6", "7"],
            "weight": 15.2,
            "types": ["Poison"],
            "health": 35,
            "attack": 60,
            "defense": 44,
            "special": 40,
            "speed": 55,
            "moves": {
                "natural": [
                    {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Wrap",
                        "level": 1
                    }, {
                        "move": "Poison Sting",
                        "level": 10
                    }, {
                        "move": "Bite",
                        "level": 17
                    }, {
                        "move": "Glare",
                        "level": 24
                    }, {
                        "move": "Screech",
                        "level": 31
                    }, {
                        "move": "Acid",
                        "level": 38
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "ELECTABUZZ": {
            "label": "Electric",
            "sprite": "Water",
            "info": [
                "Normally found near power plants, they can wander away and cause major blackouts in cities."
            ],
            "number": 125,
            "height": ["3", "7"],
            "weight": 66.1,
            "types": ["Electric"],
            "health": 65,
            "attack": 83,
            "defense": 57,
            "special": 95,
            "speed": 105,
            "moves": {
                "natural": [
                    {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 1
                    }, {
                        "move": "Thunder Shock",
                        "level": 34
                    }, {
                        "move": "Screech",
                        "level": 37
                    }, {
                        "move": "Thunder Punch",
                        "level": 42
                    }, {
                        "move": "Light Screen",
                        "level": 49
                    }, {
                        "move": "Thunder",
                        "level": 54
                    }],
                "hm": [
                    {
                        "move": "Strength",
                        "level": 4
                    }, {
                        "move": "Flash",
                        "level": 5
                    }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "ELECTRODE": {
            "label": "Ball",
            "sprite": "Water",
            "info": [
                "It stores electric energy under very high pressure. It often explodes with little or no provocation."
            ],
            "number": 101,
            "height": ["3", "11"],
            "weight": 146.8,
            "types": ["Electric"],
            "health": 60,
            "attack": 50,
            "defense": 70,
            "special": 80,
            "speed": 140,
            "moves": {
                "natural": [
                    {
                        "move": "Screech",
                        "level": 1
                    }, {
                        "move": "Sonic Boom",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Sonic Boom",
                        "level": 17
                    }, {
                        "move": "Self-Destruct",
                        "level": 22
                    }, {
                        "move": "Light Screen",
                        "level": 29
                    }, {
                        "move": "Swift",
                        "level": 40
                    }, {
                        "move": "Explosion",
                        "level": 50
                    }],
                "hm": [],
                "tm": [{
                    "move": "Toxic",
                    "level": 6
                }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Explosion",
                        "level": 47
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "EXEGGCUTE": {
            "label": "Egg",
            "sprite": "Water",
            "info": [
                "Often mistaken for eggs. When disturbed, they quickly gather and attack in swarms."
            ],
             "evolutions": [{
                "evolvedForm": ["E", "X", "E", "G", "G", "U", "T", "O", "R"],
                "requirements": [
                    {
                        "method": "item",
                        "item": "Leaf Stone"
                    }
                ]
            }],
            "number": 102,
            "height": ["1", "4"],
            "weight": 5.5,
            "types": ["Grass", "Psychic"],
            "health": 60,
            "attack": 40,
            "defense": 80,
            "special": 60,
            "speed": 40,
            "moves": {
                "natural": [
                    {
                        "move": "Barrage",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 1
                    }, {
                        "move": "Reflect",
                        "level": 25
                    }, {
                        "move": "Leech Seed",
                        "level": 28
                    }, {
                        "move": "Stun Spore",
                        "level": 32
                    }, {
                        "move": "Poison Powder",
                        "level": 37
                    }, {
                        "move": "Solar Beam",
                        "level": 42
                    }, {
                        "move": "Sleep Powder",
                        "level": 48
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Barrage",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 1
                    }, {
                        "move": "Reflect",
                        "level": 25
                    }, {
                        "move": "Leech Seed",
                        "level": 28
                    }, {
                        "move": "Stun Spore",
                        "level": 32
                    }, {
                        "move": "Poison Powder",
                        "level": 37
                    }, {
                        "move": "Solar Beam",
                        "level": 42
                    }, {
                        "move": "Sleep Powder",
                        "level": 48
                    }]
            }
        },
        "EXEGGUTOR": {
            "label": "Coconut",
            "sprite": "Water",
            "info": [
                "Legend has it that on rare occasions, one of its heads will drop off and continue on as an EXEGGCUTE."
            ],
            "number": 103,
            "height": ["6", "7"],
            "weight": 264.6,
            "types": ["Grass", "Psychic"],
            "health": 95,
            "attack": 95,
            "defense": 85,
            "special": 125,
            "speed": 55,
            "moves": {
                "natural": [
                    {
                        "move": "Barrage",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 1
                    }, {
                        "move": "Stomp",
                        "level": 28
                    }],
                "hm": [{
                    "move": "Strength",
                    "level": 4
                }],
                "tm": [{
                    "move": "Strength",
                    "level": 4
                }]
            }
        },
        "FARFETCHD": {
            "label": "Wild Duck",
            "sprite": "Water",
            "info": [
                "The sprig of green onions it holds is its weapon. It is used much like a metal sword."
            ],
            "number": 83,
            "height": ["2", "7"],
            "weight": 33.1,
            "types": ["Normal", "Flying"],
            "health": 52,
            "attack": 65,
            "defense": 55,
            "special": 58,
            "speed": 60,
            "moves": {
                "natural": [
                    {
                        "move": "Peck",
                        "level": 1
                    }, {
                        "move": "Sand Attack",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 7
                    }, {
                        "move": "Fury Attack",
                        "level": 15
                    }, {
                        "move": "Swords Dance",
                        "level": 23
                    }, {
                        "move": "Agility",
                        "level": 31
                    }, {
                        "move": "Slash",
                        "level": 39
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "FEAROW": {
            "label": "Beak",
            "sprite": "Water",
            "info": [
                "With its huge and magnificent wings, it can keep aloft without ever having to land for rest."
            ],
            "number": 22,
            "height": ["3", "11"],
            "weight": 83.8,
            "types": ["Normal", "Flying"],
            "health": 65,
            "attack": 90,
            "defense": 65,
            "special": 61,
            "speed": 100,
            "moves": {
                "natural": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Peck",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 9
                    }, {
                        "move": "Fury Attack",
                        "level": 15
                    }, {
                        "move": "Mirror Move",
                        "level": 25
                    }, {
                        "move": "Drill Peck",
                        "level": 34
                    }, {
                        "move": "Agility",
                        "level": 43
                    }],
                "hm": [{
                    "move": "Fly",
                    "level": 2
                }],
                "tm": [
                    {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Sky Attack",
                        "level": 43
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "FLAREON": {
            "label": "Flame",
            "sprite": "Water",
            "info": [
                "When storing thermal energy in its body, its temperature could soar to over 1600 degrees."
            ],
            "number": 136,
            "height": ["2", "11"],
            "weight": 55.1,
            "types": ["Fire"],
            "health": 65,
            "attack": 130,
            "defense": 60,
            "special": 95,
            "speed": 65,
            "moves": {
                "natural": [
                    {
                        "move": "Ember",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 1
                    }, {
                        "move": "Sand Attack",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 27
                    }, {
                        "move": "Ember",
                        "level": 31
                    }, {
                        "move": "Tail Whip",
                        "level": 37
                    }, {
                        "move": "Bite",
                        "level": 40
                    }, {
                        "move": "Leer",
                        "level": 42
                    }, {
                        "move": "Fire Spin",
                        "level": 44
                    }, {
                        "move": "Rage",
                        "level": 48
                    }, {
                        "move": "Flamethrower",
                        "level": 54
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "GASTLY": {
            "label": "Gas",
            "sprite": "Water",
            "info": [
                "Almost invisible, this gaseous %%%%%%%POKEMON%%%%%%% cloaks the target and puts it to sleep without notice."
            ],
            "evolutions": [{
                "evolvedForm": ["H", "A", "U", "N", "T", "E", "R"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 25
                    }
                ]
            }],
            "number": 92,
            "height": ["4", "3"],
            "weight": 0.2,
            "types": ["Ghost", "Poison"],
            "health": 30,
            "attack": 35,
            "defense": 30,
            "special": 100,
            "speed": 80,
            "moves": {
                "natural": [
                    {
                        "move": "Confuse Ray",
                        "level": 1
                    }, {
                        "move": "Lick",
                        "level": 1
                    }, {
                        "move": "Night Shade",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 27
                    }, {
                        "move": "Dream Eater",
                        "level": 35
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Confuse Ray",
                        "level": 1
                    }, {
                        "move": "Lick",
                        "level": 1
                    }, {
                        "move": "Night Shade",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 27
                    }, {
                        "move": "Dream Eater",
                        "level": 35
                    }]
            }
        },
        "GENGAR": {
            "label": "Shadow",
            "sprite": "Water",
            "info": [
                "Under a full moon, this %%%%%%%POKEMON%%%%%%% likes to mimic the shadows of people and laugh at their fright."
            ],
            "number": 94,
            "height": ["4", "11"],
            "weight": 89.3,
            "types": ["Ghost", "Poison"],
            "health": 60,
            "attack": 65,
            "defense": 60,
            "special": 130,
            "speed": 110,
            "moves": {
                "natural": [
                    {
                        "move": "Confuse Ray",
                        "level": 1
                    }, {
                        "move": "Lick",
                        "level": 1
                    }, {
                        "move": "Night Shade",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 29
                    }, {
                        "move": "Dream Eater",
                        "level": 38
                    }],
                "hm": [{
                    "move": "Strength",
                    "level": 4
                }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Dream Eater",
                        "level": 42
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Explosion",
                        "level": 47
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "GEODUDE": {
            "label": "Rock",
            "sprite": "Water",
            "info": [
                "Found in fields and mountains. Mistaking them for boulders, people often step or trip on them."
            ],
            "evolutions": [{
                "evolvedForm": ["G", "R", "A", "V", "E", "L", "E", "R"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 25
                    }
                ]
            }],
            "number": 74,
            "height": ["1", "4"],
            "weight": 44.1,
            "types": ["Rock", "Ground"],
            "health": 40,
            "attack": 80,
            "defense": 100,
            "special": 30,
            "speed": 20,
            "moves": {
                "natural": [
                    {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Defense Curl",
                        "level": 11
                    }, {
                        "move": "Rock Throw",
                        "level": 16
                    }, {
                        "move": "Self-Destruct",
                        "level": 21
                    }, {
                        "move": "Harden",
                        "level": 26
                    }, {
                        "move": "Earthquake",
                        "level": 31
                    }, {
                        "move": "Explosion",
                        "level": 36
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Explosion",
                        "level": 47
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "GLOOM": {
            "label": "Weed",
            "sprite": "Water",
            "info": [
                "The fluid that oozes from its mouth isn't drool. It is a nectar that is used to attract prey."
            ],
            "evolutions": [{
                "evolvedForm": ["V", "I", "L", "E", "P", "L", "U", "M", "E"],
                "requirements": [
                    {
                        "method": "item",
                        "item": "Leaf Stone"
                    }
                ]
            }],
            "number": 44,
            "height": ["2", "7"],
            "weight": 19,
            "types": ["Grass", "Poison"],
            "health": 60,
            "attack": 65,
            "defense": 70,
            "special": 85,
            "speed": 40,
            "moves": {
                "natural": [
                    {
                        "move": "Absorb",
                        "level": 1
                    }, {
                        "move": "Poison Powder",
                        "level": 1
                    }, {
                        "move": "Stun Spore",
                        "level": 1
                    }, {
                        "move": "Poison Powder",
                        "level": 15
                    }, {
                        "move": "Stun Spore",
                        "level": 17
                    }, {
                        "move": "Sleep Powder",
                        "level": 19
                    }, {
                        "move": "Acid",
                        "level": 28
                    }, {
                        "move": "Petal Dance",
                        "level": 38
                    }, {
                        "move": "Solar Beam",
                        "level": 52
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "GOLBAT": {
            "label": "Bat",
            "sprite": "Water",
            "info": [
                "Once it strikes, it will not stop draining energy from the victim even if it gets too heavy to fly."
            ],
            "number": 42,
            "height": ["5", "3"],
            "weight": 121.3,
            "types": ["Poison", "Flying"],
            "health": 75,
            "attack": 80,
            "defense": 70,
            "special": 65,
            "speed": 90,
            "moves": {
                "natural": [
                    {
                        "move": "Bite",
                        "level": 1
                    }, {
                        "move": "Leech Life",
                        "level": 1
                    }, {
                        "move": "Screech",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 10
                    }, {
                        "move": "Bite",
                        "level": 15
                    }, {
                        "move": "Confuse Ray",
                        "level": 21
                    }, {
                        "move": "Wing Attack",
                        "level": 32
                    }, {
                        "move": "Haze",
                        "level": 43
                    }],
                "hm": [
                    {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Bite",
                        "level": 1
                    }, {
                        "move": "Leech Life",
                        "level": 1
                    }, {
                        "move": "Screech",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 10
                    }, {
                        "move": "Bite",
                        "level": 15
                    }, {
                        "move": "Confuse Ray",
                        "level": 21
                    }, {
                        "move": "Wing Attack",
                        "level": 32
                    }, {
                        "move": "Haze",
                        "level": 43
                    }]
            }
        },
        "GOLDEEN": {
            "label": "Goldfish",
            "sprite": "Water",
            "info": [
                "Its tail fin billows like an elegant ballroom dress, giving it the nickname of the Water Queen."
            ],
            "evolutions": [{
                "evolvedForm": ["S", "E", "A", "K", "I", "N", "G"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 33
                    }
                ]
            }],
            "number": 118,
            "height": ["2", "0"],
            "weight": 33.1,
            "types": ["Water"],
            "health": 45,
            "attack": 67,
            "defense": 60,
            "special": 35,
            "speed": 63,
            "moves": {
                "natural": [
                    {
                        "move": "Peck",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 19
                    }, {
                        "move": "Horn Attack",
                        "level": 24
                    }, {
                        "move": "Fury Attack",
                        "level": 30
                    }, {
                        "move": "Waterfall",
                        "level": 37
                    }, {
                        "move": "Horn Drill",
                        "level": 45
                    }, {
                        "move": "Agility",
                        "level": 54
                    }],
                "hm": [{
                    "move": "Surf",
                    "level": 3
                }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "GOLDUCK": {
            "label": "Duck",
            "sprite": "Water",
            "info": [
                "Often seen swimming elegantly by lake shores. It is often mistaken for the Japanese monster, Kappa."
            ],
            "number": 55,
            "height": ["5", "7"],
            "weight": 168.9,
            "types": ["Water"],
            "health": 80,
            "attack": 82,
            "defense": 78,
            "special": 95,
            "speed": 85,
            "moves": {
                "natural": [
                    {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 28
                    }, {
                        "move": "Disable",
                        "level": 31
                    }, {
                        "move": "Confusion",
                        "level": 39
                    }, {
                        "move": "Fury Swipes",
                        "level": 48
                    }, {
                        "move": "Hydro Pump",
                        "level": 59
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "GOLEM": {
            "label": "Megaton",
            "sprite": "Water",
            "info": [
                "Its boulder-like body is extremely hard. It can easily withstand dynamite blasts without damage."
            ],
            "number": 76,
            "height": ["4", "7"],
            "weight": 661.4,
            "types": ["Rock", "Ground"],
            "health": 80,
            "attack": 120,
            "defense": 130,
            "special": 55,
            "speed": 45,
            "moves": {
                "natural": [
                    {
                        "move": "Defense Curl",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Defense Curl",
                        "level": 11
                    }, {
                        "move": "Rock Throw",
                        "level": 16
                    }, {
                        "move": "Self-Destruct",
                        "level": 21
                    }, {
                        "move": "Harden",
                        "level": 29
                    }, {
                        "move": "Earthquake",
                        "level": 36
                    }, {
                        "move": "Explosion",
                        "level": 43
                    }],
                "hm": [{
                    "move": "Strength",
                    "level": 4
                }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Explosion",
                        "level": 47
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "GRAVELER": {
            "label": "Rock",
            "sprite": "Water",
            "info": [
                "Rolls down slopes to move. It rolls over any obstacle without slowing or changing its direction."
            ],
            "evolutions": [{
                "evolvedForm": ["G", "O", "L", "E", "M"],
                "requirements": [
                    {
                        "method": "Trade"
                    }
                ]
            }],
            "number": 75,
            "height": ["3", "3"],
            "weight": 231.5,
            "types": ["Rock", "Ground"],
            "health": 55,
            "attack": 95,
            "defense": 115,
            "special": 45,
            "speed": 35,
            "moves": {
                "natural": [
                    {
                        "move": "Defense Curl",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Defense Curl",
                        "level": 11
                    }, {
                        "move": "Rock Throw",
                        "level": 16
                    }, {
                        "move": "Self-Destruct",
                        "level": 21
                    }, {
                        "move": "Harden",
                        "level": 29
                    }, {
                        "move": "Earthquake",
                        "level": 36
                    }, {
                        "move": "Explosion",
                        "level": 43
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Explosion",
                        "level": 47
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "GRIMER": {
            "label": "Sludge",
            "sprite": "Water",
            "info": [
                "Appears in filthy areas. Thrives by sucking up polluted sludge that is pumped out of factories."
            ],
            "evolutions": [{
                "evolvedForm": ["M", "U", "K"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 38
                    }
                ]
            }],
            "number": 88,
            "height": ["2", "11"],
            "weight": 66.1,
            "types": ["Poison"],
            "health": 80,
            "attack": 80,
            "defense": 50,
            "special": 40,
            "speed": 25,
            "moves": {
                "natural": [
                    {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Pound",
                        "level": 1
                    }, {
                        "move": "Poison Gas",
                        "level": 30
                    }, {
                        "move": "Minimize",
                        "level": 33
                    }, {
                        "move": "Sludge",
                        "level": 37
                    }, {
                        "move": "Harden",
                        "level": 42
                    }, {
                        "move": "Screech",
                        "level": 48
                    }, {
                        "move": "Acid Armor",
                        "level": 55
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Explosion",
                        "level": 47
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Pound",
                        "level": 1
                    }, {
                        "move": "Poison Gas",
                        "level": 30
                    }, {
                        "move": "Minimize",
                        "level": 33
                    }, {
                        "move": "Sludge",
                        "level": 37
                    }, {
                        "move": "Harden",
                        "level": 42
                    }, {
                        "move": "Screech",
                        "level": 48
                    }, {
                        "move": "Acid Armor",
                        "level": 55
                    }]
            }
        },
        "GROWLITHE": {
            "label": "Puppy",
            "sprite": "Water",
            "info": [
                "Very protective of its territory. It will bark and bite to repel intruders from its space."
            ],
            "evolutions": [{
                "evolvedForm": ["A", "R", "C", "A", "N", "I", "N", "E"],
                "requirements": [
                    {
                        "method": "item",
                        "item": "Fire Stone"
                    }
                ]
            }],
            "number": 58,
            "height": ["2", "4"],
            "weight": 41.9,
            "types": ["Fire"],
            "health": 55,
            "attack": 70,
            "defense": 45,
            "special": 70,
            "speed": 60,
            "moves": {
                "natural": [
                    {
                        "move": "Bite",
                        "level": 1
                    }, {
                        "move": "Roar",
                        "level": 1
                    }, {
                        "move": "Ember",
                        "level": 18
                    }, {
                        "move": "Leer",
                        "level": 23
                    }, {
                        "move": "Take Down",
                        "level": 30
                    }, {
                        "move": "Agility",
                        "level": 39
                    }, {
                        "move": "Flamethrower",
                        "level": 50
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Bite",
                        "level": 1
                    }, {
                        "move": "Roar",
                        "level": 1
                    }, {
                        "move": "Ember",
                        "level": 18
                    }, {
                        "move": "Leer",
                        "level": 23
                    }, {
                        "move": "Take Down",
                        "level": 30
                    }, {
                        "move": "Agility",
                        "level": 39
                    }, {
                        "move": "Flamethrower",
                        "level": 50
                    }]
            }
        },
        "GYARADOS": {
            "label": "Atrocious",
            "sprite": "Water",
            "info": [
                "Rarely seen in the wild. Huge and vicious, it is capable of destroying entire cities in a rage."
            ],
            "number": 130,
            "height": ["21", "4"],
            "weight": 518.1,
            "types": ["Water", "Flying"],
            "health": 95,
            "attack": 125,
            "defense": 79,
            "special": 60,
            "speed": 81,
            "moves": {
                "natural": [
                    {
                        "move": "Bite",
                        "level": 1
                    }, {
                        "move": "Dragon Rage",
                        "level": 1
                    }, {
                        "move": "Hydro Pump",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Bite",
                        "level": 20
                    }, {
                        "move": "Dragon Rage",
                        "level": 25
                    }, {
                        "move": "Leer",
                        "level": 32
                    }, {
                        "move": "Hydro Pump",
                        "level": 41
                    }, {
                        "move": "Hyper Beam",
                        "level": 52
                    }],
                "hm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }]
            }
        },
        "HAUNTER": {
            "label": "Gas",
            "sprite": "Water",
            "info": [
                "Because of its ability to slip through block walls, it is said to be from another dimension."
            ],
            "evolutions": [{
                "evolvedForm": ["G", "E", "N", "G", "A", "R"],
                "requirements": [
                    {
                        "method": "Trade"
                    }
                ]
            }],
            "number": 93,
            "height": ["5", "3"],
            "weight": 0.2,
            "types": ["Ghost", "Poison"],
            "health": 45,
            "attack": 50,
            "defense": 45,
            "special": 115,
            "speed": 95,
            "moves": {
                "natural": [
                    {
                        "move": "Confuse Ray",
                        "level": 1
                    }, {
                        "move": "Lick",
                        "level": 1
                    }, {
                        "move": "Night Shade",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 29
                    }, {
                        "move": "Dream Eater",
                        "level": 38
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Confuse Ray",
                        "level": 1
                    }, {
                        "move": "Lick",
                        "level": 1
                    }, {
                        "move": "Night Shade",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 29
                    }, {
                        "move": "Dream Eater",
                        "level": 38
                    }]
            }
        },
        "HITMONCHAN": {
            "label": "Punching",
            "sprite": "Water",
            "info": [
                "While apparently doing nothing, it fires punches in lightning fast volleys that are impossible to see."
            ],
            "number": 107,
            "height": ["4", "7"],
            "weight": 110.7,
            "types": ["Fighting"],
            "health": 50,
            "attack": 105,
            "defense": 79,
            "special": 35,
            "speed": 76,
            "moves": {
                "natural": [
                    {
                        "move": "Agility",
                        "level": 1
                    }, {
                        "move": "Comet Punch",
                        "level": 1
                    }, {
                        "move": "Fire Punch",
                        "level": 33
                    }, {
                        "move": "Ice Punch",
                        "level": 38
                    }, {
                        "move": "Thunder Punch",
                        "level": 43
                    }, {
                        "move": "Mega Punch",
                        "level": 48
                    }, {
                        "move": "Counter",
                        "level": 53
                    }],
                "hm": [{
                    "move": "Strength",
                    "level": 4
                }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "HITMONLEE": {
            "label": "Kicking",
            "sprite": "Water",
            "info": [
                "When in a hurry, its legs lengthen progressively. It runs smoothly with extra long, loping strides."
            ],
            "number": 106,
            "height": ["4", "11"],
            "weight": 109.8,
            "types": ["Fighting"],
            "health": 50,
            "attack": 120,
            "defense": 53,
            "special": 35,
            "speed": 87,
            "moves": {
                "natural": [
                    {
                        "move": "Double Kick",
                        "level": 1
                    }, {
                        "move": "Meditate",
                        "level": 1
                    }, {
                        "move": "Rolling Kick",
                        "level": 33
                    }, {
                        "move": "Jump Kick",
                        "level": 38
                    }, {
                        "move": "Focus Energy",
                        "level": 43
                    }, {
                        "move": "High Jump Kick",
                        "level": 48
                    }, {
                        "move": "Mega Kick",
                        "level": 53
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "HORSEA": {
            "label": "Dragon",
            "sprite": "Water",
            "info": [
                "Known to shoot down flying bugs with precision blasts of ink from the surface of the water."
            ],
            "evolutions": [{
                "evolvedForm": ["S", "E", "A", "D", "R", "A"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 32
                    }
                ]
            }],
            "number": 116,
            "height": ["1", "4"],
            "weight": 17.6,
            "types": ["Water"],
            "health": 30,
            "attack": 40,
            "defense": 70,
            "special": 70,
            "speed": 60,
            "moves": {
                "natural": [
                    {
                        "move": "Bubble",
                        "level": 1
                    }, {
                        "move": "Smokescreen",
                        "level": 19
                    }, {
                        "move": "Leer",
                        "level": 24
                    }, {
                        "move": "Water Gun",
                        "level": 30
                    }, {
                        "move": "Agility",
                        "level": 37
                    }, {
                        "move": "Hydro Pump",
                        "level": 45
                    }],
                "hm": [{
                    "move": "Surf",
                    "level": 3
                }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "HYPNO": {
            "label": "Hypnosis",
            "sprite": "Water",
            "info": [
                "When it locks eyes with an enemy, it will use a mix of PSI moves such as HYPNOSIS and CONFUSION."
            ],
            "number": 97,
            "height": ["5", "3"],
            "weight": 166.7,
            "types": ["Psychic"],
            "health": 85,
            "attack": 73,
            "defense": 70,
            "special": 73,
            "speed": 67,
            "moves": {
                "natural": [
                    {
                        "move": "Confusion",
                        "level": 1
                    }, {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 1
                    }, {
                        "move": "Pound",
                        "level": 1
                    }, {
                        "move": "Disable",
                        "level": 12
                    }, {
                        "move": "Confusion",
                        "level": 17
                    }, {
                        "move": "Headbutt",
                        "level": 24
                    }, {
                        "move": "Poison Gas",
                        "level": 33
                    }, {
                        "move": "Psychic",
                        "level": 37
                    }, {
                        "move": "Meditate",
                        "level": 43
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Dream Eater",
                        "level": 42
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "IVYSAUR": {
            "label": "Seed",
            "sprite": "Water",
            "info": [
                "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs."
            ],
            "evolutions": [{
                "evolvedForm": ["V", "E", "N", "U", "S", "A", "U", "R"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 32
                    }
                ]
            }],
            "number": 2,
            "height": ["3", "3"],
            "weight": 28.7,
            "types": ["Grass", "Poison"],
            "health": 60,
            "attack": 62,
            "defense": 63,
            "special": 80,
            "speed": 60,
            "moves": {
                "natural": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Leech Seed",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Leech Seed",
                        "level": 7
                    }, {
                        "move": "Vine Whip",
                        "level": 13
                    }, {
                        "move": "Poison Powder",
                        "level": 22
                    }, {
                        "move": "Razor Leaf",
                        "level": 30
                    }, {
                        "move": "Growth",
                        "level": 38
                    }, {
                        "move": "Sleep Powder",
                        "level": 46
                    }, {
                        "move": "Solar Beam",
                        "level": 54
                    }],
                "hm": [{
                    "move": "Cut",
                    "level": 1
                }],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "JIGGLYPUFF": {
            "label": "Balloon",
            "sprite": "Water",
            "info": [
                "When its huge eyes light up, it sings a mysteriously soothing melody that lulls its enemies to sleep."
            ],
            "evolutions": [{
                "evolvedForm": ["W", "I", "G", "G", "L", "Y", "T", "U", "F", "F"],
                "requirements": [
                    {
                        "method": "item",
                        "item": "Moon Stone"
                    }
                ]
            }],
            "number": 39,
            "height": ["1", "8"],
            "weight": 12.1,
            "types": ["Normal", "Fairy"],
            "health": 115,
            "attack": 45,
            "defense": 20,
            "special": 45,
            "speed": 20,
            "moves": {
                "natural": [
                    {
                        "move": "Sing",
                        "level": 1
                    }, {
                        "move": "Pound",
                        "level": 9
                    }, {
                        "move": "Disable",
                        "level": 14
                    }, {
                        "move": "Defense Curl",
                        "level": 19
                    }, {
                        "move": "Double Slap",
                        "level": 24
                    }, {
                        "move": "Rest",
                        "level": 29
                    }, {
                        "move": "Body Slam",
                        "level": 34
                    }, {
                        "move": "Double-Edge",
                        "level": 39
                    }],
                "hm": [
                    {
                        "move": "Strength",
                        "level": 4
                    }, {
                        "move": "Flash",
                        "level": 5
                    }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "JOLTEON": {
            "label": "Lightning",
            "sprite": "Water",
            "info": [
                "It accumulates negative ions in the atmosphere to blast out 10000-volt lightning bolts."
            ],
            "number": 135,
            "height": ["2", "7"],
            "weight": 54,
            "types": ["Electric"],
            "health": 65,
            "attack": 65,
            "defense": 60,
            "special": 110,
            "speed": 130,
            "moves": {
                "natural": [
                    {
                        "move": "Quick Attack",
                        "level": 1
                    }, {
                        "move": "Sand Attack",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Thunder Shock",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 27
                    }, {
                        "move": "Thunder Shock",
                        "level": 31
                    }, {
                        "move": "Tail Whip",
                        "level": 37
                    }, {
                        "move": "Thunder Wave",
                        "level": 40
                    }, {
                        "move": "Double Kick",
                        "level": 42
                    }, {
                        "move": "Agility",
                        "level": 44
                    }, {
                        "move": "Pin Missile",
                        "level": 48
                    }, {
                        "move": "Thunder",
                        "level": 54
                    }],
                "hm": [],
                "tm": [{
                    "move": "Flash",
                    "level": 5
                }]
            }
        },
        "JYNX": {
            "label": "Human Shape",
            "sprite": "Water",
            "info": [
                "It seductively wiggles its hips as it walks. It can cause people to dance in unison with it."
            ],
            "number": 124,
            "height": ["4", "7"],
            "weight": 89.5,
            "types": ["Ice", "Psychic"],
            "health": 65,
            "attack": 50,
            "defense": 35,
            "special": 115,
            "speed": 95,
            "moves": {
                "natural": [
                    {
                        "move": "Lovely Kiss",
                        "level": 1
                    }, {
                        "move": "Pound",
                        "level": 1
                    }, {
                        "move": "Lick",
                        "level": 18
                    }, {
                        "move": "Double Slap",
                        "level": 23
                    }, {
                        "move": "Ice Punch",
                        "level": 31
                    }, {
                        "move": "Body Slam",
                        "level": 39
                    }, {
                        "move": "Thrash",
                        "level": 47
                    }, {
                        "move": "Blizzard",
                        "level": 58
                    }],
                "hm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Lovely Kiss",
                        "level": 1
                    }, {
                        "move": "Pound",
                        "level": 1
                    }, {
                        "move": "Lick",
                        "level": 18
                    }, {
                        "move": "Double Slap",
                        "level": 23
                    }, {
                        "move": "Ice Punch",
                        "level": 31
                    }, {
                        "move": "Body Slam",
                        "level": 39
                    }, {
                        "move": "Thrash",
                        "level": 47
                    }, {
                        "move": "Blizzard",
                        "level": 58
                    }]
            }
        },
        "KABUTO": {
            "label": "Shellfish",
            "sprite": "Water",
            "info": [
                "A %%%%%%%POKEMON%%%%%%% that was resurrected from a fossil found in what was once the ocean floor eons ago."
            ],
            "evolutions": [{
                "evolvedForm": ["K", "A", "B", "U", "T", "O", "P", "S"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 40
                    }
                ]
            }],
            "number": 140,
            "height": ["1", "8"],
            "weight": 25.4,
            "types": ["Rock", "Water"],
            "health": 30,
            "attack": 80,
            "defense": 90,
            "special": 55,
            "speed": 55,
            "moves": {
                "natural": [
                    {
                        "move": "Harden",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Absorb",
                        "level": 34
                    }, {
                        "move": "Slash",
                        "level": 39
                    }, {
                        "move": "Leer",
                        "level": 44
                    }, {
                        "move": "Hydro Pump",
                        "level": 49
                    }],
                "hm": [{
                    "move": "Surf",
                    "level": 3
                }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "KABUTOPS": {
            "label": "Shellfish",
            "sprite": "Water",
            "info": [
                "Its sleek shape is perfect for swimming. It slashes prey with its claws and drains the body fluids."
            ],
            "number": 141,
            "height": ["4", "3"],
            "weight": 89.3,
            "types": ["Rock", "Water"],
            "health": 60,
            "attack": 115,
            "defense": 105,
            "special": 65,
            "speed": 80,
            "moves": {
                "natural": [
                    {
                        "move": "Absorb",
                        "level": 1
                    }, {
                        "move": "Harden",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Absorb",
                        "level": 34
                    }, {
                        "move": "Slash",
                        "level": 39
                    }, {
                        "move": "Leer",
                        "level": 46
                    }, {
                        "move": "Hydro Pump",
                        "level": 53
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "KADABRA": {
            "label": "Psi",
            "sprite": "Water",
            "info": [
                "It emits special alpha waves from its body that induce headaches just by being close by."
            ],
            "evolutions": [{
                "evolvedForm": ["A", "L", "A", "K", "A", "Z", "A", "M"],
                "requirements": [
                    {
                        "method": "Trade"
                    }
                ]
            }],
            "number": 64,
            "height": ["4", "3"],
            "weight": 124.6,
            "types": ["Psychic"],
            "health": 40,
            "attack": 35,
            "defense": 30,
            "special": 120,
            "speed": 105,
            "moves": {
                "natural": [
                    {
                        "move": "Confusion",
                        "level": 1
                    }, {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Teleport",
                        "level": 1
                    }, {
                        "move": "Confusion",
                        "level": 16
                    }, {
                        "move": "Disable",
                        "level": 20
                    }, {
                        "move": "Psybeam",
                        "level": 27
                    }, {
                        "move": "Recover",
                        "level": 31
                    }, {
                        "move": "Psychic",
                        "level": 38
                    }, {
                        "move": "Reflect",
                        "level": 42
                    }],
                "hm": [{
                    "move": "Flash",
                    "level": 5
                }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "KAKUNA": {
            "label": "Cocoon",
            "sprite": "Water",
            "info": [
                "Almost incapable of moving, this %%%%%%%POKEMON%%%%%%% can only harden its shell to protect itself from predators."
            ],
            "evolutions": [{
                "evolvedForm": ["B", "E", "E", "D", "R", "I", "L", "L"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 10
                    }
                ]
            }],
            "number": 14,
            "height": ["2", "0"],
            "weight": 22,
            "types": ["Bug", "Poison"],
            "health": 45,
            "attack": 25,
            "defense": 50,
            "special": 25,
            "speed": 35,
            "moves": {
                "natural": [{
                    "move": "Harden",
                    "level": 1
                }],
                "hm": [],
                "tm": [{
                    "move": "Harden",
                    "level": 1
                }]
            }
        },
        "KANGASKHAN": {
            "label": "Parent",
            "sprite": "Water",
            "info": [
                "The infant rarely ventures out of its mother's protective pouch until it is 3 years old."
            ],
            "number": 115,
            "height": ["7", "3"],
            "weight": 176.4,
            "types": ["Normal"],
            "health": 105,
            "attack": 95,
            "defense": 80,
            "special": 40,
            "speed": 90,
            "moves": {
                "natural": [
                    {
                        "move": "Comet Punch",
                        "level": 1
                    }, {
                        "move": "Rage",
                        "level": 1
                    }, {
                        "move": "Bite",
                        "level": 26
                    }, {
                        "move": "Tail Whip",
                        "level": 31
                    }, {
                        "move": "Mega Punch",
                        "level": 36
                    }, {
                        "move": "Leer",
                        "level": 41
                    }, {
                        "move": "Dizzy Punch",
                        "level": 46
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "KINGLER": {
            "label": "Pincer",
            "sprite": "Water",
            "info": [
                "The large pincer has 10000 hp of crushing power. However, its huge size makes it unwieldy to use."
            ],
            "number": 99,
            "height": ["4", "3"],
            "weight": 132.3,
            "types": ["Water"],
            "health": 55,
            "attack": 130,
            "defense": 115,
            "special": 50,
            "speed": 75,
            "moves": {
                "natural": [
                    {
                        "move": "Bubble",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Vice Grip",
                        "level": 1
                    }, {
                        "move": "Vice Grip",
                        "level": 20
                    }, {
                        "move": "Guillotine",
                        "level": 25
                    }, {
                        "move": "Stomp",
                        "level": 34
                    }, {
                        "move": "Crabhammer",
                        "level": 42
                    }, {
                        "move": "Harden",
                        "level": 49
                    }],
                "hm": [
                    {
                        "move": "Cut",
                        "level": 1
                    }, {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "KOFFING": {
            "label": "Poison Gas",
            "sprite": "Water",
            "info": [
                "Because it stores several kinds of toxic gases in its body, it is prone to exploding without warning."
            ],
            "evolutions": [{
                "evolvedForm": ["W", "E", "E", "Z", "I", "N", "G"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 35
                    }
                ]
            }],
            "number": 109,
            "height": ["2", "0"],
            "weight": 2.2,
            "types": ["Poison"],
            "health": 40,
            "attack": 65,
            "defense": 95,
            "special": 60,
            "speed": 35,
            "moves": {
                "natural": [
                    {
                        "move": "Smog",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Sludge",
                        "level": 32
                    }, {
                        "move": "Smokescreen",
                        "level": 37
                    }, {
                        "move": "Self-Destruct",
                        "level": 40
                    }, {
                        "move": "Haze",
                        "level": 45
                    }, {
                        "move": "Explosion",
                        "level": 48
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Explosion",
                        "level": 47
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Smog",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Sludge",
                        "level": 32
                    }, {
                        "move": "Smokescreen",
                        "level": 37
                    }, {
                        "move": "Self-Destruct",
                        "level": 40
                    }, {
                        "move": "Haze",
                        "level": 45
                    }, {
                        "move": "Explosion",
                        "level": 48
                    }]
            }
        },
        "KRABBY": {
            "label": "River Crab",
            "sprite": "Water",
            "info": [
                "Its pincers are not only powerful weapons, they are used for balance when walking sideways."
            ],
            "evolutions": [{
                "evolvedForm": ["K", "I", "N", "G", "L", "E", "R"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 28
                    }
                ]
            }],
            "number": 98,
            "height": ["1", "4"],
            "weight": 14.3,
            "types": ["Water"],
            "health": 30,
            "attack": 105,
            "defense": 90,
            "special": 25,
            "speed": 50,
            "moves": {
                "natural": [
                    {
                        "move": "Bubble",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Vice Grip",
                        "level": 20
                    }, {
                        "move": "Guillotine",
                        "level": 25
                    }, {
                        "move": "Stomp",
                        "level": 30
                    }, {
                        "move": "Crabhammer",
                        "level": 35
                    }, {
                        "move": "Harden",
                        "level": 40
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "LAPRAS": {
            "label": "Transport",
            "sprite": "Water",
            "info": [
                "A %%%%%%%POKEMON%%%%%%% that has been overhunted almost to extinction. It can ferry people across the water."
            ],
            "number": 131,
            "height": ["8", "2"],
            "weight": 485,
            "types": ["Water", "Ice"],
            "health": 130,
            "attack": 85,
            "defense": 80,
            "special": 85,
            "speed": 60,
            "moves": {
                "natural": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Water Gun",
                        "level": 1
                    }, {
                        "move": "Sing",
                        "level": 16
                    }, {
                        "move": "Mist",
                        "level": 20
                    }, {
                        "move": "Body Slam",
                        "level": 25
                    }, {
                        "move": "Confuse Ray",
                        "level": 31
                    }, {
                        "move": "Ice Beam",
                        "level": 38
                    }, {
                        "move": "Hydro Pump",
                        "level": 46
                    }],
                "hm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Dragon Rage",
                        "level": 23
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "LICKITUNG": {
            "label": "Licking",
            "sprite": "Water",
            "info": [
                "Its tongue can be extended like a chameleon's. It leaves a tingling sensation when it licks enemies."
            ],
            "number": 108,
            "height": ["3", "11"],
            "weight": 144.4,
            "types": ["Normal"],
            "health": 90,
            "attack": 55,
            "defense": 75,
            "special": 60,
            "speed": 30,
            "moves": {
                "natural": [
                    {
                        "move": "Supersonic",
                        "level": 1
                    }, {
                        "move": "Wrap",
                        "level": 1
                    }, {
                        "move": "Stomp",
                        "level": 7
                    }, {
                        "move": "Disable",
                        "level": 15
                    }, {
                        "move": "Defense Curl",
                        "level": 23
                    }, {
                        "move": "Slam",
                        "level": 31
                    }, {
                        "move": "Screech",
                        "level": 39
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "MACHAMP": {
            "label": "Superpower",
            "sprite": "Water",
            "info": [
                "Using its heavy muscles, it throws powerful punches that can send the victim clear over the horizon."
            ],
            "number": 68,
            "height": ["5", "3"],
            "weight": 286.6,
            "types": ["Fighting"],
            "health": 90,
            "attack": 130,
            "defense": 80,
            "special": 65,
            "speed": 55,
            "moves": {
                "natural": [
                    {
                        "move": "Karate Chop",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Low Kick",
                        "level": 1
                    }, {
                        "move": "Low Kick",
                        "level": 20
                    }, {
                        "move": "Leer",
                        "level": 25
                    }, {
                        "move": "Focus Energy",
                        "level": 36
                    }, {
                        "move": "Seismic Toss",
                        "level": 44
                    }, {
                        "move": "Submission",
                        "level": 52
                    }],
                "hm": [{
                    "move": "Strength",
                    "level": 4
                }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "MACHOKE": {
            "label": "Superpower",
            "sprite": "Water",
            "info": [
                "Its muscular body is so powerful, it must wear a power save belt to be able to regulate its motions."
            ],
            "evolutions": [{
                "evolvedForm": ["M", "A", "C", "H", "A", "M", "P"],
                "requirements": [
                    {
                        "method": "Trade"
                    }
                ]
            }],
            "number": 67,
            "height": ["4", "11"],
            "weight": 155.4,
            "types": ["Fighting"],
            "health": 80,
            "attack": 100,
            "defense": 70,
            "special": 50,
            "speed": 45,
            "moves": {
                "natural": [
                    {
                        "move": "Karate Chop",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Low Kick",
                        "level": 1
                    }, {
                        "move": "Low Kick",
                        "level": 20
                    }, {
                        "move": "Leer",
                        "level": 25
                    }, {
                        "move": "Focus Energy",
                        "level": 36
                    }, {
                        "move": "Seismic Toss",
                        "level": 44
                    }, {
                        "move": "Submission",
                        "level": 52
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "MACHOP": {
            "label": "Superpower",
            "sprite": "Water",
            "info": [
                "Loves to build its muscles. It trains in all styles of martial arts to become even stronger."
            ],
            "evolutions": [{
                "evolvedForm": ["M", "A", "C", "H", "O", "K", "E"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 28
                    }
                ]
            }],
            "number": 66,
            "height": ["2", "7"],
            "weight": 43,
            "types": ["Fighting"],
            "health": 70,
            "attack": 80,
            "defense": 50,
            "special": 35,
            "speed": 35,
            "moves": {
                "natural": [
                    {
                        "move": "Karate Chop",
                        "level": 1
                    }, {
                        "move": "Low Kick",
                        "level": 20
                    }, {
                        "move": "Leer",
                        "level": 25
                    }, {
                        "move": "Focus Energy",
                        "level": 32
                    }, {
                        "move": "Seismic Toss",
                        "level": 39
                    }, {
                        "move": "Submission",
                        "level": 46
                    }],
                "hm": [{
                    "move": "Strength",
                    "level": 4
                }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "MAGIKARP": {
            "label": "Fish",
            "sprite": "Water",
            "info": [
                "In the distant past, it was somewhat stronger than the horribly weak descendants that exist today."
            ],
            "evolutions": [{
                "evolvedForm": ["G", "Y", "A", "R", "A", "D", "O", "S"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 20
                    }
                ]
            }],
            "number": 129,
            "height": ["2", "11"],
            "weight": 22,
            "types": ["Water"],
            "health": 20,
            "attack": 10,
            "defense": 55,
            "special": 15,
            "speed": 80,
            "moves": {
                "natural": [
                    {
                        "move": "Splash",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 15
                    }],
                "hm": [],
                "tm": []
            }
        },
        "MAGMAR": {
            "label": "Spitfire",
            "sprite": "Water",
            "info": [
                "Its body always burns with an orange glow that enables it to hide perfectly among flames."
            ],
            "number": 126,
            "height": ["4", "3"],
            "weight": 98.1,
            "types": ["Fire"],
            "health": 65,
            "attack": 95,
            "defense": 57,
            "special": 100,
            "speed": 93,
            "moves": {
                "natural": [
                    {
                        "move": "Ember",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 36
                    }, {
                        "move": "Confuse Ray",
                        "level": 39
                    }, {
                        "move": "Fire Punch",
                        "level": 43
                    }, {
                        "move": "Smokescreen",
                        "level": 48
                    }, {
                        "move": "Smog",
                        "level": 52
                    }, {
                        "move": "Flamethrower",
                        "level": 55
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "MAGNEMITE": {
            "label": "Magnet",
            "sprite": "Water",
            "info": [
                "Uses anti-gravity to stay suspended. Appears without warning and uses THUNDER WAVE and similar moves."
            ],
            "evolutions": [{
                "evolvedForm": ["M", "A", "G", "N", "E", "T", "O", "N"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 30
                    }
                ]
            }],
            "number": 81,
            "height": ["1", "0"],
            "weight": 13.2,
            "types": ["Electric", "Steel"],
            "health": 25,
            "attack": 35,
            "defense": 70,
            "special": 95,
            "speed": 45,
            "moves": {
                "natural": [
                    {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Sonic Boom",
                        "level": 21
                    }, {
                        "move": "Thunder Shock",
                        "level": 25
                    }, {
                        "move": "Supersonic",
                        "level": 29
                    }, {
                        "move": "Thunder Wave",
                        "level": 35
                    }, {
                        "move": "Swift",
                        "level": 41
                    }, {
                        "move": "Screech",
                        "level": 47
                    }],
                "hm": [{
                    "move": "Flash",
                    "level": 5
                }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "MAGNETON": {
            "label": "Magnet",
            "sprite": "Water",
            "info": [
                "Formed by several MAGNEMITEs linked together. They frequently appear when sunspots flare up."
            ],
            "number": 82,
            "height": ["3", "3"],
            "weight": 132.3,
            "types": ["Electric", "Steel"],
            "health": 50,
            "attack": 60,
            "defense": 95,
            "special": 120,
            "speed": 70,
            "moves": {
                "natural": [
                    {
                        "move": "Sonic Boom",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Thunder Shock",
                        "level": 1
                    }, {
                        "move": "Sonic Boom",
                        "level": 21
                    }, {
                        "move": "Thunder Shock",
                        "level": 25
                    }, {
                        "move": "Supersonic",
                        "level": 29
                    }, {
                        "move": "Thunder Wave",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 46
                    }, {
                        "move": "Screech",
                        "level": 54
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "MANKEY": {
            "label": "Pig Monkey",
            "sprite": "Water",
            "info": [
                "Extremely quick to anger. It could be docile one moment then thrashing away the next instant."
            ],
            "evolutions": [{
                "evolvedForm": ["P", "R", "I", "M", "E", "A", "P", "E"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 28
                    }
                ]
            }],
            "number": 56,
            "height": ["1", "8"],
            "weight": 61.7,
            "types": ["Fighting"],
            "health": 40,
            "attack": 80,
            "defense": 35,
            "special": 35,
            "speed": 70,
            "moves": {
                "natural": [
                    {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Karate Chop",
                        "level": 15
                    }, {
                        "move": "Fury Swipes",
                        "level": 21
                    }, {
                        "move": "Focus Energy",
                        "level": 27
                    }, {
                        "move": "Seismic Toss",
                        "level": 33
                    }, {
                        "move": "Thrash",
                        "level": 39
                    }],
                "hm": [{
                    "move": "Strength",
                    "level": 4
                }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "MAROWAK": {
            "label": "Bone Keeper",
            "sprite": "Water",
            "info": [
                "The bone it holds is its key weapon. It throws the bone skillfully like a boomerang to KO targets."
            ],
            "number": 105,
            "height": ["3", "3"],
            "weight": 99.2,
            "types": ["Ground"],
            "health": 60,
            "attack": 80,
            "defense": 110,
            "special": 50,
            "speed": 45,
            "moves": {
                "natural": [
                    {
                        "move": "Bone Club",
                        "level": 1
                    }, {
                        "move": "Focus Energy",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 25
                    }, {
                        "move": "Focus Energy",
                        "level": 33
                    }, {
                        "move": "Thrash",
                        "level": 41
                    }, {
                        "move": "Bonemerang",
                        "level": 48
                    }, {
                        "move": "Rage",
                        "level": 55
                    }],
                "hm": [{
                    "move": "Strength",
                    "level": 4
                }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "MEOWTH": {
            "label": "Scratch Cat",
            "sprite": "Water",
            "info": [
                "Adores circular objects. Wanders the streets on a nightly basis to look for dropped loose change."
            ],
            "evolutions": [{
                "evolvedForm": ["P", "E", "R", "S", "I", "A", "N"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 28
                    }
                ]
            }],
            "number": 52,
            "height": ["1", "4"],
            "weight": 9.3,
            "types": ["Normal"],
            "health": 40,
            "attack": 45,
            "defense": 35,
            "special": 40,
            "speed": 90,
            "moves": {
                "natural": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Bite",
                        "level": 12
                    }, {
                        "move": "Pay Day",
                        "level": 17
                    }, {
                        "move": "Screech",
                        "level": 24
                    }, {
                        "move": "Fury Swipes",
                        "level": 33
                    }, {
                        "move": "Slash",
                        "level": 44
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Bite",
                        "level": 12
                    }, {
                        "move": "Pay Day",
                        "level": 17
                    }, {
                        "move": "Screech",
                        "level": 24
                    }, {
                        "move": "Fury Swipes",
                        "level": 33
                    }, {
                        "move": "Slash",
                        "level": 44
                    }]
            }
        },
        "METAPOD": {
            "label": "Cocoon",
            "sprite": "Water",
            "info": [
                "this %%%%%%%POKEMON%%%%%%% is vulnerable to attack while its shell is soft, exposing its weak and tender body."
            ],
            "evolutions": [{
                "evolvedForm": ["B", "U", "T", "T", "E", "R", "F", "R", "E", "E"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 10
                    }
                ]
            }],
            "number": 11,
            "height": ["2", "4"],
            "weight": 21.8,
            "types": ["Bug"],
            "health": 50,
            "attack": 20,
            "defense": 55,
            "special": 25,
            "speed": 30,
            "moves": {
                "natural": [{
                    "move": "Harden",
                    "level": 1
                }],
                "hm": [],
                "tm": [
                    {
                        "move": "Harden",
                        "level": 1
                    }, {
                        "move": "Harden",
                        "level": 7
                    }]
            }
        },
        "MEW": {
            "label": "New Species",
            "sprite": "Water",
            "info": [
                "So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide."
            ],
            "number": 151,
            "height": ["1", "4"],
            "weight": 8.8,
            "types": ["Psychic"],
            "health": 100,
            "attack": 100,
            "defense": 100,
            "special": 100,
            "speed": 100,
            "moves": {
                "natural": [
                    {
                        "move": "Pound",
                        "level": 1
                    }, {
                        "move": "Transform",
                        "level": 10
                    }, {
                        "move": "Mega Punch",
                        "level": 20
                    }, {
                        "move": "Metronome",
                        "level": 30
                    }, {
                        "move": "Psychic",
                        "level": 40
                    }],
                "hm": [
                    {
                        "move": "Cut",
                        "level": 1
                    }, {
                        "move": "Fly",
                        "level": 2
                    }, {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }, {
                        "move": "Flash",
                        "level": 5
                    }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Dragon Rage",
                        "level": 23
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Egg Bomb",
                        "level": 37
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Soft-Boiled",
                        "level": 41
                    }, {
                        "move": "Dream Eater",
                        "level": 42
                    }, {
                        "move": "Sky Attack",
                        "level": 43
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Explosion",
                        "level": 47
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "MEWTWO": {
            "label": "Genetic",
            "sprite": "Water",
            "info": [
                "It was created by a scientist after years of horrific gene splicing and DNA engineering experiments."
            ],
            "number": 150,
            "height": ["6", "7"],
            "weight": 269,
            "types": ["Psychic"],
            "health": 106,
            "attack": 110,
            "defense": 90,
            "special": 154,
            "speed": 130,
            "moves": {
                "natural": [
                    {
                        "move": "Confusion",
                        "level": 1
                    }, {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Psychic",
                        "level": 1
                    }, {
                        "move": "Swift",
                        "level": 1
                    }, {
                        "move": "Barrier",
                        "level": 63
                    }, {
                        "move": "Psychic",
                        "level": 66
                    }, {
                        "move": "Recover",
                        "level": 70
                    }, {
                        "move": "Mist",
                        "level": 75
                    }, {
                        "move": "Amnesia",
                        "level": 81
                    }],
                "hm": [
                    {
                        "move": "Strength",
                        "level": 4
                    }, {
                        "move": "Flash",
                        "level": 5
                    }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "MOLTRES": {
            "label": "Flame",
            "sprite": "Water",
            "info": [
                "Known as the legendary bird of fire. Every flap of its wings creates a dazzling flash of flames."
            ],
            "number": 146,
            "height": ["6", "7"],
            "weight": 132.3,
            "types": ["Fire", "Flying"],
            "health": 90,
            "attack": 100,
            "defense": 90,
            "special": 125,
            "speed": 90,
            "moves": {
                "natural": [
                    {
                        "move": "Fire Spin",
                        "level": 1
                    }, {
                        "move": "Peck",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 51
                    }, {
                        "move": "Agility",
                        "level": 55
                    }, {
                        "move": "Sky Attack",
                        "level": 60
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Sky Attack",
                        "level": 43
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "MrHyphenMime": {
            "label": "Barrier",
            "sprite": "Water",
            "info": [
                "If interrupted while it is miming, it will slap around the offender with its broad hands."
            ],
            "number": 122,
            "height": ["4", "3"],
            "weight": 120.2,
            "types": ["Psychic", "Fairy"],
            "health": 40,
            "attack": 45,
            "defense": 65,
            "special": 100,
            "speed": 90,
            "moves": {
                "natural": [
                    {
                        "move": "Barrier",
                        "level": 1
                    }, {
                        "move": "Confusion",
                        "level": 1
                    }, {
                        "move": "Confusion",
                        "level": 15
                    }, {
                        "move": "Light Screen",
                        "level": 23
                    }, {
                        "move": "Double Slap",
                        "level": 31
                    }, {
                        "move": "Meditate",
                        "level": 39
                    }, {
                        "move": "Substitute",
                        "level": 47
                    }],
                "hm": [{
                    "move": "Flash",
                    "level": 5
                }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "MUK": {
            "label": "Sludge",
            "sprite": "Water",
            "info": [
                "Thickly covered with a filthy, vile sludge. It is so toxic, even its footprints contain poison."
            ],
            "number": 89,
            "height": ["3", "11"],
            "weight": 66.1,
            "types": ["Poison"],
            "health": 105,
            "attack": 105,
            "defense": 75,
            "special": 65,
            "speed": 50,
            "moves": {
                "natural": [
                    {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Poison Gas",
                        "level": 1
                    }, {
                        "move": "Pound",
                        "level": 1
                    }, {
                        "move": "Poison Gas",
                        "level": 30
                    }, {
                        "move": "Minimize",
                        "level": 33
                    }, {
                        "move": "Sludge",
                        "level": 37
                    }, {
                        "move": "Harden",
                        "level": 45
                    }, {
                        "move": "Screech",
                        "level": 53
                    }, {
                        "move": "Acid Armor",
                        "level": 60
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Poison Gas",
                        "level": 1
                    }, {
                        "move": "Pound",
                        "level": 1
                    }, {
                        "move": "Poison Gas",
                        "level": 30
                    }, {
                        "move": "Minimize",
                        "level": 33
                    }, {
                        "move": "Sludge",
                        "level": 37
                    }, {
                        "move": "Harden",
                        "level": 45
                    }, {
                        "move": "Screech",
                        "level": 53
                    }, {
                        "move": "Acid Armor",
                        "level": 60
                    }]
            }
        },
        "NIDOKING": {
            "label": "Drill",
            "sprite": "Water",
            "info": [
                "It uses its powerful tail in battle to smash, constrict, then break the prey's bones."
            ],
            "number": 34,
            "height": ["4", "7"],
            "weight": 136.7,
            "types": ["Poison", "Ground"],
            "health": 81,
            "attack": 102,
            "defense": 77,
            "special": 85,
            "speed": 85,
            "moves": {
                "natural": [
                    {
                        "move": "Horn Attack",
                        "level": 1
                    }, {
                        "move": "Poison Sting",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Thrash",
                        "level": 1
                    }, {
                        "move": "Horn Attack",
                        "level": 8
                    }, {
                        "move": "Poison Sting",
                        "level": 14
                    }, {
                        "move": "Thrash",
                        "level": 23
                    }],
                "hm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }]
            }
        },
        "NIDOQUEEN": {
            "label": "Drill",
            "sprite": "Water",
            "info": [
                "Its hard scales provide strong protection. It uses its hefty bulk to execute powerful moves."
            ],
            "number": 31,
            "height": ["4", "3"],
            "weight": 132.3,
            "types": ["Poison", "Ground"],
            "health": 90,
            "attack": 92,
            "defense": 87,
            "special": 75,
            "speed": 76,
            "moves": {
                "natural": [
                    {
                        "move": "Body Slam",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 8
                    }, {
                        "move": "Poison Sting",
                        "level": 14
                    }, {
                        "move": "Body Slam",
                        "level": 23
                    }],
                "hm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }]
            }
        },
        "NIDORANFemaleSymbol": {
            "label": "Poison Pin",
            "sprite": "Water",
            "info": [
                "Although small, its venomous barbs render this %%%%%%%POKEMON%%%%%%% dangerous. The female has smaller horns."
            ],
            "evolutions": [{
                "evolvedForm": ["N", "I", "D", "O", "R", "I", "N", "A"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 16
                    }
                ]
            }],
            "number": 29,
            "height": ["1", "4"],
            "weight": 15.4,
            "types": ["Poison"],
            "health": 55,
            "attack": 47,
            "defense": 52,
            "special": 40,
            "speed": 41,
            "moves": {
                "natural": [
                    {
                        "move": "Growl",
                        "level": 1
                    },
                    {
                        "move": "Tackle",
                        "level": 1
                    },
                    {
                        "move": "Scratch",
                        "level": 8
                    },
                    {
                        "move": "Double Kick",
                        "level": 12
                    },
                    {
                        "move": "Poison Sting",
                        "level": 17
                    },
                    {
                        "move": "Tail Whip",
                        "level": 23
                    },
                    {
                        "move": "Bite",
                        "level": 30
                    },
                    {
                        "move": "Fury Swipes",
                        "level": 38
                    },
                ],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "NIDORANMaleSymbol": {
            "label": "Poison Pin",
            "sprite": "Water",
            "info": [
                "Stiffens its ears to sense danger. The larger its horns, the more powerful its secreted venom."
            ],
            "evolutions": [{
                "evolvedForm": ["N", "I", "D", "O", "R", "I", "N", "O"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 16
                    }
                ]
            }],
            "number": 32,
            "height": ["1", "8"],
            "weight": 19.8,
            "types": ["Poison"],
            "health": 46,
            "attack": 57,
            "defense": 40,
            "special": 40,
            "speed": 50,
            "moves": {
                "natural": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "NIDORINA": {
            "label": "Poison Pin",
            "sprite": "Water",
            "info": [
                "The female's horn develops slowly. Prefers physical attacks such as clawing and biting."
            ],
            "evolutions": [{
                "evolvedForm": ["N", "I", "D", "O", "Q", "U", "E", "E", "N"],
                "requirements": [
                    {
                        "method": "item",
                        "item": "Moon Stone"
                    }
                ]
            }],
            "number": 30,
            "height": ["2", "7"],
            "weight": 44.1,
            "types": ["Poison"],
            "health": 70,
            "attack": 62,
            "defense": 67,
            "special": 55,
            "speed": 56,
            "moves": {
                "natural": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 8
                    }, {
                        "move": "Poison Sting",
                        "level": 14
                    }, {
                        "move": "Tail Whip",
                        "level": 23
                    }, {
                        "move": "Bite",
                        "level": 32
                    }, {
                        "move": "Fury Swipes",
                        "level": 41
                    }, {
                        "move": "Double Kick",
                        "level": 50
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 8
                    }, {
                        "move": "Double Kick",
                        "level": 12
                    }, {
                        "move": "Poison Sting",
                        "level": 19
                    }, {
                        "move": "Tail Whip",
                        "level": 27
                    }, {
                        "move": "Bite",
                        "level": 36
                    }, {
                        "move": "Fury Swipes",
                        "level": 46
                    }]
            }
        },
        "NIDORINO": {
            "label": "Poison Pin",
            "sprite": "Water",
            "info": [
                "An aggressive %%%%%%%POKEMON%%%%%%% that is quick to attack. The horn on its head secretes a powerful venom."
            ],
            "evolutions": [{
                "evolvedForm": ["N", "I", "D", "O", "K", "I", "N", "G"],
                "requirements": [
                    {
                        "method": "item",
                        "item": "Moon Stone"
                    }
                ]
            }],
            "number": 33,
            "height": ["2", "11"],
            "weight": 43,
            "types": ["Poison"],
            "health": 61,
            "attack": 72,
            "defense": 57,
            "special": 55,
            "speed": 65,
            "moves": {
                "natural": [
                    {
                        "move": "Horn Attack",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Horn Attack",
                        "level": 8
                    }, {
                        "move": "Poison Sting",
                        "level": 14
                    }, {
                        "move": "Focus Energy",
                        "level": 23
                    }, {
                        "move": "Fury Attack",
                        "level": 32
                    }, {
                        "move": "Horn Drill",
                        "level": 41
                    }, {
                        "move": "Double Kick",
                        "level": 50
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Horn Attack",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Horn Attack",
                        "level": 8
                    }, {
                        "move": "Double Kick",
                        "level": 12
                    }, {
                        "move": "Poison Sting",
                        "level": 19
                    }, {
                        "move": "Focus Energy",
                        "level": 27
                    }, {
                        "move": "Fury Attack",
                        "level": 36
                    }, {
                        "move": "Horn Drill",
                        "level": 46
                    }]
            }
        },
        "NINETALES": {
            "label": "Fox",
            "sprite": "Water",
            "info": [
                "Very smart and very vengeful. Grabbing one of its many tails could result in a 1000-year curse."
            ],
            "number": 38,
            "height": ["3", "7"],
            "weight": 43.9,
            "types": ["Fire"],
            "health": 73,
            "attack": 76,
            "defense": 75,
            "special": 81,
            "speed": 100,
            "moves": {
                "natural": [
                    {
                        "move": "Ember",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 1
                    }, {
                        "move": "Roar",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "ODDISH": {
            "label": "Weed",
            "sprite": "Water",
            "info": [
                "During the day, it keeps its face buried in the ground. At night, it wanders around sowing its seeds."
            ],
            "evolutions": [{
                "evolvedForm": ["G", "L", "O", "O", "M"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 21
                    }
                ]
            }],
            "number": 43,
            "height": ["1", "8"],
            "weight": 11.9,
            "types": ["Grass", "Poison"],
            "health": 45,
            "attack": 50,
            "defense": 55,
            "special": 75,
            "speed": 30,
            "moves": {
                "natural": [
                    {
                        "move": "Absorb",
                        "level": 1
                    }, {
                        "move": "Poison Powder",
                        "level": 15
                    }, {
                        "move": "Stun Spore",
                        "level": 17
                    }, {
                        "move": "Sleep Powder",
                        "level": 19
                    }, {
                        "move": "Acid",
                        "level": 24
                    }, {
                        "move": "Petal Dance",
                        "level": 33
                    }, {
                        "move": "Solar Beam",
                        "level": 46
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "OMANYTE": {
            "label": "Spiral",
            "sprite": "Water",
            "info": [
                "Although long extinct, in rare cases, it can be genetically resurrected from fossils."
            ],
            "evolutions": [{
                "evolvedForm": ["O", "M", "A", "S", "T", "A", "R"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 40
                    }
                ]
            }],
            "number": 138,
            "height": ["1", "4"],
            "weight": 16.5,
            "types": ["Rock", "Water"],
            "health": 35,
            "attack": 40,
            "defense": 100,
            "special": 90,
            "speed": 35,
            "moves": {
                "natural": [
                    {
                        "move": "Water Gun",
                        "level": 1
                    }, {
                        "move": "Withdraw",
                        "level": 1
                    }, {
                        "move": "Horn Attack",
                        "level": 34
                    }, {
                        "move": "Leer",
                        "level": 39
                    }, {
                        "move": "Spike Cannon",
                        "level": 46
                    }, {
                        "move": "Hydro Pump",
                        "level": 53
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "OMASTAR": {
            "label": "Spiral",
            "sprite": "Water",
            "info": [
                "A prehistoric %%%%%%%POKEMON%%%%%%% that died out when its heavy shell made it impossible to catch prey."
            ],
            "number": 139,
            "height": ["3", "3"],
            "weight": 77.2,
            "types": ["Rock", "Water"],
            "health": 70,
            "attack": 60,
            "defense": 125,
            "special": 115,
            "speed": 55,
            "moves": {
                "natural": [
                    {
                        "move": "Horn Attack",
                        "level": 1
                    }, {
                        "move": "Water Gun",
                        "level": 1
                    }, {
                        "move": "Withdraw",
                        "level": 1
                    }, {
                        "move": "Horn Attack",
                        "level": 34
                    }, {
                        "move": "Leer",
                        "level": 39
                    }, {
                        "move": "Spike Cannon",
                        "level": 44
                    }, {
                        "move": "Hydro Pump",
                        "level": 49
                    }],
                "hm": [{
                    "move": "Surf",
                    "level": 3
                }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "ONIX": {
            "label": "Rock Snake",
            "sprite": "Water",
            "info": [
                "As it grows, the stone portions of its body harden to become similar to a diamond, but colored black."
            ],
            "number": 95,
            "height": ["28", "10"],
            "weight": 463,
            "types": ["Rock", "Ground"],
            "health": 35,
            "attack": 45,
            "defense": 160,
            "special": 30,
            "speed": 70,
            "moves": {
                "natural": [
                    {
                        "move": "Screech",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Bind",
                        "level": 15
                    }, {
                        "move": "Rock Throw",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 25
                    }, {
                        "move": "Slam",
                        "level": 33
                    }, {
                        "move": "Harden",
                        "level": 43
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Explosion",
                        "level": 47
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "PARAS": {
            "label": "Mushroom",
            "sprite": "Water",
            "info": [
                "Burrows to suck tree roots. The mushrooms on its back grow by drawing nutrients from the bug host."
            ],
            "evolutions": [{
                "evolvedForm": ["P", "A", "R", "A", "S", "E", "C", "T"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 24
                    }
                ]
            }],
            "number": 46,
            "height": ["1", "0"],
            "weight": 11.9,
            "types": ["Bug", "Grass"],
            "health": 35,
            "attack": 70,
            "defense": 55,
            "special": 45,
            "speed": 25,
            "moves": {
                "natural": [
                    {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Stun Spore",
                        "level": 13
                    }, {
                        "move": "Leech Life",
                        "level": 20
                    }, {
                        "move": "Spore",
                        "level": 27
                    }, {
                        "move": "Slash",
                        "level": 34
                    }, {
                        "move": "Growth",
                        "level": 41
                    }],
                "hm": [{
                    "move": "Cut",
                    "level": 1
                }],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "PARASECT": {
            "label": "Mushroom",
            "sprite": "Water",
            "info": [
                "A host-parasite pair in which the parasite mushroom has taken over the host bug. Prefers damp places."
            ],
            "number": 47,
            "height": ["3", "3"],
            "weight": 65,
            "types": ["Bug", "Grass"],
            "health": 60,
            "attack": 95,
            "defense": 80,
            "special": 60,
            "speed": 30,
            "moves": {
                "natural": [
                    {
                        "move": "Leech Life",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Stun Spore",
                        "level": 1
                    }, {
                        "move": "Stun Spore",
                        "level": 13
                    }, {
                        "move": "Leech Life",
                        "level": 20
                    }, {
                        "move": "Spore",
                        "level": 30
                    }, {
                        "move": "Slash",
                        "level": 39
                    }, {
                        "move": "Growth",
                        "level": 48
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "PERSIAN": {
            "label": "Classy Cat",
            "sprite": "Water",
            "info": [
                "Although its fur has many admirers, it is tough to raise as a pet because of its fickle meanness."
            ],
            "number": 53,
            "height": ["3", "3"],
            "weight": 70.5,
            "types": ["Normal"],
            "health": 65,
            "attack": 70,
            "defense": 60,
            "special": 65,
            "speed": 115,
            "moves": {
                "natural": [
                    {
                        "move": "Bite",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Screech",
                        "level": 1
                    }, {
                        "move": "Bite",
                        "level": 12
                    }, {
                        "move": "Pay Day",
                        "level": 17
                    }, {
                        "move": "Screech",
                        "level": 24
                    }, {
                        "move": "Fury Swipes",
                        "level": 37
                    }, {
                        "move": "Slash",
                        "level": 51
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Bite",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Screech",
                        "level": 1
                    }, {
                        "move": "Bite",
                        "level": 12
                    }, {
                        "move": "Pay Day",
                        "level": 17
                    }, {
                        "move": "Screech",
                        "level": 24
                    }, {
                        "move": "Fury Swipes",
                        "level": 37
                    }, {
                        "move": "Slash",
                        "level": 51
                    }]
            }
        },
        "PIDGEOT": {
            "label": "Bird",
            "sprite": "Water",
            "info": [
                "When hunting, it skims the surface of water at high speed to pick off unwary prey such as MAGIKARP."
            ],
            "number": 18,
            "height": ["4", "11"],
            "weight": 87.1,
            "types": ["Normal", "Flying"],
            "health": 83,
            "attack": 80,
            "defense": 75,
            "special": 70,
            "speed": 101,
            "moves": {
                "natural": [
                    {
                        "move": "Gust",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 1
                    }, {
                        "move": "Sand Attack",
                        "level": 1
                    }, {
                        "move": "Sand Attack",
                        "level": 5
                    }, {
                        "move": "Quick Attack",
                        "level": 12
                    }, {
                        "move": "Whirlwind",
                        "level": 21
                    }, {
                        "move": "Wing Attack",
                        "level": 31
                    }, {
                        "move": "Agility",
                        "level": 44
                    }, {
                        "move": "Mirror Move",
                        "level": 54
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Sky Attack",
                        "level": 43
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "PIDGEOTTO": {
            "label": "Bird",
            "sprite": "Water",
            "info": [
                "Very protective of its sprawling territorial area, this %%%%%%%POKEMON%%%%%%% will fiercely peck at any intruder."
            ],
            "evolutions": [{
                "evolvedForm": ["P", "I", "D", "G", "E", "O", "T"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 36
                    }
                ]
            }],
            "number": 17,
            "height": ["3", "7"],
            "weight": 66.1,
            "types": ["Normal", "Flying"],
            "health": 63,
            "attack": 60,
            "defense": 55,
            "special": 50,
            "speed": 71,
            "moves": {
                "natural": [
                    {
                        "move": "Gust",
                        "level": 1
                    }, {
                        "move": "Sand Attack",
                        "level": 1
                    }, {
                        "move": "Sand Attack",
                        "level": 5
                    }, {
                        "move": "Quick Attack",
                        "level": 12
                    }, {
                        "move": "Whirlwind",
                        "level": 21
                    }, {
                        "move": "Wing Attack",
                        "level": 31
                    }, {
                        "move": "Agility",
                        "level": 40
                    }, {
                        "move": "Mirror Move",
                        "level": 49
                    }],
                "hm": [{
                    "move": "Fly",
                    "level": 2
                }],
                "tm": [
                    {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Sky Attack",
                        "level": 43
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "PIDGEY": {
            "label": "Tiny Bird",
            "sprite": "Water",
            "info": [
                "A common sight in forests and woods. It flaps its wings at ground level to kick up blinding sand."
            ],
            "evolutions": [{
                "evolvedForm": ["P", "I", "D", "G", "E", "O", "T", "T", "O"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 18
                    }
                ]
            }],
            "number": 16,
            "height": ["1", "0"],
            "weight": 4,
            "types": ["Normal", "Flying"],
            "health": 40,
            "attack": 45,
            "defense": 40,
            "special": 35,
            "speed": 56,
            "moves": {
                "natural": [
                    {
                        "move": "Gust",
                        "level": 1
                    }, {
                        "move": "Sand Attack",
                        "level": 5
                    }, {
                        "move": "Quick Attack",
                        "level": 12
                    }, {
                        "move": "Whirlwind",
                        "level": 19
                    }, {
                        "move": "Wing Attack",
                        "level": 28
                    }, {
                        "move": "Agility",
                        "level": 36
                    }, {
                        "move": "Mirror Move",
                        "level": 44
                    }],
                "hm": [{
                    "move": "Fly",
                    "level": 2
                }],
                "tm": [
                    {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Sky Attack",
                        "level": 43
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "PIKACHU": {
            "label": "Mouse",
            "sprite": "Water",
            "info": [
                "When several of these %%%%%%%POKEMON%%%%%%% gather, their electricity could build and cause lightning storms."
            ],
            "evolutions": [{
                "evolvedForm": ["R", "A", "I", "C", "H", "U"],
                "requirements": [
                    {
                        "method": "item",
                        "item": "Thunder Stone"
                    }
                ]
            }],
            "number": 25,
            "height": ["1", "4"],
            "weight": 13.2,
            "types": ["Electric"],
            "health": 35,
            "attack": 55,
            "defense": 40,
            "special": 50,
            "speed": 90,
            "moves": {
                "natural": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Thunder Shock",
                        "level": 1
                    }, {
                        "move": "Thunder Wave",
                        "level": 9
                    }, {
                        "move": "Quick Attack",
                        "level": 16
                    }, {
                        "move": "Swift",
                        "level": 26
                    }, {
                        "move": "Agility",
                        "level": 33
                    }, {
                        "move": "Thunder",
                        "level": 43
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "PINSIR": {
            "label": "Stag Beetle",
            "sprite": "Water",
            "info": [
                "If it fails to crush the victim in its pincers, it will swing it around and toss it hard."
            ],
            "number": 127,
            "height": ["4", "11"],
            "weight": 121.3,
            "types": ["Bug"],
            "health": 65,
            "attack": 125,
            "defense": 100,
            "special": 55,
            "speed": 85,
            "moves": {
                "natural": [
                    {
                        "move": "Vice Grip",
                        "level": 1
                    }, {
                        "move": "Seismic Toss",
                        "level": 25
                    }, {
                        "move": "Guillotine",
                        "level": 30
                    }, {
                        "move": "Focus Energy",
                        "level": 36
                    }, {
                        "move": "Harden",
                        "level": 43
                    }, {
                        "move": "Slash",
                        "level": 49
                    }, {
                        "move": "Swords Dance",
                        "level": 54
                    }],
                "hm": [
                    {
                        "move": "Cut",
                        "level": 1
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "POLIWAG": {
            "label": "Tadpole",
            "sprite": "Water",
            "info": [
                "Its newly grown legs prevent it from running. It appears to prefer swimming than trying to stand."
            ],
            "evolutions": [{
                "evolvedForm": ["P", "O", "L", "I", "W", "H", "I", "R", "L"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 25
                    }
                ]
            }],
            "number": 60,
            "height": ["2", "0"],
            "weight": 27.3,
            "types": ["Water"],
            "health": 40,
            "attack": 50,
            "defense": 40,
            "special": 40,
            "speed": 90,
            "moves": {
                "natural": [
                    {
                        "move": "Bubble",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 16
                    }, {
                        "move": "Water Gun",
                        "level": 19
                    }, {
                        "move": "Double Slap",
                        "level": 25
                    }, {
                        "move": "Body Slam",
                        "level": 31
                    }, {
                        "move": "Amnesia",
                        "level": 38
                    }, {
                        "move": "Hydro Pump",
                        "level": 45
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "POLIWHIRL": {
            "label": "Tadpole",
            "sprite": "Water",
            "info": [
                "Capable of living in or out of water. When out of water, it sweats to keep its body slimy."
            ],
            "evolutions": [{
                "evolvedForm": ["P", "O", "L", "I", "W", "R", "A", "T", "H"],
                "requirements": [
                    {
                        "method": "item",
                        "item": "Water Stone"
                    }
                ]
            }],
            "number": 61,
            "height": ["3", "3"],
            "weight": 44.1,
            "types": ["Water"],
            "health": 65,
            "attack": 65,
            "defense": 65,
            "special": 50,
            "speed": 90,
            "moves": {
                "natural": [
                    {
                        "move": "Bubble",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 1
                    }, {
                        "move": "Water Gun",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 16
                    }, {
                        "move": "Water Gun",
                        "level": 19
                    }, {
                        "move": "Double Slap",
                        "level": 26
                    }, {
                        "move": "Body Slam",
                        "level": 33
                    }, {
                        "move": "Amnesia",
                        "level": 41
                    }, {
                        "move": "Hydro Pump",
                        "level": 49
                    }],
                "hm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "POLIWRATH": {
            "label": "Tadpole",
            "sprite": "Water",
            "info": [
                "An adept swimmer at both the front crawl and breast stroke. Easily overtakes the best human swimmers."
            ],
            "number": 62,
            "height": ["4", "3"],
            "weight": 119,
            "types": ["Water", "Fighting"],
            "health": 90,
            "attack": 95,
            "defense": 95,
            "special": 70,
            "speed": 70,
            "moves": {
                "natural": [
                    {
                        "move": "Body Slam",
                        "level": 1
                    }, {
                        "move": "Double Slap",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 1
                    }, {
                        "move": "Water Gun",
                        "level": 1
                    }, {
                        "move": "Hypnosis",
                        "level": 16
                    }, {
                        "move": "Water Gun",
                        "level": 19
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }]
            }
        },
        "PONYTA": {
            "label": "Fire Horse",
            "sprite": "Water",
            "info": [
                "Its hooves are 10 times harder than diamonds. It can trample anything completely flat in little time."
            ],
            "evolutions": [{
                "evolvedForm": ["R", "A", "P", "I", "D", "A", "S", "H"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 40
                    }
                ]
            }],
            "number": 77,
            "height": ["3", "3"],
            "weight": 66.1,
            "types": ["Fire"],
            "health": 50,
            "attack": 85,
            "defense": 55,
            "special": 65,
            "speed": 90,
            "moves": {
                "natural": [
                    {
                        "move": "Ember",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 30
                    }, {
                        "move": "Stomp",
                        "level": 32
                    }, {
                        "move": "Growl",
                        "level": 35
                    }, {
                        "move": "Fire Spin",
                        "level": 39
                    }, {
                        "move": "Take Down",
                        "level": 43
                    }, {
                        "move": "Agility",
                        "level": 48
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Ember",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 30
                    }, {
                        "move": "Stomp",
                        "level": 32
                    }, {
                        "move": "Growl",
                        "level": 35
                    }, {
                        "move": "Fire Spin",
                        "level": 39
                    }, {
                        "move": "Take Down",
                        "level": 43
                    }, {
                        "move": "Agility",
                        "level": 48
                    }]
            }
        },
        "PORYGON": {
            "label": "Virtual",
            "sprite": "Water",
            "info": [
                "A %%%%%%%POKEMON%%%%%%% that consists entirely of programming code. Capable of moving freely in cyberspace."
            ],
            "number": 137,
            "height": ["2", "7"],
            "weight": 80.5,
            "types": ["Normal"],
            "health": 65,
            "attack": 60,
            "defense": 70,
            "special": 85,
            "speed": 40,
            "moves": {
                "natural": [
                    {
                        "move": "Conversion",
                        "level": 1
                    }, {
                        "move": "Sharpen",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Psybeam",
                        "level": 23
                    }, {
                        "move": "Recover",
                        "level": 28
                    }, {
                        "move": "Agility",
                        "level": 35
                    }, {
                        "move": "Tri Attack",
                        "level": 42
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "PRIMEAPE": {
            "label": "Pig Monkey",
            "sprite": "Water",
            "info": [
                "Always furious and tenacious to boot. It will not abandon chasing its quarry until it is caught."
            ],
            "number": 57,
            "height": ["3", "3"],
            "weight": 70.5,
            "types": ["Fighting"],
            "health": 65,
            "attack": 105,
            "defense": 60,
            "special": 60,
            "speed": 95,
            "moves": {
                "natural": [
                    {
                        "move": "Fury Swipes",
                        "level": 1
                    }, {
                        "move": "Karate Chop",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Karate Chop",
                        "level": 15
                    }, {
                        "move": "Fury Swipes",
                        "level": 21
                    }, {
                        "move": "Focus Energy",
                        "level": 27
                    }, {
                        "move": "Seismic Toss",
                        "level": 37
                    }, {
                        "move": "Thrash",
                        "level": 46
                    }],
                "hm": [{
                    "move": "Strength",
                    "level": 4
                }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "PSYDUCK": {
            "label": "Duck",
            "sprite": "Water",
            "info": [
                "While lulling its enemies with its vacant look, this wily %%%%%%%POKEMON%%%%%%% will use psychokinetic powers."
            ],
            "evolutions": [{
                "evolvedForm": ["G", "O", "L", "D", "U", "C", "K"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 33
                    }
                ]
            }],
            "number": 54,
            "height": ["2", "7"],
            "weight": 43.2,
            "types": ["Water"],
            "health": 50,
            "attack": 52,
            "defense": 48,
            "special": 65,
            "speed": 55,
            "moves": {
                "natural": [
                    {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 28
                    }, {
                        "move": "Disable",
                        "level": 31
                    }, {
                        "move": "Confusion",
                        "level": 36
                    }, {
                        "move": "Fury Swipes",
                        "level": 43
                    }, {
                        "move": "Hydro Pump",
                        "level": 52
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "RAICHU": {
            "label": "Mouse",
            "sprite": "Water",
            "info": [
                "Its long tail serves as a ground to protect itself from its own high voltage power."
            ],
            "number": 26,
            "height": ["2", "7"],
            "weight": 66.1,
            "types": ["Electric"],
            "health": 60,
            "attack": 90,
            "defense": 55,
            "special": 90,
            "speed": 110,
            "moves": {
                "natural": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Thunder Shock",
                        "level": 1
                    }, {
                        "move": "Thunder Wave",
                        "level": 1
                    }],
                "hm": [{
                    "move": "Flash",
                    "level": 5
                }],
                "tm": [{
                    "move": "Flash",
                    "level": 5
                }]
            }
        },
        "RAPIDASH": {
            "label": "Fire Horse",
            "sprite": "Water",
            "info": [
                "Very competitive, this %%%%%%%POKEMON%%%%%%% will chase anything that moves fast in the hopes of racing it."
            ],
            "number": 78,
            "height": ["5", "7"],
            "weight": 209.4,
            "types": ["Fire"],
            "health": 65,
            "attack": 100,
            "defense": 70,
            "special": 80,
            "speed": 105,
            "moves": {
                "natural": [
                    {
                        "move": "Ember",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Stomp",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 30
                    }, {
                        "move": "Stomp",
                        "level": 32
                    }, {
                        "move": "Growl",
                        "level": 35
                    }, {
                        "move": "Fire Spin",
                        "level": 39
                    }, {
                        "move": "Take Down",
                        "level": 47
                    }, {
                        "move": "Agility",
                        "level": 55
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Ember",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Stomp",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 30
                    }, {
                        "move": "Stomp",
                        "level": 32
                    }, {
                        "move": "Growl",
                        "level": 35
                    }, {
                        "move": "Fire Spin",
                        "level": 39
                    }, {
                        "move": "Take Down",
                        "level": 47
                    }, {
                        "move": "Agility",
                        "level": 55
                    }]
            }
        },
        "RATICATE": {
            "label": "Mouse",
            "sprite": "Water",
            "info": [
                "It uses its whiskers to maintain its balance. It apparently slows down if they are cut off."
            ],
            "number": 20,
            "height": ["2", "4"],
            "weight": 40.8,
            "types": ["Normal"],
            "health": 55,
            "attack": 81,
            "defense": 60,
            "special": 50,
            "speed": 97,
            "moves": {
                "natural": [
                    {
                        "move": "Quick Attack",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 7
                    }, {
                        "move": "Hyper Fang",
                        "level": 14
                    }, {
                        "move": "Focus Energy",
                        "level": 27
                    }, {
                        "move": "Super Fang",
                        "level": 41
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Quick Attack",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 7
                    }, {
                        "move": "Hyper Fang",
                        "level": 14
                    }, {
                        "move": "Focus Energy",
                        "level": 27
                    }, {
                        "move": "Super Fang",
                        "level": 41
                    }]
            }
        },
        "RATTATA": {
            "label": "Mouse",
            "sprite": "Water",
            "info": [
                "Bites anything when it attacks. Small and very quick, it is a common sight in many places."
            ],
            "evolutions": [{
                "evolvedForm": ["R", "A", "T", "I", "C", "A", "T", "E"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 20
                    }
                ]
            }],
            "number": 19,
            "height": ["1", "0"],
            "weight": 7.7,
            "types": ["Normal"],
            "health": 30,
            "attack": 56,
            "defense": 35,
            "special": 25,
            "speed": 72,
            "moves": {
                "natural": [
                    {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 7
                    }, {
                        "move": "Hyper Fang",
                        "level": 14
                    }, {
                        "move": "Focus Energy",
                        "level": 23
                    }, {
                        "move": "Super Fang",
                        "level": 34
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 7
                    }, {
                        "move": "Hyper Fang",
                        "level": 14
                    }, {
                        "move": "Focus Energy",
                        "level": 23
                    }, {
                        "move": "Super Fang",
                        "level": 34
                    }]
            }
        },
        "RHYDON": {
            "label": "Drill",
            "sprite": "Water",
            "info": [
                "Protected by an armor-like hide, it is capable of living in molten lava of 3,600 degrees."
            ],
            "number": 112,
            "height": ["6", "3"],
            "weight": 264.6,
            "types": ["Ground", "Rock"],
            "health": 105,
            "attack": 130,
            "defense": 120,
            "special": 45,
            "speed": 40,
            "moves": {
                "natural": [
                    {
                        "move": "Fury Attack",
                        "level": 1
                    }, {
                        "move": "Horn Attack",
                        "level": 1
                    }, {
                        "move": "Stomp",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Stomp",
                        "level": 30
                    }, {
                        "move": "Tail Whip",
                        "level": 35
                    }, {
                        "move": "Fury Attack",
                        "level": 40
                    }, {
                        "move": "Horn Drill",
                        "level": 48
                    }, {
                        "move": "Leer",
                        "level": 55
                    }, {
                        "move": "Take Down",
                        "level": 64
                    }],
                "hm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "RHYHORN": {
            "label": "Spikes",
            "sprite": "Water",
            "info": [
                "Its massive bones are 1000 times harder than human bones. It can easily knock a trailer flying."
            ],
            "evolutions": [{
                "evolvedForm": ["R", "H", "Y", "D", "O", "N"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 42
                    }
                ]
            }],
            "number": 111,
            "height": ["3", "3"],
            "weight": 253.5,
            "types": ["Ground", "Rock"],
            "health": 80,
            "attack": 85,
            "defense": 95,
            "special": 30,
            "speed": 25,
            "moves": {
                "natural": [
                    {
                        "move": "Horn Attack",
                        "level": 1
                    }, {
                        "move": "Stomp",
                        "level": 30
                    }, {
                        "move": "Tail Whip",
                        "level": 35
                    }, {
                        "move": "Fury Attack",
                        "level": 40
                    }, {
                        "move": "Horn Drill",
                        "level": 45
                    }, {
                        "move": "Leer",
                        "level": 50
                    }, {
                        "move": "Take Down",
                        "level": 55
                    }],
                "hm": [{
                    "move": "Strength",
                    "level": 4
                }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "SANDSHREW": {
            "label": "Mouse",
            "sprite": "Water",
            "info": [
                "Burrows deep underground in arid locations far from water. It only emerges to hunt for food."
            ],
            "evolutions": [{
                "evolvedForm": ["S", "A", "N", "D", "S", "L", "A", "S", "H"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 22
                    }
                ]
            }],
            "number": 27,
            "height": ["2", "0"],
            "weight": 26.5,
            "types": ["Ground"],
            "health": 50,
            "attack": 75,
            "defense": 85,
            "special": 20,
            "speed": 40,
            "moves": {
                "natural": [
                    {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Sand Attack",
                        "level": 10
                    }, {
                        "move": "Slash",
                        "level": 17
                    }, {
                        "move": "Poison Sting",
                        "level": 24
                    }, {
                        "move": "Swift",
                        "level": 31
                    }, {
                        "move": "Fury Swipes",
                        "level": 38
                    }],
                "hm": [
                    {
                        "move": "Cut",
                        "level": 1
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "SANDSLASH": {
            "label": "Mouse",
            "sprite": "Water",
            "info": [
                "Curls up into a spiny ball when threatened. It can roll while curled up to attack or escape."
            ],
            "number": 28,
            "height": ["3", "3"],
            "weight": 65,
            "types": ["Ground"],
            "health": 75,
            "attack": 100,
            "defense": 110,
            "special": 45,
            "speed": 65,
            "moves": {
                "natural": [
                    {
                        "move": "Sand Attack",
                        "level": 1
                    }, {
                        "move": "Scratch",
                        "level": 1
                    }, {
                        "move": "Sand Attack",
                        "level": 10
                    }, {
                        "move": "Slash",
                        "level": 17
                    }, {
                        "move": "Poison Sting",
                        "level": 27
                    }, {
                        "move": "Swift",
                        "level": 36
                    }, {
                        "move": "Fury Swipes",
                        "level": 47
                    }],
                "hm": [
                    {
                        "move": "Cut",
                        "level": 1
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "SCYTHER": {
            "label": "Mantis",
            "sprite": "Water",
            "info": [
                "With ninja-like agility and speed, it can create the illusion that there is more than one."
            ],
            "number": 123,
            "height": ["4", "11"],
            "weight": 123.5,
            "types": ["Bug", "Flying"],
            "health": 70,
            "attack": 110,
            "defense": 80,
            "special": 55,
            "speed": 105,
            "moves": {
                "natural": [
                    {
                        "move": "Quick Attack",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 17
                    }, {
                        "move": "Focus Energy",
                        "level": 20
                    }, {
                        "move": "Double Team",
                        "level": 24
                    }, {
                        "move": "Slash",
                        "level": 29
                    }, {
                        "move": "Swords Dance",
                        "level": 35
                    }, {
                        "move": "Agility",
                        "level": 42
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "SEADRA": {
            "label": "Dragon",
            "sprite": "Water",
            "info": [
                "Capable of swimming backwards by rapidly flapping its wing-like pectoral fins and stout tail."
            ],
            "number": 117,
            "height": ["3", "11"],
            "weight": 55.1,
            "types": ["Water"],
            "health": 55,
            "attack": 65,
            "defense": 95,
            "special": 95,
            "speed": 85,
            "moves": {
                "natural": [
                    {
                        "move": "Bubble",
                        "level": 1
                    }, {
                        "move": "Smokescreen",
                        "level": 1
                    }, {
                        "move": "Smokescreen",
                        "level": 19
                    }, {
                        "move": "Leer",
                        "level": 24
                    }, {
                        "move": "Water Gun",
                        "level": 30
                    }, {
                        "move": "Agility",
                        "level": 41
                    }, {
                        "move": "Hydro Pump",
                        "level": 52
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "SEAKING": {
            "label": "Goldfish",
            "sprite": "Water",
            "info": [
                "In the autumn spawning season, they can be seen swimming powerfully up rivers and creeks."
            ],
            "number": 119,
            "height": ["4", "3"],
            "weight": 86,
            "types": ["Water"],
            "health": 80,
            "attack": 92,
            "defense": 65,
            "special": 65,
            "speed": 68,
            "moves": {
                "natural": [
                    {
                        "move": "Peck",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 19
                    }, {
                        "move": "Horn Attack",
                        "level": 24
                    }, {
                        "move": "Fury Attack",
                        "level": 30
                    }, {
                        "move": "Waterfall",
                        "level": 39
                    }, {
                        "move": "Horn Drill",
                        "level": 48
                    }, {
                        "move": "Agility",
                        "level": 54
                    }],
                "hm": [{
                    "move": "Surf",
                    "level": 3
                }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "SEEL": {
            "label": "Sea Lion",
            "sprite": "Water",
            "info": [
                "The protruding horn on its head is very hard. It is used for bashing through thick ice."
            ],
            "evolutions": [{
                "evolvedForm": ["D", "E", "W", "G", "O", "N", "G"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 34
                    }
                ]
            }],
            "number": 86,
            "height": ["3", "7"],
            "weight": 198.4,
            "types": ["Water"],
            "health": 65,
            "attack": 45,
            "defense": 55,
            "special": 45,
            "speed": 45,
            "moves": {
                "natural": [
                    {
                        "move": "Headbutt",
                        "level": 1
                    }, {
                        "move": "Growl",
                        "level": 30
                    }, {
                        "move": "Aurora Beam",
                        "level": 35
                    }, {
                        "move": "Rest",
                        "level": 40
                    }, {
                        "move": "Take Down",
                        "level": 45
                    }, {
                        "move": "Ice Beam",
                        "level": 50
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "SHELLDER": {
            "label": "Bivalve",
            "sprite": "Water",
            "info": [
                "Its hard shell repels any kind of attack. It is vulnerable only when its shell is open."
            ],
            "evolutions": [{
                "evolvedForm": ["C", "L", "O", "Y", "S", "T", "E", "R"],
                "requirements": [
                    {
                        "method": "item",
                        "item": "Water Stone"
                    }
                ]
            }],
            "number": 90,
            "height": ["1", "0"],
            "weight": 8.8,
            "types": ["Water"],
            "health": 30,
            "attack": 65,
            "defense": 100,
            "special": 45,
            "speed": 40,
            "moves": {
                "natural": [
                    {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Withdraw",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 18
                    }, {
                        "move": "Clamp",
                        "level": 23
                    }, {
                        "move": "Aurora Beam",
                        "level": 30
                    }, {
                        "move": "Leer",
                        "level": 39
                    }, {
                        "move": "Ice Beam",
                        "level": 50
                    }],
                "hm": [{
                    "move": "Surf",
                    "level": 3
                }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Explosion",
                        "level": 47
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "SLOWBRO": {
            "label": "Hermit Crab",
            "sprite": "Water",
            "info": [
                "The SHELLDER that is latched onto SLOWPOKE's tail is said to feed on the host's left over scraps."
            ],
            "number": 80,
            "height": ["5", "3"],
            "weight": 173.1,
            "types": ["Water", "Psychic"],
            "health": 95,
            "attack": 75,
            "defense": 110,
            "special": 100,
            "speed": 30,
            "moves": {
                "natural": [
                    {
                        "move": "Confusion",
                        "level": 1
                    }, {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Headbutt",
                        "level": 1
                    }, {
                        "move": "Disable",
                        "level": 18
                    }, {
                        "move": "Headbutt",
                        "level": 22
                    }, {
                        "move": "Growl",
                        "level": 27
                    }, {
                        "move": "Water Gun",
                        "level": 33
                    }, {
                        "move": "Withdraw",
                        "level": 37
                    }, {
                        "move": "Amnesia",
                        "level": 44
                    }, {
                        "move": "Psychic",
                        "level": 55
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "Slowpoke": {
            "label": "Dopey",
            "sprite": "Water",
            "info": [
                "Incredibly slow and dopey. It takes 5 seconds for it to feel pain when under attack."
            ],
            "evolutions": [{
                "evolvedForm": ["S", "L", "O", "W", "B", "R", "O"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 37
                    }
                ]
            }],
            "number": 79,
            "height": ["3", "11"],
            "weight": 79.4,
            "types": ["Water", "Psychic"],
            "health": 90,
            "attack": 65,
            "defense": 65,
            "special": 40,
            "speed": 15,
            "moves": {
                "natural": [
                    {
                        "move": "Confusion",
                        "level": 1
                    }, {
                        "move": "Disable",
                        "level": 18
                    }, {
                        "move": "Headbutt",
                        "level": 22
                    }, {
                        "move": "Growl",
                        "level": 27
                    }, {
                        "move": "Water Gun",
                        "level": 33
                    }, {
                        "move": "Amnesia",
                        "level": 40
                    }, {
                        "move": "Psychic",
                        "level": 48
                    }],
                "hm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }, {
                        "move": "Flash",
                        "level": 5
                    }],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "SNORLAX": {
            "label": "Sleeping",
            "sprite": "Water",
            "info": [
                "Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful."
            ],
            "number": 143,
            "height": ["6", "11"],
            "weight": 1014.1,
            "types": ["Normal"],
            "health": 160,
            "attack": 110,
            "defense": 65,
            "special": 65,
            "speed": 30,
            "moves": {
                "natural": [
                    {
                        "move": "Amnesia",
                        "level": 1
                    }, {
                        "move": "Headbutt",
                        "level": 1
                    }, {
                        "move": "Rest",
                        "level": 1
                    }, {
                        "move": "Body Slam",
                        "level": 35
                    }, {
                        "move": "Harden",
                        "level": 41
                    }, {
                        "move": "Double-Edge",
                        "level": 48
                    }, {
                        "move": "Hyper Beam",
                        "level": 56
                    }],
                "hm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Strength",
                        "level": 4
                    }],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Pay Day",
                        "level": 16
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Metronome",
                        "level": 35
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Rock Slide",
                        "level": 48
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "SPEAROW": {
            "label": "Tiny Bird",
            "sprite": "Water",
            "info": [
                "Eats bugs in grassy areas. It has to flap its short wings at high speed to stay airborne."
            ],
            "evolutions": [{
                "evolvedForm": ["F", "E", "A", "R", "O", "W"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 20
                    }
                ]
            }],
            "number": 21,
            "height": ["1", "0"],
            "weight": 4.4,
            "types": ["Normal", "Flying"],
            "health": 40,
            "attack": 60,
            "defense": 30,
            "special": 31,
            "speed": 70,
            "moves": {
                "natural": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Peck",
                        "level": 1
                    }, {
                        "move": "Leer",
                        "level": 9
                    }, {
                        "move": "Fury Attack",
                        "level": 15
                    }, {
                        "move": "Mirror Move",
                        "level": 22
                    }, {
                        "move": "Drill Peck",
                        "level": 29
                    }, {
                        "move": "Agility",
                        "level": 36
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Sky Attack",
                        "level": 43
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "SQUIRTLE": {
            "label": "TinyTurtle",
            "sprite": "Water",
            "info": [
                "After birth, its back swells and hardens into a shell.",
                "Powerfully sprays foam from its mouth."
            ],
            "evolutions": [{
                "evolvedForm": ["W", "A", "R", "T", "O", "R", "T", "L", "E"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 16
                    }
                ]
            }],
            "number": 7,
            "height": ["1", "8"],
            "weight": 19.8,
            "types": ["Water"],
            "health": 44,
            "attack": 48,
            "defense": 65,
            "special": 50,
            "speed": 43,
            "moves": {
                "natural": [
                    {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Bubble",
                        "level": 8
                    }, {
                        "move": "Water Gun",
                        "level": 15
                    }, {
                        "move": "Bite",
                        "level": 22
                    }, {
                        "move": "Withdraw",
                        "level": 28
                    }, {
                        "move": "Skull Bash",
                        "level": 35
                    }, {
                        "move": "Hydro Pump",
                        "level": 42
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "STARMIE": {
            "label": "Mysterious",
            "sprite": "Water",
            "info": [
                "Its central core glows with the seven colors of the rainbow. Some people value the core as a gem."
            ],
            "number": 121,
            "height": ["3", "7"],
            "weight": 176.4,
            "types": ["Water", "Psychic"],
            "health": 60,
            "attack": 75,
            "defense": 85,
            "special": 100,
            "speed": 115,
            "moves": {
                "natural": [
                    {
                        "move": "Harden",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Water Gun",
                        "level": 1
                    }],
                "hm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Flash",
                        "level": 5
                    }],
                "tm": [
                    {
                        "move": "Surf",
                        "level": 3
                    }, {
                        "move": "Flash",
                        "level": 5
                    }]
            }
        },
        "STARYU": {
            "label": "Star Shape",
            "sprite": "Water",
            "info": [
                "An enigmatic %%%%%%%POKEMON%%%%%%% that can effortlessly regenerate any appendage it loses in battle."
            ],
            "evolutions": [{
                "evolvedForm": ["S", "T", "A", "R", "M", "I", "E"],
                "requirements": [
                    {
                        "method": "item",
                        "item": "Water Stone"
                    }
                ]
            }],
            "number": 120,
            "height": ["2", "7"],
            "weight": 76.1,
            "types": ["Water"],
            "health": 30,
            "attack": 45,
            "defense": 55,
            "special": 70,
            "speed": 85,
            "moves": {
                "natural": [
                    {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Water Gun",
                        "level": 17
                    }, {
                        "move": "Harden",
                        "level": 22
                    }, {
                        "move": "Recover",
                        "level": 27
                    }, {
                        "move": "Swift",
                        "level": 32
                    }, {
                        "move": "Minimize",
                        "level": 37
                    }, {
                        "move": "Light Screen",
                        "level": 42
                    }, {
                        "move": "Hydro Pump",
                        "level": 47
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Tri Attack",
                        "level": 49
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "TANGELA": {
            "label": "Vine",
            "sprite": "Water",
            "info": [
                "The whole body is swathed with wide vines that are similar to seaweed. Its vines shake as it walks."
            ],
            "number": 114,
            "height": ["3", "3"],
            "weight": 77.2,
            "types": ["Grass"],
            "health": 65,
            "attack": 55,
            "defense": 115,
            "special": 100,
            "speed": 60,
            "moves": {
                "natural": [
                    {
                        "move": "Bind",
                        "level": 1
                    }, {
                        "move": "Constrict",
                        "level": 1
                    }, {
                        "move": "Absorb",
                        "level": 29
                    }, {
                        "move": "Poison Powder",
                        "level": 32
                    }, {
                        "move": "Stun Spore",
                        "level": 36
                    }, {
                        "move": "Sleep Powder",
                        "level": 39
                    }, {
                        "move": "Slam",
                        "level": 45
                    }, {
                        "move": "Growth",
                        "level": 49
                    }],
                "hm": [{
                    "move": "Cut",
                    "level": 1
                }],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "TAUROS": {
            "label": "Wild Bull",
            "sprite": "Water",
            "info": [
                "When it targets an enemy, it charges furiously while whipping its body with its long tails."
            ],
            "number": 128,
            "height": ["4", "7"],
            "weight": 194.9,
            "types": ["Normal"],
            "health": 75,
            "attack": 100,
            "defense": 95,
            "special": 40,
            "speed": 110,
            "moves": {
                "natural": [
                    {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Stomp",
                        "level": 21
                    }, {
                        "move": "Tail Whip",
                        "level": 28
                    }, {
                        "move": "Leer",
                        "level": 35
                    }, {
                        "move": "Rage",
                        "level": 44
                    }, {
                        "move": "Take Down",
                        "level": 51
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Horn Drill",
                        "level": 7
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Earthquake",
                        "level": 26
                    }, {
                        "move": "Fissure",
                        "level": 27
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "TENTACOOL": {
            "label": "Jellyfish",
            "sprite": "Water",
            "info": [
                "Drifts in shallow seas. Anglers who hook them by accident are often punished by its stinging acid."
            ],
            "evolutions": [{
                "evolvedForm": ["T", "E", "N", "T", "A", "C", "R", "U", "E", "L"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 30
                    }
                ]
            }],
            "number": 72,
            "height": ["2", "11"],
            "weight": 100.3,
            "types": ["Water", "Poison"],
            "health": 40,
            "attack": 40,
            "defense": 35,
            "special": 50,
            "speed": 70,
            "moves": {
                "natural": [
                    {
                        "move": "Acid",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 7
                    }, {
                        "move": "Wrap",
                        "level": 13
                    }, {
                        "move": "Poison Sting",
                        "level": 18
                    }, {
                        "move": "Water Gun",
                        "level": 22
                    }, {
                        "move": "Constrict",
                        "level": 27
                    }, {
                        "move": "Barrier",
                        "level": 33
                    }, {
                        "move": "Screech",
                        "level": 40
                    }, {
                        "move": "Hydro Pump",
                        "level": 48
                    }],
                "hm": [
                    {
                        "move": "Cut",
                        "level": 1
                    }, {
                        "move": "Surf",
                        "level": 3
                    }],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "TENTACRUEL": {
            "label": "Jellyfish",
            "sprite": "Water",
            "info": [
                "The tentacles are normally kept short. On hunts, they are extended to ensnare and immobilize prey."
            ],
            "number": 73,
            "height": ["5", "3"],
            "weight": 121.3,
            "types": ["Water", "Poison"],
            "health": 80,
            "attack": 70,
            "defense": 65,
            "special": 80,
            "speed": 100,
            "moves": {
                "natural": [
                    {
                        "move": "Acid",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 1
                    }, {
                        "move": "Wrap",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 7
                    }, {
                        "move": "Wrap",
                        "level": 13
                    }, {
                        "move": "Poison Sting",
                        "level": 18
                    }, {
                        "move": "Water Gun",
                        "level": 22
                    }, {
                        "move": "Constrict",
                        "level": 27
                    }, {
                        "move": "Barrier",
                        "level": 35
                    }, {
                        "move": "Screech",
                        "level": 43
                    }, {
                        "move": "Hydro Pump",
                        "level": 50
                    }],
                "hm": [
                    {
                        "move": "Cut",
                        "level": 1
                    }, {
                        "move": "Surf",
                        "level": 3
                    }],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "VAPOREON": {
            "label": "Bubble Jet",
            "sprite": "Water",
            "info": [
                "Lives close to water. Its long tail is ridged with a fin which is often mistaken for a mermaid's."
            ],
            "number": 134,
            "height": ["3", "3"],
            "weight": 63.9,
            "types": ["Water"],
            "health": 130,
            "attack": 65,
            "defense": 60,
            "special": 110,
            "speed": 65,
            "moves": {
                "natural": [
                    {
                        "move": "Quick Attack",
                        "level": 1
                    }, {
                        "move": "Sand Attack",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Water Gun",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 27
                    }, {
                        "move": "Water Gun",
                        "level": 31
                    }, {
                        "move": "Tail Whip",
                        "level": 37
                    }, {
                        "move": "Bite",
                        "level": 40
                    }, {
                        "move": "Acid Armor",
                        "level": 42
                    }, {
                        "move": "Haze",
                        "level": 44
                    }, {
                        "move": "Mist",
                        "level": 48
                    }, {
                        "move": "Hydro Pump",
                        "level": 54
                    }],
                "hm": [{
                    "move": "Surf",
                    "level": 3
                }],
                "tm": [{
                    "move": "Surf",
                    "level": 3
                }]
            }
        },
        "VENOMOTH": {
            "label": "Poison Moth",
            "sprite": "Water",
            "info": [
                "The dust-like scales covering its wings are color coded to indicate the kinds of poison it has."
            ],
            "number": 49,
            "height": ["4", "11"],
            "weight": 27.6,
            "types": ["Bug", "Poison"],
            "health": 70,
            "attack": 65,
            "defense": 60,
            "special": 90,
            "speed": 90,
            "moves": {
                "natural": [
                    {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Leech Life",
                        "level": 1
                    }, {
                        "move": "Poison Powder",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Poison Powder",
                        "level": 24
                    }, {
                        "move": "Leech Life",
                        "level": 27
                    }, {
                        "move": "Stun Spore",
                        "level": 30
                    }, {
                        "move": "Psybeam",
                        "level": 38
                    }, {
                        "move": "Sleep Powder",
                        "level": 43
                    }, {
                        "move": "Psychic",
                        "level": 50
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Confusion",
                        "level": 1
                    }, {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Poison Powder",
                        "level": 22
                    }, {
                        "move": "Leech Life",
                        "level": 27
                    }, {
                        "move": "Stun Spore",
                        "level": 30
                    }, {
                        "move": "Psybeam",
                        "level": 38
                    }, {
                        "move": "Sleep Powder",
                        "level": 43
                    }, {
                        "move": "Psychic",
                        "level": 50
                    }]
            }
        },
        "VENONAT": {
            "label": "Insect",
            "sprite": "Water",
            "info": [
                "Lives in the shadows of tall trees where it eats insects. It is attracted by light at night."
            ],
            "evolutions": [{
                "evolvedForm": ["V", "E", "N", "O", "M", "O", "T", "H"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 31
                    }
                ]
            }],
            "number": 48,
            "height": ["3", "3"],
            "weight": 66.1,
            "types": ["Bug", "Poison"],
            "health": 60,
            "attack": 55,
            "defense": 50,
            "special": 40,
            "speed": 45,
            "moves": {
                "natural": [
                    {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Poison Powder",
                        "level": 24
                    }, {
                        "move": "Leech Life",
                        "level": 27
                    }, {
                        "move": "Stun Spore",
                        "level": 30
                    }, {
                        "move": "Psybeam",
                        "level": 35
                    }, {
                        "move": "Sleep Powder",
                        "level": 38
                    }, {
                        "move": "Psychic",
                        "level": 43
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Psychic",
                        "level": 29
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Psywave",
                        "level": 46
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 11
                    }, {
                        "move": "Confusion",
                        "level": 19
                    }, {
                        "move": "Poison Powder",
                        "level": 22
                    }, {
                        "move": "Leech Life",
                        "level": 27
                    }, {
                        "move": "Stun Spore",
                        "level": 30
                    }, {
                        "move": "Psybeam",
                        "level": 35
                    }, {
                        "move": "Sleep Powder",
                        "level": 38
                    }, {
                        "move": "Psychic",
                        "level": 43
                    }]
            }
        },
        "VENUSAUR": {
            "label": "Seed",
            "sprite": "Water",
            "info": [
                "The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight."
            ],
            "number": 3,
            "height": ["6", "7"],
            "weight": 220.5,
            "types": ["Grass", "Poison"],
            "health": 80,
            "attack": 82,
            "defense": 83,
            "special": 100,
            "speed": 80,
            "moves": {
                "natural": [
                    {
                        "move": "Growl",
                        "level": 1
                    }, {
                        "move": "Leech Seed",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Vine Whip",
                        "level": 1
                    }, {
                        "move": "Leech Seed",
                        "level": 7
                    }, {
                        "move": "Vine Whip",
                        "level": 13
                    }, {
                        "move": "Poison Powder",
                        "level": 22
                    }, {
                        "move": "Razor Leaf",
                        "level": 30
                    }, {
                        "move": "Growth",
                        "level": 43
                    }, {
                        "move": "Sleep Powder",
                        "level": 55
                    }, {
                        "move": "Solar Beam",
                        "level": 65
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "VICTREEBEL": {
            "label": "Flycatcher",
            "sprite": "Water",
            "info": [
                "Said to live in huge colonies deep in jungles, although no one has ever returned from there."
            ],
            "number": 71,
            "height": ["5", "7"],
            "weight": 34.2,
            "types": ["Grass", "Poison"],
            "health": 80,
            "attack": 105,
            "defense": 65,
            "special": 100,
            "speed": 70,
            "moves": {
                "natural": [
                    {
                        "move": "Acid",
                        "level": 1
                    }, {
                        "move": "Razor Leaf",
                        "level": 1
                    }, {
                        "move": "Sleep Powder",
                        "level": 1
                    }, {
                        "move": "Stun Spore",
                        "level": 1
                    }, {
                        "move": "Wrap",
                        "level": 13
                    }, {
                        "move": "Poison Powder",
                        "level": 15
                    }, {
                        "move": "Sleep Powder",
                        "level": 18
                    }],
                "hm": [{
                    "move": "Cut",
                    "level": 1
                }],
                "tm": [{
                    "move": "Cut",
                    "level": 1
                }]
            }
        },
        "VILEPLUME": {
            "label": "Flower",
            "sprite": "Water",
            "info": [
                "The larger its petals, the more toxic pollen it contains. Its big head is heavy and hard to hold up."
            ],
            "number": 45,
            "height": ["3", "11"],
            "weight": 41,
            "types": ["Grass", "Poison"],
            "health": 75,
            "attack": 80,
            "defense": 85,
            "special": 110,
            "speed": 50,
            "moves": {
                "natural": [
                    {
                        "move": "Acid",
                        "level": 1
                    }, {
                        "move": "Petal Dance",
                        "level": 1
                    }, {
                        "move": "Sleep Powder",
                        "level": 1
                    }, {
                        "move": "Stun Spore",
                        "level": 1
                    }, {
                        "move": "Poison Powder",
                        "level": 15
                    }, {
                        "move": "Stun Spore",
                        "level": 17
                    }, {
                        "move": "Sleep Powder",
                        "level": 19
                    }],
                "hm": [],
                "tm": [{
                    "move": "Cut",
                    "level": 1
                }]
            }
        },
        "VOLTORB": {
            "label": "Ball",
            "sprite": "Water",
            "info": [
                "Usually found in power plants. Easily mistaken for a POKÃ© BALL, they have zapped many people."
            ],
            "evolutions": [{
                "evolvedForm": ["E", "L", "E", "C", "T", "R", "O", "D", "E"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 30
                    }
                ]
            }],
            "number": 100,
            "height": ["1", "8"],
            "weight": 22.9,
            "types": ["Electric"],
            "health": 40,
            "attack": 30,
            "defense": 50,
            "special": 55,
            "speed": 100,
            "moves": {
                "natural": [
                    {
                        "move": "Screech",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Sonic Boom",
                        "level": 17
                    }, {
                        "move": "Self-Destruct",
                        "level": 22
                    }, {
                        "move": "Light Screen",
                        "level": 29
                    }, {
                        "move": "Swift",
                        "level": 36
                    }, {
                        "move": "Explosion",
                        "level": 43
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Teleport",
                        "level": 30
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Explosion",
                        "level": 47
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "VULPIX": {
            "label": "Fox",
            "sprite": "Water",
            "info": [
                "At the time of birth, it has just one tail. The tail splits from its tip as it grows older."
            ],
            "evolutions": [{
                "evolvedForm": ["N", "I", "N", "E", "T", "A", "L", "E", "S"],
                "requirements": [
                    {
                        "method": "item",
                        "item": "Fire Stone"
                    }
                ]
            }],
            "number": 37,
            "height": ["2", "0"],
            "weight": 21.8,
            "types": ["Fire"],
            "health": 38,
            "attack": 41,
            "defense": 40,
            "special": 50,
            "speed": 65,
            "moves": {
                "natural": [
                    {
                        "move": "Ember",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 16
                    }, {
                        "move": "Roar",
                        "level": 21
                    }, {
                        "move": "Confuse Ray",
                        "level": 28
                    }, {
                        "move": "Flamethrower",
                        "level": 35
                    }, {
                        "move": "Fire Spin",
                        "level": 42
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Ember",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Quick Attack",
                        "level": 16
                    }, {
                        "move": "Roar",
                        "level": 21
                    }, {
                        "move": "Confuse Ray",
                        "level": 28
                    }, {
                        "move": "Flamethrower",
                        "level": 35
                    }, {
                        "move": "Fire Spin",
                        "level": 42
                    }]
            }
        },
        "WARTORTLE": {
            "label": "Turtle",
            "sprite": "Water",
            "info": [
                "Often hides in water to stalk unwary prey. For swimming fast, it moves its ears to maintain balance."
            ],
            "evolutions": [{
                "evolvedForm": ["B", "L", "A", "S", "T", "O", "I", "S", "E"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 36
                    }
                ]
            }],
            "number": 8,
            "height": ["3", "3"],
            "weight": 49.6,
            "types": ["Water"],
            "health": 59,
            "attack": 63,
            "defense": 80,
            "special": 65,
            "speed": 58,
            "moves": {
                "natural": [
                    {
                        "move": "Bubble",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Tail Whip",
                        "level": 1
                    }, {
                        "move": "Bubble",
                        "level": 8
                    }, {
                        "move": "Water Gun",
                        "level": 15
                    }, {
                        "move": "Bite",
                        "level": 24
                    }, {
                        "move": "Withdraw",
                        "level": 31
                    }, {
                        "move": "Skull Bash",
                        "level": 39
                    }, {
                        "move": "Hydro Pump",
                        "level": 47
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Mega Punch",
                        "level": 1
                    }, {
                        "move": "Mega Kick",
                        "level": 5
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Body Slam",
                        "level": 8
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Bubble Beam",
                        "level": 11
                    }, {
                        "move": "Water Gun",
                        "level": 12
                    }, {
                        "move": "Ice Beam",
                        "level": 13
                    }, {
                        "move": "Blizzard",
                        "level": 14
                    }, {
                        "move": "Submission",
                        "level": 17
                    }, {
                        "move": "Counter",
                        "level": 18
                    }, {
                        "move": "Seismic Toss",
                        "level": 19
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Dig",
                        "level": 28
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Skull Bash",
                        "level": 40
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "WEEDLE": {
            "label": "Hairy Bug",
            "sprite": "Water",
            "info": [
                "Often found in forests, eating leaves. It has a sharp venomous stinger on its head."
            ],
            "evolutions": [{
                "evolvedForm": ["K", "A", "K", "U", "N", "A"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 7
                    }
                ]
            }],
            "number": 13,
            "height": ["1", "0"],
            "weight": 7.1,
            "types": ["Bug", "Poison"],
            "health": 40,
            "attack": 35,
            "defense": 30,
            "special": 20,
            "speed": 50,
            "moves": {
                "natural": [
                    {
                        "move": "Poison Sting",
                        "level": 1
                    }, {
                        "move": "String Shot",
                        "level": 1
                    }],
                "hm": [],
                "tm": []
            }
        },
        "WEEPINBELL": {
            "label": "Flycatcher",
            "sprite": "Water",
            "info": [
                "It spits out POISONPOWDER to immobilize the enemy and then finishes it with a spray of ACID."
            ],
            "evolutions": [{
                "evolvedForm": ["V", "I", "C", "T", "R", "E", "E", "B", "E", "L"],
                "requirements": [
                    {
                        "method": "item",
                        "item": "Leaf Stone"
                    }
                ]
            }],
            "number": 70,
            "height": ["3", "3"],
            "weight": 14.1,
            "types": ["Grass", "Poison"],
            "health": 65,
            "attack": 90,
            "defense": 50,
            "special": 85,
            "speed": 55,
            "moves": {
                "natural": [
                    {
                        "move": "Growth",
                        "level": 1
                    }, {
                        "move": "Vine Whip",
                        "level": 1
                    }, {
                        "move": "Wrap",
                        "level": 1
                    }, {
                        "move": "Wrap",
                        "level": 13
                    }, {
                        "move": "Poison Powder",
                        "level": 15
                    }, {
                        "move": "Sleep Powder",
                        "level": 18
                    }, {
                        "move": "Stun Spore",
                        "level": 23
                    }, {
                        "move": "Acid",
                        "level": 29
                    }, {
                        "move": "Razor Leaf",
                        "level": 38
                    }, {
                        "move": "Slam",
                        "level": 49
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Swords Dance",
                        "level": 3
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Mega Drain",
                        "level": 21
                    }, {
                        "move": "Solar Beam",
                        "level": 22
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "WEEZING": {
            "label": "Poison Gas",
            "sprite": "Water",
            "info": [
                "Where two kinds of poison gases meet, 2 KOFFINGs can fuse into a WEEZING over many years."
            ],
            "number": 110,
            "height": ["3", "11"],
            "weight": 20.9,
            "types": ["Poison"],
            "health": 65,
            "attack": 90,
            "defense": 120,
            "special": 85,
            "speed": 60,
            "moves": {
                "natural": [
                    {
                        "move": "Sludge",
                        "level": 1
                    }, {
                        "move": "Smog",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Sludge",
                        "level": 32
                    }, {
                        "move": "Smokescreen",
                        "level": 39
                    }, {
                        "move": "Self-Destruct",
                        "level": 43
                    }, {
                        "move": "Haze",
                        "level": 49
                    }, {
                        "move": "Explosion",
                        "level": 53
                    }],
                "hm": [
                    {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Self-Destruct",
                        "level": 36
                    }, {
                        "move": "Fire Blast",
                        "level": 38
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Explosion",
                        "level": 47
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }],
                "tm": [
                    {
                        "move": "Sludge",
                        "level": 1
                    }, {
                        "move": "Smog",
                        "level": 1
                    }, {
                        "move": "Tackle",
                        "level": 1
                    }, {
                        "move": "Sludge",
                        "level": 32
                    }, {
                        "move": "Smokescreen",
                        "level": 39
                    }, {
                        "move": "Self-Destruct",
                        "level": 43
                    }, {
                        "move": "Haze",
                        "level": 49
                    }, {
                        "move": "Explosion",
                        "level": 53
                    }]
            }
        },
        "WIGGLYTUFF": {
            "label": "Balloon",
            "sprite": "Water",
            "info": [
                "The body is soft and rubbery. When angered, it will suck in air and inflate itself to an enormous size."
            ],
            "number": 40,
            "height": ["3", "3"],
            "weight": 26.5,
            "types": ["Normal", "Fairy"],
            "health": 140,
            "attack": 70,
            "defense": 45,
            "special": 85,
            "speed": 45,
            "moves": {
                "natural": [
                    {
                        "move": "Defense Curl",
                        "level": 1
                    }, {
                        "move": "Disable",
                        "level": 1
                    }, {
                        "move": "Double Slap",
                        "level": 1
                    }, {
                        "move": "Sing",
                        "level": 1
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Strength",
                        "level": 4
                    }, {
                        "move": "Flash",
                        "level": 5
                    }]
            }
        },
        "ZAPDOS": {
            "label": "Electric",
            "sprite": "Water",
            "info": [
                "A legendary bird %%%%%%%POKEMON%%%%%%% that is said to appear from clouds while dropping enormous lightning bolts."
            ],
            "number": 145,
            "height": ["5", "3"],
            "weight": 116,
            "types": ["Electric", "Flying"],
            "health": 90,
            "attack": 90,
            "defense": 85,
            "special": 125,
            "speed": 100,
            "moves": {
                "natural": [
                    {
                        "move": "Drill Peck",
                        "level": 1
                    }, {
                        "move": "Thunder Shock",
                        "level": 1
                    }, {
                        "move": "Thunder",
                        "level": 51
                    }, {
                        "move": "Agility",
                        "level": 55
                    }, {
                        "move": "Light Screen",
                        "level": 60
                    }],
                "hm": [
                    {
                        "move": "Fly",
                        "level": 2
                    }, {
                        "move": "Flash",
                        "level": 5
                    }],
                "tm": [
                    {
                        "move": "Razor Wind",
                        "level": 2
                    }, {
                        "move": "Whirlwind",
                        "level": 4
                    }, {
                        "move": "Toxic",
                        "level": 6
                    }, {
                        "move": "Take Down",
                        "level": 9
                    }, {
                        "move": "Double-Edge",
                        "level": 10
                    }, {
                        "move": "Hyper Beam",
                        "level": 15
                    }, {
                        "move": "Rage",
                        "level": 20
                    }, {
                        "move": "Thunderbolt",
                        "level": 24
                    }, {
                        "move": "Thunder",
                        "level": 25
                    }, {
                        "move": "Mimic",
                        "level": 31
                    }, {
                        "move": "Double Team",
                        "level": 32
                    }, {
                        "move": "Reflect",
                        "level": 33
                    }, {
                        "move": "Bide",
                        "level": 34
                    }, {
                        "move": "Swift",
                        "level": 39
                    }, {
                        "move": "Sky Attack",
                        "level": 43
                    }, {
                        "move": "Rest",
                        "level": 44
                    }, {
                        "move": "Thunder Wave",
                        "level": 45
                    }, {
                        "move": "Substitute",
                        "level": 50
                    }]
            }
        },
        "ZUBAT": {
            "label": "Bat",
            "sprite": "Water",
            "info": [
                "Forms colonies in perpetually dark places. Uses ultrasonic waves to identify and approach targets."
            ],
            "evolutions": [{
                "evolvedForm": ["G", "O", "L", "B", "A", "T"],
                "requirements": [
                    {
                        "method": "level",
                        "level": 22
                    }
                ]
            }],
            "number": 41,
            "height": ["2", "7"],
            "weight": 16.5,
            "types": ["Poison", "Flying"],
            "health": 40,
            "attack": 45,
            "defense": 35,
            "special": 30,
            "speed": 55,
            "moves": {
                "natural": [
                    {
                        "move": "Leech Life",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 10
                    }, {
                        "move": "Bite",
                        "level": 15
                    }, {
                        "move": "Confuse Ray",
                        "level": 21
                    }, {
                        "move": "Wing Attack",
                        "level": 28
                    }, {
                        "move": "Haze",
                        "level": 36
                    }],
                "hm": [],
                "tm": [
                    {
                        "move": "Leech Life",
                        "level": 1
                    }, {
                        "move": "Supersonic",
                        "level": 10
                    }, {
                        "move": "Bite",
                        "level": 15
                    }, {
                        "move": "Confuse Ray",
                        "level": 21
                    }, {
                        "move": "Wing Attack",
                        "level": 28
                    }, {
                        "move": "Haze",
                        "level": 36
                    }]
            }
        }
    };
}
