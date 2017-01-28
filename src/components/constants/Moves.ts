import { EffectTarget, IMoveEffect } from "battlemovr/lib/Effects";

import { Actions } from "../../components/Actions";
import { IPokemon } from "../../components/Battles";
import { IPlayer } from "../../components/Things";

/**
 * Static information on a move's metadata and effects.
 */
export interface IMoveSchema {
    /**
     * The accuracy of the move if it needs to hit a target, within 0 to 100.
     */
    accuracy?: number;

    /**
     * Whether the move has a higher chance of being a critical hit.
     */
    criticalRaised?: boolean;

    /**
     * Effects caused by this move.
     */
    effects: IMoveEffect[];

    /**
     * The maximum PP for the move.
     */
    PP: number;

    /**
     * What speed priority this move has.
     */
    priority?: number;

    /**
     * The type of move, such as "Water".
     */
    type: string;
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
            accuracy: 100,
            effects: [],
            PP: 20,
            type: "Grass"
        },
        "Acid": {
            type: "Poison",
            effects: [],
            accuracy: 100,
            PP: 30,
        },
        "Acid Armor": {
            type: "Poison",
            effects: [],
            PP: 40,
        },
        "Agility": {
            type: "Psychic",
            effects: [],
            PP: 30,
        },
        "Amnesia": {
            type: "Psychic",
            effects: [],
            PP: 20,
        },
        "Aurora Beam": {
            type: "Ice",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Barrage": {
            type: "Normal",
            effects: [],
            accuracy: 85,
            PP: 20,
        },
        "Barrier": {
            type: "Psychic",
            effects: [],
            PP: 30,
        },
        "Bide": {
            type: "Normal",
            effects: [],
            PP: 10,
        },
        "Bind": {
            type: "Normal",
            effects: [],
            accuracy: 75,
            PP: 20,
        },
        "Bite": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 25,
        },
        "Blizzard": {
            type: "Ice",
            effects: [],
            accuracy: 90,
            PP: 5,
        },
        "Body Slam": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Bone Club": {
            type: "Ground",
            effects: [],
            accuracy: 85,
            PP: 20,
        },
        "Bonemerang": {
            type: "Ground",
            effects: [],
            accuracy: 90,
            PP: 10,
        },
        "Bubble": {
            type: "Water",
            effects: [],
            accuracy: 100,
            PP: 30,
        },
        "Bubble Beam": {
            type: "Water",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Clamp": {
            type: "Water",
            effects: [],
            accuracy: 75,
            PP: 10,
        },
        "Comet Punch": {
            type: "Normal",
            effects: [],
            accuracy: 85,
            PP: 15,
        },
        "Confuse Ray": {
            type: "Ghost",
            effects: [],
            accuracy: 100,
            PP: 10,
        },
        "Confusion": {
            type: "Psychic",
            effects: [],
            accuracy: 100,
            PP: 25,
        },
        "Constrict": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 35,
        },
        "Conversion": {
            type: "Normal",
            effects: [],
            PP: 30,
        },
        "Counter": {
            type: "Fighting",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Crabhammer": {
            type: "Water",
            effects: [],
            accuracy: 85,
            PP: 10,
        },
        "Cut": {
            type: "Normal",
            effects: [],
            accuracy: 95,
            PP: 30,
            "partyActivate": Actions.prototype.partyActivateCut,
            "characterName": "CuttableTree",
            "requiredBadge": "Cascade"
        } as IHMMoveSchema,
        "Defense Curl": {
            type: "Normal",
            effects: [],
            PP: 40,
        },
        "Dig": {
            type: "Ground",
            effects: [],
            accuracy: 100,
            PP: 10,
        },
        "Disable": {
            type: "Normal",
            effects: [],
            accuracy: 55,
            PP: 20,
        },
        "Dizzy Punch": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 10,
        },
        "Double Kick": {
            type: "Fighting",
            effects: [],
            accuracy: 100,
            PP: 30,
        },
        "Double Slap": {
            type: "Normal",
            effects: [],
            accuracy: 85,
            PP: 10,
        },
        "Double Team": {
            type: "Normal",
            effects: [],
            PP: 15,
        },
        "Double-Edge": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Dragon Rage": {
            type: "Dragon",
            effects: [],
            accuracy: 100,
            PP: 10,
        },
        "Dream Eater": {
            type: "Psychic",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Drill Peck": {
            type: "Flying",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Earthquake": {
            type: "Ground",
            effects: [
                {
                    damage: 100,
                    target: EffectTarget.defender,
                    type: "damage"
                }
            ],
            accuracy: 100,
            PP: 10,
        },
        "Egg Bomb": {
            type: "Normal",
            effects: [],
            accuracy: 75,
            PP: 10,
        },
        "Ember": {
            type: "Fire",
            effects: [],
            accuracy: 100,
            PP: 25,
        },
        "Explosion": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 5,
        },
        "Fire Blast": {
            type: "Fire",
            effects: [],
            accuracy: 85,
            PP: 5,
        },
        "Fire Punch": {
            type: "Fire",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Fire Spin": {
            type: "Fire",
            effects: [],
            accuracy: 70,
            PP: 15,
        },
        "Fissure": {
            type: "Ground",
            effects: [],
            accuracy: 30,
            PP: 5,
        },
        "Flamethrower": {
            type: "Fire",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Flash": {
            type: "Normal",
            effects: [],
            accuracy: 70,
            PP: 20,
            "requiredBadge": "Boulder"
        } as IHMMoveSchema,
        "Fly": {
            type: "Flying",
            effects: [],
            accuracy: 95,
            PP: 15,
            "requiredBadge": "Thunder"
        } as IHMMoveSchema,
        "Focus Energy": {
            type: "Normal",
            effects: [],
            PP: 30,
        },
        "Fury Attack": {
            type: "Normal",
            effects: [],
            accuracy: 85,
            PP: 20,
        },
        "Fury Swipes": {
            type: "Normal",
            effects: [],
            accuracy: 80,
            PP: 15,
        },
        "Glare": {
            type: "Normal",
            effects: [],
            accuracy: 75,
            PP: 30,
        },
        "Growl": {
            type: "Normal",
            effects: [{
                change: -1,
                statistic: "attack",
                target: EffectTarget.defender,
                type: "statistic"
            }],
            accuracy: 100,
            PP: 40,
        },
        "Growth": {
            type: "Normal",
            effects: [],
            PP: 40,
        },
        "Guillotine": {
            type: "Normal",
            effects: [],
            accuracy: 30,
            PP: 5,
        },
        "Gust": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 35,
        },
        "Harden": {
            type: "Normal",
            effects: [],
            PP: 30,
        },
        "Haze": {
            type: "Ice",
            effects: [],
            PP: 30,
        },
        "Headbutt": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "High Jump Kick": {
            type: "Fighting",
            effects: [],
            accuracy: 90,
            PP: 20,
        },
        "Horn Attack": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 25,
        },
        "Horn Drill": {
            type: "Normal",
            effects: [],
            accuracy: 30,
            PP: 5,
        },
        "Hydro Pump": {
            type: "Water",
            effects: [],
            accuracy: 80,
            PP: 5,
        },
        "Hyper Beam": {
            type: "Normal",
            effects: [],
            accuracy: 90,
            PP: 5,
        },
        "Hyper Fang": {
            type: "Normal",
            effects: [],
            accuracy: 90,
            PP: 15,
        },
        "Hypnosis": {
            type: "Psychic",
            effects: [],
            accuracy: 60,
            PP: 20,
        },
        "Ice Beam": {
            type: "Ice",
            effects: [],
            accuracy: 100,
            PP: 10,
        },
        "Ice Punch": {
            type: "Ice",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Jump Kick": {
            type: "Fighting",
            effects: [],
            accuracy: 95,
            PP: 25,
        },
        "Karate Chop": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 25,
        },
        "Kinesis": {
            type: "Psychic",
            effects: [],
            accuracy: 80,
            PP: 15,
        },
        "Leech Life": {
            type: "Bug",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Leech Seed": {
            type: "Grass",
            effects: [],
            accuracy: 90,
            PP: 10,
        },
        "Leer": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 30,
        },
        "Lick": {
            type: "Ghost",
            effects: [],
            accuracy: 100,
            PP: 30,
        },
        "Light Screen": {
            type: "Psychic",
            effects: [],
            PP: 30,
        },
        "Lovely Kiss": {
            type: "Normal",
            effects: [],
            accuracy: 75,
            PP: 10,
        },
        "Low Kick": {
            type: "Fighting",
            effects: [],
            accuracy: 90,
            PP: 20,
        },
        "Meditate": {
            type: "Psychic",
            effects: [],
            PP: 40,
        },
        "Mega Drain": {
            type: "Grass",
            effects: [],
            accuracy: 100,
            PP: 10,
        },
        "Mega Kick": {
            type: "Normal",
            effects: [],
            accuracy: 75,
            PP: 5,
        },
        "Mega Punch": {
            type: "Normal",
            effects: [],
            accuracy: 85,
            PP: 20,
        },
        "Metronome": {
            type: "Normal",
            effects: [],
            PP: 10,
        },
        "Mimic": {
            type: "Normal",
            effects: [],
            PP: 10,
        },
        "Minimize": {
            type: "Normal",
            effects: [],
            PP: 20,
        },
        "Mirror Move": {
            type: "Flying",
            effects: [],
            PP: 20,
        },
        "Mist": {
            type: "Ice",
            effects: [],
            PP: 30,
        },
        "Night Shade": {
            type: "Ghost",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Pay Day": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Peck": {
            type: "Flying",
            effects: [],
            accuracy: 100,
            PP: 35,
        },
        "Petal Dance": {
            type: "Grass",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Pin Missile": {
            type: "Bug",
            effects: [],
            accuracy: 85,
            PP: 20,
        },
        "Poison Gas": {
            type: "Poison",
            effects: [],
            accuracy: 55,
            PP: 40,
        },
        "Poison Powder": {
            type: "Poison",
            effects: [],
            accuracy: 75,
            PP: 35,
        },
        "Poison Sting": {
            type: "Poison",
            effects: [],
            accuracy: 100,
            PP: 35,
        },
        "Pound": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 35,
        },
        "Psybeam": {
            type: "Psychic",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Psychic": {
            type: "Psychic",
            effects: [],
            accuracy: 100,
            PP: 10,
        },
        "Psywave": {
            type: "Psychic",
            effects: [],
            accuracy: 80,
            PP: 15,
        },
        "Quick Attack": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 30,
            "priority": 1
        },
        "Rage": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Razor Leaf": {
            type: "Grass",
            effects: [],
            accuracy: 95,
            PP: 25,
        },
        "Razor Wind": {
            type: "Normal",
            effects: [],
            accuracy: 75,
            PP: 10,
        },
        "Recover": {
            type: "Normal",
            effects: [],
            PP: 20,
        },
        "Reflect": {
            type: "Psychic",
            effects: [],
            PP: 20,
        },
        "Rest": {
            type: "Psychic",
            effects: [],
            PP: 10,
        },
        "Roar": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Rock Slide": {
            type: "Rock",
            effects: [],
            accuracy: 90,
            PP: 10,
        },
        "Rock Throw": {
            type: "Rock",
            effects: [],
            accuracy: 90,
            PP: 15,
        },
        "Rolling Kick": {
            type: "Fighting",
            effects: [],
            accuracy: 85,
            PP: 15,
        },
        "Sand Attack": {
            type: "Ground",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Scratch": {
            type: "Normal",
            effects: [
                {
                    damage: 40,
                    target: EffectTarget.defender,
                    type: "damage"
                }
            ],
            accuracy: 100,
            PP: 35,
        },
        "Screech": {
            type: "Normal",
            effects: [],
            accuracy: 85,
            PP: 40,
        },
        "Seismic Toss": {
            type: "Fighting",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Self-Destruct": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 5,
        },
        "Sharpen": {
            type: "Normal",
            effects: [],
            PP: 30,
        },
        "Sing": {
            type: "Normal",
            effects: [],
            accuracy: 55,
            PP: 15,
        },
        "Skull Bash": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Sky Attack": {
            type: "Flying",
            effects: [],
            accuracy: 90,
            PP: 5,
        },
        "Slam": {
            type: "Normal",
            effects: [],
            accuracy: 75,
            PP: 20,
        },
        "Slash": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Sleep Powder": {
            type: "Grass",
            effects: [],
            accuracy: 75,
            PP: 15,
        },
        "Sludge": {
            type: "Poison",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Smog": {
            type: "Poison",
            effects: [],
            accuracy: 70,
            PP: 20,
        },
        "Smokescreen": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Soft-Boiled": {
            type: "Normal",
            effects: [],
            PP: 10,
        },
        "Solar Beam": {
            type: "Grass",
            effects: [],
            accuracy: 100,
            PP: 10,
        },
        "Sonic Boom": {
            type: "Normal",
            effects: [],
            accuracy: 90,
            PP: 20,
        },
        "Spike Cannon": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Splash": {
            type: "Normal",
            effects: [],
            PP: 40,
        },
        "Spore": {
            type: "Grass",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Stomp": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Strength": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 15,
            "partyActivate": Actions.prototype.partyActivateStrength,
            "characterName": "StrengthBoulder",
            "requiredBadge": "Rainbow"
        } as IHMMoveSchema,
        "String Shot": {
            type: "Bug",
            effects: [],
            accuracy: 95,
            PP: 40,
        },
        "Struggle": {
            type: "Normal",
            effects: [],
            PP: 10,
        },
        "Stun Spore": {
            type: "Grass",
            effects: [],
            accuracy: 75,
            PP: 30,
        },
        "Submission": {
            type: "Fighting",
            effects: [],
            accuracy: 80,
            PP: 25,
        },
        "Substitute": {
            type: "Normal",
            effects: [],
            PP: 10,
        },
        "Super Fang": {
            type: "Normal",
            effects: [],
            accuracy: 90,
            PP: 10,
        },
        "Supersonic": {
            type: "Normal",
            effects: [],
            accuracy: 55,
            PP: 20,
        },
        "Surf": {
            type: "Water",
            effects: [],
            accuracy: 100,
            PP: 15,
            "partyActivate": Actions.prototype.partyActivateSurf,
            "characterName": "WaterEdge",
            "requiredBadge": "Soul"
        } as IHMMoveSchema,
        "Swift": {
            type: "Normal",
            effects: [],
            PP: 20,
        },
        "Swords Dance": {
            type: "Normal",
            effects: [],
            PP: 30,
        },
        "Tackle": {
            type: "Normal",
            effects: [
                {
                    damage: 40,
                    target: EffectTarget.defender,
                    type: "damage"
                }
            ],
            accuracy: 95,
            PP: 35,
        },
        "Tail Whip": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 30,
        },
        "Take Down": {
            type: "Normal",
            effects: [],
            accuracy: 85,
            PP: 20,
        },
        "Teleport": {
            type: "Psychic",
            effects: [],
            PP: 20,
        },
        "Thrash": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Thunder": {
            type: "Electric",
            effects: [],
            accuracy: 70,
            PP: 10,
        },
        "Thunder Punch": {
            type: "Electric",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Thunder Shock": {
            type: "Electric",
            effects: [],
            accuracy: 100,
            PP: 30,
        },
        "Thunder Wave": {
            type: "Electric",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Thunderbolt": {
            type: "Electric",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Toxic": {
            type: "Poison",
            effects: [],
            accuracy: 85,
            PP: 10,
        },
        "Transform": {
            type: "Normal",
            effects: [],
            PP: 10,
        },
        "Tri Attack": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 10,
        },
        "Twineedle": {
            type: "Bug",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Vice Grip": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 30,
        },
        "Vine Whip": {
            type: "Grass",
            effects: [],
            accuracy: 100,
            PP: 10,
        },
        "Water Gun": {
            type: "Water",
            effects: [],
            accuracy: 100,
            PP: 25,
        },
        "Waterfall": {
            type: "Water",
            effects: [],
            accuracy: 100,
            PP: 15,
        },
        "Whirlwind": {
            type: "Normal",
            effects: [],
            accuracy: 100,
            PP: 20,
        },
        "Wing Attack": {
            type: "Flying",
            effects: [],
            accuracy: 100,
            PP: 35,
        },
        "Withdraw": {
            type: "Water",
            effects: [],
            PP: 40,
        },
        "Wrap": {
            type: "Normal",
            effects: [],
            accuracy: 85,
            PP: 20,
        }
    };
}
