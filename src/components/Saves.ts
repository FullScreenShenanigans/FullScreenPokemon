import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { PokedexListingStatus } from "./Constants";
import { IPokedex, IPokedexInformation, IPokemonListing } from "./constants/Pokemon";
import { IStorageItems } from "./Storage";
import { ICharacter } from "./Things";

/**
 * Container for holding the states of objects in the game.
 */
export interface IStateHistory {
    [i: string]: [any];
}

/**
 * An object for saving this object's state history.
 */
export interface IStateSaveable {
    /**
     * Holds the states of an object in the game.
     */
    state?: IStateHistory;
}

/**
 * A general description of a save file.
 */
export interface ISaveFile {
    [i: string]: any;
}

/**
 * Saves and load game data.
 */
export class Saves<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Clears the data saved in localStorage and saves it in a new object in localStorage
     * upon a new game being started.
     */
    public clearSavedData(): void {
        const oldLocalStorage: IStorageItems & { [i: string]: any } = this.eightBitter.itemsHolder.exportItems();

        const collectionKeys: string[] = this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.stateCollectionKeys);
        if (collectionKeys) {
            for (const collection of collectionKeys) {
                oldLocalStorage[collection] = this.eightBitter.itemsHolder.getItem(collection as keyof IStorageItems);
            }
        }

        for (const key of Object.keys(oldLocalStorage)) {
            this.eightBitter.itemsHolder.removeItem(key as keyof IStorageItems);
        }

        this.eightBitter.itemsHolder.clear();
        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.oldLocalStorage, oldLocalStorage);
        this.eightBitter.itemsHolder.saveItem(this.eightBitter.storage.names.oldLocalStorage);
        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.stateCollectionKeys, []);
    }

    /**
     * Checks to see if oldLocalStorage is defined in localStorage; if that is true and a prior game
     * hasn't been saved, the data is restored under localStorage.
     */
    public checkForOldStorageData(): void {
        if (!this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.oldLocalStorage)
            || this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.gameStarted)) {
            return;
        }

        const oldLocalStorage = this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.oldLocalStorage);
        if (oldLocalStorage !== undefined) {
            for (const key in oldLocalStorage) {
                if (!oldLocalStorage.hasOwnProperty(key)) {
                    continue;
                }

                const prefix = this.eightBitter.stateHolder.getPrefix();

                if (key.slice(0, prefix.length) === prefix) {
                    this.eightBitter.stateHolder.setCollection(key.slice(prefix.length), oldLocalStorage[key as keyof IStorageItems]);
                } else {
                    this.eightBitter.itemsHolder.setItem(key as keyof IStorageItems, oldLocalStorage[key as keyof IStorageItems]);
                }
            }
        }

        this.eightBitter.itemsHolder.saveAll();
    }

    /**
     * Saves all persistant information about the current game state.
     *
     * @param showText   Whether to display a status menu (by default, false).
     */
    public saveGame(showText: boolean = true): void {
        const ticksRecorded: number = this.eightBitter.fpsAnalyzer.getRecordedTicks();

        this.eightBitter.itemsHolder.increase(this.eightBitter.storage.names.time, ticksRecorded - this.eightBitter.ticksElapsed);
        this.eightBitter.ticksElapsed = ticksRecorded;

        this.saveCharacterPositions();
        this.eightBitter.stateHolder.saveCollection();
        this.eightBitter.itemsHolder.saveAll();

        if (!showText) {
            return;
        }

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog("GeneralText", ["Now saving..."]);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.menuGrapher.deleteAllMenus(),
            49);
    }

    /**
     * Automatically saves the game if auto-save is enabled.
     */
    public autoSaveIfEnabled(): void {
        if (this.eightBitter.itemsHolder.getAutoSave()
            && !this.eightBitter.scenePlayer.getCutscene()
            && this.eightBitter.areaSpawner.getMapName() !== "Blank") {
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
        link.setAttribute(
            "download",
            "FullScreenPokemon Save " + Date.now() + ".json");
        link.setAttribute(
            "href",
            "data:text/json;charset=utf-8," + encodeURIComponent(
                JSON.stringify(this.eightBitter.itemsHolder.exportItems())));

        this.eightBitter.container.appendChild(link);
        link.click();
        this.eightBitter.container.removeChild(link);
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
    public loadSaveFile(data: ISaveFile): void {
        this.clearSavedData();
        const prefix = this.eightBitter.stateHolder.getPrefix();

        for (const key in data) {
            if (!data.hasOwnProperty(key)) {
                continue;
            }

            if (key.slice(0, prefix.length) === prefix) {
                const split: string[] = key.split("::");
                this.eightBitter.stateHolder.setCollection(split[1] + "::" + split[2], data[key]);
            } else {
                this.eightBitter.itemsHolder.setItem(key as keyof IStorageItems, data[key]);
            }
        }

        this.eightBitter.menuGrapher.deleteActiveMenu();
        this.eightBitter.gameplay.startPlay();
        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.gameStarted, true);
    }

    /**
     * Saves the positions of all Characters in the game.
     */
    public saveCharacterPositions(): void {
        for (const character of this.eightBitter.groupHolder.getGroup("Character") as ICharacter[]) {
            this.saveCharacterPosition(character, character.id);
        }
    }

    /**
     * Saves the position of a certain Character.
     *
     * @param character   An in-game Character.
     * @param id   The ID associated with the Character.
     */
    public saveCharacterPosition(character: ICharacter, id: string): void {
        this.eightBitter.stateHolder.addChange(
            id,
            "xloc",
            (character.left + this.eightBitter.mapScreener.left));
        this.eightBitter.stateHolder.addChange(
            id,
            "yloc",
            (character.top + this.eightBitter.mapScreener.top));
        this.eightBitter.stateHolder.addChange(
            id,
            "direction",
            character.direction);
    }

    /**
     * Pushes and saves the current state of a variable to a stack.
     *
     * @param thing   The Thing, Area, Map, or Location saving its state of a variable.
     * @param title   Name for the state being saved.
     * @param value   The values of the variable to be saved.
     */
    public addStateHistory(thing: IStateSaveable, title: string, value: any): void {
        if (!thing.state) {
            thing.state = {};
        }

        const stateHistory: any[] = thing.state[title];
        if (stateHistory) {
            stateHistory.push(value);
        } else {
            thing.state[title] = [value];
        }
    }

    /**
     * Updates to the most recently saved state for a variable.
     *
     * @param thing   The Thing having its state restored.
     * @param title   The name of the state to restore.
     */
    public popStateHistory(thing: IStateSaveable, title: string): void {
        if (!thing.state) {
            throw new Error(`State property is not defined for '${thing}'.`);
        }

        const stateHistory: any[] = thing.state[title];
        if (!stateHistory || stateHistory.length === 0) {
            throw new Error(`No state saved for '${title}'.`);
        }

        (thing as any)[title] = stateHistory.pop();
    }

    /**
     * Adds an in-game item to the character's bag.
     *
     * @param item    Name of item being stored.
     * @param amount   How many of the item to add, if not 1.
     */
    public addItemToBag(item: string, amount: number = 1): void {
        this.eightBitter.utilities.combineArrayMembers(
            this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.items),
            item,
            amount,
            "item",
            "amount");
    }

    /**
     * Removes an in-game item from the character's bag.
     *
     * @param item    Name of item being stored.
     * @param amount   How many of the item to remove, if not 1.
     */
    public removeItemFromBag(item: string, amount: number = 1): void {
        this.eightBitter.utilities.removeArrayMembers(
            this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.items),
            item,
            amount,
            "item",
            "amount");
    }

    /**
     * Adds a Pokemon by title to the Pokedex.
     *
     * @param titleRaw   The raw title of the Pokemon.
     * @param status   Whether the Pokemon has been seen and caught.
     */
    public addPokemonToPokedex(titleRaw: string[], status: PokedexListingStatus): void {
        const pokedex: IPokedex = this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.pokedex);
        const title: string = titleRaw.join("");
        const caught: boolean = status === PokedexListingStatus.Caught;
        const seen: boolean = caught || (status === PokedexListingStatus.Seen);
        let information: IPokedexInformation = pokedex[title];

        if (information) {
            // Skip potentially expensive storage operations if they're unnecessary
            if (information.caught || (information.seen && status >= PokedexListingStatus.Seen)) {
                return;
            }

            information.caught = information.caught || (status >= PokedexListingStatus.Caught);
            information.seen = information.seen || (status >= PokedexListingStatus.Seen);
        } else {
            pokedex[title] = information = {
                caught,
                seen,
                title: titleRaw,
            };
        }

        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.pokedex, pokedex);
    }

    /**
     * Retrieves known Pokedex listings in ascending order. Unknown Pokemon are
     * replaced with `undefined`.
     *
     * @returns Pokedex listings in ascending order.
     */
    public getPokedexListingsOrdered(): (IPokedexInformation | undefined)[] {
        const pokedex: IPokedex = this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.pokedex);
        const pokemon: { [i: string]: IPokemonListing } = this.eightBitter.constants.pokemon.byName;
        const titlesSorted: string[] = Object.keys(pokedex)
            .sort((a: string, b: string): number => pokemon[a].number - pokemon[b].number);
        let i: number;

        if (!titlesSorted.length) {
            return [];
        }

        const ordered: (IPokedexInformation | undefined)[] = [];

        for (i = 0; i < pokemon[titlesSorted[0]].number - 1; i += 1) {
            ordered.push(undefined);
        }

        for (i = 0; i < titlesSorted.length - 1; i += 1) {
            ordered.push(pokedex[titlesSorted[i]]);

            for (let j: number = pokemon[titlesSorted[i]].number - 1; j < pokemon[titlesSorted[i + 1]].number - 2; j += 1) {
                ordered.push(undefined);
            }
        }

        ordered.push(pokedex[titlesSorted[i]]);

        return ordered;
    }
}
