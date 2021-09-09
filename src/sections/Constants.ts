import { member } from "babyioc";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Battles } from "./constants/Battles";
import { Items } from "./constants/Items";
import { Moves } from "./constants/Moves";
import { Pokemon } from "./constants/Pokemon";
import { Statuses } from "./constants/Statuses";
import { Types } from "./constants/Types";

/**
 * Directions mapped to their String aliases.
 */
export interface DirectionsToAliases {
    [i: number]: string;
}

/**
 * String aliases of directions mapped to those directions.
 */
export interface DirectionAliases {
    [i: string]: Direction;
}

/**
 * Direction aliases mapped to their opposites, such as "left" to "right".
 */
export interface DirectionOpposites {
    [i: string]: string;
}

/**
 * Cardinal directions An Actor may face in-game.
 */
export enum Direction {
    Top = 0,
    Right = 1,
    Bottom = 2,
    Left = 3,
}

/**
 * Whether a Pokemon is unknown, has been caught, or has been seen.
 */
export enum PokedexListingStatus {
    Unknown = 0,
    Caught = 1,
    Seen = 2,
}

/**
 * Universal game constants.
 */
export class Constants extends Section<FullScreenPokemon> {
    /**
     * Static scale of 2, to expand to two pixels per one game pixel.
     */
    public static readonly scale: number = 2;

    /**
     * How many game pixels wide each map "block" is.
     */
    public readonly blockSize: number = 32;

    /**
     * Universal battle constants.
     */
    @member(Battles)
    public readonly battles: Battles;

    /**
     * All known items, keyed by English name.
     */
    @member(Items)
    public readonly items: Items;

    /**
     * All known Pokemon moves, keyed by concatenated name.
     */
    @member(Moves)
    public readonly moves: Moves;

    /**
     * All known Pokemon, keyed by concatenated name.
     */
    @member(Pokemon)
    public readonly pokemon: Pokemon;

    /**
     * Information on Pokemon status effects.
     */
    @member(Statuses)
    public readonly statuses: Statuses;

    /**
     * Information on move types.
     */
    @member(Types)
    public readonly types: Types;

    /**
     * The allowed uppercase keys to be shown in a keyboard.
     */
    public readonly keysUppercase: string[] = [
        "A",
        "J",
        "S",
        "Times",
        "-",
        "B",
        "K",
        "T",
        "(",
        "?",
        "C",
        "L",
        "U",
        ")",
        "!",
        "D",
        "M",
        "V",
        ":",
        "MaleSymbol",
        "E",
        "N",
        "W",
        ";",
        "FemaleSymbol",
        "F",
        "O",
        "X",
        "[",
        "/",
        "G",
        "P",
        "Y",
        "]",
        ".",
        "H",
        "Q",
        "Z",
        "Poke",
        ",",
        "I",
        "R",
        " ",
        "Mon",
        "ED",
    ];

    /**
     * The allowed lowercase keys to be shown in a keyboard.
     */
    public readonly keysLowercase: string[] = [
        "a",
        "j",
        "s",
        "Times",
        "-",
        "b",
        "k",
        "t",
        "(",
        "?",
        "c",
        "l",
        "u",
        ")",
        "!",
        "d",
        "m",
        "v",
        ":",
        "MaleSymbol",
        "e",
        "n",
        "w",
        ";",
        "FemaleSymbol",
        "f",
        "o",
        "x",
        "[",
        "/",
        "g",
        "p",
        "y",
        "]",
        ".",
        "h",
        "q",
        "z",
        "Poke",
        ",",
        "i",
        "r",
        " ",
        "Mon",
        "ED",
    ];

    /**
     * Direction names, mapped to their opposites.
     */
    public readonly directionOpposites: DirectionOpposites = {
        Top: "Bottom",
        top: "bottom",
        Right: "Left",
        right: "left",
        Bottom: "Top",
        bottom: "top",
        Left: "Right",
        left: "right",
    };

    /**
     * Directions, keyed by their string aliases.
     */
    public readonly directionAliases: DirectionAliases = {
        top: Direction.Top,
        right: Direction.Right,
        bottom: Direction.Bottom,
        left: Direction.Left,
    };

    /**
     * String aliases of directions, keyed by the direction.
     */
    public readonly directionsToAliases: DirectionsToAliases = ["top", "right", "bottom", "left"];

    /**
     * Classes to add to Actors facing particular directions.
     */
    public readonly directionClasses: DirectionsToAliases = ["up", "right", "down", "left"];

    /**
     * Direction aliases for areaSpawner activations.
     */
    public readonly directionSpawns: DirectionsToAliases = ["yDec", "xInc", "yInc", "xInc"];
}
