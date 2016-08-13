/// <reference path="../../typings/GameStartr.d.ts" />

import { Collisions } from "../Collisions";

export function GenerateCollisionsSettings(): GameStartr.IThingHittrCustoms {
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
    } as any;
}
