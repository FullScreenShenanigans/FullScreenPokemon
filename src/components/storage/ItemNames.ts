import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Keys for ItemsHoldr items.
 */
export class ItemNames<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Whether game data should be saved on frequent important events.
     */
    public readonly autoSave = "autoSave";

    /**
     * Which area the the player most recently entered.
     */
    public readonly area = "area";

    /**
     * Which gym leader badges the player has earned.
     */
    public readonly badges = "badges";

    /**
     * Whether a game has been started.
     */
    public readonly gameStarted = "gameStarted";

    /**
     * Whether the player has a Pokedex.
     */
    public readonly hasPokedex = "hasPokedex";

    /**
     * Items owned by the player.
     */
    public readonly items = "items";

    /**
     * Map and location of the last Pokecenter equivalent visited by the player.
     */
    public readonly lastPokecenter = "lastPokecenter";

    /**
     * Which location the the player most recently entered.
     */
    public readonly location = "location";

    /**
     * Which map the the player most recently entered.
     */
    public readonly map = "map";

    /**
     * How much money the player has earned.
     */
    public readonly money = "money";

    /**
     * Chosen name of the player.
     */
    public readonly name = "name";

    /**
     * Chosen name of the rival.
     */
    public readonly nameRival = "nameRival";

    /**
     * Restore point for a previous save while a new game is played.
     */
    public readonly oldLocalStorage = "oldLocalStorage";

    /**
     * Pokemon info stored in the player's Pokedex.
     */
    public readonly pokedex = "pokedex";

    /**
     * Pokemon in the player's party.
     */
    public readonly pokemonInParty = "pokemonInParty";

    /**
     * Pokemon in the player's PC storage.
     */
    public readonly pokemonInPC = "pokemonInPC";

    /**
     * Item name the player has listed under select.
     */
    public readonly selectItem = "selectItem";

    /**
     * List of StateHoldr collection keys.
     */
    public readonly stateCollectionKeys = "stateCollectionKeys";

    /**
     * Starter Pokemon chosen by the player.
     */
    public readonly starter = "starter";

    /**
     * Starter Pokemon chosen by the rival.
     */
    public readonly starterRival = "starterRival";

    /**
     * How much time had passed at most recent save.
     */
    public readonly time = "time";
}
