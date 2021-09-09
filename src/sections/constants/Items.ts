import { Cycling } from "../Cycling";
import { Fishing } from "../Fishing";
import { Actor } from "../Actors";

export type OnBagActivate = (actor: Actor, itemSchema: ItemSchema) => void;

/**
 * A static description of an in-game item.
 */
export interface ItemSchema {
    /**
     * Callback for when the item is used in the bag.
     */
    bagActivate?: OnBagActivate;

    /**
     * What category of items this falls under.
     */
    category: "HM" | "Key" | "Main" | "Pokeball" | "TM";

    /**
     * A short description of what the item does, such as "Cures Poison".
     */
    effect: string;

    /**
     * An error message displayed when you try to use an item at a time when you're not allowed.
     */
    error?: string;

    /**
     * Name of item.
     */
    name: string[];

    /**
     * How much the item costs in a store.
     */
    price?: number;
}

/**
 * Type identifier for a rod.
 */
export type RodType = "old" | "good" | "super";

/**
 * A type of rod that that can be used.
 */
export interface Rod extends ItemSchema {
    /**
     * Type of rod used.
     */
    type: RodType;

    /**
     * Name of the rod used.
     */
    title: string;
}

/**
 * An in-game Pokeball item.
 */
export interface BattleBall extends ItemSchema {
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
    public readonly byName: { [i: string]: ItemSchema } = {
        Antidote: {
            price: 100,
            effect: "Cures Poison",
            category: "Main",
            name: "Antidote".split(""),
        },
        Awakening: {
            price: 250,
            effect: "Cures Sleep",
            category: "Main",
            name: "Awakening".split(""),
        },
        "Burn Heal": {
            price: 250,
            effect: "Cures Burn",
            category: "Main",
            name: "Burn Heal".split(""),
        },
        Calcium: {
            price: 9800,
            effect: "Raises Special Attack",
            category: "Main",
            name: "Calcium".split(""),
        },
        Carbos: {
            price: 9800,
            effect: "Raises Speed",
            category: "Main",
            name: "Carbos".split(""),
        },
        "Dire Hit": {
            price: 650,
            effect: "Raises chances of a Critical Hit in battle",
            category: "Main",
            name: "Dire Hit".split(""),
        },
        Elixer: {
            price: undefined,
            effect: "Restores 10PP to each move",
            category: "Main",
            name: "Elixer".split(""),
        },
        "Escape Rope": {
            price: 550,
            effect: "Escape from the current cave",
            category: "Main",
            name: "Escape Rope".split(""),
        },
        Ether: {
            effect: "Restores 10PP of one move",
            category: "Main",
            name: "Ether".split(""),
        },
        "Fire Stone": {
            price: 2100,
            effect: "Evolves Eevee, Growlithe and Vulpix",
            category: "Main",
            name: "Fire Stone".split(""),
        },
        "Fresh Water": {
            price: 200,
            effect: "Recovers 50HP",
            category: "Main",
            name: "Fresh Water".split(""),
        },
        "Full Heal": {
            price: 600,
            effect: "Cures all status ailments",
            category: "Main",
            name: "Full Heal".split(""),
        },
        "Full Restore": {
            price: 3000,
            effect: "Restores all HP and cures all status ailments",
            category: "Main",
            name: "Full Restore".split(""),
        },
        "Guard Spec": {
            price: 700,
            effect: "Prevents stat reduction in a battle",
            category: "Main",
            name: "Guard Spec".split(""),
        },
        "HP Up": {
            price: 9800,
            effect: "Raises max HP",
            category: "Main",
            name: "HP Up".split(""),
        },
        "Hyper Potion": {
            price: 1200,
            effect: "Restores 200HP",
            category: "Main",
            name: "Hyper Potion".split(""),
        },
        "Ice Heal": {
            price: 250,
            effect: "Cures Freeze",
            category: "Main",
            name: "Ice Heal".split(""),
        },
        Iron: {
            price: 9800,
            effect: "Raises Defense",
            category: "Main",
            name: "Iron".split(""),
        },
        "Leaf Stone": {
            effect: "Evolves Exeggcute, Gloom, and Weepinbell",
            category: "Main",
            name: "Leaf Stone".split(""),
        },
        Lemonade: {
            price: 350,
            effect: "Restores 80HP",
            category: "Main",
            name: "Lemonade".split(""),
        },
        "Max Elixer": {
            effect: "Restores all PP to all moves",
            category: "Main",
            name: "Max Elixer".split(""),
        },
        "Max Ether": {
            effect: "Restores all PP to one move",
            category: "Main",
            name: "Max Ether".split(""),
        },
        "Max Potion": {
            price: 2500,
            effect: "Restores all HP",
            category: "Main",
            name: "Max Potion".split(""),
        },
        "Max Repel": {
            price: 700,
            effect: "Repels weaker Pokemon for 250 steps",
            category: "Main",
            name: "Max Repel".split(""),
        },
        "Max Revive": {
            effect: "Revives a fainted Pokemon to max HP",
            category: "Main",
            name: "Max Revive".split(""),
        },
        "Moon Stone": {
            effect: "Evolves Clefairy, Jigglypuff, Nidorina and Nidorino",
            category: "Main",
            name: "Moon Stone".split(""),
        },
        Nugget: {
            effect: "Sell for money",
            category: "Main",
            name: "Nugget".split(""),
        },
        "Parlyz Heal": {
            price: 200,
            effect: "Cures Paralysis",
            category: "Main",
            name: "Parlyz Heal".split(""),
        },
        "Poke Doll": {
            price: 1000,
            effect: "Trade for TM31 in Saffron, Allows escape from battle",
            category: "Main",
            name: "Poke Doll".split(""),
        },
        Potion: {
            price: 300,
            effect: "Restores 20HP",
            category: "Main",
            name: "Potion".split(""),
        },
        "PP Up": {
            effect: "Increases the max PP of a move",
            category: "Main",
            name: "PP Up".split(""),
        },
        Protein: {
            price: 9800,
            effect: "Raises Attack",
            category: "Main",
            name: "Protein".split(""),
        },
        "Rare Candy": {
            effect: "Raises a Pokemon's level by one",
            category: "Main",
            name: "Rare Candy".split(""),
        },
        Repel: {
            price: 350,
            effect: "Repels weaker Pokemon for 100 steps",
            category: "Main",
            name: "Repel".split(""),
        },
        Revive: {
            price: 1500,
            effect: "Recovers a fainted Pokemon to half max HP",
            category: "Main",
            name: "Revive".split(""),
        },
        "Soda Pop": {
            price: 300,
            effect: "Recovers 80HP",
            category: "Main",
            name: "Soda Pop".split(""),
        },
        "Super Potion": {
            price: 700,
            effect: "Restores 50HP",
            category: "Main",
            name: "Super Potion".split(""),
        },
        "Super Repel": {
            price: 500,
            effect: "Repels weaker Pokemon for 200 steps",
            category: "Main",
            name: "Super Repel".split(""),
        },
        Thunderstone: {
            price: 2100,
            effect: "Evolves Eevee and Pikachu",
            category: "Main",
            name: "Thunderstone".split(""),
        },
        "Water Stone": {
            price: 2100,
            effect: "Evolves Eevee, Poliwag, Shellder and Staryu",
            category: "Main",
            name: "Water Stone".split(""),
        },
        "X Accuracy": {
            price: 950,
            effect: "Raises accuracy in a battle",
            category: "Main",
            name: "X Accuracy".split(""),
        },
        "X Attack": {
            price: 500,
            effect: "Raises attack in a battle",
            category: "Main",
            name: "X Attack".split(""),
        },
        "X Defend": {
            price: 550,
            effect: "Raises defense in a battle",
            category: "Main",
            name: "X Defend".split(""),
        },
        "X Special": {
            price: 350,
            effect: "Raises special in a battle",
            category: "Main",
            name: "X Special".split(""),
        },
        "X Speed": {
            price: 350,
            effect: "Raises speed in a battle",
            category: "Main",
            name: "X Speed".split(""),
        },
        Pokeball: {
            price: 200,
            effect: "Catches Pokemon",
            category: "Pokeball",
            name: "Pokeball".split(""),
        },
        "Great Ball": {
            price: 600,
            effect: "Greater chance of catching Pokemon than a Pokeball",
            category: "Pokeball",
            name: "Great Ball".split(""),
        },
        "Ultra Ball": {
            price: 1200,
            effect: "Greater chance of catching Pokemon than a Great Ball",
            category: "Pokeball",
            name: "Ultra Ball".split(""),
        },
        "Master Ball": {
            effect: "Always catches Pokemon",
            category: "Pokeball",
            name: "Master Ball".split(""),
        },
        "Safari Ball": {
            effect: "A special ball for use in the Safari Zone",
            category: "Pokeball",
            name: "Safari Ball".split(""),
        },
        Bicycle: {
            effect: "Allows travel at double speed",
            category: "Key",
            error: "No cycling allowed here.",
            bagActivate: Cycling.prototype.toggleCycling,
            name: "Bicycle".split(""),
        },
        "Bike Voucher": {
            effect: "Redeem at Cerulean Bike Shop for a free Bicycle",
            category: "Key",
            name: "Bike Voucher".split(""),
        },
        "Card Key": {
            effect: "Unlocks doors in the Silph Co. building",
            category: "Key",
            name: "Card Key".split(""),
        },
        "Coin Case": {
            effect: "Holds 9999 Casino coins for use at Celadon Casino",
            category: "Key",
            name: "Coin Case".split(""),
        },
        "Dome Fossil": {
            effect: "Used to clone Kabuto at the Cinnabar Island Laboratory",
            category: "Key",
            name: "Dome Fossil".split(""),
        },
        "EXP. All": {
            effect: "Divides EXP from battle between all party members",
            category: "Key",
            name: "Exp. All".split(""),
        },
        "Gold Teeth": {
            effect: "Return to Safari Zone Warden and receive HM04",
            category: "Key",
            name: "Gold Teeth".split(""),
        },
        "Good Rod": {
            effect: "Fish for medium-levelled water Pokemon",
            category: "Key",
            bagActivate: Fishing.prototype.startFishing,
            title: "Good Rod",
            type: "good",
            name: "Good Rod".split(""),
        } as Rod,
        "Helix Fossil": {
            effect: "Used to clone Omanyte at the Cinnabar Island Laboratory",
            category: "Key",
            name: "Helix Fossil".split(""),
        },
        Itemfinder: {
            effect: "Detects hidden items in close proximity",
            category: "Key",
            name: "Itemfinder".split(""),
        },
        "Lift Key": {
            effect: "Unlocks the elevator in the Team Rocket Hideout, Celadon City",
            category: "Key",
            name: "Lift key".split(""),
        },
        "Oak's Parcel": {
            effect: "Deliver to Prof. Oak in Pallet Town and receive a Pokedex",
            category: "Key",
            name: "Oak's Parcel".split(""),
        },
        "Old Amber": {
            effect: "Used to clone Aerodactyl at the Cinnabar Island Laboratoy",
            category: "Key",
            name: "Old Amber".split(""),
        },
        "Old Rod": {
            effect: "Fish for low-levelled water Pokemon",
            category: "Key",
            bagActivate: Fishing.prototype.startFishing,
            title: "Old Rod",
            type: "old",
            name: "Old Rod".split(""),
        } as Rod,
        Pokeflute: {
            effect: "Awakens sleeping Pokemon",
            category: "Key",
            name: "Pokeflute".split(""),
        },
        Pokedex: {
            effect: "Records all information about Pokemon seen and caught",
            category: "Key",
            name: "Pokedex".split(""),
        },
        "S.S. Ticket": {
            effect: "Use to board the S.S. Anne in Vermilion City",
            category: "Key",
            name: "S.S. Ticket".split(""),
        },
        "Secret Key": {
            effect: "Unlocks Blaine's Gym on Cinnabar Island",
            category: "Key",
            name: "Secret Key".split(""),
        },
        "Silph Scope": {
            effect: "Allows Ghosts to be detected in the Pokemon Tower, Lavendar Town",
            category: "Key",
            name: "Silph Scope".split(""),
        },
        "Super Rod": {
            effect: "Fish for high-levelled water Pokemon",
            category: "Key",
            bagActivate: Fishing.prototype.startFishing,
            title: "Super Rod",
            type: "super",
            name: "Super Rod".split(""),
        } as Rod,
        "Town Map": {
            effect: "Shows your position in the Pokemon World",
            category: "Key",
            name: "Town Map".split(""),
        },
        HM01: {
            effect: "Cut",
            category: "HM",
            name: "HM01".split(""),
        },
        HM02: {
            effect: "Fly",
            category: "HM",
            name: "HM02".split(""),
        },
        HM03: {
            effect: "Surf",
            category: "HM",
            name: "HM03".split(""),
        },
        HM04: {
            effect: "Strength",
            category: "HM",
            name: "HM04".split(""),
        },
        HM05: {
            effect: "Flash",
            category: "HM",
            name: "HM05".split(""),
        },
        TM01: {
            effect: "Mega Punch",
            category: "TM",
            name: "TM01".split(""),
        },
        TM02: {
            effect: "Razor Wnd",
            category: "TM",
            name: "TM02".split(""),
        },
        TM03: {
            effect: "Swords Dance",
            category: "TM",
            name: "TM03".split(""),
        },
        TM04: {
            effect: "Whirlwind",
            category: "TM",
            name: "TM04".split(""),
        },
        TM05: {
            effect: "Mega Kick",
            category: "TM",
            name: "TM05".split(""),
        },
        TM06: {
            effect: "Toxic",
            category: "TM",
            name: "TM06".split(""),
        },
        TM07: {
            effect: "Horn Drill",
            category: "TM",
            name: "TM07".split(""),
        },
        TM08: {
            effect: "Body Slam",
            category: "TM",
            name: "TM08".split(""),
        },
        TM09: {
            effect: "Take Down",
            category: "TM",
            name: "TM09".split(""),
        },
        TM10: {
            effect: "Double-Edge",
            category: "TM",
            name: "TM10".split(""),
        },
        TM11: {
            effect: "BubbleBeam",
            category: "TM",
            name: "TM11".split(""),
        },
        TM12: {
            effect: "Water Gun",
            category: "TM",
            name: "TM12".split(""),
        },
        TM13: {
            effect: "Ice Beam",
            category: "TM",
            name: "TM13".split(""),
        },
        TM14: {
            effect: "Blizzard",
            category: "TM",
            name: "TM14".split(""),
        },
        TM15: {
            effect: "Hyper Beam",
            category: "TM",
            name: "TM15".split(""),
        },
        TM16: {
            effect: "Pay Day",
            category: "TM",
            name: "TM16".split(""),
        },
        TM17: {
            effect: "Submission",
            category: "TM",
            name: "TM17".split(""),
        },
        TM18: {
            effect: "Counter",
            category: "TM",
            name: "TM18".split(""),
        },
        TM19: {
            effect: "Seismic Toss",
            category: "TM",
            name: "TM19".split(""),
        },
        TM20: {
            effect: "Rage",
            category: "TM",
            name: "TM20".split(""),
        },
        TM21: {
            effect: "Mega Drain",
            category: "TM",
            name: "TM21".split(""),
        },
        TM22: {
            effect: "SolarBeam",
            category: "TM",
            name: "TM22".split(""),
        },
        TM23: {
            effect: "Dragon Rage",
            category: "TM",
            name: "TM23".split(""),
        },
        TM24: {
            effect: "Thunderbolt",
            category: "TM",
            name: "TM24".split(""),
        },
        TM25: {
            effect: "Thunder",
            category: "TM",
            name: "TM25".split(""),
        },
        TM26: {
            effect: "Earthquake",
            category: "TM",
            name: "TM26".split(""),
        },
        TM27: {
            effect: "Fissure",
            category: "TM",
            name: "TM27".split(""),
        },
        TM28: {
            effect: "Dig",
            category: "TM",
            name: "TM28".split(""),
        },
        TM29: {
            effect: "Psychic",
            category: "TM",
            name: "TM29".split(""),
        },
        TM30: {
            effect: "Teleport",
            category: "TM",
            name: "TM30".split(""),
        },
        TM31: {
            effect: "Mimic",
            category: "TM",
            name: "TM31".split(""),
        },
        TM32: {
            effect: "Double Team",
            category: "TM",
            name: "TM32".split(""),
        },
        TM33: {
            effect: "Reflect",
            category: "TM",
            name: "TM33".split(""),
        },
        TM34: {
            effect: "Bide",
            category: "TM",
            name: "TM34".split(""),
        },
        TM35: {
            effect: "Metronome",
            category: "TM",
            name: "TM35".split(""),
        },
        TM36: {
            effect: "Selfdestruct",
            category: "TM",
            name: "TM36".split(""),
        },
        TM37: {
            effect: "Egg Bomb",
            category: "TM",
            name: "TM37".split(""),
        },
        TM38: {
            effect: "Fire Blast",
            category: "TM",
            name: "TM38".split(""),
        },
        TM39: {
            effect: "Swift",
            category: "TM",
            name: "TM39".split(""),
        },
        TM40: {
            effect: "Skull Bash",
            category: "TM",
            name: "TM40".split(""),
        },
        TM41: {
            effect: "Softboiled",
            category: "TM",
            name: "TM41".split(""),
        },
        TM42: {
            effect: "Dream Eater",
            category: "TM",
            name: "TM42".split(""),
        },
        TM43: {
            effect: "Sky Attack",
            category: "TM",
            name: "TM43".split(""),
        },
        TM44: {
            effect: "Rest",
            category: "TM",
            name: "TM44".split(""),
        },
        TM45: {
            effect: "Thunder Wave",
            category: "TM",
            name: "TM45".split(""),
        },
        TM46: {
            effect: "Psywave",
            category: "TM",
            name: "TM46".split(""),
        },
        TM47: {
            effect: "Explosion",
            category: "TM",
            name: "TM47".split(""),
        },
        TM48: {
            effect: "Rock Slide",
            category: "TM",
            name: "TM48".split(""),
        },
        TM49: {
            effect: "Tri Attack",
            category: "TM",
            name: "TM49".split(""),
        },
        TM50: {
            effect: "Substitute",
            category: "TM",
            name: "TM50".split(""),
        },
    };
}
