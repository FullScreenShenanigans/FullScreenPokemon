import { IGroupHoldrSettings } from "groupholdr";

import { ICharacter, IThing } from "../components/Things";

export interface IGroups {
    Character: ICharacter;
    Scenery: IThing;
    Solid: IThing;
    Terrain: IThing;
    Text: IThing;
    [i: string]: IThing;
}

export const groupsSettings: Partial<IGroupHoldrSettings<IGroups>> = {
    groupNames: ["Solid", "Character", "Scenery", "Terrain", "Text"],
};
