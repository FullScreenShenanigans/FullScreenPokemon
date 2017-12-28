import { IThingHittrSettings } from "thinghittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * @param fsp   A generating FullScreenPokemon instance.
 * @returns Collision settings for the FullScreenPokemon instance.
 */
export const GenerateCollisionsSettings = (fsp: FullScreenPokemon): Partial<IThingHittrSettings> => ({
    globalCheckGenerators: {
        Character: fsp.collisions.generateCanThingCollide.bind(fsp.collisions),
        Solid: fsp.collisions.generateCanThingCollide.bind(fsp.collisions),
    },
    hitCheckGenerators: {
        Character: {
            Character: fsp.collisions.generateIsCharacterTouchingCharacter.bind(fsp.collisions),
            Solid: fsp.collisions.generateIsCharacterTouchingSolid.bind(fsp.collisions),
        },
    },
    hitCallbackGenerators: {
        Character: {
            Solid: fsp.collisions.generateHitCharacterThing.bind(fsp.collisions),
            Character: fsp.collisions.generateHitCharacterThing.bind(fsp.collisions),
        },
    },
});
