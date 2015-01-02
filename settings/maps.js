FullScreenPokemon.prototype.settings.maps = {
    "mapDefault": "Lavender Town",
    "locationDefault": "Land",
    "screenAttributes": [
    ],
    "screenVariables": {},
    "onSpawn": FullScreenPokemon.prototype.addPreThing,
    "macros": {},
    "library": (function (maps) {
        var library = {},
            i;
        
        for (i = 0; i < maps.length; i += 1) {
            library[maps[i].name] = maps[i];
        }
        
        return library;
    })([
        {
            "name": "Lavender Town",
            "locations": {
                "StartGame": {},
            },
            "areas": [
                {
                    "setting": "Land",
                    "creation": [

                    ]
                }
            ]
        }
    ])
};