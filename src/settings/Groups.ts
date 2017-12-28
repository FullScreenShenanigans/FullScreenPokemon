import { IGroupHoldrSettings } from "groupholdr";

/**
 * @returns Group settings for a FullScreenPokemon instance.
 */
export const GenerateGroupsSettings = (): Partial<IGroupHoldrSettings> => ({
    groupNames: ["Solid", "Character", "Scenery", "Terrain", "Text", "Thing"],
    groupTypes: {
        Solid: "Array",
        Character: "Array",
        Scenery: "Array",
        Terrain: "Array",
        Text: "Array",
        Thing: "Object",
    },
});
