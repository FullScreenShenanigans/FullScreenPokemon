import { ThingHittr } from "thinghittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

export const createThingHitter = (fsp: FullScreenPokemon): ThingHittr =>
    new ThingHittr({
        globalCheckGenerators: {
            Character: fsp.collisions.generateCanThingCollide,
            Solid: fsp.collisions.generateCanThingCollide,
        },
        hitCheckGenerators: {
            Character: {
                Character: fsp.collisions.generateIsCharacterTouchingCharacter,
                Solid: fsp.collisions.generateIsCharacterTouchingSolid,
            },
        },
        hitCallbackGenerators: {
            Character: {
                Solid: fsp.collisions.generateHitCharacterThing,
                Character: fsp.collisions.generateHitCharacterThing,
            },
        },
    });
