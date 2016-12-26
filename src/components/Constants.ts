import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPlayer, IPokemon } from "../IFullScreenPokemon"
import * as Moves from "./constants/Moves";
import { Pokemon } from "./constants/Pokemon";
import { Statuses } from "./constants/Statuses";
import { Types } from "./constants/Types";

/**
 * Directions mapped to their String aliases.
 */
export interface IDirectionsToAliases {
    [i: number]: string;
}

/**
 * String aliases of directions mapped to those directions.
 */
export interface IDirectionAliases {
    [i: string]: Direction;
}

/**
 * Direction aliases mapped to their opposites, such as "left" to "right".
 */
export interface IDirectionOpposites {
    [i: string]: string;
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
 * Cardinal directions a Thing may face in-game.
 */
export enum Direction {
    Top = 0,
    Right = 1,
    Bottom = 2,
    Left = 3
};

/**
 * Whether a Pokemon is unknown, has been caught, or has been seen.
 */
export enum PokedexListingStatus {
    Unknown = 0,
    Caught = 1,
    Seen = 2
};

/**
 * Constants used by FullScreenPokemon instances.
 */
export class Constants<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Static scale of 2, to expand to two pixels per one game pixel.
     */
    public static readonly scale: number = 2;

    /**
     * 
     */
    public readonly moves: typeof Moves = Moves;

    /**
     * 
     */
    public readonly pokemon: typeof Pokemon = Pokemon;

    /**
     * Information on Pokemon status effects.
     */
    public readonly statuses: Statuses = new Statuses();

    /**
     * Information on move types.
     */
    public readonly types: Types = new Types();

    /**
     * Names of all statistics Pokemon have.
     */
    public readonly statisticNames: string[] = ["HP", "Attack", "Defense", "Speed", "Special"];

    /**
     * Names of Pokemon statistics to display in statistics menus.
     */
    public readonly statisticNamesDisplayed: string[] = ["Attack", "Defense", "Speed", "Special"];

    /**
     * Quickly tapping direction keys means to look in a direction, not walk.
     */
    public readonly inputTimeTolerance: number = 4;

    /**
     * The allowed uppercase keys to be shown in a keyboard.
     */
    public readonly keysUppercase: string[] = [
        "A", "J", "S", "Times", "-",
        "B", "K", "T", "(", "?",
        "C", "L", "U", ")", "!",
        "D", "M", "V", ":", "MaleSymbol",
        "E", "N", "W", ";", "FemaleSymbol",
        "F", "O", "X", "[", "/",
        "G", "P", "Y", "]", ".",
        "H", "Q", "Z", "Poke", ",",
        "I", "R", " ", "Mon", "ED"
    ];

    /**
     * The allowed lowercase keys to be shown in a keyboard.
     */
    public readonly keysLowercase: string[] = [
        "a", "j", "s", "Times", "-",
        "b", "k", "t", "(", "?",
        "c", "l", "u", ")", "!",
        "d", "m", "v", ":", "MaleSymbol",
        "e", "n", "w", ";", "FemaleSymbol",
        "f", "o", "x", "[", "/",
        "g", "p", "y", "]", ".",
        "h", "q", "z", "Poke", ",",
        "i", "r", " ", "Mon", "ED"
    ];

    /**
     * Direction names, mapped to their opposites.
     */
    public readonly directionOpposites: IDirectionOpposites = {
        Top: "Bottom",
        top: "bottom",
        Right: "Left",
        right: "left",
        Bottom: "Top",
        bottom: "top",
        Left: "Right",
        left: "right"
    };

    /**
     * Directions, keyed by their string aliases.
     */
    public readonly directionAliases: IDirectionAliases = {
        top: Direction.Top,
        right: Direction.Right,
        bottom: Direction.Bottom,
        left: Direction.Left
    };

    /**
     * String aliases of directions, keyed by the direction.
     */
    public readonly directionsToAliases: IDirectionsToAliases = ["top", "right", "bottom", "left"];

    /**
     * Classes to add to Things facing particular directions.
     */
    public readonly directionClasses: IDirectionsToAliases = ["up", "right", "down", "left"];

    /**
     * Direction aliases for areaSpawner activations.
     */
    public readonly directionSpawns: IDirectionsToAliases = ["yDec", "xInc", "yInc", "xInc"];
}
