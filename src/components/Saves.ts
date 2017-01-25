import { Component } from "eightbittr/lib/Component";
import { IItems } from "itemsholdr/lib/IItemsHoldr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { PokedexListingStatus } from "./Constants";
import { IPokedex, IPokedexInformation, IPokemonListing } from "./constants/Pokemon";
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
 * Storage functions used by FullScreenPokemon instances.
 */
export class Saves<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Clears the data saved in localStorage and saves it in a new object in localStorage
     * upon a new game being started.
     */
    public clearSavedData(): void {
        const oldLocalStorage: IItems = this.gameStarter.itemsHolder.exportItems();

        const collectionKeys: string[] = this.gameStarter.itemsHolder.getItem("stateCollectionKeys");
        if (collectionKeys) {
            for (const collection of collectionKeys) {
                oldLocalStorage[collection] = this.gameStarter.itemsHolder.getItem(collection);
            }
        }

        for (const key of this.gameStarter.itemsHolder.getKeys()) {
            this.gameStarter.itemsHolder.removeItem(key);
        }

        this.gameStarter.itemsHolder.clear();
        this.gameStarter.itemsHolder.setItem("oldLocalStorage", oldLocalStorage);
        this.gameStarter.itemsHolder.saveItem("oldLocalStorage");
        this.gameStarter.itemsHolder.setItem("stateCollectionKeys", []);

        this.gameStarter.userWrapper.resetControls();
    }

    /**
     * Checks to see if oldLocalStorage is defined in localStorage; if that is true and a prior game
     * hasn't been saved, the data is restored under localStorage.
     */
    public checkForOldStorageData(): void {
        if (!this.gameStarter.itemsHolder.getItem("oldLocalStorage") || this.gameStarter.itemsHolder.getItem("gameStarted")) {
            return;
        }

        const oldLocalStorage: IItems = this.gameStarter.itemsHolder.getItem("oldLocalStorage");
        for (const key in oldLocalStorage) {
            if (!oldLocalStorage.hasOwnProperty(key)) {
                continue;
            }

            if (key.slice(0, "StateHolder".length) === "StateHolder") {
                this.gameStarter.stateHolder.setCollection(key.slice(11), oldLocalStorage[key]);
            } else {
                this.gameStarter.itemsHolder.setItem(key, oldLocalStorage[key]);
            }
        }

        this.gameStarter.itemsHolder.saveAll();

        this.gameStarter.userWrapper.resetControls();
    }

    /**
     * Saves all persistant information about the current game state.
     * 
     * @param showText   Whether to display a status menu (by default, false).
     */
    public saveGame(showText: boolean = true): void {
        const ticksRecorded: number = this.gameStarter.gamesRunner.fpsAnalyzer.getNumRecorded();

        this.gameStarter.itemsHolder.increase("time", ticksRecorded - this.gameStarter.ticksElapsed);
        this.gameStarter.ticksElapsed = ticksRecorded;

        this.saveCharacterPositions();
        this.gameStarter.stateHolder.saveCollection();
        this.gameStarter.itemsHolder.saveAll();

        if (!showText) {
            return;
        }

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog("GeneralText", ["Now saving..."]);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.menuGrapher.deleteAllMenus(),
            49);
    }

    /**
     * Automatically saves the game.
     */
    public autoSave(): void {
        if (this.gameStarter.itemsHolder.getAutoSave()
            && !this.gameStarter.scenePlayer.getCutscene()
            && this.gameStarter.areaSpawner.getMapName() !== "Blank") {
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
                JSON.stringify(this.gameStarter.itemsHolder.exportItems())));

        this.gameStarter.container.appendChild(link);
        link.click();
        this.gameStarter.container.removeChild(link);
    }

    /**
     * Loads JSON game data from a data string and sets it as the game state,
     * then starts gameplay.
     * 
     * @param dataRaw   Raw data to be parsed as JSON.
     */
    public loadData(dataRaw: string): void {
        this.clearSavedData();
        const data: ISaveFile = JSON.parse(dataRaw);
        const keyStart: string = "StateHolder::";

        for (const key in data) {
            if (!data.hasOwnProperty(key)) {
                continue;
            }

            if (key.slice(0, keyStart.length) === keyStart) {
                const split: string[] = key.split("::");
                this.gameStarter.stateHolder.setCollection(split[1] + "::" + split[2], data[key]);
            } else {
                this.gameStarter.itemsHolder.setItem(key, data[key]);
            }
        }

        this.gameStarter.menuGrapher.deleteActiveMenu();
        this.gameStarter.userWrapper.resetControls();
        this.gameStarter.gameplay.startPlay();
        this.gameStarter.itemsHolder.setItem("gameStarted", true);
    }

    /**
     * Saves the positions of all Characters in the game.
     */
    public saveCharacterPositions(): void {
        for (const character of this.gameStarter.groupHolder.getGroup("Character") as ICharacter[]) {
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
        this.gameStarter.stateHolder.addChange(
            id,
            "xloc",
            (character.left + this.gameStarter.mapScreener.left));
        this.gameStarter.stateHolder.addChange(
            id,
            "yloc",
            (character.top + this.gameStarter.mapScreener.top));
        this.gameStarter.stateHolder.addChange(
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
        this.gameStarter.utilities.combineArrayMembers(
            this.gameStarter.itemsHolder.getItem("items"),
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
        const pokedex: IPokedex = this.gameStarter.itemsHolder.getItem("Pokedex");
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
                caught: caught,
                seen: seen,
                title: titleRaw
            };
        }

        this.gameStarter.itemsHolder.setItem("Pokedex", pokedex);
    }

    /**
     * Retrieves known Pokedex listings in ascending order. Unknown Pokemon are
     * replaced with `undefined`.
     * 
     * @returns Pokedex listings in ascending order.
     */
    public getPokedexListingsOrdered(): (IPokedexInformation | undefined)[] {
        const pokedex: IPokedex = this.gameStarter.itemsHolder.getItem("Pokedex");
        const pokemon: { [i: string]: IPokemonListing } = this.gameStarter.constants.pokemon.byName;
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
