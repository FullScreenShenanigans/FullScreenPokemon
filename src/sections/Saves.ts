import { Section } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { PokedexListingStatus } from "./Constants";
import { Pokedex, PokedexInformation, PokemonListing } from "./constants/Pokemon";
import { StorageItems } from "./Storage";
import { Character } from "./Actors";

/**
 * Container for holding the states of objects in the game.
 */
export interface StateHistory {
    [i: string]: [any];
}

/**
 * An object for saving this object's state history.
 */
export interface StateSaveable {
    /**
     * Holds the states of an object in the game.
     */
    state?: StateHistory;
}

/**
 * A general description of a save file.
 */
export interface SaveFile {
    [i: string]: any;
}

/**
 * Saves and load game data.
 */
export class Saves extends Section<FullScreenPokemon> {
    /**
     * Clears the data saved in localStorage and saves it in a new object in localStorage
     * upon a new game being started.
     */
    public clearSavedData(): void {
        const oldLocalStorage: StorageItems & {
            [i: string]: any;
        } = this.game.itemsHolder.exportItems();

        const collectionKeys: string[] = this.game.itemsHolder.getItem(
            this.game.storage.names.stateCollectionKeys
        );
        if (collectionKeys) {
            for (const collection of collectionKeys) {
                oldLocalStorage[collection] = this.game.itemsHolder.getItem(
                    collection as keyof StorageItems
                );
            }
        }

        for (const key of Object.keys(oldLocalStorage)) {
            this.game.itemsHolder.removeItem(key as keyof StorageItems);
        }

        this.game.itemsHolder.clear();
        this.game.itemsHolder.setItem(this.game.storage.names.oldLocalStorage, oldLocalStorage);
        this.game.itemsHolder.saveItem(this.game.storage.names.oldLocalStorage);
        this.game.itemsHolder.setItem(this.game.storage.names.stateCollectionKeys, []);
    }

    /**
     * Checks to see if oldLocalStorage is defined in localStorage; if that is true and a prior game
     * hasn't been saved, the data is restored under localStorage.
     */
    public checkForOldStorageData(): void {
        if (
            !this.game.itemsHolder.getItem(this.game.storage.names.oldLocalStorage) ||
            this.game.itemsHolder.getItem(this.game.storage.names.gameStarted)
        ) {
            return;
        }

        const oldLocalStorage = this.game.itemsHolder.getItem(
            this.game.storage.names.oldLocalStorage
        );
        if (oldLocalStorage !== undefined) {
            for (const key in oldLocalStorage) {
                if (!{}.hasOwnProperty.call(oldLocalStorage, key)) {
                    continue;
                }

                const prefix = this.game.stateHolder.getPrefix();

                if (key.slice(0, prefix.length) === prefix) {
                    this.game.stateHolder.setCollection(
                        key.slice(prefix.length),
                        oldLocalStorage[key as keyof StorageItems]
                    );
                } else {
                    this.game.itemsHolder.setItem(
                        key as keyof StorageItems,
                        oldLocalStorage[key as keyof StorageItems]
                    );
                }
            }
        }

        this.game.itemsHolder.saveAll();
    }

    /**
     * Saves all persistant information about the current game state.
     *
     * @param showText   Whether to display a status menu (by default, false).
     */
    public saveGame(showText?: boolean): void {
        const ticksRecorded: number = this.game.fpsAnalyzer.getRecordedTicks();

        this.game.itemsHolder.increase(
            this.game.storage.names.time,
            ticksRecorded - this.game.ticksElapsed
        );
        this.game.ticksElapsed = ticksRecorded;

        this.saveCharacterPositions();
        this.game.stateHolder.saveCollection();
        this.game.itemsHolder.saveAll();

        if (!showText) {
            return;
        }

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog("GeneralText", ["Now saving..."]);

        this.game.timeHandler.addEvent((): void => this.game.menuGrapher.deleteAllMenus(), 49);
    }

    /**
     * Automatically saves the game if auto-save is enabled.
     */
    public autoSaveIfEnabled(): void {
        if (
            this.game.itemsHolder.getAutoSave() &&
            !this.game.scenePlayer.getCutscene() &&
            this.game.areaSpawner.getMapName() !== "Blank"
        ) {
            this.saveGame(false);
        }
    }

    /**
     * Saves current game state and downloads
     * it onto the client's computer as a JSON file.
     */
    public downloadSaveGame(): void {
        this.saveGame();

        const link: HTMLAnchorElement = document.createElement("a");
        link.setAttribute("download", "FullScreenPokemon Save " + Date.now() + ".json");
        link.setAttribute(
            "href",
            "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(this.game.itemsHolder.exportItems()))
        );

        this.game.container.appendChild(link);
        link.click();
        this.game.container.removeChild(link);
    }

    /**
     * Loads JSON game data from a data string and sets it as the game state,
     * then starts gameplay.
     *
     * @param dataRaw   Raw data to be parsed as JSON.
     */
    public loadRawData(dataRaw: string): void {
        this.loadSaveFile(JSON.parse(dataRaw));
    }

    /**
     * Loads JSON game data and sets it as the game state, then starts gameplay.
     *
     * @param dataRaw   Raw data to be parsed as JSON.
     */
    public loadSaveFile(data: SaveFile): void {
        this.clearSavedData();
        const prefix = this.game.stateHolder.getPrefix();

        for (const key in data) {
            if (!{}.hasOwnProperty.call(data, key)) {
                continue;
            }

            if (key.slice(0, prefix.length) === prefix) {
                const split: string[] = key.split("::");
                this.game.stateHolder.setCollection(split[1] + "::" + split[2], data[key]);
            } else {
                this.game.itemsHolder.setItem(key as keyof StorageItems, data[key]);
            }
        }

        this.game.menuGrapher.deleteActiveMenu();
        this.game.gameplay.startPlay();
        this.game.itemsHolder.setItem(this.game.storage.names.gameStarted, true);
    }

    /**
     * Saves the positions of all Characters in the game.
     */
    public saveCharacterPositions(): void {
        for (const character of this.game.groupHolder.getGroup("Character")) {
            this.saveCharacterPosition(character, character.id);
        }
    }

    /**
     * Saves the position of a certain Character.
     *
     * @param character   An in-game Character.
     * @param id   The ID associated with the Character.
     */
    public saveCharacterPosition(character: Character, id: string): void {
        this.game.stateHolder.addChange(id, "xloc", character.left + this.game.mapScreener.left);
        this.game.stateHolder.addChange(id, "yloc", character.top + this.game.mapScreener.top);
        this.game.stateHolder.addChange(id, "direction", character.direction);
    }

    /**
     * Pushes and saves the current state of a variable to a stack.
     *
     * @param actor   The Actor, Area, Map, or Location saving its state of a variable.
     * @param title   Name for the state being saved.
     * @param value   The values of the variable to be saved.
     */
    public addStateHistory(actor: StateSaveable, title: string, value: any): void {
        if (!actor.state) {
            actor.state = {};
        }

        const stateHistory: any[] = actor.state[title];
        if (stateHistory) {
            stateHistory.push(value);
        } else {
            actor.state[title] = [value];
        }
    }

    /**
     * Updates to the most recently saved state for a variable.
     *
     * @param actor   The Actor having its state restored.
     * @param title   The name of the state to restore.
     */
    public popStateHistory(actor: StateSaveable, title: string): void {
        if (!actor.state) {
            throw new Error(`State property is not defined for '${actor}'.`);
        }

        const stateHistory: any[] = actor.state[title];
        if (!stateHistory || stateHistory.length === 0) {
            throw new Error(`No state saved for '${title}'.`);
        }

        (actor as any)[title] = stateHistory.pop();
    }

    /**
     * Adds an in-game item to the character's bag.
     *
     * @param item    Name of item being stored.
     * @param amount   How many of the item to add, if not 1.
     */
    public addItemToBag(item: string, amount = 1): void {
        this.game.utilities.combineArrayMembers(
            this.game.itemsHolder.getItem(this.game.storage.names.items),
            item,
            amount,
            "item",
            "amount"
        );
    }

    /**
     * Removes an in-game item from the character's bag.
     *
     * @param item    Name of item being stored.
     * @param amount   How many of the item to remove, if not 1.
     */
    public removeItemFromBag(item: string, amount = 1): void {
        this.game.utilities.removeArrayMembers(
            this.game.itemsHolder.getItem(this.game.storage.names.items),
            item,
            amount,
            "item",
            "amount"
        );
    }

    /**
     * Adds a Pokemon by title to the Pokedex.
     *
     * @param titleRaw   The raw title of the Pokemon.
     * @param status   Whether the Pokemon has been seen and caught.
     */
    public addPokemonToPokedex(titleRaw: string[], status: PokedexListingStatus): void {
        const pokedex: Pokedex = this.game.itemsHolder.getItem(this.game.storage.names.pokedex);
        const title: string = titleRaw.join("");
        const caught: boolean = status === PokedexListingStatus.Caught;
        const seen: boolean = caught || status === PokedexListingStatus.Seen;
        let information: PokedexInformation = pokedex[title];

        if (information) {
            // Skip potentially expensive storage operations if they're unnecessary
            if (information.caught || (information.seen && status >= PokedexListingStatus.Seen)) {
                return;
            }

            information.caught = information.caught || status >= PokedexListingStatus.Caught;
            information.seen = information.seen || status >= PokedexListingStatus.Seen;
        } else {
            pokedex[title] = information = {
                caught,
                seen,
                title: titleRaw,
            };
        }

        this.game.itemsHolder.setItem(this.game.storage.names.pokedex, pokedex);
    }

    /**
     * Retrieves known Pokedex listings in ascending order. Unknown Pokemon are
     * replaced with `undefined`.
     *
     * @returns Pokedex listings in ascending order.
     */
    public getPokedexListingsOrdered(): (PokedexInformation | undefined)[] {
        const pokedex: Pokedex = this.game.itemsHolder.getItem(this.game.storage.names.pokedex);
        const pokemon: { [i: string]: PokemonListing } = this.game.constants.pokemon.byName;
        const titlesSorted: string[] = Object.keys(pokedex).sort(
            (a: string, b: string): number => pokemon[a].number - pokemon[b].number
        );
        let i: number;

        if (!titlesSorted.length) {
            return [];
        }

        const ordered: (PokedexInformation | undefined)[] = [];

        for (i = 0; i < pokemon[titlesSorted[0]].number - 1; i += 1) {
            ordered.push(undefined);
        }

        for (i = 0; i < titlesSorted.length - 1; i += 1) {
            ordered.push(pokedex[titlesSorted[i]]);

            for (
                let j: number = pokemon[titlesSorted[i]].number - 1;
                j < pokemon[titlesSorted[i + 1]].number - 2;
                j += 1
            ) {
                ordered.push(undefined);
            }
        }

        ordered.push(pokedex[titlesSorted[i]]);

        return ordered;
    }
}
