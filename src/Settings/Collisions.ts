import { ICollisionsModuleSettings } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Collision settings for the FullScreenPokemon instance.
 */
export function GenerateCollisionsSettings(fsp: FullScreenPokemon): ICollisionsModuleSettings {
    "use strict";

    return {
        groupNames: ["Solid", "Character"],
        keyGroupName: "groupType",
        keyTypeName: "title",
        globalCheckGenerators: {
            Character: fsp.collisions.generateCanThingCollide.bind(fsp.collisions),
            Solid: fsp.collisions.generateCanThingCollide.bind(fsp.collisions)
        },
        hitCheckGenerators: {
            Character: {
                Character: fsp.collisions.generateIsCharacterTouchingCharacter.bind(fsp.collisions),
                Solid: fsp.collisions.generateIsCharacterTouchingSolid.bind(fsp.collisions)
            }
        },
        hitCallbackGenerators: {
            Character: {
                Solid: fsp.collisions.generateHitCharacterThing.bind(fsp.collisions),
                Character: fsp.collisions.generateHitCharacterThing.bind(fsp.collisions)
            }
        }
    };
}
