import { Actions } from "../../components/Actions";
import { IPlayer, IPokemon } from "../../IFullScreenPokemon";

/**
 * Static information on a move's metadata and effects.
 */
export interface IMoveSchema {
    /**
     * The type of move, such as "Water".
     */
    type: string;

    /**
     * What type of damage this does, as "Physical", "Special", or "Non-Damaging".
     */
    damage: string;

    /**
     * What type of alternate effect the move does, such as "Status" or "Raise".
     */
    effect?: string;

    /**
     * The power of the move, as a damage Number or "-".
     */
    power: string | number;

    /**
     * The accuracy of the move, as "<number>%" (such as "70%") or "-".
     */
    accuracy: string;

    /**
     * The maximum PP for the move.
     */
    PP: number;

    /**
     * A friendly description of the move's effects.
     */
    description: string;

    /**
     * How much of an alternate effect the move has for changing statistics.
     */
    amount?: number;

    /**
     * Whether the move has a higher chance of being a critical hit.
     */
    criticalRaised?: boolean;

    /**
     * What status to lower, if applicable.
     */
    lower?: string;

    /**
     * What speed priority this move has.
     */
    priority?: number;

    /**
     * What status to raise, if applicable.
     */
    raise?: string;

    /**
     * Which status to give, such as "Sleep", if applicable.
     */
    status?: string;
}

/**
 * An HM move or move that interacts with the environment.
 */
export interface IHMMoveSchema extends IMoveSchema {
    /**
     * Activates a Function to perform an HM move outside of battle.
     */
    partyActivate?: (player: IPlayer, pokemon: IPokemon) => void;

    /**
     * The HMCharacter that the move affects.
     */
    characterName?: string;

    /**
     * The badge needed to use the HM move.
     */
    requiredBadge?: string;
}

/**
 * Information on moves.
 */
export class Moves {
    /**
     * All known Pokemon moves, keyed by English name.
     */
    public readonly byName: { [i: string]: IMoveSchema } = {
        "Absorb": {
            "type": "Grass",
            "damage": "Special",
            "power": 20,
            "accuracy": "100%",
            "PP": 20,
            "description": "Leeches 50% of the damage dealt."
        },
        "Acid": {
            "type": "Poison",
            "damage": "Physical",
            "power": 40,
            "accuracy": "100%",
            "PP": 30,
            "description": "10% chance to lower the target's Defense by one stage."
        },
        "Acid Armor": {
            "type": "Poison",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 40,
            "description": "Boosts the user's Defense by two stages."
        },
        "Agility": {
            "type": "Psychic",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 30,
            "description": "Boosts the user's Speed by two stages. Negates the Speed drop of paralysis."
        },
        "Amnesia": {
            "type": "Psychic",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 20,
            "description": "Boosts the user's Special by two stages."
        },
        "Aurora Beam": {
            "type": "Ice",
            "damage": "Special",
            "power": 65,
            "accuracy": "100%",
            "PP": 20,
            "description": "10% chance to lower the user's Attack by one stage."
        },
        "Barrage": {
            "type": "Normal",
            "damage": "Physical",
            "power": 15,
            "accuracy": "85%",
            "PP": 20,
            "description": "Hits two to five times."
        },
        "Barrier": {
            "type": "Psychic",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 30,
            "description": "Boosts the user's Defense by two stages."
        },
        "Bide": {
            "type": "Normal",
            "damage": "Physical",
            "power": "-",
            "accuracy": "-",
            "PP": 10,
            "description": "Charges for two to three turns; returns double the damage received in those turns."
        },
        "Bind": {
            "type": "Normal",
            "damage": "Physical",
            "power": 15,
            "accuracy": "75%",
            "PP": 20,
            "description": "Prevents the opponent from attacking and deals damage to it at the end of every turn for two to five turns."
        },
        "Bite": {
            "type": "Normal",
            "damage": "Physical",
            "power": 60,
            "accuracy": "100%",
            "PP": 25,
            "description": "10% chance of causing the target to flinch."
        },
        "Blizzard": {
            "type": "Ice",
            "damage": "Special",
            "power": 120,
            "accuracy": "90%",
            "PP": 5,
            "description": "10% chance to freeze the target."
        },
        "Body Slam": {
            "type": "Normal",
            "damage": "Physical",
            "power": 85,
            "accuracy": "100%",
            "PP": 15,
            "description": "30% chance to paralyze the target."
        },
        "Bone Club": {
            "type": "Ground",
            "damage": "Physical",
            "power": 65,
            "accuracy": "85%",
            "PP": 20,
            "description": "10% chance of causing the target to flinch."
        },
        "Bonemerang": {
            "type": "Ground",
            "damage": "Physical",
            "power": 50,
            "accuracy": "90%",
            "PP": 10,
            "description": "Hits twice."
        },
        "Bubble": {
            "type": "Water",
            "damage": "Special",
            "power": 20,
            "accuracy": "100%",
            "PP": 30,
            "description": "10% chance to lower the target's Speed by one stage."
        },
        "Bubble Beam": {
            "type": "Water",
            "damage": "Special",
            "power": 65,
            "accuracy": "100%",
            "PP": 20,
            "description": "10% chance to lower the target's Speed by one stage."
        },
        "Clamp": {
            "type": "Water",
            "damage": "Special",
            "power": 35,
            "accuracy": "75%",
            "PP": 10,
            "description": "Prevents the opponent from attacking and deals damage to it at the end of every turn for two to five turns."
        },
        "Comet Punch": {
            "type": "Normal",
            "damage": "Physical",
            "power": 18,
            "accuracy": "85%",
            "PP": 15,
            "description": "Hits two to five times."
        },
        "Confuse Ray": {
            "type": "Ghost",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "100%",
            "PP": 10,
            "description": "Confuses the target."
        },
        "Confusion": {
            "type": "Psychic",
            "damage": "Special",
            "power": 50,
            "accuracy": "100%",
            "PP": 25,
            "description": "10% chance to confuse the target."
        },
        "Constrict": {
            "type": "Normal",
            "damage": "Physical",
            "power": 10,
            "accuracy": "100%",
            "PP": 35,
            "description": "10% chance to lower the target Speed by one stage."
        },
        "Conversion": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 30,
            "description": "Changes the user into the opponent's type."
        },
        "Counter": {
            "type": "Fighting",
            "damage": "Physical",
            "power": "-",
            "accuracy": "100%",
            "PP": 20,
            "description": "If hit by a Normal- or Fighting-type attack, deals double the damage taken."
        },
        "Crabhammer": {
            "type": "Water",
            "damage": "Special",
            "power": 90,
            "accuracy": "85%",
            "PP": 10,
            "description": "High critical hit rate."
        },
        "Cut": {
            "type": "Normal",
            "damage": "Physical",
            "power": 50,
            "accuracy": "95%",
            "PP": 30,
            "description": "No additional effect.",
            "partyActivate": Actions.prototype.partyActivateCut,
            "characterName": "CuttableTree",
            "requiredBadge": "Cascade"
        } as IHMMoveSchema,
        "Defense Curl": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 40,
            "description": "Boosts the user's Defense by one stage."
        },
        "Dig": {
            "type": "Ground",
            "damage": "Physical",
            "power": 100,
            "accuracy": "100%",
            "PP": 10,
            "description": "User is made invulnerable for one turn, then hits the next turn."
        },
        "Disable": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "55%",
            "PP": 20,
            "description": "Randomly disables a foe's move for 0-6 turns."
        },
        "Dizzy Punch": {
            "type": "Normal",
            "damage": "Physical",
            "power": 70,
            "accuracy": "100%",
            "PP": 10,
            "description": "No additional effect."
        },
        "Double Kick": {
            "type": "Fighting",
            "damage": "Physical",
            "power": 30,
            "accuracy": "100%",
            "PP": 30,
            "description": "Hits twice."
        },
        "Double Slap": {
            "type": "Normal",
            "damage": "Physical",
            "power": 15,
            "accuracy": "85%",
            "PP": 10,
            "description": "Hits two to five times."
        },
        "Double Team": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 15,
            "description": "Boosts the user's evasion by one stage."
        },
        "Double-Edge": {
            "type": "Normal",
            "damage": "Physical",
            "power": 100,
            "accuracy": "100%",
            "PP": 15,
            "description": "Has 1/4 recoil."
        },
        "Dragon Rage": {
            "type": "Dragon",
            "damage": "Special",
            "power": "-",
            "accuracy": "100%",
            "PP": 10,
            "description": "Always does 40 HP damage."
        },
        "Dream Eater": {
            "type": "Psychic",
            "damage": "Special",
            "power": 100,
            "accuracy": "100%",
            "PP": 15,
            "description": "Leeches 50% of the damage dealt. Only works if the target is asleep."
        },
        "Drill Peck": {
            "type": "Flying",
            "damage": "Physical",
            "power": 80,
            "accuracy": "100%",
            "PP": 20,
            "description": "No additional effect."
        },
        "Earthquake": {
            "type": "Ground",
            "damage": "Physical",
            "power": 100,
            "accuracy": "100%",
            "PP": 10,
            "description": "No additional effect."
        },
        "Egg Bomb": {
            "type": "Normal",
            "damage": "Physical",
            "power": 100,
            "accuracy": "75%",
            "PP": 10,
            "description": "No additional effect."
        },
        "Ember": {
            "type": "Fire",
            "damage": "Special",
            "power": 40,
            "accuracy": "100%",
            "PP": 25,
            "description": "10% chance to burn the target."
        },
        "Explosion": {
            "type": "Normal",
            "damage": "Physical",
            "power": 170,
            "accuracy": "100%",
            "PP": 5,
            "description": "Faints the user."
        },
        "Fire Blast": {
            "type": "Fire",
            "damage": "Special",
            "power": 120,
            "accuracy": "85%",
            "PP": 5,
            "description": "30% chance to burn the target."
        },
        "Fire Punch": {
            "type": "Fire",
            "damage": "Special",
            "power": 75,
            "accuracy": "100%",
            "PP": 15,
            "description": "10% chance to burn the target."
        },
        "Fire Spin": {
            "type": "Fire",
            "damage": "Special",
            "power": 15,
            "accuracy": "70%",
            "PP": 15,
            "description": "Prevents the opponent from attacking and deals damage to it at the end of every turn for two to five turns."
        },
        "Fissure": {
            "type": "Ground",
            "damage": "Physical",
            "power": "-",
            "accuracy": "30%",
            "PP": 5,
            "description": "OHKOes the target."
        },
        "Flamethrower": {
            "type": "Fire",
            "damage": "Special",
            "power": 95,
            "accuracy": "100%",
            "PP": 15,
            "description": "10% chance to burn the target."
        },
        "Flash": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "70%",
            "PP": 20,
            "description": "Lowers the target's accuracy by one stage.",
            "requiredBadge": "Boulder"
        } as IHMMoveSchema,
        "Fly": {
            "type": "Flying",
            "damage": "Physical",
            "power": 70,
            "accuracy": "95%",
            "PP": 15,
            "description": "User is made invulnerable for one turn, then hits the next turn.",
            "requiredBadge": "Thunder"
        } as IHMMoveSchema,
        "Focus Energy": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 30,
            "description": "Reduces the user's critical hit rate."
        },
        "Fury Attack": {
            "type": "Normal",
            "damage": "Physical",
            "power": 15,
            "accuracy": "85%",
            "PP": 20,
            "description": "Hits two to five times."
        },
        "Fury Swipes": {
            "type": "Normal",
            "damage": "Physical",
            "power": 18,
            "accuracy": "80%",
            "PP": 15,
            "description": "Hits two to five times."
        },
        "Glare": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "75%",
            "PP": 30,
            "description": "Paralyzes the target."
        },
        "Growl": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "100%",
            "PP": 40,
            "description": "Lowers the target's Attack by one stage."
        },
        "Growth": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 40,
            "description": "Boosts Special one stage."
        },
        "Guillotine": {
            "type": "Normal",
            "damage": "Physical",
            "power": "-",
            "accuracy": "30%",
            "PP": 5,
            "description": "OHKOes the target."
        },
        "Gust": {
            "type": "Normal",
            "damage": "Physical",
            "power": 40,
            "accuracy": "100%",
            "PP": 35,
            "description": "No additional effect."
        },
        "Harden": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 30,
            "description": "Boosts the user's Defense by one stage."
        },
        "Haze": {
            "type": "Ice",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 30,
            "description": "Eliminates all stat changes."
        },
        "Headbutt": {
            "type": "Normal",
            "damage": "Physical",
            "power": 70,
            "accuracy": "100%",
            "PP": 15,
            "description": "30% chance of causing the target to flinch."
        },
        "High Jump Kick": {
            "type": "Fighting",
            "damage": "Physical",
            "power": 85,
            "accuracy": "90%",
            "PP": 20,
            "description": "User takes 1 HP recoil if attack misses or fails."
        },
        "Horn Attack": {
            "type": "Normal",
            "damage": "Physical",
            "power": 65,
            "accuracy": "100%",
            "PP": 25,
            "description": "No additional effect."
        },
        "Horn Drill": {
            "type": "Normal",
            "damage": "Physical",
            "power": "-",
            "accuracy": "30%",
            "PP": 5,
            "description": "OHKOes the target."
        },
        "Hydro Pump": {
            "type": "Water",
            "damage": "Special",
            "power": 120,
            "accuracy": "80%",
            "PP": 5,
            "description": "No additional effect."
        },
        "Hyper Beam": {
            "type": "Normal",
            "damage": "Physical",
            "power": 150,
            "accuracy": "90%",
            "PP": 5,
            "description": "User cannot move next turn, unless opponent or Substitute was KOed."
        },
        "Hyper Fang": {
            "type": "Normal",
            "damage": "Physical",
            "power": 80,
            "accuracy": "90%",
            "PP": 15,
            "description": "10% chance of causing the target to flinch."
        },
        "Hypnosis": {
            "type": "Psychic",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "60%",
            "PP": 20,
            "description": "Puts the foe to sleep."
        },
        "Ice Beam": {
            "type": "Ice",
            "damage": "Special",
            "power": 95,
            "accuracy": "100%",
            "PP": 10,
            "description": "10% chance to freeze."
        },
        "Ice Punch": {
            "type": "Ice",
            "damage": "Special",
            "power": 75,
            "accuracy": "100%",
            "PP": 15,
            "description": "10% chance to freeze."
        },
        "Jump Kick": {
            "type": "Fighting",
            "damage": "Physical",
            "power": 70,
            "accuracy": "95%",
            "PP": 25,
            "description": "User takes 1 HP recoil if attack misses."
        },
        "Karate Chop": {
            "type": "Normal",
            "damage": "Physical",
            "power": 50,
            "accuracy": "100%",
            "PP": 25,
            "description": "High critical hit rate."
        },
        "Kinesis": {
            "type": "Psychic",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "80%",
            "PP": 15,
            "description": "Lowers the target's accuracy by one stage."
        },
        "Leech Life": {
            "type": "Bug",
            "damage": "Physical",
            "power": 20,
            "accuracy": "100%",
            "PP": 15,
            "description": "Leeches 50% of the damage dealt."
        },
        "Leech Seed": {
            "type": "Grass",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "90%",
            "PP": 10,
            "description": "Leeches 1/16 of the target's HP each turn."
        },
        "Leer": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "100%",
            "PP": 30,
            "description": "Lowers the target's Defense by one stage."
        },
        "Lick": {
            "type": "Ghost",
            "damage": "Physical",
            "power": 20,
            "accuracy": "100%",
            "PP": 30,
            "description": "30% chance to paralyze the target."
        },
        "Light Screen": {
            "type": "Psychic",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 30,
            "description": "Halves Special damage done to user."
        },
        "Lovely Kiss": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "75%",
            "PP": 10,
            "description": "Puts the target to sleep."
        },
        "Low Kick": {
            "type": "Fighting",
            "damage": "Physical",
            "power": 50,
            "accuracy": "90%",
            "PP": 20,
            "description": "30% chance of causing the target to flinch foe."
        },
        "Meditate": {
            "type": "Psychic",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 40,
            "description": "Boosts the user's Attack by one stage."
        },
        "Mega Drain": {
            "type": "Grass",
            "damage": "Special",
            "power": 40,
            "accuracy": "100%",
            "PP": 10,
            "description": "Leeches 50% of the damage dealt."
        },
        "Mega Kick": {
            "type": "Normal",
            "damage": "Physical",
            "power": 120,
            "accuracy": "75%",
            "PP": 5,
            "description": "No additional effect."
        },
        "Mega Punch": {
            "type": "Normal",
            "damage": "Physical",
            "power": 80,
            "accuracy": "85%",
            "PP": 20,
            "description": "No additional effect."
        },
        "Metronome": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 10,
            "description": "Uses a random move."
        },
        "Mimic": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 10,
            "description": "Copies a random move the foe knows."
        },
        "Minimize": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 20,
            "description": "Boosts the user's evasion by one stage."
        },
        "Mirror Move": {
            "type": "Flying",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 20,
            "description": "Use the move the foe just used."
        },
        "Mist": {
            "type": "Ice",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 30,
            "description": "Prevents moves that only lower stats from working for 5 turns."
        },
        "Night Shade": {
            "type": "Ghost",
            "damage": "Physical",
            "power": "-",
            "accuracy": "100%",
            "PP": 15,
            "description": "Deals damage equal to the user's level."
        },
        "Pay Day": {
            "type": "Normal",
            "damage": "Physical",
            "power": 40,
            "accuracy": "100%",
            "PP": 20,
            "description": "No competitive effect."
        },
        "Peck": {
            "type": "Flying",
            "damage": "Physical",
            "power": 35,
            "accuracy": "100%",
            "PP": 35,
            "description": "No additional effect."
        },
        "Petal Dance": {
            "type": "Grass",
            "damage": "Special",
            "power": 70,
            "accuracy": "100%",
            "PP": 20,
            "description": "Repeats for two to three turns. Confuses the user at the end."
        },
        "Pin Missile": {
            "type": "Bug",
            "damage": "Physical",
            "power": 14,
            "accuracy": "85%",
            "PP": 20,
            "description": "Hits two to five times."
        },
        "Poison Gas": {
            "type": "Poison",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "55%",
            "PP": 40,
            "description": "Poisons the target."
        },
        "Poison Powder": {
            "type": "Poison",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "75%",
            "PP": 35,
            "description": "Poisons the target."
        },
        "Poison Sting": {
            "type": "Poison",
            "damage": "Physical",
            "power": 15,
            "accuracy": "100%",
            "PP": 35,
            "description": "20% chance to poison the target."
        },
        "Pound": {
            "type": "Normal",
            "damage": "Physical",
            "power": 40,
            "accuracy": "100%",
            "PP": 35,
            "description": "No additional effect."
        },
        "Psybeam": {
            "type": "Psychic",
            "damage": "Special",
            "power": 65,
            "accuracy": "100%",
            "PP": 20,
            "description": "10% chance to confuse the target."
        },
        "Psychic": {
            "type": "Psychic",
            "damage": "Special",
            "power": 90,
            "accuracy": "100%",
            "PP": 10,
            "description": "30% chance to lower the target's Special by one stage."
        },
        "Psywave": {
            "type": "Psychic",
            "damage": "Special",
            "power": "-",
            "accuracy": "80%",
            "PP": 15,
            "description": "Does random damage equal to .5x-1.5x the user's level."
        },
        "Quick Attack": {
            "type": "Normal",
            "damage": "Physical",
            "power": 40,
            "accuracy": "100%",
            "PP": 30,
            "description": "Priority +1.",
            "priority": 1
        },
        "Rage": {
            "type": "Normal",
            "damage": "Physical",
            "power": 20,
            "accuracy": "100%",
            "PP": 20,
            "description": "Boosts Attack by one stage if hit, but can only use Rage after that."
        },
        "Razor Leaf": {
            "type": "Grass",
            "damage": "Special",
            "power": 55,
            "accuracy": "95%",
            "PP": 25,
            "description": "High critical hit rate."
        },
        "Razor Wind": {
            "type": "Normal",
            "damage": "Physical",
            "power": 80,
            "accuracy": "75%",
            "PP": 10,
            "description": "Charges first turn; attacks on the second."
        },
        "Recover": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 20,
            "description": "Heals 50% of the user's max HP."
        },
        "Reflect": {
            "type": "Psychic",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 20,
            "description": "Lowers the physical damage done to user."
        },
        "Rest": {
            "type": "Psychic",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 10,
            "description": "The user goes to sleep for two turns, restoring all HP."
        },
        "Roar": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "100%",
            "PP": 20,
            "description": "Has no effect."
        },
        "Rock Slide": {
            "type": "Rock",
            "damage": "Physical",
            "power": 75,
            "accuracy": "90%",
            "PP": 10,
            "description": "No additional effect."
        },
        "Rock Throw": {
            "type": "Rock",
            "damage": "Physical",
            "power": 50,
            "accuracy": "90%",
            "PP": 15,
            "description": "No additional effect."
        },
        "Rolling Kick": {
            "type": "Fighting",
            "damage": "Physical",
            "power": 60,
            "accuracy": "85%",
            "PP": 15,
            "description": "30% chance of causing the target to flinch."
        },
        "Sand Attack": {
            "type": "Ground",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "100%",
            "PP": 15,
            "description": "Lowers the target's accuracy by one stage."
        },
        "Scratch": {
            "type": "Normal",
            "damage": "Physical",
            "power": 40,
            "accuracy": "100%",
            "PP": 35,
            "description": "No additional effect."
        },
        "Screech": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "85%",
            "PP": 40,
            "description": "Lowers the target's Defense by two stages."
        },
        "Seismic Toss": {
            "type": "Fighting",
            "damage": "Physical",
            "power": "-",
            "accuracy": "100%",
            "PP": 20,
            "description": "Deals damage equal to the user's level."
        },
        "Self-Destruct": {
            "type": "Normal",
            "damage": "Physical",
            "power": 130,
            "accuracy": "100%",
            "PP": 5,
            "description": "Faints the user."
        },
        "Sharpen": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 30,
            "description": "Boosts the user's Attack by one stage."
        },
        "Sing": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "55%",
            "PP": 15,
            "description": "Puts the target to sleep."
        },
        "Skull Bash": {
            "type": "Normal",
            "damage": "Physical",
            "power": 100,
            "accuracy": "100%",
            "PP": 15,
            "description": "Charges turn one; attacks turn two."
        },
        "Sky Attack": {
            "type": "Flying",
            "damage": "Physical",
            "power": 140,
            "accuracy": "90%",
            "PP": 5,
            "description": "Hits the turn after being used."
        },
        "Slam": {
            "type": "Normal",
            "damage": "Physical",
            "power": 80,
            "accuracy": "75%",
            "PP": 20,
            "description": "No additional effect."
        },
        "Slash": {
            "type": "Normal",
            "damage": "Physical",
            "power": 70,
            "accuracy": "100%",
            "PP": 20,
            "description": "High critical hit rate."
        },
        "Sleep Powder": {
            "type": "Grass",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "75%",
            "PP": 15,
            "status": "Sleep",
            "description": "Puts the target to sleep."
        },
        "Sludge": {
            "type": "Poison",
            "damage": "Physical",
            "power": 65,
            "accuracy": "100%",
            "PP": 20,
            "description": "29.7% chance to poison the target."
        },
        "Smog": {
            "type": "Poison",
            "damage": "Physical",
            "power": 20,
            "accuracy": "70%",
            "PP": 20,
            "description": "40% chance to poison the target."
        },
        "Smokescreen": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "100%",
            "PP": 20,
            "description": "Lowers the target's accuracy by one stage."
        },
        "Soft-Boiled": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 10,
            "description": "Heals 50% of the user's max HP."
        },
        "Solar Beam": {
            "type": "Grass",
            "damage": "Special",
            "power": 120,
            "accuracy": "100%",
            "PP": 10,
            "description": "Charges turn 1; attacks turn 2."
        },
        "Sonic Boom": {
            "type": "Normal",
            "damage": "Physical",
            "power": "-",
            "accuracy": "90%",
            "PP": 20,
            "description": "Does 20 damage. Ghosts take regular damage."
        },
        "Spike Cannon": {
            "type": "Normal",
            "damage": "Physical",
            "power": 20,
            "accuracy": "100%",
            "PP": 15,
            "description": "Hits two to five times."
        },
        "Splash": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 40,
            "description": "No effect whatsoever."
        },
        "Spore": {
            "type": "Grass",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "100%",
            "PP": 15,
            "description": "Puts the target to sleep."
        },
        "Stomp": {
            "type": "Normal",
            "damage": "Physical",
            "power": 65,
            "accuracy": "100%",
            "PP": 20,
            "description": "30% chance of causing the target to flinch."
        },
        "Strength": {
            "type": "Normal",
            "damage": "Physical",
            "power": 80,
            "accuracy": "100%",
            "PP": 15,
            "description": "No additional effect.",
            "partyActivate": Actions.prototype.partyActivateStrength,
            "characterName": "StrengthBoulder",
            "requiredBadge": "Rainbow"
        } as IHMMoveSchema,
        "String Shot": {
            "type": "Bug",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "95%",
            "PP": 40,
            "description": "Lowers the target's Speed by one stage."
        },
        "Struggle": {
            "type": "Normal",
            "damage": "Physical",
            "power": 50,
            "accuracy": "-",
            "PP": 10,
            "description": "Has 1/2 recoil. Ghost-types take damage."
        },
        "Stun Spore": {
            "type": "Grass",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "75%",
            "PP": 30,
            "description": "Paralyzes the target."
        },
        "Submission": {
            "type": "Fighting",
            "damage": "Physical",
            "power": 80,
            "accuracy": "80%",
            "PP": 25,
            "description": "Has 1/4 recoil."
        },
        "Substitute": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 10,
            "description": "Takes 1/4 the user's max HP to create a Substitute that takes damage for the user."
        },
        "Super Fang": {
            "type": "Normal",
            "damage": "Physical",
            "power": "-",
            "accuracy": "90%",
            "PP": 10,
            "description": "Deals damage equal to half the target's current HP."
        },
        "Supersonic": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "55%",
            "PP": 20,
            "description": "Confuses the target."
        },
        "Surf": {
            "type": "Water",
            "damage": "Special",
            "power": 95,
            "accuracy": "100%",
            "PP": 15,
            "description": "No additional effect.",
            "partyActivate": Actions.prototype.partyActivateSurf,
            "characterName": "WaterEdge",
            "requiredBadge": "Soul"
        } as IHMMoveSchema,
        "Swift": {
            "type": "Normal",
            "damage": "Physical",
            "power": 60,
            "accuracy": "-",
            "PP": 20,
            "description": "Always hits."
        },
        "Swords Dance": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 30,
            "description": "Boosts the user's Attack by two stages.",
            "effect": "Raise",
            "raise": "Attack",
            "amount": 1
        },
        "Tackle": {
            "type": "Normal",
            "damage": "Physical",
            "power": 35,
            "accuracy": "95%",
            "PP": 35,
            "description": "No additional effect."
        },
        "Tail Whip": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "100%",
            "PP": 30,
            "description": "Lowers the Defense of all opposing adjacent Pokemon by one stage."
        },
        "Take Down": {
            "type": "Normal",
            "damage": "Physical",
            "power": 90,
            "accuracy": "85%",
            "PP": 20,
            "description": "Has 1/4 recoil."
        },
        "Teleport": {
            "type": "Psychic",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 20,
            "description": "No competitive effect."
        },
        "Thrash": {
            "type": "Normal",
            "damage": "Physical",
            "power": 90,
            "accuracy": "100%",
            "PP": 20,
            "description": "Repeats for three to four turns. Confuses the user at the end."
        },
        "Thunder": {
            "type": "Electric",
            "damage": "Special",
            "power": 120,
            "accuracy": "70%",
            "PP": 10,
            "description": "10% chance to paralyze the target."
        },
        "Thunder Punch": {
            "type": "Electric",
            "damage": "Special",
            "power": 75,
            "accuracy": "100%",
            "PP": 15,
            "description": "10% chance to paralyze the target."
        },
        "Thunder Shock": {
            "type": "Electric",
            "damage": "Special",
            "power": 40,
            "accuracy": "100%",
            "PP": 30,
            "description": "10% chance to paralyze the target."
        },
        "Thunder Wave": {
            "type": "Electric",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "100%",
            "PP": 20,
            "description": "Paralyzes the target."
        },
        "Thunderbolt": {
            "type": "Electric",
            "damage": "Special",
            "power": 95,
            "accuracy": "100%",
            "PP": 15,
            "description": "10% chance to paralyze the target."
        },
        "Toxic": {
            "type": "Poison",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "85%",
            "PP": 10,
            "description": "Badly poisons the target."
        },
        "Transform": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 10,
            "description": "Transforms the user into the target, copying its type, stats, stat changes, moves, and ability."
        },
        "Tri Attack": {
            "type": "Normal",
            "damage": "Physical",
            "power": 80,
            "accuracy": "100%",
            "PP": 10,
            "description": "No additional effect."
        },
        "Twineedle": {
            "type": "Bug",
            "damage": "Physical",
            "power": 25,
            "accuracy": "100%",
            "PP": 20,
            "description": "Hits twice. Each hit has a 20% chance to poison the target."
        },
        "Vice Grip": {
            "type": "Normal",
            "damage": "Physical",
            "power": 55,
            "accuracy": "100%",
            "PP": 30,
            "description": "No additional effect."
        },
        "Vine Whip": {
            "type": "Grass",
            "damage": "Special",
            "power": 35,
            "accuracy": "100%",
            "PP": 10,
            "description": "No additional effect."
        },
        "Water Gun": {
            "type": "Water",
            "damage": "Special",
            "power": 40,
            "accuracy": "100%",
            "PP": 25,
            "description": "No additional effect."
        },
        "Waterfall": {
            "type": "Water",
            "damage": "Special",
            "power": 80,
            "accuracy": "100%",
            "PP": 15,
            "description": "No additional effect."
        },
        "Whirlwind": {
            "type": "Normal",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "100%",
            "PP": 20,
            "description": "Has no effect."
        },
        "Wing Attack": {
            "type": "Flying",
            "damage": "Physical",
            "power": 35,
            "accuracy": "100%",
            "PP": 35,
            "description": "No additional effect."
        },
        "Withdraw": {
            "type": "Water",
            "damage": "Non-Damaging",
            "power": "-",
            "accuracy": "-",
            "PP": 40,
            "description": "Boosts the user's Defense by one stage."
        },
        "Wrap": {
            "type": "Normal",
            "damage": "Physical",
            "power": 15,
            "accuracy": "85%",
            "PP": 20,
            "description": "Prevents the opponent from attacking and deals damage to it at the end of every turn for two to five turns."
        }
    };
}