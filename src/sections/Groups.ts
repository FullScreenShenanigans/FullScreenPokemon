import { Groups as EightBittrGroups } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { ICharacter, IThing } from "./Things";

export interface IGroups {
    Character: ICharacter;
    Scenery: IThing;
    Solid: IThing;
    Terrain: IThing;
    Text: IThing;
    [i: string]: IThing;
}

/**
 * Collection settings for IThing group names.
 */
export class Groups<TEightBittr extends FullScreenPokemon> extends EightBittrGroups<TEightBittr> {
    /**
     * Names of known IThing groups, in drawing order.
     */
    public readonly groupNames = ["Terrain", "Scenery", "Solid", "Character", "Text"];
}
