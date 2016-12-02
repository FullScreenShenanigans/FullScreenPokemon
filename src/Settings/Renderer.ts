import { IRendererModuleSettings } from "gamestartr/lib/IGameStartr";

export function GenerateRendererSettings(): IRendererModuleSettings {
    "use strict";

    return {
        groupNames: ["Text", "Character", "Scenery", "Solid", "Terrain"],
        spriteCacheCutoff: 2048,
        framerateSkip: 2,
        keyOffsetX: "offsetX",
        keyOffsetY: "offsetY"
    };
}
