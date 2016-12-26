import { ICollisionsModuleSettings } from "gamestartr/lib/IGameStartr";

import { Collisions } from "../components/Collisions";

export function GenerateCollisionsSettings(): ICollisionsModuleSettings {
    "use strict";

    return {
        groupNames: ["Solid", "Character"],
        keyGroupName: "groupType",
        keyTypeName: "title",
        globalCheckGenerators: {
            Character: Collisions.prototype.generateCanThingCollide,
            Solid: Collisions.prototype.generateCanThingCollide
        },
        hitCheckGenerators: {
            Character: {
                Character: Collisions.prototype.generateIsCharacterTouchingCharacter,
                Solid: Collisions.prototype.generateIsCharacterTouchingSolid
            }
        },
        hitCallbackGenerators: {
            Character: {
                Solid: Collisions.prototype.generateHitCharacterThing,
                Character: Collisions.prototype.generateHitCharacterThing
            }
        }
    };
}
