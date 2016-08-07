import { FullScreenPokemon } from "../FullScreenPokemon";

FullScreenPokemon.prototype.settings.renderer = {
    groupNames: ["Text", "Character", "Scenery", "Solid", "Terrain"],
    spriteCacheCutoff: 2048,
    framerateSkip: 2,
    keyOffsetX: "offsetX",
    keyOffsetY: "offsetY"
};
