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
 * What direction(s) the screen may scroll from player movement.
 */
export enum Scrollability {
    /**
     * The screen may not scroll in either direction.
     */
    None,

    /**
     * The screen may scroll vertically.
     */
    Vertical,

    /**
     * The screen may scroll horizontally.
     */
    Horizontal,

    /**
     * The screen may scroll vertically and horizontally.
     */
    Both,
};

/**
 * How much to expand each pixel from raw sizing measurements to in-game.
 */
export const Unitsize: number = 4;

/**
 * Static scale of 2, to exand to two pixels per one game pixel.
 */
export const Scale: number = 2;

/**
 * Quickly tapping direction keys means to look in a direction, not walk.
 */
export const InputTimeTolerance: number = 4;

/**
 * The allowed uppercase keys to be shown in a keyboard.
 */
export const KeysUppercase: string[] = [
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
export const KeysLowercase: string[] = [
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
 * Direction names, mapped to their opposites.
 */
export const DirectionOpposites: IDirectionOpposites = {
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
export const DirectionAliases: IDirectionAliases = {
    top: Direction.Top,
    right: Direction.Right,
    bottom: Direction.Bottom,
    left: Direction.Left
};

/**
 * String aliases of directions, keyed by the direction.
 */
export const DirectionsToAliases: IDirectionsToAliases = ["top", "right", "bottom", "left"];

/**
 * Classes to add to Things facing particular directions.
 */
export const DirectionClasses: IDirectionsToAliases = ["up", "right", "down", "left"];

/**
 * Direction aliases for AreaSpawner activations.
 */
export const DirectionSpawns: IDirectionsToAliases = ["yDec", "xInc", "yInc", "xInc"];
