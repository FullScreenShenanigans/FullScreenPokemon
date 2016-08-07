import { Collisions } from "../Collisions";
import { FullScreenPokemon } from "../FullScreenPokemon";

FullScreenPokemon.prototype.settings.collisions = {
    "groupNames": ["Solid", "Character"],
    "keyGroupName": "groupType",
    "keyTypeName": "title",
    "globalCheckGenerators": {
        "Character": Collisions.prototype.generateCanThingCollide,
        "Solid": Collisions.prototype.generateCanThingCollide
    },
    "hitCheckGenerators": {
        "Character": {
            "Character": Collisions.prototype.generateIsCharacterTouchingCharacter,
            "Solid": Collisions.prototype.generateIsCharacterTouchingSolid
        }
    },
    "hitCallbackGenerators": {
        "Character": {
            "Solid": Collisions.prototype.generateHitCharacterThing,
            "Character": Collisions.prototype.generateHitCharacterThing
        }
    }
} as any;
