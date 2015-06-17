FullScreenPokemon.prototype.settings.collisions = {
    "groupNames": ["Solid", "Character"],
    "globalCheckGenerators": {
        "Character": FullScreenPokemon.prototype.generateCanThingCollide,
        "Solid": FullScreenPokemon.prototype.generateCanThingCollide
    },
    "hitCheckGenerators": {
        "Character": {
            "Character": FullScreenPokemon.prototype.generateIsCharacterTouchingCharacter,
            "Solid": FullScreenPokemon.prototype.generateIsCharacterTouchingSolid
        }
    },
    "hitFunctionGenerators": {
        "Character": {
            "Solid": FullScreenPokemon.prototype.generateHitCharacterThing,
            "Character": FullScreenPokemon.prototype.generateHitCharacterThing
        }
    }
};