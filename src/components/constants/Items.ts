import { Cycling } from "../Cycling";
import { Fishing } from "../Fishing";

/**
 * A static description of an in-game item.
 */
export interface IItemSchema {
    /**
     * Callback for when the item is used in the bag.
     */
    bagActivate?: Function;

    /**
     * What category of items this falls under.
     */
    category: "Key" | "Main" | "Pokeball";

    /**
     * A short description of what the item does, such as "Cures Poison".
     */
    effect: string;

    /**
     * An error message displayed when you try to use an item at a time when you're not allowed.
     */
    error?: string;

    /**
     * How much the item costs in a store.
     */
    price?: number;
}

/**
 * The type of rod that is being used.
 */
export interface IRod extends IItemSchema {
    /**
     * The type of rod used. Can be old, good, or super.
     * @todo Make type explicitly "old" | "good" | "super".
     */
    type: string;

    /**
     * The name of the rod used.
     */
    title: string;
}

/**
 * An in-game Pokeball item.
 */
export interface IBattleBall extends IItemSchema {
    /**
     * A maximum probability N for the canCatchPokemon equation.
     */
    probabilityMax: number;

    /**
     * A multiplier for the opponent Pokemon's HP in canCatchPokemon.
     */
    rate: number;

    /**
     * The type of ball, such as "Great" or "Master".
     */
    type: string;
}

/**
 * Information on items.
 */
export class Items {
    /**
     * All known items, keyed by English name.
     */
    public readonly byName: { [i: string]: IItemSchema } = {
        "Antidote": {
            "price": 100,
            "effect": "Cures Poison",
            "category": "Main"
        },
        "Awakening": {
            "price": 250,
            "effect": "Cures Sleep",
            "category": "Main"
        },
        "Burn Heal": {
            "price": 250,
            "effect": "Cures Burn",
            "category": "Main"
        },
        "Calcium": {
            "price": 9800,
            "effect": "Raises Special Attack",
            "category": "Main"
        },
        "Carbos": {
            "price": 9800,
            "effect": "Raises Speed",
            "category": "Main"
        },
        "Dire Hit": {
            "price": 650,
            "effect": "Raises chances of a Critical Hit in battle",
            "category": "Main"
        },
        "Elixir": {
            "price": undefined,
            "effect": "Restores 10PP to each move",
            "category": "Main"
        },
        "Escape Rope": {
            "price": 550,
            "effect": "Escape from the current cave",
            "category": "Main"
        },
        "Ether": {
            "effect": "Restores 10PP of one move",
            "category": "Main"
        },
        "Fire Stone": {
            "price": 2100,
            "effect": "Evolves Eevee, Growlithe and Vulpix",
            "category": "Main"
        },
        "Fresh Water": {
            "price": 200,
            "effect": "Recovers 50HP",
            "category": "Main"
        },
        "Full Heal": {
            "price": 600,
            "effect": "Cures all status ailments",
            "category": "Main"
        },
        "Full Restore": {
            "price": 3000,
            "effect": "Restores all HP and cures all status ailments",
            "category": "Main"
        },
        "Guard Spec": {
            "price": 700,
            "effect": "Prevents stat reduction in a battle",
            "category": "Main"
        },
        "HP Up": {
            "price": 9800,
            "effect": "Raises max HP",
            "category": "Main"
        },
        "Hyper Potion": {
            "price": 1200,
            "effect": "Restores 200HP",
            "category": "Main"
        },
        "Ice Heal": {
            "price": 250,
            "effect": "Cures Freeze",
            "category": "Main"
        },
        "Iron": {
            "price": 9800,
            "effect": "Raises Defense",
            "category": "Main"
        },
        "Leaf Stone": {
            "effect": "Evolves Exeggcute, Gloom, and Weepinbell",
            "category": "Main"
        },
        "Lemonade": {
            "price": 350,
            "effect": "Restores 80HP",
            "category": "Main"
        },
        "Max Elixir": {
            "effect": "Restores all PP to all moves",
            "category": "Main"
        },
        "Max Ether": {
            "effect": "Restores all PP to one move",
            "category": "Main"
        },
        "Max Potion": {
            "price": 2500,
            "effect": "Restores all HP",
            "category": "Main"
        },
        "Max Repel": {
            "price": 700,
            "effect": "Repels weaker Pokemon for 250 steps",
            "category": "Main"
        },
        "Max Revive": {
            "effect": "Revives a fainted Pokemon to max HP",
            "category": "Main"
        },
        "Moon Stone": {
            "effect": "Evolves Clefairy, Jigglypuff, Nidorina and Nidorino",
            "category": "Main"
        },
        "Nugget": {
            "effect": "Sell for money",
            "category": "Main"
        },
        "Paralyz Heal": {
            "price": 200,
            "effect": "Cures Paralysis",
            "category": "Main"
        },
        "Poke Doll": {
            "price": 1000,
            "effect": "Trade for TM31 in Saffron, Allows escape from battle",
            "category": "Main"
        },
        "Potion": {
            "price": 300,
            "effect": "Restores 20HP",
            "category": "Main"
        },
        "PP Up": {
            "effect": "Increases the max PP of a move",
            "category": "Main"
        },
        "Protein": {
            "price": 9800,
            "effect": "Raises Attack",
            "category": "Main"
        },
        "Rare Candy": {
            "effect": "Raises a Pokemon's level by one",
            "category": "Main"
        },
        "Repel": {
            "price": 350,
            "effect": "Repels weaker Pokemon for 100 steps",
            "category": "Main"
        },
        "Revive": {
            "price": 1500,
            "effect": "Recovers a fainted Pokemon to half max HP",
            "category": "Main"
        },
        "Soda Pop": {
            "price": 300,
            "effect": "Recovers 80HP",
            "category": "Main"
        },
        "Super Potion": {
            "price": 700,
            "effect": "Restores 50HP",
            "category": "Main"
        },
        "Super Repel": {
            "price": 500,
            "effect": "Repels weaker Pokemon for 200 steps",
            "category": "Main"
        },
        "Thunderstone": {
            "price": 2100,
            "effect": "Evolves Eevee and Pikachu",
            "category": "Main"
        },
        "Water Stone": {
            "price": 2100,
            "effect": "Evolves Eevee, Poliwag, Shellder and Staryu",
            "category": "Main"
        },
        "X Accuracy": {
            "price": 950,
            "effect": "Raises accuracy in a battle",
            "category": "Main"
        },
        "X Attack": {
            "price": 500,
            "effect": "Raises attack in a battle",
            "category": "Main"
        },
        "X Defend": {
            "price": 550,
            "effect": "Raises defense in a battle",
            "category": "Main"
        },
        "X Special": {
            "price": 350,
            "effect": "Raises special in a battle",
            "category": "Main"
        },
        "X Speed": {
            "price": 350,
            "effect": "Raises speed in a battle",
            "category": "Main"
        },
        "Pokeball": {
            "price": 200,
            "effect": "Catches Pokemon",
            "category": "Pokeball"
        },
        "Great Ball": {
            "price": 600,
            "effect": "Greater chance of catching Pokemon than a Pokeball",
            "category": "Pokeball"
        },
        "Ultra Ball": {
            "price": 1200,
            "effect": "Greater chance of catching Pokemon than a Great Ball",
            "category": "Pokeball"
        },
        "Master Ball": {
            "effect": "Always catches Pokemon",
            "category": "Pokeball"
        },
        "Safari Ball": {
            "effect": "A special ball for use in the Safari Zone",
            "category": "Pokeball"
        },
        "Bicycle": {
            "effect": "Allows travel at double speed",
            "category": "Key",
            "error": "No cycling allowed here.",
            "bagActivate": Cycling.prototype.toggleCycling
        },
        "Bike Voucher": {
            "effect": "Redeem at Cerulean Bike Shop for a free Bicycle",
            "category": "Key"
        },
        "Card Key": {
            "effect": "Unlocks doors in the Silph Co. building",
            "category": "Key"
        },
        "Coin Case": {
            "effect": "Holds 9999 Casino coins for use at Celadon Casino",
            "category": "Key"
        },
        "Dome Fossil": {
            "effect": "Used to clone Kabuto at the Cinnabar Island Laboratory",
            "category": "Key"
        },
        "EXP. All": {
            "effect": "Divides EXP from battle between all party members",
            "category": "Key"
        },
        "Gold Teeth": {
            "effect": "Return to Safari Zone Warden and receive HM04",
            "category": "Key"
        },
        "Good Rod": {
            "effect": "Fish for medium-levelled water Pokemon",
            "category": "Key",
            "bagActivate": Fishing.prototype.startFishing,
            "title": "Good Rod",
            "type": "good"
        } as IRod,
        "Helix Fossil": {
            "effect": "Used to clone Omanyte at the Cinnabar Island Laboratory",
            "category": "Key"
        },
        "Itemfinder": {
            "effect": "Detects hidden items in close proximity",
            "category": "Key"
        },
        "Lift Key": {
            "effect": "Unlocks the elevator in the Team Rocket Hideout, Celadon City",
            "category": "Key"
        },
        "Oak's Parcel": {
            "effect": "Deliver to Prof. Oak in Pallet Town and receive a Pokedex",
            "category": "Key"
        },
        "Old Amber": {
            "effect": "Used to clone Aerodactyl at the Cinnabar Island Laboratoy",
            "category": "Key"
        },
        "Old Rod": {
            "effect": "Fish for low-levelled water Pokemon",
            "category": "Key",
            "bagActivate": Fishing.prototype.startFishing,
            "title": "Old Rod",
            "type": "old"
        } as IRod,
        "Pokeflute": {
            "effect": "Awakens sleeping Pokemon",
            "category": "Key"
        },
        "Pokedex": {
            "effect": "Records all information about Pokemon seen and caught",
            "category": "Key"
        },
        "S.S. Ticket": {
            "effect": "Use to board the S.S. Anne in Vermilion City",
            "category": "Key"
        },
        "Secret Key": {
            "effect": "Unlocks Blaine's Gym on Cinnabar Island",
            "category": "Key"
        },
        "Silph Scope": {
            "effect": "Allows Ghosts to be detected in the Pokemon Tower, Lavendar Town",
            "category": "Key"
        },
        "Super Rod": {
            "effect": "Fish for high-levelled water Pokemon",
            "category": "Key",
            "bagActivate": Fishing.prototype.startFishing,
            "title": "Super Rod",
            "type": "super"
        } as IRod,
        "Town Map": {
            "effect": "Shows your position in the Pokemon World",
            "category": "Key"
        }
    };
}
