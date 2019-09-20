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
     * All names of IThing groups.
     */
    public readonly groupNames = ["Solid", "Character", "Scenery", "Terrain", "Text"];

    /**
     * Friendly name aliases of groups.
     */
    public readonly names = {
        character: "Character",
        scenery: "Scenery",
        solid: "Solid",
        terrain: "Terrain",
        text: "Text",
    } as const;
}
