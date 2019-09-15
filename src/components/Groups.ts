import { Groups as EightBittrGroups } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Collection settings for IThing group names.
 */
export class Groups<TEightBittr extends FullScreenPokemon> extends EightBittrGroups<TEightBittr> {
    /**
     * Names of known IThing groups.
     */
    public readonly groupNames = ["Solid", "Character", "Scenery", "Terrain", "Text"];
}
