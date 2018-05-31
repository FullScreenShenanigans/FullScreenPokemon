import { GroupHoldr } from "groupholdr";

import { ICharacter, IThing } from "../components/Things";
import { FullScreenPokemon } from "../FullScreenPokemon";

export interface IGroups {
    Character: ICharacter;
    Scenery: IThing;
    Solid: IThing;
    Terrain: IThing;
    Text: IThing;
    [i: string]: IThing;
}

export const createGroupHolder = (fsp: FullScreenPokemon) =>
    new GroupHoldr<IGroups>({
        groupNames: ["Solid", "Character", "Scenery", "Terrain", "Text"],
        ...fsp.settings.components.groupHolder,
    });
