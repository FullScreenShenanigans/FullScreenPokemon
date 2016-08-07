import { FullScreenPokemon } from "../FullScreenPokemon";

FullScreenPokemon.prototype.settings.quadrants = {
    numRows: 5,
    numCols: 6,
    tolerance: FullScreenPokemon.prototype.unitsize / 2,
    groupNames: ["Solid", "Character", "Scenery", "Terrain", "Text"],
    keyGroupName: "groupType"
};
