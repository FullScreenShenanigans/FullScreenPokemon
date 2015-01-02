FullScreenPokemon.prototype.settings.maps = {
    "mapDefault": "Pallet Town",
    "locationDefault": "StartGame",
    "requireEntrance": true,
    "screenAttributes": [],
    "screenVariables": {},
    "onSpawn": FullScreenPokemon.prototype.addPreThing,
    "macros": {},
    "entrances": {
        "Normal": FullScreenPokemon.prototype.mapEntranceNormal
    },
    "library": (function (maps) {
        var library = {},
            i;
        
        for (i = 0; i < maps.length; i += 1) {
            library[maps[i].name] = maps[i];
        }
        
        return library;
    })([
        {
            "name": "Pallet Town",
            "locations": {
                "StartGame": {},
            },
            "areas": [
                {
                    "setting": "Land",
                    "creation": [
                        { "location": "StartGame" }
                    ]
                }
            ]
        }
    ])
};