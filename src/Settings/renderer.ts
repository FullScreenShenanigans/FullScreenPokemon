/// <reference path="../../typings/GameStartr.d.ts" />

export function GenerateRendererSettings(): GameStartr.IPixelDrawrCustoms {
    "use strict";

    return {
        groupNames: ["Text", "Character", "Scenery", "Solid", "Terrain"],
        spriteCacheCutoff: 2048,
        framerateSkip: 2,
        keyOffsetX: "offsetX",
        keyOffsetY: "offsetY"
    };
}
